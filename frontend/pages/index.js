import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Web3 Skills Passport
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Issue, store, and verify student credentials in a tamper-proof, 
            privacy-preserving, and issuer-verified way using blockchain technology.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Link href="/issuer" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-blue-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Issuer Portal</h3>
              <p className="text-gray-600">
                Issue new credentials to students. Upload credential data and mint 
                soulbound tokens on the blockchain.
              </p>
            </div>
          </Link>

          <Link href="/student" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-green-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Portal</h3>
              <p className="text-gray-600">
                View your credentials, generate QR codes for verification, 
                and manage your digital skills passport.
              </p>
            </div>
          </Link>

          <Link href="/verify" className="group">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-purple-500 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verifier Portal</h3>
              <p className="text-gray-600">
                Verify the authenticity of credentials by scanning QR codes 
                or entering credential IDs.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-blue-500 mb-2">🔒</div>
              <h4 className="font-semibold">Tamper-Proof</h4>
              <p className="text-sm text-gray-600">Blockchain-secured credentials</p>
            </div>
            <div className="text-center">
              <div className="text-green-500 mb-2">🛡️</div>
              <h4 className="font-semibold">Privacy-Preserving</h4>
              <p className="text-sm text-gray-600">Selective disclosure of information</p>
            </div>
            <div className="text-center">
              <div className="text-purple-500 mb-2">✅</div>
              <h4 className="font-semibold">Issuer-Verified</h4>
              <p className="text-sm text-gray-600">Only approved issuers can mint</p>
            </div>
            <div className="text-center">
              <div className="text-orange-500 mb-2">📱</div>
              <h4 className="font-semibold">QR Verification</h4>
              <p className="text-sm text-gray-600">Easy mobile verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}