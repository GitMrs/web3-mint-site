require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-etherscan');
const dotenv = require('dotenv');
dotenv.config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: process.env.REACT_APP_GOERLI_RPC_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KKEY],
    }
  },
  etherscan: {
    apiKey: process.env.REACT_APP_ENTERSCAN_KEY
  },
  mocha: {
    timeout: 400000
  }
};
