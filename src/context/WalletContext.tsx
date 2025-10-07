
'use client';

import { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { MONAD_TESTNET_CONFIG, MONAD_TESTNET_CHAIN_ID } from '@/lib/constants';

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

  const switchToMonadNetwork = async (eth: any): Promise<boolean> => {
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) { // Chain not added
        try {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [MONAD_TESTNET_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Monad testnet:', addError);
          alert('Failed to add the Monad testnet. Please add it manually.');
          return false;
        }
      } else if (switchError.code === 4001) {
        console.log('User rejected the network switch request.');
        alert('Please approve the request to switch to the Monad testnet.');
        return false;
      } else {
        console.error('Failed to switch to Monad testnet:', switchError);
        alert('Failed to switch to the Monad testnet. Please switch manually in your wallet.');
        return false;
      }
    }
  };

  const updateWalletState = useCallback(async (currentProvider?: ethers.BrowserProvider) => {
    const web3Provider = currentProvider || (window.ethereum ? new ethers.BrowserProvider(window.ethereum, 'any') : null);
    if (!web3Provider) {
      disconnectWallet();
      return;
    }
    
    setProvider(web3Provider);
    const network = await web3Provider.getNetwork();
    
    if (Number(network.chainId) !== MONAD_TESTNET_CHAIN_ID) {
        disconnectWallet();
        return;
    }

    const accounts = await web3Provider.listAccounts();
    if (accounts.length > 0) {
      const signer = accounts[0];
      setAddress(signer.address);
      setIsConnected(true);
      const balance = await web3Provider.getBalance(signer.address);
      setBalance(parseFloat(ethers.formatEther(balance)));
    } else {
      disconnectWallet();
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const switched = await switchToMonadNetwork(window.ethereum);
        if (!switched) return;
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            await updateWalletState(web3Provider);
        } else {
            disconnectWallet();
        }

      } catch (error: any) {
        if (error.code === 4001) { // User rejected the connection request
          console.log('User rejected the connection request.');
          alert('Please approve the connection request to continue.');
        } else {
          console.error('Failed to connect wallet:', error);
          alert('Failed to connect wallet. Please make sure MetaMask is unlocked.');
        }
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
  }, []);
  
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        updateWalletState();
      }
    };

    const handleChainChanged = () => {
      updateWalletState();
    };

    // Initial check
    updateWalletState();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [updateWalletState, disconnectWallet]);

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
