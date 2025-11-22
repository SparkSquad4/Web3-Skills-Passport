# Deployment Guide

## Quick Start

### 1. Prerequisites Setup

```bash
# Install dependencies
npm run install:all

# Get Mumbai testnet MATIC
# Visit: https://faucet.polygon.technology/
```

### 2. Environment Configuration

Create `.env` files with your credentials:

```bash
# Root .env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_metamask_private_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### 3. Deploy Smart Contract

```bash
# Compile and test
npm run compile
npm run test

# Deploy to Mumbai
npm run deploy
```

Copy the deployed contract address and update all `.env` files.

### 4. Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

### 5. Setup Initial Issuer

1. Visit `http://localhost:3000/issuer`
2. Connect with the deployer wallet (automatically approved)
3. Approve additional issuers using the contract owner functions

## Production Deployment

### Backend Deployment (Render/Railway)

1. **Create New Service**
2. **Connect Repository**
3. **Set Environment Variables**:
   ```
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   PRIVATE_KEY=your_private_key
   CONTRACT_ADDRESS=deployed_contract_address
   PINATA_API_KEY=your_pinata_api_key
   PINATA_SECRET_KEY=your_pinata_secret_key
   PORT=3001
   ```
4. **Set Build Command**: `cd backend && npm install`
5. **Set Start Command**: `cd backend && npm start`

### Frontend Deployment (Vercel)

1. **Connect Repository to Vercel**
2. **Set Root Directory**: `frontend`
3. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS=deployed_contract_address
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   ```
4. **Deploy**

### Contract Verification (Optional)

```bash
# Verify on Polygonscan
npx hardhat verify --network mumbai DEPLOYED_CONTRACT_ADDRESS
```

## Demo Flow

1. **Deploy Contract** → Get contract address
2. **Start Backend** → API running on port 3001
3. **Start Frontend** → UI running on port 3000
4. **Connect Issuer Wallet** → Approve issuer if needed
5. **Issue Credential** → Create test credential
6. **Connect Student Wallet** → View credential
7. **Generate QR Code** → Create verification QR
8. **Verify Credential** → Test verification flow

## Environment Variables Reference

### Required for All Deployments
- `MUMBAI_RPC_URL`: Polygon Mumbai RPC endpoint
- `PRIVATE_KEY`: Wallet private key (keep secure!)
- `CONTRACT_ADDRESS`: Deployed contract address
- `PINATA_API_KEY`: Pinata API key for IPFS
- `PINATA_SECRET_KEY`: Pinata secret key

### Optional
- `POLYGONSCAN_API_KEY`: For contract verification
- `PORT`: Backend port (default: 3001)

## Security Checklist

- [ ] Private keys stored securely
- [ ] Environment variables not committed
- [ ] CORS configured for production domains
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] HTTPS enabled in production