import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { defineChain } from 'viem';

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

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId || projectId === 'REPLACE_WITH_YOUR_PROJECT_ID') {
  console.warn(`[AppKit] Project ID is not defined or is a placeholder. Please set NEXT_PUBLIC_PROJECT_ID in your .env file. You can get a project ID from https://dashboard.reown.com`);
}


export const networks = [monad];

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
