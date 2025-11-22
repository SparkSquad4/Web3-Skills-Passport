const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SkillsPassport contract...");

  const SkillsPassport = await ethers.getContractFactory("SkillsPassport");
  const skillsPassport = await SkillsPassport.deploy();

  await skillsPassport.deployed();
  const contractAddress = skillsPassport.address;

  console.log("SkillsPassport deployed to:", contractAddress);
  console.log("Owner:", await skillsPassport.owner());

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });