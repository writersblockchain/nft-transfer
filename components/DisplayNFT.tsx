import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

// Updated ABI with transferFrom function
const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function transferFrom(address from, address to, uint256 tokenId)"
];

const contractAddress = "0xD50D663727C49Be5E1632707E71aAd2f110903D1";

type NFT = {
  id: number;
  name: string;
  image: string;
};

interface DisplayNFTProps {
  refreshTrigger: number;
}

export default function DisplayNFT({ refreshTrigger }: DisplayNFTProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [account, setAccount] = useState<string | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferStatus, setTransferStatus] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

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
    }
  }, [refreshTrigger, account]);

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
        console.log("Found NFTs in balance but couldn't retrieve details. Try a different approach.");
      }
    } catch (err) {
      console.error("Error fetching NFTs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNFT = (nft: NFT) => {
    setSelectedNFT(nft);
    setTransferStatus("");
  };

  const handleTransfer = async () => {
    if (!selectedNFT || !recipientAddress || !window.ethereum || !account) {
      console.log("Please select an NFT and enter a valid recipient address");
      return;
    }

    // Validate recipient address
    if (!ethers.utils.isAddress(recipientAddress)) {
      console.log("Invalid recipient address");
      return;
    }

    try {
      setIsTransferring(true);
      setTransferStatus("Initiating transfer...");

      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Send the transaction
      const tx = await contract.transferFrom(account, recipientAddress, selectedNFT.id);
      setTransferStatus("Transaction sent! Waiting for confirmation...");

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transfer transaction:", receipt);

      setTransferStatus("Transfer successful!");
      
      // Refresh NFTs after transfer
      setTimeout(() => {
        fetchNFTs();
        setSelectedNFT(null);
        setRecipientAddress("");
      }, 2000);
    } catch (err: any) {
      console.error("Error transferring NFT:", err);
      setTransferStatus("Transfer failed. Check console for details.");
    } finally {
      setIsTransferring(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading your mascots...</div>;
  }

  if (!account) {
    return <div>Connect your wallet to view your mascots</div>;
  }

  if (nfts.length === 0) {
    return <div>You don't have any mascots yet. Mint one!</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {nfts.map((nft) => (
          <div 
            key={nft.id} 
            className={`border rounded-lg p-4 bg-gray-50 cursor-pointer transition-all ${
              selectedNFT?.id === nft.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => handleSelectNFT(nft)}
          >
            <div className="aspect-square w-full relative mb-2">
              <img
                src={nft.image}
                alt={nft.name}
                className="absolute inset-0 w-full h-full object-contain rounded"
              />
            </div>
            <h3 className="font-bold text-lg text-center">{nft.name}</h3>
            <p className="text-sm text-gray-600 text-center">Token ID: {nft.id}</p>
          </div>
        ))}
      </div>

      {selectedNFT && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <h3 className="text-lg font-bold mb-4">Transfer NFT</h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Selected: {selectedNFT.name} (ID: {selectedNFT.id})</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleTransfer}
            disabled={isTransferring || !recipientAddress}
            className={`px-4 py-2 rounded ${
              isTransferring || !recipientAddress
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isTransferring ? 'Transferring...' : 'Transfer NFT'}
          </button>
          {transferStatus && (
            <p className={`mt-2 text-sm ${
              transferStatus.includes('successful') ? 'text-green-500' : 'text-blue-500'
            }`}>
              {transferStatus}
            </p>
          )}
        </div>
      )}
    </div>
  );
}