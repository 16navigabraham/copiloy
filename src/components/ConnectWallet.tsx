'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Loader2, CheckCircle, AlertTriangle, Zap, LogOut } from 'lucide-react';
import {
  connect,
  disconnect,
  getAccounts,
} from '@/lib/smartAccount';

const formatAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

interface ConnectWalletProps {
  onConnected: (address: string) => void;
  onDisconnected: () => void;
}

export function ConnectWallet({ onConnected, onDisconnected }: ConnectWalletProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already connected on component mount
    const accounts = getAccounts();
    if (accounts.length > 0) {
      const firstAccount = accounts[0];
      setAddress(firstAccount);
      onConnected(firstAccount);
    }
  }, [onConnected]);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const accounts = await connect();
      if (accounts && accounts.length > 0) {
        const firstAccount = accounts[0];
        setAddress(firstAccount);
        onConnected(firstAccount);
      } else {
        throw new Error("No accounts found after connection.");
      }
    } catch (e: any) {
      console.error('Connection failed:', e);
      setError(e.message || 'Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setAddress(null);
    onDisconnected();
  }

  if (address) {
    return (
      <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-mono">{formatAddress(address)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            <LogOut className="mr-2 h-4 w-4"/>
            Disconnect
          </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleConnect} disabled={loading} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Zap className="mr-2 h-5 w-5" />
        )}
        Connect Wallet
      </Button>
      {error && (
        <div className="flex items-center gap-2 text-red-500 mt-2">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
