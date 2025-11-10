'use client';

import { wagmiAdapter, projectId, networks } from '@/lib/appkit-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import React, { type ReactNode } from 'react';
import { WagmiProvider, type Config } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

// Set up metadata
const metadata = {
  name: 'Portfolio Copilot',
  description: 'AI-powered Web3 portfolio analysis on Monad testnet.',
  url: 'https://6000-firebase-studio-1759845892750.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

// Create the modal at the module level to ensure web components are registered
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0],
  metadata: metadata,
});

function AppKitProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default AppKitProvider;
