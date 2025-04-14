"use client";

import React, { useState, useEffect } from "react";
import { initializeWeb3Modal } from '../config/web3ModalConfig';
import { useInitEthereum } from "../config/initEthereum";
import MintNFT from "../components/MintNFT";
import DisplayNFT from "../components/DisplayNFT";

export default function Home() {
  const [chainId, setChainId] = useState("");
  const [shouldRefreshNFTs, setShouldRefreshNFTs] = useState(0);

  useEffect(() => {
    initializeWeb3Modal();
  }, []);

  useInitEthereum(setChainId);

  const triggerNFTRefresh = () => {
    setShouldRefreshNFTs(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url("/background.png")',
          filter: 'brightness(0.7)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-5xl font-bold text-white tracking-wider">
              VLAYER MASCOT MINTER
            </h1>
          </div>
          <div className="w-24 h-1 bg-purple-500 mx-auto"/>
        </div>

        <div className="mb-4 self-end flex justify-end">
          {/* @ts-ignore */}
          <w3m-button />
        </div>

        <div className="flex flex-1 gap-8">
          <div className="w-1/2 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Mint a Mascot</h2>
            <MintNFT onSuccessfulMint={triggerNFTRefresh} />
          </div>

          <div className="w-1/2 p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Your Mascots</h2>
            <DisplayNFT refreshTrigger={shouldRefreshNFTs} />
          </div>
        </div>
      </div>
    </div>
  );
}
