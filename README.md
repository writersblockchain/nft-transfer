# Vlayer Mascot NFT Collection

A Web3 dApp for minting and managing unique Vlayer mascot NFTs. Each wallet can mint one of each mascot type, creating a unique collection of digital mascots on the blockchain.

## Live Demo

Visit [nft-transfer.vercel.app](https://nft-transfer.vercel.app) to try the app!

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features & Usage

### 1. Minting Mascots
- Connect your wallet using the button in the top right
- Choose from 4 unique mascots:
  - OG Mascot
  - Love Mascot
  - OK Mascot
  - Sherlock Holmes
- Click on a mascot to mint
- Confirm the transaction in your wallet

[View Minting Code](components/MintNFT.tsx)

### 2. Viewing Your Collection
- All your minted mascots appear in the "Your Mascots" section
- Each mascot displays:
  - Unique artwork
  - Mascot name
  - Token ID

[View Display Code](components/DisplayNFT.tsx)

### 3. Transferring NFTs
- Select a mascot from your collection
- Enter the recipient's wallet address
- Click "Transfer NFT"
- Confirm the transaction in your wallet

[View Contract Code](contracts/VlayerMascots.sol)

## Limitations & Known Behaviors

1. **One Per Type Limit**
   - Each wallet can only mint one of each mascot type
   - Attempting to mint a duplicate will show a warning message

2. **Wallet Requirements**
   - Requires MetaMask wallet
   - Must be connected to the correct network (Sepolia)

3. **Token IDs**
   - Token IDs increment sequentially
   - IDs are preserved even if NFTs are transferred

## Smart Contract Details

The contract is deployed at: `0xD50D663727C49Be5E1632707E71aAd2f110903D1`

Key features:
- ERC721 standard implementation
- On-chain metadata storage
- Base64 encoded JSON responses
- Ownership tracking per wallet address
- Type-specific minting restrictions

## Development Notes

### Contract Functions
```solidity
// Mint a new mascot
function mint(uint256 mascotType) public returns (uint256)

// Check mascot ownership
function ownerOf(uint256 tokenId) public view returns (address)

// Transfer mascot
function transferFrom(address from, address to, uint256 tokenId)
```

### Frontend Components
- `MintNFT.tsx`: Handles mascot minting interface
- `DisplayNFT.tsx`: Manages NFT display and transfers
- `Web3Modal`: Handles wallet connections
