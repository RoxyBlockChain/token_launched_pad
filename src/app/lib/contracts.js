// lib/contracts.js
import contractData from './contracts.json';
import { ContractFactory } from 'ethers';

// ----- Token Contract Data -----
export const tokenABI = contractData.abi;
export const tokenBytecode = contractData.bytecode;

// ----- Uniswap V2 Addresses (mainnet by default) -----
// You can override these with environment variables for testnets.
export const UNISWAP_V2_ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_UNISWAP_ROUTER ||
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

export const UNISWAP_V2_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_UNISWAP_FACTORY ||
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';

export const WETH_ADDRESS =
  process.env.NEXT_PUBLIC_WETH ||
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

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
 * @param {ethers.Signer} signer - The signer (wallet) to deploy with.
 * @param {string} name - Token name.
 * @param {string} symbol - Token symbol.
 * @param {number} decimals - Decimals (0-18).
 * @param {ethers.BigNumberish} totalSupply - Total supply in wei (already multiplied by decimals).
 * @param {string} owner - The address that will own the contract (and receive initial supply).
 * @returns {Promise<{contract: ethers.Contract, address: string}>}
 */
export async function deployToken(signer, name, symbol, decimals, totalSupply, owner) {
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
  return { contract, address };
}