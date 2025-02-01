import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()
import { vars } from "hardhat/config";

const {ALCHEMY_LISK_SEPOLIA_API_KEY_URL, ACCOUNT_PRIVATE_KEY} = process.env;

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY");


const config: HardhatUserConfig = {
  solidity: "0.8.28",

  networks: {
    liskSep: {
      url: ALCHEMY_LISK_SEPOLIA_API_KEY_URL,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`],
    }
  },

  etherscan: {
    apiKey: {
      liskSep: ETHERSCAN_API_KEY,
    },
  }   
};

export default config;

