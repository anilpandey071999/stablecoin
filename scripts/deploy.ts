import { ethers } from "hardhat";
import { StableCoin__factory, StableCoin } from "../typechain-types";

async function main() {
  const priceFeed = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

  const NUSDFactory: StableCoin__factory = await ethers.getContractFactory("StableCoin");
  const NUSDContract: StableCoin = await NUSDFactory.deploy(priceFeed);

  await NUSDContract.waitForDeployment();
  const NUSDAddress = await NUSDContract.getAddress();

  console.log(`nUSD: ${NUSDAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
