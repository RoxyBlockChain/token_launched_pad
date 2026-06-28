'use client';

// import { deployToken, tokenABI, UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_V2_FACTORY_ADDRESS, WETH_ADDRESS } from '@/lib/contracts';
import { useState, useEffect, useCallback } from 'react';
import { getAccount, getBalance, getNetwork, isMetaMaskInstalled, formatEther, parseEther, parseUnits, getSigner, estimateGasCost, checkSufficientBalance} from './lib/ethers';
import { deployToken, tokenABI, UNISWAP_V2_ROUTER_ADDRESS, UNISWAP_V2_FACTORY_ADDRESS, WETH_ADDRESS} from './lib/contracts';
import { ethers } from 'ethers';
import { getProvider } from './lib/ethers';

// Minimal ABIs for Uniswap (only the methods we need)
const UNISWAP_ROUTER_ABI = [
  'function addLiquidityETH(address token, uint amountTokenDesired, uint amountTokenMin, uint amountETHMin, address to, uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)',
];
const UNISWAP_FACTORY_ABI = [
  'function createPair(address tokenA, address tokenB) external returns (address pair)',
];
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

export default function TokenLauncher() {
  // ---------- Wallet State ----------
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMetaMask, setIsMetaMask] = useState(false);

  // ---------- Form State ----------
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState('');

  // ---------- Advanced Options ----------
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [enableMintBurn, setEnableMintBurn] = useState(false);
  const [distribution, setDistribution] = useState([{ address: '', percent: '' }]);
  const [enableLiquidity, setEnableLiquidity] = useState(false);
  const [liquidityTokenPercent, setLiquidityTokenPercent] = useState('');
  const [liquidityEthAmount, setLiquidityEthAmount] = useState('');

  // ---------- UI State ----------
  const [isDeploying, setIsDeploying] = useState(false);
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [error, setError] = useState('');
  const [gasWarning, setGasWarning] = useState('');

  // ---------- Check MetaMask ----------
  useEffect(() => {
    setIsMetaMask(isMetaMaskInstalled());
  }, []);

  // ---------- Connect Wallet ----------
  const connectWallet = async () => {
    if (!isMetaMask) {
      alert('Please install MetaMask!');
      return;
    }
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await updateWalletData();
    } catch (err) {
      console.error(err);
      setError('Failed to connect wallet');
    }
  };

  const updateWalletData = useCallback(async () => {
    try {
      const address = await getAccount();
      if (!address) {
        setIsConnected(false);
        return;
      }
      setAccount(address);
      setIsConnected(true);

      const bal = await getBalance(address);
      setBalance(formatEther(bal));

      const network = await getNetwork();
      setChainId(network?.chainId || null);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isMetaMask) {
      updateWalletData();
      // Listen for account/chain changes
      const handleAccountsChanged = () => updateWalletData();
      const handleChainChanged = () => window.location.reload();
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [isMetaMask, updateWalletData]);

  // ---------- Balance / Gas Warning ----------
  useEffect(() => {
    const checkGas = async () => {
      if (!isConnected || !tokenName || !tokenSymbol || !totalSupply) {
        setGasWarning('');
        return;
      }
      try {
        const signer = await getSigner();
        const owner = await signer.getAddress();
        const supply = parseUnits(totalSupply, decimals);
        // Build a dummy deployment transaction for estimation
        const factory = new ethers.ContractFactory(tokenABI, '0x', signer); // dummy bytecode
        const deployTx = factory.getDeployTransaction(
          tokenName,
          tokenSymbol,
          decimals,
          supply,
          owner
        );
        const result = await checkSufficientBalance(deployTx);
        if (!result.sufficient) {
          setGasWarning(
            `⚠️ Insufficient ETH for gas. You have ${result.balance} ETH, need ~${result.needed} ETH.`
          );
        } else {
          setGasWarning('');
        }
      } catch (err) {
        // estimation may fail if params invalid; ignore
        setGasWarning('');
      }
    };
    checkGas();
  }, [isConnected, tokenName, tokenSymbol, decimals, totalSupply]);

  // ---------- Distribution Handlers ----------
  const addDistributionRow = () => {
    setDistribution([...distribution, { address: '', percent: '' }]);
  };
  const removeDistributionRow = (index) => {
    if (distribution.length > 1) {
      const newDist = [...distribution];
      newDist.splice(index, 1);
      setDistribution(newDist);
    }
  };
  const updateDistribution = (index, field, value) => {
    const newDist = [...distribution];
    newDist[index][field] = value;
    setDistribution(newDist);
  };

  // ---------- Deploy ----------
  const handleDeploy = async () => {
    // ---- Validation ----
    if (!isConnected) {
      setError('Please connect your wallet first.');
      return;
    }
    if (!tokenName.trim()) {
      setError('Token Name is required.');
      return;
    }
    if (!tokenSymbol.trim()) {
      setError('Token Symbol is required.');
      return;
    }
    if (!totalSupply || parseFloat(totalSupply) <= 0) {
      setError('Total Supply must be a positive number.');
      return;
    }
    if (decimals < 0 || decimals > 18) {
      setError('Decimals must be between 0 and 18.');
      return;
    }
    // Distribution validation
    if (showAdvanced && distribution.length > 0) {
      let totalPercent = 0;
      for (const row of distribution) {
        if (!row.address || !ethers.isAddress(row.address)) {
          setError('Invalid address in distribution.');
          return;
        }
        const p = parseFloat(row.percent);
        if (isNaN(p) || p < 0) {
          setError('Percentages must be positive numbers.');
          return;
        }
        totalPercent += p;
      }
      if (Math.abs(totalPercent - 100) > 0.01) {
        setError('Distribution percentages must sum to 100%.');
        return;
      }
    }
    // Liquidity validation
    if (showAdvanced && enableLiquidity) {
      const liqPercent = parseFloat(liquidityTokenPercent);
      if (isNaN(liqPercent) || liqPercent <= 0 || liqPercent > 100) {
        setError('Liquidity token percentage must be between 0 and 100.');
        return;
      }
      if (!liquidityEthAmount || parseFloat(liquidityEthAmount) <= 0) {
        setError('Please enter the amount of ETH to pair with.');
        return;
      }
    }

    setError('');
    setIsDeploying(true);
    setStatus('Preparing deployment...');
    setTxHash('');
    setTokenAddress('');

    try {
      const signer = await getSigner();
      const owner = await signer.getAddress();

      // ----- 1. Deploy Token -----
      const supply = parseUnits(totalSupply, decimals);
      setStatus('Deploying token contract...');

      // If we have distribution, we need to use a custom deployment that mints to multiple addresses.
      // For simplicity, we'll deploy normally (mint all to owner) and then transfer.
      // A more advanced version would modify the constructor.
      const { contract, address } = await deployToken(
        signer,
        tokenName,
        tokenSymbol,
        decimals,
        supply,
        owner
      );
      setTokenAddress(address);
      setTxHash(contract.deploymentTransaction()?.hash || '');
      setStatus(`Token deployed at ${address}. Waiting for confirmations...`);

      // ----- 2. Handle Distribution (if enabled) -----
      if (showAdvanced && distribution.length > 0) {
        setStatus('Processing distribution...');
        // We minted everything to owner initially; now transfer to recipients.
        const tokenContract = new ethers.Contract(address, tokenABI, signer);
        // Calculate amounts based on percentages of totalSupply
        for (const row of distribution) {
          const percent = parseFloat(row.percent);
          const amount = (supply * BigInt(Math.floor(percent * 100))) / 10000n; // handle two decimals
          if (amount > 0n) {
            const tx = await tokenContract.transfer(row.address, amount);
            await tx.wait();
          }
        }
        // Optionally, burn remaining if not distributed? We'll assume percentages sum to 100%.
      }

      // ----- 3. Liquidity (if enabled) -----
      if (showAdvanced && enableLiquidity) {
        setStatus('Creating Uniswap pair and adding liquidity...');
        const tokenContract = new ethers.Contract(address, tokenABI, signer);

        // We need the amount of tokens to put into liquidity.
        // We'll take a percentage of the total supply (already minted to owner).
        const liqPercent = parseFloat(liquidityTokenPercent);
        const tokenAmount = (supply * BigInt(Math.floor(liqPercent * 100))) / 10000n;
        const ethAmount = parseEther(liquidityEthAmount);

        // Approve Router to spend tokens
        const router = new ethers.Contract(
          UNISWAP_V2_ROUTER_ADDRESS,
          UNISWAP_ROUTER_ABI,
          signer
        );
        const approveTx = await tokenContract.approve(UNISWAP_V2_ROUTER_ADDRESS, tokenAmount);
        await approveTx.wait();

        // Add liquidity ETH (this also creates pair if not exist)
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 mins
        const txLiquidity = await router.addLiquidityETH(
          address,
          tokenAmount,
          0, // amountTokenMin (0 = no slippage tolerance – dangerous, but for demo)
          0, // amountETHMin
          owner,
          deadline,
          { value: ethAmount }
        );
        await txLiquidity.wait();
        setStatus('Liquidity added successfully!');
      }

      setStatus('✅ Deployment complete!');
    } catch (err) {
      console.error(err);
      setError(`Deployment failed: ${err.message}`);
      setStatus('');
    } finally {
      setIsDeploying(false);
    }
  };

  // ---------- Render ----------
  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto">
      {/* Header with gradient and glow */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">
          🚀 Token Launcher
        </h1>
        <p className="text-gray-300 mt-2 text-sm">Deploy your ERC‑20 token in seconds</p>
      </div>

      {/* Wallet Section – Glass card */}
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="text-white">
          {isConnected ? (
            <>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="font-mono text-sm bg-black/30 px-3 py-1 rounded-full">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-300">
                <span>💰 {balance} ETH</span>
                <span>⚙️ Chain ID: {chainId}</span>
              </div>
            </>
          ) : (
            <p className="text-gray-300">Wallet not connected</p>
          )}
        </div>
        <button
          onClick={connectWallet}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 transform hover:scale-105"
        >
          {isConnected ? '🔄 Change Wallet' : '🔗 Connect MetaMask'}
        </button>
      </div>

      {/* Gas Warning – with icon */}
      {gasWarning && (
        <div className="bg-yellow-400/20 border-l-4 border-yellow-400 backdrop-blur-sm p-4 mb-6 rounded-r-xl text-yellow-200 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <span>{gasWarning}</span>
        </div>
      )}

      {/* Token Parameters – Floating label style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">Token Name *</label>
          <input
            type="text"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            placeholder="e.g. MyToken"
            disabled={isDeploying}
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">Token Symbol *</label>
          <input
            type="text"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            placeholder="e.g. MTK"
            disabled={isDeploying}
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">Decimals</label>
          <input
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(parseInt(e.target.value) || 18)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            min="0"
            max="18"
            disabled={isDeploying}
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1">Total Supply *</label>
          <input
            type="text"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
            placeholder="e.g. 1000000"
            disabled={isDeploying}
          />
        </div>
      </div>

      {/* Advanced Toggle – styled as a pill button */}
      <div className="mb-6 text-center">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-6 py-2 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors"
        >
          {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Options
        </button>
      </div>

      {/* Advanced Options – Glass card with smoother transitions */}
      {showAdvanced && (
        <div className="backdrop-blur-sm bg-black/30 border border-white/10 rounded-2xl p-6 mb-8 space-y-6 transition-all">
          {/* Mint/Burn – Custom toggle switch */}
          <div className="flex items-center gap-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enableMintBurn}
                onChange={(e) => setEnableMintBurn(e.target.checked)}
                disabled={isDeploying}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500"></div>
            </label>
            <span className="text-white">Enable Minting &amp; Burning (Ownable)</span>
          </div>

          {/* Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-white">📤 Distribution (optional)</h3>
            <p className="text-sm text-gray-400 mb-3">Add addresses and percentages of total supply.</p>
            {distribution.map((row, index) => (
              <div key={index} className="flex flex-wrap gap-3 mt-2 items-center">
                <input
                  type="text"
                  placeholder="Address"
                  value={row.address}
                  onChange={(e) => updateDistribution(index, 'address', e.target.value)}
                  className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  disabled={isDeploying}
                />
                <input
                  type="text"
                  placeholder="%"
                  value={row.percent}
                  onChange={(e) => updateDistribution(index, 'percent', e.target.value)}
                  className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  disabled={isDeploying}
                />
                <button
                  type="button"
                  onClick={() => removeDistributionRow(index)}
                  className="text-red-400 hover:text-red-300 transition disabled:opacity-40"
                  disabled={isDeploying || distribution.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDistributionRow}
              className="mt-3 text-sm bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-white transition"
              disabled={isDeploying}
            >
              + Add Address
            </button>
          </div>

          {/* Liquidity */}
          <div>
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enableLiquidity}
                  onChange={(e) => setEnableLiquidity(e.target.checked)}
                  disabled={isDeploying}
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-cyan-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-400 peer-checked:to-blue-500"></div>
              </label>
              <span className="text-white">Create Uniswap V2 Pair &amp; Add Liquidity</span>
            </div>
            {enableLiquidity && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">% of Total Supply</label>
                  <input
                    type="text"
                    value={liquidityTokenPercent}
                    onChange={(e) => setLiquidityTokenPercent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="e.g. 50"
                    disabled={isDeploying}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">ETH amount to pair</label>
                  <input
                    type="text"
                    value={liquidityEthAmount}
                    onChange={(e) => setLiquidityEthAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="e.g. 0.5"
                    disabled={isDeploying}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status & Errors – with icons */}
      {status && (
        <div className="bg-cyan-500/20 backdrop-blur-sm border border-cyan-400/30 p-4 rounded-xl mb-6 text-cyan-200 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <span>{status}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 p-4 rounded-xl mb-6 text-red-200 flex items-center gap-3">
          <span className="text-xl">❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Transaction & Token Address links */}
      {txHash && (
        <div className="mb-4 text-white/80 flex items-center gap-2">
          <span className="text-green-400">✅</span>
          <span>Tx: </span>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </a>
        </div>
      )}
      {tokenAddress && (
        <div className="mb-6 text-white/80 flex items-center gap-2">
          <span>📄</span>
          <span>Token: </span>
          <a
            href={`https://etherscan.io/address/${tokenAddress}`}
            target="_blank"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            {tokenAddress}
          </a>
        </div>
      )}

      {/* Deploy Button – with gradient and pulse animation when deploying */}
      <button
        onClick={handleDeploy}
        disabled={!isConnected || isDeploying || !!gasWarning}
        className={`w-full py-4 rounded-2xl font-bold text-white text-lg shadow-2xl transition-all duration-200 transform ${
          !isConnected || isDeploying || gasWarning
            ? 'bg-gray-600 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 hover:scale-[1.02] shadow-green-500/30'
        } ${isDeploying ? 'animate-pulse' : ''}`}
      >
        {isDeploying ? '⏳ Deploying...' : '🚀 Deploy Token'}
      </button>
    </div>
  </div>
);
}