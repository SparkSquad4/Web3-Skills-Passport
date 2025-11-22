const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillsPassport", function () {
  let skillsPassport;
  let owner, issuer, student, unauthorizedIssuer;
  let credentialHash;
  let expiryTimestamp;

  beforeEach(async function () {
    [owner, issuer, student, unauthorizedIssuer] = await ethers.getSigners();
    
    const SkillsPassport = await ethers.getContractFactory("SkillsPassport");
    skillsPassport = await SkillsPassport.deploy();
    await skillsPassport.waitForDeployment();

    // Set up test data
    credentialHash = ethers.keccak256(ethers.toUtf8Bytes("test credential"));
    expiryTimestamp = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

    // Approve issuer
    await skillsPassport.setApprovedIssuer(issuer.address, true);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await skillsPassport.owner()).to.equal(owner.address);
    });

    it("Should approve owner as issuer by default", async function () {
      expect(await skillsPassport.approvedIssuers(owner.address)).to.be.true;
    });
  });

  describe("Issuer Management", function () {
    it("Should allow owner to approve issuers", async function () {
      await skillsPassport.setApprovedIssuer(issuer.address, true);
      expect(await skillsPassport.approvedIssuers(issuer.address)).to.be.true;
    });

    it("Should allow owner to remove issuers", async function () {
      await skillsPassport.setApprovedIssuer(issuer.address, false);
      expect(await skillsPassport.approvedIssuers(issuer.address)).to.be.false;
    });

    it("Should not allow non-owner to manage issuers", async function () {
      await expect(
        skillsPassport.connect(issuer).setApprovedIssuer(student.address, true)
      ).to.be.revertedWith("Only owner");
    });

    it("Should emit events when managing issuers", async function () {
      await expect(skillsPassport.setApprovedIssuer(student.address, true))
        .to.emit(skillsPassport, "IssuerApproved")
        .withArgs(student.address);

      await expect(skillsPassport.setApprovedIssuer(student.address, false))
        .to.emit(skillsPassport, "IssuerRemoved")
        .withArgs(student.address);
    });
  });

  describe("Credential Issuance", function () {
    it("Should allow approved issuer to issue credentials", async function () {
      await expect(
        skillsPassport.connect(issuer).issueCredential(
          student.address,
          credentialHash,
          expiryTimestamp
        )
      ).to.emit(skillsPassport, "CredentialIssued");
    });

    it("Should not allow unauthorized issuer to issue credentials", async function () {
      await expect(
        skillsPassport.connect(unauthorizedIssuer).issueCredential(
          student.address,
          credentialHash,
          expiryTimestamp
        )
      ).to.be.revertedWith("Not approved issuer");
    });

    it("Should not allow issuing to zero address", async function () {
      await expect(
        skillsPassport.connect(issuer).issueCredential(
          ethers.ZeroAddress,
          credentialHash,
          expiryTimestamp
        )
      ).to.be.revertedWith("Invalid student address");
    });

    it("Should not allow issuing with past expiry", async function () {
      const pastTimestamp = Math.floor(Date.now() / 1000) - 86400;
      await expect(
        skillsPassport.connect(issuer).issueCredential(
          student.address,
          credentialHash,
          pastTimestamp
        )
      ).to.be.revertedWith("Invalid expiry");
    });

    it("Should store credential details correctly", async function () {
      const tx = await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        expiryTimestamp
      );
      const receipt = await tx.wait();
      
      // Get credential ID from event
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === "CredentialIssued"
      );
      const credentialId = event.args[0];

      const details = await skillsPassport.getCredentialDetails(credentialId);
      expect(details[0]).to.equal(credentialHash);
      expect(details[1]).to.equal(expiryTimestamp);
      expect(details[2]).to.equal(issuer.address);
      expect(details[3]).to.be.false; // not revoked
      expect(details[4]).to.be.true;  // exists
    });

    it("Should add credential to student's list", async function () {
      await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        expiryTimestamp
      );

      const studentCredentials = await skillsPassport.getStudentCredentials(student.address);
      expect(studentCredentials.length).to.equal(1);
    });
  });

  describe("Credential Verification", function () {
    let credentialId;

    beforeEach(async function () {
      const tx = await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        expiryTimestamp
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === "CredentialIssued"
      );
      credentialId = event.args[0];
    });

    it("Should verify valid credential", async function () {
      const result = await skillsPassport.verifyCredential(credentialId);
      expect(result[0]).to.be.true;  // valid
      expect(result[1]).to.be.false; // not expired
      expect(result[2]).to.be.false; // not revoked
      expect(result[3]).to.equal(issuer.address);
    });

    it("Should detect expired credentials", async function () {
      // Issue credential with past expiry
      const pastExpiry = Math.floor(Date.now() / 1000) - 1;
      const tx = await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        pastExpiry
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === "CredentialIssued"
      );
      const expiredCredentialId = event.args[0];

      const result = await skillsPassport.verifyCredential(expiredCredentialId);
      expect(result[0]).to.be.false; // not valid
      expect(result[1]).to.be.true;  // expired
    });

    it("Should return false for non-existent credentials", async function () {
      const result = await skillsPassport.verifyCredential(999);
      expect(result[0]).to.be.false;
      expect(result[3]).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Credential Revocation", function () {
    let credentialId;

    beforeEach(async function () {
      const tx = await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        expiryTimestamp
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === "CredentialIssued"
      );
      credentialId = event.args[0];
    });

    it("Should allow issuer to revoke credential", async function () {
      await expect(
        skillsPassport.connect(issuer).revokeCredential(credentialId)
      ).to.emit(skillsPassport, "CredentialRevoked")
        .withArgs(credentialId, issuer.address);
    });

    it("Should not allow non-issuer to revoke credential", async function () {
      await expect(
        skillsPassport.connect(student).revokeCredential(credentialId)
      ).to.be.revertedWith("Not credential issuer");
    });

    it("Should not allow revoking non-existent credential", async function () {
      await expect(
        skillsPassport.connect(issuer).revokeCredential(999)
      ).to.be.revertedWith("Credential not found");
    });

    it("Should not allow revoking already revoked credential", async function () {
      await skillsPassport.connect(issuer).revokeCredential(credentialId);
      await expect(
        skillsPassport.connect(issuer).revokeCredential(credentialId)
      ).to.be.revertedWith("Already revoked");
    });

    it("Should mark revoked credential as invalid", async function () {
      await skillsPassport.connect(issuer).revokeCredential(credentialId);
      
      const result = await skillsPassport.verifyCredential(credentialId);
      expect(result[0]).to.be.false; // not valid
      expect(result[2]).to.be.true;  // revoked
    });
  });

  describe("Expiry Checking", function () {
    it("Should correctly check expiry status", async function () {
      // Valid credential
      const tx = await skillsPassport.connect(issuer).issueCredential(
        student.address,
        credentialHash,
        expiryTimestamp
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find(log => 
        log.fragment && log.fragment.name === "CredentialIssued"
      );
      const credentialId = event.args[0];

      expect(await skillsPassport.checkExpiry(credentialId)).to.be.false;

      // Non-existent credential should be considered expired
      expect(await skillsPassport.checkExpiry(999)).to.be.true;
    });
  });

  describe("Non-transferability (Soulbound)", function () {
    it("Should not have transfer functions", async function () {
      // The contract should not have transfer functions
      // This is ensured by not implementing ERC721 transfer functions
      expect(skillsPassport.transferFrom).to.be.undefined;
      expect(skillsPassport.safeTransferFrom).to.be.undefined;
    });
  });
});