"use client";

import React, { useState, useEffect } from "react";
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
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      (window.ethereum as any).on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        (window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  };

  const mintMascot = async (mascotId: number) => {
    try {
      if (!window.ethereum) {
        setStatus(`⚠️ Please install MetaMask to mint ${mascots[mascotId].name}`);
        return;
      }

      if (!account) {
        setStatus(`⚠️ Please connect your wallet to mint ${mascots[mascotId].name}`);
        return;
      }

      setStatus("Minting...");
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC721_ABI, signer);

      const tx = await contract.mint(mascotId);
      await tx.wait();

      setStatus(`✅ Minted ${mascots[mascotId].name}`);
    } catch (err: any) {
      console.error("Mint failed:", err);
      // Check for the specific error message in different possible locations
      const errorMessage = err.message || err.error?.message || err.data?.message || '';
      const revertMessage = err.error?.data?.message || err.data?.data?.message || '';
      
      if (errorMessage.includes("already minted") || revertMessage.includes("already minted")) {
        setStatus(`⚠️ You can only mint one ${mascots[mascotId].name}!`);
      } else if (errorMessage.includes("unknown account") || errorMessage.includes("getAddress")) {
        setStatus(`⚠️ Please connect your wallet to mint ${mascots[mascotId].name}`);
      } else {
        setStatus("❌ Mint failed. Check console for details.");
      }
    }
  };

  return (
    <div>
      {!account && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700">
            👋 Connect your wallet using the button in the top right to start minting mascots!
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        {mascots.map((m) => (
          <div
            key={m.id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer bg-white/80 hover:bg-white hover:shadow-purple-500/25 hover:shadow-lg hover:scale-[1.02] duration-300 ease-out relative group"
            onClick={() => mintMascot(m.id)}
          >
            <div className="aspect-square w-full relative mb-2">
              <img
                src={m.image}
                alt={m.name}
                className="rounded absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="text-center font-medium">{m.name}</div>
            {status.includes(m.name) && (
              <div 
                className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                  status.includes("⚠️") 
                    ? "bg-yellow-500/90" 
                    : status.includes("✅") 
                    ? "bg-green-500/90"
                    : "bg-red-500/90"
                } transition-opacity duration-300 opacity-0 group-hover:opacity-100`}
              >
                <p className="text-white text-center font-medium px-4">
                  {status.includes(m.name) ? status : ""}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
