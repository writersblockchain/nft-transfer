// web3ModalConfig.ts
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { projectId, metadata } from "./config";
import chainData from "@/config/chains.json";

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: "...",
  defaultChainId: 1,
});

export const initializeWeb3Modal = async () => {
  try {
    // Extract only testnets from the local config file
    const testnets = chainData.chains.testnets;

    // Build the array of chains from only the testnets data
    const chains = [...Object.values(testnets)];

    // Extract chain images for testnets only
    const chainImages = Object.keys(testnets).reduce<Record<number, string>>((images, key) => {
      const testnet = testnets[key as keyof typeof testnets];
      images[testnet.chainId] = testnet.image;
      return images;
    }, {});

    // Initialize Web3Modal with dynamic chains and chain images
    createWeb3Modal({
      chainImages,
      ethersConfig,
      chains,  // Use only the testnet chains
      projectId,
      enableAnalytics: true, // Optional - defaults to your Cloud configuration
    });
  } catch (error) {
    console.error("Error initializing Web3Modal:", error);
  }
};