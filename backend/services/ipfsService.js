const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY;
    this.pinataBaseUrl = 'https://api.pinata.cloud';
  }

  async uploadJSON(jsonData) {
    try {
      const data = JSON.stringify(jsonData);
      
      const config = {
        method: 'post',
        url: `${this.pinataBaseUrl}/pinning/pinJSONToIPFS`,
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        },
        data: data
      };

      const response = await axios(config);
      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize
      };
    } catch (error) {
      console.error('IPFS upload error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async getJSON(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateMetadataHash(metadata) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(JSON.stringify(metadata)).digest('hex');
  }
}

module.exports = new IPFSService();