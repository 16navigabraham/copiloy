'use client';
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';

const queryClient = new QueryClient();

export const monad = defineChain({
  id: 80084,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MONAD',
    symbol: 'MONAD',
  },
  rpcUrls: {
    default: { http: ['https://devnet.monad.xyz/'] },
  },
  blockExplorers: {
    default: { name: 'MonadScan', url: 'https://explorer.devnet.monad.xyz' },
  },
});


const config = getDefaultConfig({
  appName: 'Portfolio Copilot',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [monad],
  ssr: true, 
});

export const RainbowKitAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
