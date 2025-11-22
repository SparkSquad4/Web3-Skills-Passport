const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');

router.get('/check/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: 'Issuer address required' });
    }

    const result = await contractService.checkApprovedIssuer(address);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      address,
      isApproved: result.isApproved
    });

  } catch (error) {
    console.error('Check issuer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;