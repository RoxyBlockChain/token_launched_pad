// components/ConnectWallet.jsx
import { useState, useEffect } from 'react';
import { getAccount, getBalanceInEth, getNetwork, isMetaMaskInstalled } from '@/lib/ethers';

export default function ConnectWallet() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('');

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // Request accounts (pops up MetaMask)
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const address = await getAccount();
      const bal = await getBalanceInEth();
      const net = await getNetwork();

      setAccount(address);
      setBalance(bal);
      setNetwork(net ? `${net.name} (${net.chainId})` : 'Unknown');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Auto‑connect on page load if already connected
    const checkConnection = async () => {
      const address = await getAccount();
      if (address) {
        const bal = await getBalanceInEth();
        const net = await getNetwork();
        setAccount(address);
        setBalance(bal);
        setNetwork(net ? `${net.name} (${net.chainId})` : 'Unknown');
      }
    };
    checkConnection();

    // Listen for account/network changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => checkConnection());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkConnection);
      }
    };
  }, []);

  return (
    <div>
      {account ? (
        <div>
          <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <p>Balance: {balance} ETH</p>
          <p>Network: {network}</p>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect MetaMask</button>
      )}
    </div>
  );
}