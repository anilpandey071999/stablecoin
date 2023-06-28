import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-foundry";


dotenv.config();

function loadAccounts() {
  return process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: loadAccounts(),
    },
    mumbai: {
      url: `https://rpc-mumbai.maticvigil.com/`,
      accounts: loadAccounts(),
      gasPrice: 8000000000, // We need to have a number here. See issue: https://github.com/nomiclabs/hardhat/issues/1828
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY as string,
    }
  }
};


export default config;
