import { useState } from 'react';
import WalletConnect from '../components/WalletConnect';
import { api, contractUtils } from '../utils/contract';

export default function IssuerPortal() {
  const [account, setAccount] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentAddress: '',
    skillName: '',
    skillLevel: '',
    institution: '',
    expiryDays: '365'
  });
  const [result, setResult] = useState(null);

  const handleConnect = async (address) => {
    setAccount(address);
    const approved = await contractUtils.checkApprovedIssuer(address);
    setIsApproved(approved);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !isApproved) return;

    setLoading(true);
    setResult(null);

    try {
      const credentialData = {
        skillName: formData.skillName,
        skillLevel: formData.skillLevel,
        institution: formData.institution,
        issuedBy: account
      };

      const response = await api.issueCredential({
        studentAddress: formData.studentAddress,
        credentialData,
        expiryDays: parseInt(formData.expiryDays),
        issuerAddress: account
      });

      if (response.success) {
        setResult({
          type: 'success',
          message: 'Credential issued successfully!',
          data: response
        });
        setFormData({
          studentAddress: '',
          skillName: '',
          skillLevel: '',
          institution: '',
          expiryDays: '365'
        });
      } else {
        setResult({
          type: 'error',
          message: response.error || 'Failed to issue credential'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message || 'An error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Issuer Portal</h1>
          <WalletConnect onConnect={handleConnect} onDisconnect={() => setAccount(null)} />
        </div>

        {!account ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600">Please connect your MetaMask wallet to access the issuer portal.</p>
          </div>
        ) : !isApproved ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Not Authorized</h2>
            <p className="text-red-600">
              Your wallet address is not approved as an issuer. Please contact the administrator.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Issue New Credential</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Wallet Address
                </label>
                <input
                  type="text"
                  value={formData.studentAddress}
                  onChange={(e) => setFormData({...formData, studentAddress: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0x..."
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={formData.skillName}
                    onChange={(e) => setFormData({...formData, skillName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Smart Contract Development"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({...formData, skillLevel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({...formData, institution: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., University of Blockchain"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.expiryDays}
                    onChange={(e) => setFormData({...formData, expiryDays: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Issuing Credential...' : 'Issue Credential'}
              </button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded-md ${
                result.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`font-medium ${
                  result.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.message}
                </p>
                {result.data && (
                  <div className="mt-2 text-sm text-green-600">
                    <p>Credential ID: {result.data.credentialId}</p>
                    <p>Transaction: {result.data.transactionHash}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}