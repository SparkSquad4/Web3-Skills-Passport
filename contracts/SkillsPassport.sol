// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SkillsPassport {
    struct Credential {
        bytes32 credentialHash;
        uint256 expiryTimestamp;
        address issuer;
        bool revoked;
        bool exists;
    }

    mapping(uint256 => Credential) public credentials;
    mapping(address => bool) public approvedIssuers;
    mapping(address => uint256[]) public studentCredentials;
    
    uint256 private credentialCounter;
    address public owner;

    event CredentialIssued(uint256 indexed credentialId, address indexed student, address indexed issuer, bytes32 credentialHash);
    event CredentialRevoked(uint256 indexed credentialId, address indexed issuer);
    event IssuerApproved(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyApprovedIssuer() {
        require(approvedIssuers[msg.sender], "Not approved issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        approvedIssuers[msg.sender] = true;
    }

    function issueCredential(
        address student,
        bytes32 credentialHash,
        uint256 expiryTimestamp
    ) external onlyApprovedIssuer returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(expiryTimestamp > block.timestamp, "Invalid expiry");

        credentialCounter++;
        uint256 credentialId = credentialCounter;

        credentials[credentialId] = Credential({
            credentialHash: credentialHash,
            expiryTimestamp: expiryTimestamp,
            issuer: msg.sender,
            revoked: false,
            exists: true
        });

        studentCredentials[student].push(credentialId);

        emit CredentialIssued(credentialId, student, msg.sender, credentialHash);
        return credentialId;
    }

    function revokeCredential(uint256 credentialId) external {
        require(credentials[credentialId].exists, "Credential not found");
        require(credentials[credentialId].issuer == msg.sender, "Not credential issuer");
        require(!credentials[credentialId].revoked, "Already revoked");

        credentials[credentialId].revoked = true;
        emit CredentialRevoked(credentialId, msg.sender);
    }

    function verifyCredential(uint256 credentialId) external view returns (
        bool valid,
        bool expired,
        bool revoked,
        address issuer
    ) {
        if (!credentials[credentialId].exists) {
            return (false, false, false, address(0));
        }

        Credential memory cred = credentials[credentialId];
        bool isExpired = block.timestamp > cred.expiryTimestamp;
        bool isValid = !cred.revoked && !isExpired && approvedIssuers[cred.issuer];

        return (isValid, isExpired, cred.revoked, cred.issuer);
    }

    function checkExpiry(uint256 credentialId) external view returns (bool expired) {
        if (!credentials[credentialId].exists) return true;
        return block.timestamp > credentials[credentialId].expiryTimestamp;
    }

    function setApprovedIssuer(address issuer, bool approved) external onlyOwner {
        approvedIssuers[issuer] = approved;
        if (approved) {
            emit IssuerApproved(issuer);
        } else {
            emit IssuerRemoved(issuer);
        }
    }

    function getStudentCredentials(address student) external view returns (uint256[] memory) {
        return studentCredentials[student];
    }

    function getCredentialDetails(uint256 credentialId) external view returns (
        bytes32 credentialHash,
        uint256 expiryTimestamp,
        address issuer,
        bool revoked,
        bool exists
    ) {
        Credential memory cred = credentials[credentialId];
        return (cred.credentialHash, cred.expiryTimestamp, cred.issuer, cred.revoked, cred.exists);
    }
}