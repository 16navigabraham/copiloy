'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import {
  connectAndGetSmartAccount,
  disconnect,
} from '@/lib/smartAccount';
import { Card, CardContent } from './ui/card';

const formatAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

interface ConnectSmartAccountProps {
  onConnected: (address: string) => void;
  onDisconnected: () => void;
}

export function ConnectSmartAccount({ onConnected, onDisconnected }: ConnectSmartAccountProps) {
  const [eoa, setEoa] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { eoa } = await connectAndGetSmartAccount();
      setEoa(eoa);
      onConnected(eoa);
    } catch (e: any) {
      console.error('Connection failed:', e);
      setError(e.message || 'Failed to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setEoa(null);
    setError(null);
    onDisconnected();
  }

  if (eoa) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold">Wallet Connected</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Your Address:</span>
              <span className="font-mono">{formatAddress(eoa)}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardContent>
      </Card>
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
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
