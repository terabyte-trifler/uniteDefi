require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/aaebeeda8f534e7c8cdb2aee09586363",
      accounts: ["46b94a0006727d06b308d87db33b87aa59b86611582e9b92bb58fcad5a9f0572"]
    }
  }
};
