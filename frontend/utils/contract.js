import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const CONTRACT_ABI = [
  "function approvedIssuers(address) external view returns (bool)",
  "function getStudentCredentials(address student) external view returns (uint256[])",
  "function getCredentialDetails(uint256 credentialId) external view returns (bytes32, uint256, address, bool, bool)",
  "function verifyCredential(uint256 credentialId) external view returns (bool valid, bool expired, bool revoked, address issuer)"
];

export class ContractUtils {
  constructor() {
    this.provider = null;
    this.contract = null;
  }

  async init() {
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    }
  }

  async getStudentCredentials(studentAddress) {
    try {
      await this.init();
      const credentialIds = await this.contract.getStudentCredentials(studentAddress);
      return credentialIds.map(id => id.toString());
    } catch (error) {
      console.error('Error fetching student credentials:', error);
      return [];
    }
  }

  async getCredentialDetails(credentialId) {
    try {
      await this.init();
      const details = await this.contract.getCredentialDetails(credentialId);
      return {
        credentialHash: details[0],
        expiryTimestamp: Number(details[1]),
        issuer: details[2],
        revoked: details[3],
        exists: details[4]
      };
    } catch (error) {
      console.error('Error fetching credential details:', error);
      return null;
    }
  }

  async checkApprovedIssuer(issuerAddress) {
    try {
      await this.init();
      return await this.contract.approvedIssuers(issuerAddress);
    } catch (error) {
      console.error('Error checking approved issuer:', error);
      return false;
    }
  }
}

export const contractUtils = new ContractUtils();

// API calls
export const api = {
  async issueCredential(data) {
    const response = await fetch(`${API_BASE_URL}/issue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  async verifyCredential(credentialId) {
    const response = await fetch(`${API_BASE_URL}/verify/${credentialId}`);
    return response.json();
  },

  async revokeCredential(credentialId) {
    const response = await fetch(`${API_BASE_URL}/verify/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialId })
    });
    return response.json();
  },

  async checkIssuer(issuerAddress) {
    const response = await fetch(`${API_BASE_URL}/issuer/check/${issuerAddress}`);
    return response.json();
  }
};