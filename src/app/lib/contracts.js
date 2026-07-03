// lib/contracts.js
import contractData from './contracts.json';
import { ContractFactory } from 'ethers';

// ----- Token Contract Data -----
export const tokenABI = contractData.abi;
export const tokenBytecode = contractData.bytecode;

// ----- Chain Configuration -----
// Maps chainId to Uniswap V2 compatible router, factory, native wrapped token, and native symbol.
// Includes top 10 Ethereum L2s + mainnet.
export const CHAIN_CONFIGS = {
  // ========== MAINNETS ==========
  // Ethereum Mainnet
  1: {
    name: 'Ethereum',
    nativeSymbol: 'ETH',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  // BNB Smart Chain
  56: {
    name: 'BNB Chain',
    nativeSymbol: 'BNB',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // PancakeSwap Router v2
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73', // PancakeSwap Factory
    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
  },
  // Arbitrum One
  42161: {
    name: 'Arbitrum',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // SushiSwap V2 Router
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4', // SushiSwap Factory
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  // Optimism
  10: {
    name: 'Optimism',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4200000000000000000000000000000000000006',
  },
  // Polygon (PoS)
  137: {
    name: 'Polygon',
    nativeSymbol: 'MATIC',
    router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap Router
    factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', // QuickSwap Factory
    weth: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
  },
  // Base
  8453: {
    name: 'Base',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4200000000000000000000000000000000000006',
  },
  // zkSync Era
  324: {
    name: 'zkSync Era',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  },
  // Avalanche C-Chain
  43114: {
    name: 'Avalanche',
    nativeSymbol: 'AVAX',
    router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4', // Trader Joe Router
    factory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10', // Trader Joe Factory
    weth: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', // WAVAX
  },
  // Polygon zkEVM
  1101: {
    name: 'Polygon zkEVM',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
  },
  // Linea
  59144: {
    name: 'Linea',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0xe5D7C2a44FfDDF6b295A15c148167daaAf5Cf34f',
  },
  // Scroll
  534352: {
    name: 'Scroll',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x5300000000000000000000000000000000000004',
  },

  // ========== TESTNETS ==========
  // Ethereum Sepolia
  11155111: {
    name: 'Ethereum Sepolia',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506', // SushiSwap (same address)
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // Sepolia WETH
  },
  // BNB Chain Testnet
  97: {
    name: 'BNB Chain Testnet',
    nativeSymbol: 'tBNB',
    router: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3', // PancakeSwap Testnet Router
    factory: '0x6725F303b657a9451d8BA641348b6761A6CC7a17', // PancakeSwap Testnet Factory
    weth: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd', // WBNB on testnet
  },
  // Arbitrum Sepolia
  421614: {
    name: 'Arbitrum Sepolia',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', // Arbitrum Sepolia WETH
  },
  // Optimism Sepolia
  11155420: {
    name: 'Optimism Sepolia',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4200000000000000000000000000000000000006', // same as OP mainnet (check)
  },
  // Polygon Mumbai
  80001: {
    name: 'Polygon Mumbai',
    nativeSymbol: 'MATIC',
    router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff', // QuickSwap Router (same)
    factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', // QuickSwap Factory
    weth: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // Mumbai WMATIC
  },
  // Base Sepolia
  84532: {
    name: 'Base Sepolia',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4200000000000000000000000000000000000006', // same as Base
  },
  // zkSync Era Testnet
  280: {
    name: 'zkSync Era Testnet',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', // same as mainnet (verify)
  },
  // Avalanche Fuji
  43113: {
    name: 'Avalanche Fuji',
    nativeSymbol: 'AVAX',
    router: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4', // Trader Joe Router (same)
    factory: '0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10', // Trader Joe Factory
    weth: '0x1C20E891Bab6b1727d14Da358FAe2984Ed9B59Eb', // Fuji WAVAX
  },
  // Polygon zkEVM Testnet
  1442: {
    name: 'Polygon zkEVM Testnet',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9', // same as mainnet (verify)
  },
  // Linea Goerli (testnet)
  59140: {
    name: 'Linea Goerli',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0xe5D7C2a44FfDDF6b295A15c148167daaAf5Cf34f', // same as Linea mainnet (verify)
  },
  // Scroll Sepolia
  534351: {
    name: 'Scroll Sepolia',
    nativeSymbol: 'ETH',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    weth: '0x5300000000000000000000000000000000000004', // same as Scroll mainnet
  },

  // ========== LOCAL / DEVELOPMENT ==========
  // Anvil (default Hardhat/Foundry local chain)
  31337: {
    name: 'Anvil (Local)',
    nativeSymbol: 'ETH',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // same as mainnet (forked)
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  // You can also add Ganache (1337) if needed
};

// Default to mainnet for environment variable overrides (backward compatibility)
const DEFAULT_CHAIN_ID = 1;

// ----- Helper to get configuration for a given chain -----
export function getChainConfig(chainId) {
  const config = CHAIN_CONFIGS[chainId];
  if (!config) {
    throw new Error(
      `Unsupported chain ID: ${chainId}. Supported chains: ${Object.keys(CHAIN_CONFIGS).join(', ')}`
    );
  }
  return config;
}

// ----- Environment variable overrides (mainnet only) -----
// Allow overriding mainnet addresses via .env
const ENV_OVERRIDES = {
  router: process.env.NEXT_PUBLIC_UNISWAP_ROUTER,
  factory: process.env.NEXT_PUBLIC_UNISWAP_FACTORY,
  weth: process.env.NEXT_PUBLIC_WETH,
};

// Apply overrides to mainnet config if provided
if (ENV_OVERRIDES.router) {
  CHAIN_CONFIGS[1].router = ENV_OVERRIDES.router;
}
if (ENV_OVERRIDES.factory) {
  CHAIN_CONFIGS[1].factory = ENV_OVERRIDES.factory;
}
if (ENV_OVERRIDES.weth) {
  CHAIN_CONFIGS[1].weth = ENV_OVERRIDES.weth;
}

// ----- Convenience exports (using current chain) -----
// These are kept for backward compatibility but now fetch based on chainId parameter.
// You should use the parameterized versions in your app.
export function getUniswapRouter(chainId) {
  return getChainConfig(chainId).router;
}

export function getUniswapFactory(chainId) {
  return getChainConfig(chainId).factory;
}

export function getWethAddress(chainId) {
  return getChainConfig(chainId).weth;
}

// ----- Old constants (deprecated – use functions above) -----
// Kept only for backward compatibility; they now point to mainnet.
export const UNISWAP_V2_ROUTER_ADDRESS = CHAIN_CONFIGS[1].router;
export const UNISWAP_V2_FACTORY_ADDRESS = CHAIN_CONFIGS[1].factory;
export const WETH_ADDRESS = CHAIN_CONFIGS[1].weth;

// ----- Contract Factory Helper -----
export function getTokenFactory(signer) {
  if (!tokenBytecode || tokenBytecode === '0x' || tokenBytecode.length < 10) {
    throw new Error(
      'Token bytecode is missing. Run `npm run extract-contracts` after compiling.'
    );
  }
  if (!tokenABI || tokenABI.length === 0) {
    throw new Error(
      'Token ABI is missing. Run `npm run extract-contracts` after compiling.'
    );
  }
  return new ContractFactory(tokenABI, tokenBytecode, signer);
}

/**
 * Deploy the token with the given constructor arguments.
 * Automatically uses the correct Uniswap addresses for the network where the signer is connected.
 * @param {ethers.Signer} signer - The signer (wallet) to deploy with.
 * @param {string} name - Token name.
 * @param {string} symbol - Token symbol.
 * @param {number} decimals - Decimals (0-18).
 * @param {ethers.BigNumberish} totalSupply - Total supply in wei (already multiplied by decimals).
 * @param {string} owner - The address that will own the contract (and receive initial supply).
 * @param {object} options - Optional parameters.
 * @param {number} options.chainId - If not provided, fetches from signer.
 * @returns {Promise<{contract: ethers.Contract, address: string, config: object}>}
 */
export async function deployToken(signer, name, symbol, decimals, totalSupply, owner, options = {}) {
  const factory = getTokenFactory(signer);
  const contract = await factory.deploy(
    name,
    symbol,
    decimals,
    totalSupply,
    owner
  );
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  // Determine chain ID from signer if not provided
  let chainId = options.chainId;
  if (!chainId) {
    const provider = signer.provider;
    if (!provider) throw new Error('Signer must have a provider to determine chain ID');
    const network = await provider.getNetwork();
    chainId = Number(network.chainId);
  }
  const config = getChainConfig(chainId);

  return { contract, address, config };
}