# 基于 react 构建 web3 的应用

- npx create-react-app
- npm i -D hardhat
- npx hardhat 创建一个 harthat 的 eth 应用
- npm i -D dotenv
- npm i @openzeppelin/contracts 智能和约的一种工具
- npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion 一种 ui 构建工具

# 编写，部署智能合约

- 编写./contracts/\*.sol 文件，里面是智能合约

```js
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; // 引入合约
import "@openzeppelin/contracts/access/Ownable.sol"; // 引入自己定义的合约

contract RoboPunksNFT is ERC721, Ownable {
    uint256 public mintPrice; // 声明价格变量
    uint256 public totalSupply; // 铸币总量
    uint256 public maxSupply; // 最大铸币量
    uint256 public maxPerWallet; // 最大钱包数量
    bool public isPublicMintEnabled;
    string internal baseTokenUri;
    address payable public withdrawWallet;
    mapping(address => uint256) public walleMints;

    constructor() payable ERC721("RoboPunks", "RP") {
        mintPrice = 0.02 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
    }

    // 设置 退款地址
    function setIsPublicMintEnabled(
        bool isPublicMintEnabled_
    ) external onlyOwner {
        isPublicMintEnabled = isPublicMintEnabled_;
    }

    function setAbseTokenUri(string calldata baseTokenUri_) external onlyOwner {
        baseTokenUri = baseTokenUri_;
    }

    function tokenURI(
        uint256 tokenId_
    ) public view override returns (string memory) {
        require(_exists(tokenId_), "Token does not exist!");
        return
            string(
                abi.encodePacked(
                    baseTokenUri,
                    Strings.toString(tokenId_),
                    ".json"
                )
            );
    }

    function withdraw() external onlyOwner {
        (bool success, ) = withdrawWallet.call{value: address(this).balance}(
            ""
        );
        require(success, "withdraw failed");
    }

    function mint(uint256 quantity_) public payable {
        require(isPublicMintEnabled, "miniting not enabled");
        require(msg.value == quantity_ * mintPrice, "wrong minit value");
        require(totalSupply + quantity_ <= maxSupply, "sold out");
        require(
            walleMints[msg.sender] + quantity_ <= maxPerWallet,
            "execed max wallet"
        );
        for (uint256 i = 0; i < quantity_; i++) {
            uint256 newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
        }
    }
}

```

- 修改./scripts/\*.js 合约构建文件

```js
const hre = require("hardhat");

async function main() {
  const RoboPunksNFT = await hre.ethers.getContractFactory("RoboPunksNFT");
  const roboPunksNFT = await RoboPunksNFT.deploy();

  await roboPunksNFT.deployed();

  console.log(`RoboPunksNFT deployed to:`, roboPunksNFT.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

-创建环境变量.env

```js
REACT_APP_GOERLI_RPC_URL =
  "https://goerli.infura.io/v3/fe2d1b1ce1024d66bf0d9abee068029e"; // 合约网络
REACT_APP_ENTERSCAN_KEY = "IPA3EFKFA17Y51WGV3CNTSE16V2FIK47V5"; // enterscan 密码
REACT_APP_PRIVATE_KKEY =
  ""; // 用户私钥
```

- 修改 hardhat.config.js 配置 hardhot 发布文件

```js
require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");
dotenv.config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: process.env.REACT_APP_GOERLI_RPC_URL,
      accounts: [process.env.REACT_APP_PRIVATE_KKEY],
    },
  },
  etherscan: {
    apiKey: process.env.REACT_APP_ENTERSCAN_KEY,
  },
};
```

- 执行 npx hardhot clean
- 执行 npx hardhot run .\scripts\deployRoboPunksNFT.js --network goerli // 选择自己指定的网络
- 打开 https://goerli.etherscan.io/address/${0xB2AC06872Cec326e89fEc5c80ACda2601e75d72f} 查看自己的部署的区域链
- 查看部署验证 npm i -D @nomiclabs/hardhat-etherscan;
```js
require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-etherscan'); // 添加这个
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
  }
};

```
- 执行 npx hardhat verify --network goerli 0xB2AC06872Cec326e89fEc5c80ACda2601e75d72f ；合约id


- 找到./artifacts/contracts/RoboPunksNFT.sol/RoboPunksNFT.json; 合约的文件；复制到./src/RoboPunlsNFT.json
