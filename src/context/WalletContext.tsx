'use client';

import { createContext, useState, ReactNode, useCallback } from 'react';

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

  const connectWallet = useCallback(async () => {
    // Mock MetaMask Smart Account connection
    console.log('Connecting to MetaMask Smart Account on Monad...');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
    const mockAddress = '0x1a2B3c4d5E6F7a8B9c0D1e2F3a4B5c6d7E8f9a0B';
    const mockBalance = Math.random() * 10 + 1; // 1-11 MONAD
    setAddress(mockAddress);
    setBalance(mockBalance);
    setIsConnected(true);
    console.log(`Connected with address: ${mockAddress}`);
  }, []);

  const disconnectWallet = useCallback(() => {
    console.log('Disconnecting wallet...');
    setIsConnected(false);
    setAddress(null);
    setBalance(0);
  }, []);

  const sendTransaction = useCallback(
    async (to: string, amount: number): Promise<boolean> => {
      if (!isConnected || !address || balance < amount) {
        console.error('Transaction failed: Not connected, invalid address, or insufficient funds.');
        return false;
      }
      // Mock gasless transaction via Smart Account
      console.log(`Executing gasless transaction: send ${amount} MONAD to ${to}`);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate tx delay
      setBalance((prev) => prev - amount);
      console.log('Transaction successful!');
      return true;
    },
    [isConnected, address, balance]
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
