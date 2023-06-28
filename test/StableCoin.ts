import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { StableCoinLocal__factory, StableCoinLocal } from "../typechain-types";

describe("StableCoin", function () {
  async function deployStable() {
    const [owner, otherAccount] = await ethers.getSigners();
    const NUSDFactory: StableCoinLocal__factory =
      await ethers.getContractFactory("StableCoinLocal");
    const stableCoin: StableCoinLocal = await NUSDFactory.deploy();

    await stableCoin.waitForDeployment();
    const NUSDAddress = await stableCoin.getAddress();

    return { owner, otherAccount, stableCoin, NUSDAddress };
  }

  describe("Minting nUSD", function () {
    it("Should mint correct amount of nUSD", async function () {
      const { owner, otherAccount, stableCoin, NUSDAddress } =
        await deployStable();
      const depositAmount = ethers.parseEther("1"); // 1 ETH
      await stableCoin
        .connect(otherAccount)
        .depositETH({ value: depositAmount });

      expect(await stableCoin.balanceOf(otherAccount.address)).to.equal(
        ethers.parseEther("1000")
      ); // Should mint 1000 nUSD (half of ETH value in USD)
    });
  });

  describe("Redeeming nUSD", function () {
    it("Should redeem nUSD for correct amount of ETH", async function () {
      const { owner, otherAccount, stableCoin, NUSDAddress } =
        await deployStable();
      const depositAmount = ethers.parseEther("1"); // 1 ETH
      await stableCoin
        .connect(otherAccount)
        .depositETH({ value: depositAmount });

      const redeemAmount = await stableCoin.balanceOf(otherAccount.address);
      const initialEthBalance = await ethers.provider.getBalance(
        otherAccount.address
      );
      await stableCoin.connect(otherAccount).redeem(redeemAmount);

      const finalEthBalance = await ethers.provider.getBalance(
        otherAccount.address
      );
      expect(finalEthBalance).to.gt(initialEthBalance);
    });
  });

  describe("emergencyWithdraw", function () {
    it("Should withdraw all ETH from the contract", async function () {
      const { owner, otherAccount, stableCoin, NUSDAddress } =
        await deployStable();
      const depositAmount = ethers.parseEther("1"); // 1 ETH
      await stableCoin.connect(owner).depositETH({ value: depositAmount });

      await expect(() =>
        stableCoin.connect(owner).emergencyWithdraw()
      ).to.changeEtherBalance(owner, depositAmount);

      expect(await ethers.provider.getBalance(NUSDAddress)).to.equal(0);
    });

    it("Should revert if not the owner", async function () {
      const { owner, otherAccount, stableCoin, NUSDAddress } =
        await deployStable();
      await expect(
        stableCoin.connect(otherAccount).emergencyWithdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
