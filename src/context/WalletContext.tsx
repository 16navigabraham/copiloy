'use client';

import { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (to: string, amount: number) => Promise<boolean>;
}

const initialState: WalletState = {
  isConnected: false,
  address: null,
  balance: 0,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  sendTransaction: async () => false,
};

export const WalletContext = createContext<WalletState>(initialState);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const updateWalletState = useCallback(async (currentProvider?: ethers.BrowserProvider) => {
    const web3Provider = currentProvider || (window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null);
    if (web3Provider) {
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      if (accounts.length > 0) {
        const signer = accounts[0];
        setAddress(signer.address);
        setIsConnected(true);
        const balance = await web3Provider.getBalance(signer.address);
        setBalance(parseFloat(ethers.formatEther(balance)));
      } else {
        setIsConnected(false);
        setAddress(null);
        setBalance(0);
      }
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      updateWalletState();

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          updateWalletState();
        } else {
          disconnectWallet();
        }
      };

      const handleChainChanged = () => {
        updateWalletState();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [updateWalletState]);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send('eth_requestAccounts', []);
        await updateWalletState(web3Provider);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  }, [updateWalletState]);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
    setProvider(null);
    // In a real scenario with WalletConnect or other libraries, you'd call their disconnect methods.
    console.log('Wallet disconnected.');
  }, []);

  const sendTransaction = useCallback(
    async (to: string, amount: number): Promise<boolean> => {
      if (!provider || !address) {
        console.error('Transaction failed: Wallet not connected.');
        return false;
      }
      try {
        const signer = await provider.getSigner();
        const tx = await signer.sendTransaction({
          to: to,
          value: ethers.parseEther(amount.toString()),
        });
        console.log('Transaction sent:', tx.hash);
        await tx.wait();
        console.log('Transaction confirmed!');
        updateWalletState(provider); // Update balance after transaction
        return true;
      } catch (error) {
        console.error('Transaction failed:', error);
        return false;
      }
    },
    [provider, address, updateWalletState]
  );

  const value = {
    isConnected,
    address,
    balance,
    connectWallet,
    disconnectWallet,
    sendTransaction,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
