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
