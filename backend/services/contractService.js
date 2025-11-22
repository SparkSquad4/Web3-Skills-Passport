const { ethers } = require('ethers');

class ContractService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.MUMBAI_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    
    // Contract ABI (minimal for our functions)
    this.contractABI = [
      "function issueCredential(address student, bytes32 credentialHash, uint256 expiryTimestamp) external returns (uint256)",
      "function revokeCredential(uint256 credentialId) external",
      "function verifyCredential(uint256 credentialId) external view returns (bool valid, bool expired, bool revoked, address issuer)",
      "function checkExpiry(uint256 credentialId) external view returns (bool expired)",
      "function setApprovedIssuer(address issuer, bool approved) external",
      "function approvedIssuers(address) external view returns (bool)",
      "function getCredentialDetails(uint256 credentialId) external view returns (bytes32, uint256, address, bool, bool)"
    ];

    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      this.contractABI,
      this.wallet
    );
  }

  async issueCredential(studentAddress, credentialHash, expiryTimestamp) {
    try {
      const tx = await this.contract.issueCredential(
        studentAddress,
        credentialHash,
        expiryTimestamp
      );
      const receipt = await tx.wait();
      
      // Extract credential ID from event
      const event = receipt.logs.find(log => 
        log.topics[0] === ethers.id("CredentialIssued(uint256,address,address,bytes32)")
      );
      
      const credentialId = ethers.toBigInt(event.topics[1]).toString();
      
      return {
        success: true,
        credentialId,
        transactionHash: receipt.hash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async verifyCredential(credentialId) {
    try {
      const result = await this.contract.verifyCredential(credentialId);
      return {
        success: true,
        valid: result[0],
        expired: result[1],
        revoked: result[2],
        issuer: result[3]
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async revokeCredential(credentialId) {
    try {
      const tx = await this.contract.revokeCredential(credentialId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async checkApprovedIssuer(issuerAddress) {
    try {
      const isApproved = await this.contract.approvedIssuers(issuerAddress);
      return {
        success: true,
        isApproved
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ContractService();