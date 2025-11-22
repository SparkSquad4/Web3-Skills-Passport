const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');

router.get('/:credentialId', async (req, res) => {
  try {
    const { credentialId } = req.params;

    if (!credentialId) {
      return res.status(400).json({ error: 'Credential ID required' });
    }

    const result = await contractService.verifyCredential(credentialId);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    let status = 'Invalid';
    if (result.valid) {
      status = 'Valid';
    } else if (result.expired) {
      status = 'Expired';
    } else if (result.revoked) {
      status = 'Revoked';
    }

    res.json({
      success: true,
      credentialId,
      status,
      valid: result.valid,
      expired: result.expired,
      revoked: result.revoked,
      issuer: result.issuer
    });

  } catch (error) {
    console.error('Verify credential error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/revoke', async (req, res) => {
  try {
    const { credentialId } = req.body;

    if (!credentialId) {
      return res.status(400).json({ error: 'Credential ID required' });
    }

    const result = await contractService.revokeCredential(credentialId);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      credentialId,
      transactionHash: result.transactionHash
    });

  } catch (error) {
    console.error('Revoke credential error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;