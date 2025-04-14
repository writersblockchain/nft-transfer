import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Updated ABI with ownerOf function
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

const contractAddress = "0x3bcdfdeA2e6499cdA1a587488F93B461aD9742E0";

type NFT = {
  id: number;
  name: string;
  image: string;
};

export default function DisplayNFT() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is connected when component mounts
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      (window.ethereum as any).on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setNfts([]);
        }
      });
    }
    
    return () => {
      // Clean up listeners when component unmounts
      if (window.ethereum) {
        (window.ethereum as any).removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  useEffect(() => {
    if (account) {
      fetchNFTs();
    } else {
      setNfts([]);
    }
  }, [account]);

  const checkConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  };

  const fetchNFTs = async () => {
    if (!window.ethereum || !account) return;
    
    try {
      setLoading(true);
      setError("");
      
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      
      // Get the number of NFTs owned by the address
      const balance = await contract.balanceOf(account);
      console.log("NFT balance:", balance.toString());
      
      if (balance.toString() === "0") {
        setNfts([]);
        setLoading(false);
        return;
      }
      
      // Try to find NFTs by checking ownership of token IDs
      const foundNfts: NFT[] = [];
      
      // Check token IDs 0-10 (adjust range as needed)
      for (let tokenId = 0; tokenId < 10; tokenId++) {
        try {
          // Check if the current user owns this token
          const owner = await contract.ownerOf(tokenId);
          console.log(`Token ${tokenId} owner:`, owner);
          
          if (owner.toLowerCase() === account.toLowerCase()) {
            // User owns this token, get its metadata
            const tokenURI = await contract.tokenURI(tokenId);
            console.log(`Token ${tokenId} URI:`, tokenURI);
            
            // Parse the base64 encoded JSON data from the URI
            const base64Data = tokenURI.split(",")[1];
            const jsonString = atob(base64Data);
            const metadata = JSON.parse(jsonString);
            
            foundNfts.push({
              id: tokenId,
              name: metadata.name,
              image: metadata.image
            });
          }
        } catch (tokenErr) {
          // Skip tokens that don't exist or have other issues
          console.log(`Token ${tokenId} not found or error:`, tokenErr);
        }
      }
      
      setNfts(foundNfts);
      
      if (foundNfts.length === 0 && balance.toString() !== "0") {
        setError("Found NFTs in balance but couldn't retrieve details. Try a different approach.");
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("Failed to load your NFTs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading your mascots...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!account) {
    return <div>Connect your wallet to view your mascots</div>;
  }

  if (nfts.length === 0) {
    return <div>You don't have any mascots yet. Mint one!</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nfts.map((nft) => (
          <div key={nft.id} className="border rounded-lg p-4 bg-gray-50">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-48 object-contain mb-2 rounded"
            />
            <h3 className="font-bold text-lg">{nft.name}</h3>
            <p className="text-sm text-gray-600">Token ID: {nft.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}