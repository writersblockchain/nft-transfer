"use client";

import React, { useState, useEffect } from "react";
import { initializeWeb3Modal } from '../config/web3ModalConfig';
import { useInitEthereum } from "../config/initEthereum";

export default function Home() {
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    initializeWeb3Modal();
  }, []);

  useInitEthereum(setChainId);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="connect-wallet-button-container">
        {/* @ts-ignore */}
        <w3m-button className="connect-wallet-button" />
      </div>
    </div>
  );
}
