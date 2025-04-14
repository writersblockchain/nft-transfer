"use client";

import React, { useState, useEffect } from "react";
import { initializeWeb3Modal } from '../config/web3ModalConfig';
import { useInitEthereum } from "../config/initEthereum";
import MintNFT from "../components/MintNFT";
import DisplayNFT from "../components/DisplayNFT";

export default function Home() {
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    initializeWeb3Modal();
  }, []);

  useInitEthereum(setChainId);

  return (
    <div className="flex flex-col min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <div className="mb-4 self-end">
        {/* @ts-ignore */}
        <w3m-button />
      </div>

      <div className="flex flex-1 gap-8">
        <div className="w-1/2 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Mint a Mascot</h2>
          <MintNFT />
        </div>

        <div className="w-1/2 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Your Mascots</h2>
          <DisplayNFT />
        </div>
      </div>
    </div>
  );
}
