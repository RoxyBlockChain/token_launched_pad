🚀 Token Launcher DApp
https://img.shields.io/badge/License-MIT-yellow.svg
https://img.shields.io/badge/Next.js-14-black
https://img.shields.io/badge/ethers.js-v6-blue
https://img.shields.io/badge/Tailwind-3-38B2AC

Deploy your own ERC‑20 token on 25+ blockchain networks in seconds – no Solidity knowledge required.

A modern, feature-rich decentralized application (dApp) built with Next.js and ethers.js that allows anyone to deploy an ERC‑20 token on any Ethereum-compatible blockchain with just a few clicks. Supports 11 Mainnets, 13 Testnets, and Local Anvil for development – all with automatic DEX integration and advanced tokenomics.

📋 Table of Contents
🌟 Overview

✨ Features

🛠️ Tech Stack

🌐 Supported Chains

📦 Prerequisites

🚀 Installation & Setup

⚙️ Configuration

🧭 Usage Guide

📜 Smart Contract Integration

📂 Project Structure

🧪 Development & Testing

🌐 Deployment

🤝 Contributing

📄 License

📞 Support & Contact

🌟 Overview
The Token Launcher DApp abstracts away the complexity of deploying an ERC‑20 token. You provide just 4 parameters (Name, Symbol, Decimals, Total Supply) – the dApp handles the rest:

✅ Deploys the smart contract via MetaMask

✅ Optionally distributes tokens to multiple wallets

✅ Optionally creates a Uniswap V2 pair and adds liquidity

✅ Works on any EVM-compatible chain – mainnet, testnet, or local

Designed with security and user experience in mind, the dApp automatically detects your connected wallet's network, uses the correct DEX router (Uniswap, SushiSwap, PancakeSwap, QuickSwap, Trader Joe), estimates gas costs, and provides real‑time feedback.

✨ Features
🎯 Core Token Deployment
Parameter Input – Token Name, Symbol, Decimals, Total Supply.

Gas Estimation – Automatic check of native currency balance (ETH, BNB, MATIC, AVAX) with warnings.

Real‑time Status – Deployment progress, transaction hash, token address with explorer links.

Multi‑Chain Support – 11 mainnets, 13 testnets, and local Anvil – just connect your wallet.

⚡ Advanced Tokenomics
Mint & Burn – Toggle to include ERC20Burnable and Ownable mint functions (contract customization).

Multi‑Wallet Distribution – Add multiple addresses with percentage allocations (must sum to 100%).

One‑Click Liquidity – Automatically create a Uniswap V2 pair (or fork) and add liquidity in one flow.

🔗 Wallet & Connectivity
MetaMask Integration – Seamless connection using ethers.js and @metamask/detect-provider.

Network Display – Shows connected address, balance, chain ID, and native currency symbol.

Auto‑refresh – Listens to account/network changes and reloads data.

🎨 User Experience
Glass‑morphism UI – Gradient backgrounds, custom toggle switches, animated buttons.

Fully Responsive – Works on desktop, tablet, and mobile.

Clear Error Handling – Friendly messages for invalid inputs, insufficient funds, or transaction failures.

🛠️ Tech Stack
## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Blockchain Interaction** | ethers.js v6 |
| **Wallet Provider** | MetaMask (EIP‑1193) |
| **Styling** | Tailwind CSS |
| **Smart Contracts** | OpenZeppelin ERC‑20 (compiled with Hardhat/Foundry) |
| **Development** | Node.js, npm |
| **Testing** | Anvil (Foundry) / Hardhat Network |

🌐 Supported Chains
The dApp auto‑detects your wallet's network and uses the correct DEX router. No manual configuration required.

🟢 Mainnets (11)
## 🌐 Supported Mainnets

| Chain | Native Symbol | DEX Router |
|-------|---------------|------------|
| **Ethereum** | ETH | Uniswap V2 |
| **BNB Chain** | BNB | PancakeSwap V2 |
| **Arbitrum One** | ETH | SushiSwap |
| **Optimism** | ETH | SushiSwap |
| **Polygon PoS** | MATIC | QuickSwap |
| **Base** | ETH | SushiSwap |
| **zkSync Era** | ETH | SushiSwap |
| **Avalanche C-Chain** | AVAX | Trader Joe |
| **Polygon zkEVM** | ETH | SushiSwap |
| **Linea** | ETH | SushiSwap |
| **Scroll** | ETH | SushiSwap |

🧪 Testnets (13)
## 🧪 Supported Testnets

