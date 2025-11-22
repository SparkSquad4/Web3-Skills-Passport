import { useState } from 'react';
import { api } from '../utils/contract';
import { QrReader } from 'react-qr-reader';

export default function VerifyPortal() {
  const [credentialId, setCredentialId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const handleVerify = async (id = credentialId) => {
    if (!id) return;
    
    setLoading(true);
    setVerificationResult(null);

    try {
      const result = await api.verifyCredential(id);
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        success: false,
        error: 'Failed to verify credential'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQrScan = (result) => {
    if (result) {
      try {
        // Extract credential ID from QR code data
        const data = JSON.parse(result.text);
        if (data.credentialId) {
          setCredentialId(data.credentialId);
          setShowQrScanner(false);
          handleVerify(data.credentialId);
        }
      } catch (error) {
        // If not JSON, assume it's just the credential ID
        setCredentialId(result.text);
        setShowQrScanner(false);
        handleVerify(result.text);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid': return 'text-green-600 bg-green-50 border-green-200';
      case 'Expired': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Revoked': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Valid': return '✅';
      case 'Expired': return '⏰';
      case 'Revoked': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Credential Verifier
          </h1>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Verify Credential</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credential ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter credential ID"
                  />
                  <button
                    onClick={() => setShowQrScanner(!showQrScanner)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    📷 QR
                  </button>
                </div>
              </div>

              {showQrScanner && (
                <div className="border rounded-lg p-4">
                  <QrReader
                    onResult={handleQrScan}
                    style={{ width: '100%' }}
                    constraints={{ facingMode: 'environment' }}
                  />
                  <button
                    onClick={() => setShowQrScanner(false)}
                    className="mt-2 w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={() => handleVerify()}
                disabled={loading || !credentialId}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Credential'}
              </button>
            </div>

            {verificationResult && (
              <div className="mt-8">
                {verificationResult.success ? (
                  <div className={`p-6 rounded-lg border ${getStatusColor(verificationResult.status)}`}>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl mr-3">{getStatusIcon(verificationResult.status)}</span>
                      <h3 className="text-2xl font-bold">{verificationResult.status}</h3>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Credential ID:</strong> {verificationResult.credentialId}</p>
                      <p><strong>Issuer:</strong> <span className="font-mono">{verificationResult.issuer}</span></p>
                      
                      {verificationResult.status === 'Valid' && (
                        <div className="mt-4 p-3 bg-green-100 rounded-md">
                          <p className="text-green-800 font-medium">
                            ✓ This credential is valid and verified
                          </p>
                        </div>
                      )}
                      
                      {verificationResult.status === 'Expired' && (
                        <div className="mt-4 p-3 bg-yellow-100 rounded-md">
                          <p className="text-yellow-800 font-medium">
                            ⚠️ This credential has expired
                          </p>
                        </div>
                      )}
                      
                      {verificationResult.status === 'Revoked' && (
                        <div className="mt-4 p-3 bg-red-100 rounded-md">
                          <p className="text-red-800 font-medium">
                            ❌ This credential has been revoked
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl mr-3">❌</span>
                      <h3 className="text-2xl font-bold text-red-600">Invalid</h3>
                    </div>
                    <p className="text-red-600 text-center">
                      {verificationResult.error || 'Credential not found or invalid'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}