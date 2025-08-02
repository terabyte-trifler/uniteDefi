// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const LoyaltyToken = await hre.ethers.getContractFactory("LoyaltyToken");
  const token = await LoyaltyToken.deploy();
  await token.waitForDeployment(); // ✅ fixed
  console.log(`✅ LoyaltyToken deployed to: ${token.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