| Chain | Native Symbol | DEX Router |
|-------|---------------|------------|
| **Ethereum Sepolia** | ETH | SushiSwap |
| **BNB Chain Testnet** | tBNB | PancakeSwap |
| **Arbitrum Sepolia** | ETH | SushiSwap |
| **Optimism Sepolia** | ETH | SushiSwap |
| **Polygon Mumbai** | MATIC | QuickSwap |
| **Base Sepolia** | ETH | SushiSwap |
| **zkSync Era Testnet** | ETH | SushiSwap |
| **Avalanche Fuji** | AVAX | Trader Joe |
| **Polygon zkEVM Testnet** | ETH | SushiSwap |
| **Linea Goerli** | ETH | SushiSwap |
| **Scroll Sepolia** | ETH | SushiSwap |
💻 Local Development
| Chain | Native Symbol | DEX Router |
|-------|---------------|------------|
| Anvil | (Hardhat/Foundry)	| ETH	Uniswap V2 (fork)
New chain? You can easily add more by extending CHAIN_CONFIGS in lib/contracts.js.

📦 Prerequisites
Before you begin, ensure you have installed:

Node.js (v18 or higher)

npm or yarn

MetaMask browser extension

A local blockchain (optional) – e.g., Anvil or Hardhat Network

🚀 Installation & Setup
1. Clone the repository
```bash
git clone https://github.com/RoxyBlockChain/token_launched_pad.git
cd token-launcher-dapp
```
2. Install dependencies
```bash
npm install
# or
yarn install
```
3. Set up environment variables (optional)
Create a .env.local file in the root directory to override mainnet addresses:

env
NEXT_PUBLIC_UNISWAP_ROUTER=0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
NEXT_PUBLIC_UNISWAP_FACTORY=0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f
NEXT_PUBLIC_WETH=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
These are mainnet addresses. For testnets, the dApp uses built‑in configs – you don't need to change them.

4. Compile the smart contract (optional)
If you want to modify the token contract, place your Solidity file in contracts/ and compile using Hardhat or Foundry. Then run:

bash
npm run extract-contracts
This generates lib/contracts.json with the latest ABI and bytecode.

5. Run the development server
```bash
npm run dev
# or
yarn dev
```
Open http://localhost:3000 to view the dApp.

⚙️ Configuration
🔧 Smart Contract Customization
The default contract is a standard ERC‑20 with optional burn and mint functions. To customize:

Edit contracts/MyToken.sol.

Re‑compile and run npm run extract-contracts.

The dApp will automatically use the updated bytecode.

🌐 Adding New Chains
To support a new EVM chain, add an entry to CHAIN_CONFIGS in lib/contracts.js with the required fields:

name, nativeSymbol, router, factory, weth.

🧭 Network Switching
The dApp uses window.ethereum to detect the current network. You can add chain‑switching logic by calling switchNetwork(chainId) from lib/ethers.js.

🧭 Usage Guide
Connect Wallet – Click "Connect MetaMask" and approve the connection.

Fill Token Parameters – Enter Name, Symbol, Decimals, and Total Supply.

Optional: Advanced Options – Toggle to show:

Mint/Burn – Enable if your contract supports it.

Distribution – Add addresses and percentages (must sum to 100%).

Liquidity – Enable Uniswap V2 pair creation; provide token % and native currency amount.

Check Gas – The dApp will automatically estimate gas and warn if your balance is insufficient.

Deploy – Click Deploy Token. MetaMask will pop up for transaction confirmation.

Monitor Progress – Status updates, transaction hash, and final token address are displayed.

Verify – Use the links to view your token on the chain’s explorer.

📜 Smart Contract Integration
The dApp uses a pre‑compiled ERC‑20 contract based on OpenZeppelin’s standard with this constructor:

```solidity
constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply,
    address initialOwner
)
```

All initial supply is minted to initialOwner.

If distribution is enabled, tokens are transferred to the specified addresses.

The liquidity step interacts with the Router contract:

Approves the Router to spend tokens.
Calls addLiquidityETH (or the chain's native wrapper) to create the pair and deposit liquidity.
📂 Project Structure
```text
token-launcher-dapp/
├── app/
│   ├── page.jsx                 # Main UI component
│   └── layout.jsx               # Root layout with metadata
├── lib/
│   ├── contracts.js             # Exports ABI, bytecode, helpers, CHAIN_CONFIGS
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
```
🧪 Development & Testing
Running Tests with Anvil
Start Anvil:

```bash
anvil
```
Deploy a token and interact with the dApp pointed to http://localhost:8545.

Check Token Details via CLI
Use cast (Foundry) to query the deployed token:

```bash
cast call 0x<TOKEN_ADDRESS> "name()" --rpc-url http://localhost:8545
```
See Foundry book for more.

Linting & Formatting
```bash
npm run lint
npm run format
```
🌐 Deployment
Deploy to Vercel (Recommended)
```bash
npm run build
```
# Deploy using Vercel CLI or GitHub integration
vercel --prod
Manual Build
```bash
npm run build
npm start
```
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
GitHub Issues: https://github.com/RoxyBlockChain/token_launched_pad/issues

Built with ❤️ by the Token Launcher Team