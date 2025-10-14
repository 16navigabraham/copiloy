'use client';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { MONAD_TESTNET_CONFIG, MONAD_TESTNET_CHAIN_ID } from './constants';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

const monadTestnet = {
  chainId: MONAD_TESTNET_CHAIN_ID,
  name: MONAD_TESTNET_CONFIG.chainName,
  currency: MONAD_TESTNET_CONFIG.nativeCurrency.symbol,
  explorerUrl: MONAD_TESTNET_CONFIG.blockExplorerUrls[0],
  rpcUrl: MONAD_TESTNET_CONFIG.rpcUrls[0],
};

const metadata = {
  name: 'Portfolio Copilot',
  description: 'AI-powered Web3 portfolio analysis on Monad testnet.',
  url: 'https://web3-copilot.web.app',
  icons: ['https://web3-copilot.web.app/icon.png'],
};

export const modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [monadTestnet],
  projectId,
  enableAnalytics: true,
  themeVariables: {
    '--w3m-accent': 'hsl(67 100% 50%)',
    '--w3m-border-radius-master': '0.5rem'
  }
});
