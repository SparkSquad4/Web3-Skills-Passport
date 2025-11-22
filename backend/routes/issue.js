const express = require('express');
const router = express.Router();
const ipfsService = require('../services/ipfsService');
const contractService = require('../services/contractService');
const { ethers } = require('ethers');

router.post('/', async (req, res) => {
  try {
    const { studentAddress, credentialData, expiryDays, issuerAddress } = req.body;

    // Validate input
    if (!studentAddress || !credentialData || !expiryDays || !issuerAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if issuer is approved
    const issuerCheck = await contractService.checkApprovedIssuer(issuerAddress);
    if (!issuerCheck.success || !issuerCheck.isApproved) {
      return res.status(403).json({ error: 'Issuer not approved' });
    }

    // Upload metadata to IPFS
    const metadata = {
      studentAddress,
      credentialData,
      issuedAt: new Date().toISOString(),
      issuer: issuerAddress
    };

    const ipfsResult = await ipfsService.uploadJSON(metadata);
    if (!ipfsResult.success) {
      return res.status(500).json({ error: 'Failed to upload to IPFS' });
    }

    // Generate credential hash
    const credentialHash = '0x' + ipfsService.generateMetadataHash(metadata);
    
    // Calculate expiry timestamp
    const expiryTimestamp = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);

    // Issue credential on blockchain
    const contractResult = await contractService.issueCredential(
      studentAddress,
      credentialHash,
      expiryTimestamp
    );

    if (!contractResult.success) {
      return res.status(500).json({ error: 'Failed to issue credential on blockchain' });
    }

    res.json({
      success: true,
      credentialId: contractResult.credentialId,
      ipfsHash: ipfsResult.ipfsHash,
      transactionHash: contractResult.transactionHash,
      expiryTimestamp
    });

  } catch (error) {
    console.error('Issue credential error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;