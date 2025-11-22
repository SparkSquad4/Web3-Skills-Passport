import { useState } from 'react';
import QRCode from 'qrcode';

export default function CredentialCard({ credential, onVerify }) {
  const [qrCode, setQrCode] = useState(null);
  const [showQR, setShowQR] = useState(false);

  const generateQR = async () => {
    try {
      const verifyUrl = `${window.location.origin}/verify?id=${credential.id}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl);
      setQrCode(qrDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Valid': return 'text-green-600 bg-green-100';
      case 'Expired': return 'text-yellow-600 bg-yellow-100';
      case 'Revoked': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Credential #{credential.id}
          </h3>
          <p className="text-sm text-gray-600">
            Issued: {new Date(credential.issuedAt).toLocaleDateString()}
          </p>
          {credential.expiryTimestamp && (
            <p className="text-sm text-gray-600">
              Expires: {new Date(credential.expiryTimestamp * 1000).toLocaleDateString()}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(credential.status)}`}>
          {credential.status || 'Unknown'}
        </span>
      </div>

      {credential.data && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Credential Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            {Object.entries(credential.data).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="font-medium capitalize">{key}:</span>
                <span className="ml-2">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={generateQR}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Generate QR
        </button>
        <button
          onClick={() => onVerify?.(credential.id)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Verify
        </button>
      </div>

      {showQR && qrCode && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">Scan to verify credential:</p>
          <img src={qrCode} alt="QR Code" className="mx-auto" />
          <button
            onClick={() => setShowQR(false)}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700"
          >
            Hide QR Code
          </button>
        </div>
      )}
    </div>
  );
}