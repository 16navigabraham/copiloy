'use client';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { BrowserProvider, parseEther } from 'ethers';

let sdk: MetaMaskSDK | undefined;
let provider: SDKProvider | undefined;

const getMetaMaskSDK = () => {
  if (sdk) {
    return sdk;
  }
  sdk = new MetaMaskSDK({
    dappMetadata: {
      name: 'Portfolio Copilot',
      url: typeof window !== 'undefined' ? window.location.href : '',
    },
    useDeeplink: false,
    checkInstallationImmediately: false,
    modals: {
        install: ({ link }) => {
          // You can handle the installation flow here.
          // For example, open the link in a new tab.
          window.open(link, '_blank');
          return document.createElement('div'); // Return a dummy element
        },
    },
  });
  return sdk;
};

export const connect = async () => {
    const sdk = getMetaMaskSDK();
    try {
        await sdk.connect();
        provider = sdk.getProvider();
        if(!provider) {
            throw new Error('Failed to get provider from MetaMask SDK.');
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts', params: [] }) as string[];
        return accounts;
    } catch(err) {
        console.warn('Failed to connect to MetaMask:', err);
        throw new Error("Connection to MetaMask failed. Please try again.");
    }
}

export const getAccounts = () => {
    return sdk?.getAccounts() || [];
}

export const disconnect = () => {
    sdk?.terminate();
    sdk = undefined;
    provider = undefined;
}

export async function sendTransaction(to: string, amount: string): Promise<string | null> {
  if (!provider) {
    console.error("Provider not initialized. Please connect your wallet first.");
    throw new Error("Provider not initialized. Please connect your wallet first.");
  }
  try {
    const ethersProvider = new BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    
    const tx = await signer.sendTransaction({
      to,
      value: parseEther(amount)
    });
    console.log('Transaction sent:', tx);
    const receipt = await tx.wait();
    console.log('Transaction receipt:', receipt);
    return receipt?.hash ?? null;
  } catch (error) {
    console.error("Transaction failed", error);
    return null;
  }
}
