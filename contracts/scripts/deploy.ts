import { ethers } from "hardhat";

async function main() {
  const Rollup = await ethers.getContractFactory("Rollup");
  const rollup = await Rollup.deploy();

  await rollup.deployed();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
