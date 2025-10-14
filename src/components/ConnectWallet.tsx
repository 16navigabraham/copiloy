'use client';

import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Button } from './ui/button';
import { Zap, LogOut, CheckCircle } from 'lucide-react';

const formatAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};


export function ConnectWallet() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();

  if (isConnected && address) {
    return (
       <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-mono" title={address}>{formatAddress(address)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => open()}>
            <LogOut className="mr-2 h-4 w-4"/>
            Disconnect
          </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => open()} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg">
      <Zap className="mr-2 h-5 w-5" />
      Connect Wallet
    </Button>
  );
}
