🚀 Token Launcher DApp
A modern, feature-rich decentralized application (dApp) built with Next.js and ethers.js that allows anyone to deploy their own ERC‑20 token on any Ethereum-compatible blockchain in just a few clicks — with advanced tokenomics and liquidity options.

📋 Table of Contents
Overview

Features

Tech Stack

Prerequisites

Installation & Setup

Configuration

Usage Guide

Smart Contract Integration

Project Structure

Development & Testing

Deployment

Contributing

License

🌟 Overview
The Token Launcher DApp is a user-friendly interface that abstracts away the complexity of deploying an ERC‑20 token. Users provide just a few parameters (Name, Symbol, Decimals, Total Supply) and the dApp handles the rest — from smart contract deployment to optional distribution and liquidity creation on Uniswap V2.

Designed with security and user experience in mind, the dApp uses MetaMask for transaction signing, checks gas sufficiency, and provides real-time feedback during the deployment process.

✨ Features
Core Token Deployment
Parameter Input – Token Name, Symbol, Decimals, Total Supply.

Gas Estimation – Automatic check of user’s native currency balance (ETH, MATIC, etc.) with warning for insufficient gas.

Real‑time Status – Displays deployment progress, transaction hash, and token address upon success.

Network Support – Works on any Ethereum‑compatible chain (mainnet, testnets, local Anvil/Hardhat).

Advanced Tokenomics
Mint & Burn – Toggle to include ERC20Burnable and Ownable mint functions (via contract customization).

Multi‑Wallet Distribution – Add multiple addresses with percentage allocations of the total supply.

Uniswap V2 Liquidity – Automatically create a trading pair and add liquidity in a single flow.

Wallet & Connectivity
MetaMask Integration – Seamless connection using ethers.js and @metamask/detect-provider.

Account & Network Display – Shows connected address, balance, and chain ID.

Auto‑refresh – Listens to account/network changes and reloads data.

User Experience
Attractive UI – Glass‑morphism design with gradient backgrounds, custom toggle switches, and animated buttons.

Responsive – Works on desktop and mobile devices.

Error Handling – Clear error messages for invalid inputs, insufficient funds, or transaction failures.

🛠️ Tech Stack
Area	Technology
Framework	Next.js 14 (App Router)
Blockchain Interaction	ethers.js v6
Wallet Provider	MetaMask (EIP‑1193)
Styling	Tailwind CSS
Smart Contracts	OpenZeppelin ERC‑20 (compiled with Hardhat/Foundry)
Development	Node.js, npm
Testing	Anvil (Foundry) / Hardhat Network
📦 Prerequisites
Before you begin, ensure you have installed:

Node.js (v18 or higher)

npm or yarn

MetaMask browser extension

A local blockchain (optional, for testing) – e.g., Anvil or Hardhat Network

🚀 Installation & Setup
1. Clone the repository
bash
git clone https://github.com//RoxyBlockChain/token_launched_pad.git
cd token-launcher-dapp
2. Install dependencies
bash
npm install
# or
yarn install
3. Set up environment variables
Create a .env.local file in the root directory (optional, for custom Uniswap addresses):

env
NEXT_PUBLIC_UNISWAP_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
NEXT_PUBLIC_UNISWAP_FACTORY=0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
NEXT_PUBLIC_WETH=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
These are the mainnet addresses. For testnets, update accordingly.

4. Compile the smart contract (optional)
If you want to modify the token contract, place your Solidity file in contracts/ and compile using Hardhat or Foundry. Then run the extraction script:

bash
npm run extract-contracts
This will generate lib/contracts.json with the latest ABI and bytecode.

5. Run the development server
bash
npm run dev
# or
yarn dev
Open http://localhost:3000 to view the dApp.

⚙️ Configuration
Smart Contract Customization
The default contract is a standard ERC‑20 with optional burn and mint functions. To customize:

Edit contracts/MyToken.sol.

Re‑compile and run npm run extract-contracts.

The dApp will automatically use the updated bytecode.

Uniswap Addresses
Set environment variables to point to different Uniswap contracts (e.g., for Polygon, Arbitrum, or testnets):

env
NEXT_PUBLIC_UNISWAP_ROUTER=0x...
NEXT_PUBLIC_UNISWAP_FACTORY=0x...
NEXT_PUBLIC_WETH=0x...
Network Configuration
The dApp uses window.ethereum to detect the current network. You can add chain‑switching logic by calling switchNetwork(chainId) from lib/ethers.js.

🧭 Usage Guide
Connect Wallet – Click the "Connect MetaMask" button and approve the connection.

Fill Token Parameters – Enter Name, Symbol, Decimals, and Total Supply.

Optional: Advanced Options – Toggle to show:

Mint/Burn – Enable if your contract supports it (customize via the contract).

Distribution – Add one or more wallet addresses and percentages (must sum to 100%).

Liquidity – Enable Uniswap V2 pair creation and provide token % and ETH amount.

Check Gas – The dApp will automatically estimate gas and warn if your balance is insufficient.

Deploy – Click the Deploy Token button. MetaMask will pop up for transaction confirmation.

Monitor Progress – Status updates, transaction hash, and final token address are displayed.

Verify – Use the links to view your token on Etherscan (or your chain’s explorer).

📜 Smart Contract Integration
The dApp uses a pre‑compiled ERC‑20 contract based on OpenZeppelin’s standard with the following constructor:

solidity
constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply,
    address initialOwner
)
All initial supply is minted to initialOwner. If distribution is enabled, tokens are then transferred to the specified addresses.

The Uniswap liquidity step interacts with the Router contract:

Approves the Router to spend tokens.

Calls addLiquidityETH to create the pair and deposit liquidity.

📂 Project Structure
text
token-launcher-dapp/
├── app/
│   ├── page.jsx                 # Main UI component
│   └── layout.jsx               # Root layout with metadata
├── lib/
│   ├── contracts.js             # Exports ABI, bytecode, helpers, Uniswap addresses
│   ├── contracts.json           # Generated ABI & bytecode (do not commit)
│   └── ethers.js                # Provider, signer, balance, gas, network utilities
├── scripts/
│   └── extract-contracts.js     # Script to compile and extract contract data
├── public/                      # Static assets (favicon, images)
├── contracts/                   # Solidity source (optional)
├── .env.local                   # Environment variables
├── next.config.js
├── tailwind.config.js
├── package.json
└── README.md
🧪 Development & Testing
Running Tests with Anvil
Start Anvil:

bash
anvil
Deploy a token and interact with the dApp pointed to http://localhost:8545.

Check Token Details via CLI
Use cast (Foundry) to query the deployed token:

bash
cast call 0x<TOKEN_ADDRESS> "name()" --rpc-url http://localhost:8545
See the inline documentation for more.

Linting & Formatting
bash
npm run lint
npm run format
🌐 Deployment
Deploy to Vercel (Recommended)
bash
npm run build
# Deploy using Vercel CLI or GitHub integration
vercel --prod
Manual Build
bash
npm run build
npm start
Make sure to set environment variables in your hosting platform (Vercel, Netlify, etc.) for Uniswap addresses.

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository.

Create a new branch (feature/amazing-feature).

Commit your changes (git commit -m 'Add some amazing feature').

Push to the branch (git push origin feature/amazing-feature).

Open a Pull Request.

For major changes, please open an issue first to discuss what you would like to change.

📄 License
Distributed under the MIT License. See LICENSE for more information.

📞 Support & Contact
GitHub Issues: https://github.com//RoxyBlockChain/token_launched_pad/issues

Built with ❤️ by the Token Launcher Team
