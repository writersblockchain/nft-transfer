// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract VlayerMascots is ERC721, Ownable {
    using Strings for uint256;

    enum MascotType {
        OG,
        Love,
        OK,
        Sherlock
    }

    uint256 private nextTokenId = 1;

    // Tracks how many of each mascot type have been minted
    mapping(uint256 => uint256) private mascotTypeCounts;

    // Records what mascot type each token ID represents
    mapping(uint256 => MascotType) private tokenMascotType;

    // Tracks which mascot types each address has minted
    mapping(address => mapping(uint256 => bool)) private hasMintedMascotType;

    string[4] private mascotImageURLs = [
        "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreibcd7xon7ggpzhtz7sbdmyj4qas75lct2wlv2bfyteu2lqidqqm4m?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
        "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreid2el4ne44ojchyh4cxqx5qr3mvhgqiwoeu567rqhb3xgi72uo7va?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
        "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreiclxy3d6kpe33iogdw7fkxsnvrvbl2iyorjgbz2szn2jlkkybyjk4?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
        "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreiet7ksrnxcjqxrguoxhtgy5va55tjyfycabflmelxl5tsbhaoif24?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe"
    ];

    string[4] private mascotNames = [
        "OG Mascot",
        "Love Mascot",
        "OK Mascot",
        "Sherlock Holmes"
    ];

    constructor() ERC721("Vlayer Mascots", "VMAS") Ownable(msg.sender) {}

    function mint(uint256 mascotType) public returns (uint256) {
        require(mascotType < 4, "Invalid mascot type");
        require(!hasMintedMascotType[msg.sender][mascotType], "You already minted this mascot type");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        mascotTypeCounts[mascotType]++;
        tokenMascotType[tokenId] = MascotType(mascotType);
        hasMintedMascotType[msg.sender][mascotType] = true;

        _safeMint(msg.sender, tokenId);

        return tokenId;
    }

    function getMascotCount(uint256 mascotType) public view returns (uint256) {
        require(mascotType < 4, "Invalid mascot type");
        return mascotTypeCounts[mascotType];
    }

    function getMascotTypeOf(uint256 tokenId) public view returns (uint256) {
        ownerOf(tokenId); // will revert if nonexistent
        return uint256(tokenMascotType[tokenId]);
    }

    function setMascotImageURLs(string[4] memory newImageURLs) public onlyOwner {
        mascotImageURLs = newImageURLs;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        ownerOf(tokenId); // will revert if nonexistent

        uint256 mascotType = uint256(tokenMascotType[tokenId]);

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "', mascotNames[mascotType], '", ',
            '"description": "Vlayer Mascots Collection", ',
            '"image": "', mascotImageURLs[mascotType], '", ',
            '"attributes": [{"trait_type": "Mascot Type", "value": ', mascotType.toString(), '}]}'
        ))));

        return string(abi.encodePacked('data:application/json;base64,', json));
    }
}
