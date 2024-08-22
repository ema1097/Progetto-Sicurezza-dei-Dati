// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {
  const ViaggiAutisti = await hre.ethers.deployContract("ViaggiAutisti");

  const [deployer] = await hre.ethers.getSigners();

  await ViaggiAutisti.waitForDeployment();
  console.log("The admin autism is ", deployer.address);
  console.log("The contract address is ", await ViaggiAutisti.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
