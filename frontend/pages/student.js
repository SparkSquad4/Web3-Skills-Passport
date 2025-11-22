import { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import CredentialCard from '../components/CredentialCard';
import { contractUtils } from '../utils/contract';

export default function StudentPortal() {
  const [account, setAccount] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (address) => {
    setAccount(address);
    await loadCredentials(address);
  };

  const loadCredentials = async (studentAddress) => {
    setLoading(true);
    try {
      const credentialIds = await contractUtils.getStudentCredentials(studentAddress);
      const credentialDetails = await Promise.all(
        credentialIds.map(async (id) => {
          const details = await contractUtils.getCredentialDetails(id);
          return { id, ...details };
        })
      );
      setCredentials(credentialDetails.filter(cred => cred.exists));
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
          <WalletConnect onConnect={handleConnect} onDisconnect={() => setAccount(null)} />
        </div>

        {!account ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Please connect your MetaMask wallet to view your credentials.</p>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">My Credentials</h2>
              <p className="text-gray-600 mb-4">
                Connected as: <span className="font-mono text-sm">{account}</span>
              </p>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading credentials...</p>
                </div>
              ) : credentials.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No credentials found.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {credentials.map((credential) => (
                    <CredentialCard key={credential.id} credential={credential} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}