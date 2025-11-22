# Web3 Skills Passport

A complete Web3 Skills Passport system that issues, stores, and verifies student credentials in a tamper-proof, privacy-preserving, and issuer-verified way using blockchain technology.

## 🚀 Features

- **Soulbound Credentials**: Non-transferable credential tokens
- **Privacy-Preserving**: Only credential hashes stored on-chain, full data on IPFS
- **Issuer Verification**: Only approved issuers can mint credentials
- **Expiry Management**: Automatic credential expiry checking
- **Revocation Support**: Issuers can revoke credentials
- **QR Code Verification**: Easy mobile verification
- **Multi-Portal Interface**: Separate portals for issuers, students, and verifiers

## 🏗️ Architecture

### Smart Contract (Polygon Mumbai)
- **SkillsPassport.sol**: Main contract handling credential lifecycle
- Stores credential hashes, expiry timestamps, issuer addresses
- Implements soulbound token functionality (non-transferable)

### Backend (Node.js + Express)
- **API Endpoints**: `/issue`, `/verify`, `/revoke`, `/issuer/check`
- **IPFS Integration**: Pinata for metadata storage
- **Blockchain Integration**: Ethers.js for contract interaction

### Frontend (Next.js + React)
- **Issuer Portal**: Issue new credentials
- **Student Portal**: View credentials and generate QR codes
- **Verifier Portal**: Verify credentials via ID or QR scan
- **Responsive UI**: TailwindCSS styling

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MetaMask wallet
- Pinata account (for IPFS)
- Polygon Mumbai testnet MATIC

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm run install:all

# Or install manually
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

#### Root `.env`:
```env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### Backend `.env`:
```env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=deployed_contract_address
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PORT=3001
```

#### Frontend `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Get Required API Keys

#### Pinata (IPFS):
1. Sign up at [pinata.cloud](https://pinata.cloud)
2. Generate API keys in dashboard
3. Add to environment files

#### Polygon Mumbai:
1. Add Mumbai testnet to MetaMask
2. Get test MATIC from [faucet](https://faucet.polygon.technology/)
3. Export private key from MetaMask

## 🚀 Deployment

### 1. Deploy Smart Contract

```bash
# Compile contract
npm run compile

# Run tests
npm run test

# Deploy to Mumbai testnet
npm run deploy

# Deploy to local network (for testing)
npx hardhat node
npm run deploy:local
```

After deployment, update `CONTRACT_ADDRESS` in all environment files.

### 2. Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔧 Usage

### For Issuers

1. **Connect Wallet**: Use MetaMask to connect
2. **Get Approved**: Contact system admin to approve your address
3. **Issue Credentials**: Fill form with student details and credential info
4. **Monitor**: Track issued credentials

### For Students

1. **Connect Wallet**: Use MetaMask to connect
2. **View Credentials**: See all your issued credentials
3. **Generate QR**: Create QR codes for easy verification
4. **Share**: Share credentials with employers/verifiers

### For Verifiers

1. **Enter Credential ID**: Manual verification by ID
2. **Scan QR Code**: Use camera to scan credential QR codes
3. **Check Status**: See if credential is Valid/Expired/Revoked/Invalid
4. **View Details**: See issuer information and credential status

## 🧪 Testing

### Smart Contract Tests

```bash
npm run test
```

Tests cover:
- Credential issuance
- Verification logic
- Expiry checking
- Revocation functionality
- Issuer management
- Non-transferability (soulbound)

### Manual Testing Flow

1. **Deploy Contract**: Deploy to Mumbai testnet
2. **Approve Issuer**: Use owner account to approve issuer
3. **Issue Credential**: Use issuer portal to create credential
4. **Verify Credential**: Use verifier portal to check credential
5. **Generate QR**: Use student portal to create QR code
6. **Scan QR**: Use verifier portal to scan QR code

## 🌐 Production Deployment

### Backend (AWS/Render/Railway)

1. **Environment Variables**: Set all required env vars
2. **Database**: Consider adding database for caching
3. **CORS**: Configure for your frontend domain
4. **SSL**: Enable HTTPS

### Frontend (Vercel/Netlify)

1. **Build**: `npm run build`
2. **Environment**: Set `NEXT_PUBLIC_*` variables
3. **Domain**: Configure custom domain
4. **Analytics**: Add monitoring

### Smart Contract (Mainnet)

1. **Audit**: Get contract audited for production
2. **Gas Optimization**: Optimize for lower gas costs
3. **Upgrade Pattern**: Consider proxy pattern for upgrades
4. **Monitoring**: Set up event monitoring

## 📋 API Documentation

### POST `/api/issue`
Issue new credential
```json
{
  "studentAddress": "0x...",
  "credentialData": {
    "skillName": "Smart Contract Development",
    "skillLevel": "Advanced",
    "institution": "University of Blockchain"
  },
  "expiryDays": 365,
  "issuerAddress": "0x..."
}
```

### GET `/api/verify/:credentialId`
Verify credential status
```json
{
  "success": true,
  "status": "Valid",
  "credentialId": "1",
  "issuer": "0x..."
}
```

### POST `/api/verify/revoke`
Revoke credential
```json
{
  "credentialId": "1"
}
```

### GET `/api/issuer/check/:address`
Check if address is approved issuer
```json
{
  "success": true,
  "isApproved": true
}
```

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **IPFS Privacy**: Sensitive data stored on IPFS is publicly accessible
- **Issuer Approval**: Only trusted institutions should be approved
- **Rate Limiting**: Implement API rate limiting for production
- **Input Validation**: Validate all user inputs
- **Access Control**: Implement proper access controls

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **MetaMask Connection**: Ensure Mumbai testnet is added
2. **Contract Not Found**: Check CONTRACT_ADDRESS in env files
3. **IPFS Upload Fails**: Verify Pinata API keys
4. **Transaction Fails**: Ensure sufficient MATIC balance
5. **Issuer Not Approved**: Contact admin to approve issuer address

### Support

- Create an issue on GitHub
- Check existing issues for solutions
- Review logs for error details

## 🔗 Links

- [Polygon Mumbai Testnet](https://mumbai.polygonscan.com/)
- [Pinata IPFS](https://pinata.cloud/)
- [MetaMask](https://metamask.io/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)