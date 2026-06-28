// lib/ethers.js
import { ethers } from 'ethers';

// ---------- PROVIDER & SIGNER ----------

/**
 * Get the Ethereum provider (BrowserProvider) from window.ethereum.
 * Returns null if MetaMask is not installed.
 */
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

/**
 * Get the signer (the connected user's wallet).
 * Throws if no provider or no accounts are connected.
 */
export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) {
    throw new Error('MetaMask is not installed. Please install it to continue.');
  }
  try {
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    throw new Error('No wallet connected. Please connect your wallet.');
  }
};

/**
 * Get the currently connected account address.
 * Returns null if no account is connected.
 */
export const getAccount = async () => {
  try {
    const signer = await getSigner();
    const address = await signer.getAddress();
    return address;
  } catch {
    return null;
  }
};

/**
 * Get the current network (chainId, name, etc.)
 * Returns null if provider is not available.
 */
export const getNetwork = async () => {
  const provider = getProvider();
  if (!provider) return null;
  try {
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name,
    };
  } catch {
    return null;
  }
};

// ---------- BALANCE & GAS ----------

/**
 * Get the native token balance (ETH, MATIC, etc.) of a given address.
 * If no address is provided, uses the connected account.
 * Returns 0 if error or no address.
 */
export const getBalance = async (address = null) => {
  const provider = getProvider();
  if (!provider) return 0n;

  let targetAddress = address;
  if (!targetAddress) {
    const account = await getAccount();
    if (!account) return 0n;
    targetAddress = account;
  }

  try {
    const balance = await provider.getBalance(targetAddress);
    return balance; // returns BigInt (wei)
  } catch {
    return 0n;
  }
};

/**
 * Get the balance in human‑readable ETH (as a string with decimals).
 */
export const getBalanceInEth = async (address = null) => {
  const balanceWei = await getBalance(address);
  return ethers.formatEther(balanceWei);
};

/**
 * Estimate the gas cost for a transaction (in wei) and return as a formatted string.
 * Useful to show the user an approximate fee before they confirm.
 */
export const estimateGasCost = async (transactionRequest) => {
  const provider = getProvider();
  if (!provider) throw new Error('Provider not available');

  try {
    const feeData = await provider.getFeeData();
    const gasEstimate = await provider.estimateGas(transactionRequest);
    const totalWei = gasEstimate * feeData.gasPrice;
    return {
      wei: totalWei,
      eth: ethers.formatEther(totalWei),
      gasPrice: feeData.gasPrice,
      gasLimit: gasEstimate,
    };
  } catch (error) {
    throw new Error(`Gas estimation failed: ${error.message}`);
  }
};

/**
 * Check if the connected wallet has enough native currency to cover a transaction.
 * Returns { sufficient: boolean, needed: string, balance: string }.
 */
export const checkSufficientBalance = async (transactionRequest) => {
  const account = await getAccount();
  if (!account) throw new Error('No account connected');

  const balanceWei = await getBalance(account);
  const gasCost = await estimateGasCost(transactionRequest);

  const sufficient = balanceWei >= gasCost.wei;
  return {
    sufficient,
    balance: ethers.formatEther(balanceWei),
    needed: gasCost.eth,
  };
};

// ---------- NETWORK UTILITIES ----------

/**
 * Switch the wallet to a specific network (by chainId).
 * If the network is not added to MetaMask, it will prompt to add it.
 */
export const switchNetwork = async (chainId) => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      // You could add a fallback to add the network here,
      // but it's better to let the user add it manually or provide a button.
      throw new Error('Network not added to wallet. Please add it manually.');
    }
    throw switchError;
  }
};

/**
 * Check if the connected network matches a required chainId.
 * Returns true/false.
 */
export const isCorrectNetwork = async (requiredChainId) => {
  const network = await getNetwork();
  if (!network) return false;
  return network.chainId === requiredChainId;
};

// ---------- CONTRACT HELPERS ----------

/**
 * Get a contract instance (read‑only or with signer).
 * If signer is provided, it can write; otherwise, it's read‑only.
 */
export const getContract = (address, abi, signerOrProvider = null) => {
  if (!address || !abi) {
    throw new Error('Contract address and ABI are required');
  }

  let providerOrSigner = signerOrProvider;
  if (!providerOrSigner) {
    const provider = getProvider();
    if (!provider) throw new Error('No provider available');
    providerOrSigner = provider;
  }

  return new ethers.Contract(address, abi, providerOrSigner);
};

/**
 * Get a write‑capable contract instance (with signer).
 * Shortcut for getContract with signer.
 */
export const getWriteContract = async (address, abi) => {
  const signer = await getSigner();
  return getContract(address, abi, signer);
};

// ---------- INSTALLATION CHECK ----------

/**
 * Check if MetaMask (or any EIP‑1193 provider) is installed.
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && !!window.ethereum;
};

// ---------- UTILITY RE‑EXPORTS (for convenience) ----------

/**
 * Re‑export ethers formatting/parsing functions so you don't need to import ethers everywhere.
 * Example: parseUnits, formatUnits, parseEther, formatEther.
 */
export {
  parseUnits,
  formatUnits,
  parseEther,
  formatEther,
  id,
  keccak256,
  solidityPacked,
} from 'ethers';

// Also expose the whole ethers library if needed (optional).
export { ethers };