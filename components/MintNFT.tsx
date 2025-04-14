"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config/config";

// Minimal ABI with functions used
const ERC721_ABI = [
  "function mint(uint256 mascotType) public returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
];

// Mascot list with image previews
const mascots = [
  {
    id: 0,
    name: "OG Mascot",
    image:
      "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreibcd7xon7ggpzhtz7sbdmyj4qas75lct2wlv2bfyteu2lqidqqm4m?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
  },
  {
    id: 1,
    name: "Love Mascot",
    image:
      "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreid2el4ne44ojchyh4cxqx5qr3mvhgqiwoeu567rqhb3xgi72uo7va?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
  },
  {
    id: 2,
    name: "OK Mascot",
    image:
      "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreiclxy3d6kpe33iogdw7fkxsnvrvbl2iyorjgbz2szn2jlkkybyjk4?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
  },
  {
    id: 3,
    name: "Sherlock Holmes",
    image:
      "https://maroon-naughty-vulture-883.mypinata.cloud/ipfs/bafkreiet7ksrnxcjqxrguoxhtgy5va55tjyfycabflmelxl5tsbhaoif24?pinataGatewayToken=jqDJrIcCskFxlBulHN3n6-cCBri5qtODpHHQrMBrOiUtvmbPeLvjFLS3PwuNhhUe",
  },
];

export default function MintNFT() {
  const [status, setStatus] = useState("");

  const mintMascot = async (mascotId: number) => {
    try {
      setStatus("Minting...");
      if (!window.ethereum) throw new Error("Wallet not found");

      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC721_ABI, signer);

      const tx = await contract.mint(mascotId);
      await tx.wait();

      setStatus(`✅ Minted ${mascots[mascotId].name}`);
    } catch (err: any) {
      if (err.message?.includes("already minted")) {
        setStatus("⚠️ You already minted this mascot type.");
      } else {
        setStatus("❌ Mint failed. See console.");
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {mascots.map((m) => (
          <div
            key={m.id}
            className="border rounded p-2 shadow hover:shadow-md transition cursor-pointer"
            onClick={() => mintMascot(m.id)}
          >
            <img
              src={m.image}
              alt={m.name}
              className="rounded mb-2 w-full h-auto"
            />
            <div className="text-center font-medium">{m.name}</div>
          </div>
        ))}
      </div>
      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
