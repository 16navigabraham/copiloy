'use client';
import { MetaMaskSDK, SDKProvider } from '@metamask/sdk';
import { BrowserProvider, parseEther } from 'ethers';
// import { Implementation, toMetaMaskSmartAccount } from "@metamask/delegation-toolkit";
// import { createPublicClient, createWalletClient, custom, http } from 'viem';
// import { monad } from 'viem/chains';

let sdk: MetaMaskSDK | undefined;
let provider: SDKProvider | undefined;
let smartAccount: any | undefined;

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
    smartAccount = undefined;
}

// export const createSmartAccount = async () => {
//   if (!provider) {
//     throw new Error("Provider not initialized. Please connect your wallet first.");
//   }
  
//   const publicClient = createPublicClient({ 
//     chain: monad, 
//     transport: http() 
//   });
  
//   const walletClient = createWalletClient({
//     chain: monad,
//     transport: custom(provider)
//   });

//   const [owner] = await walletClient.getAddresses();

//   const sa = await toMetaMaskSmartAccount({
//     client: publicClient,
//     implementation: Implementation.Hybrid,
//     deployParams: [owner, [], [], []],
//     deploySalt: "0x",
//     signer: { walletClient },
//   });

//   smartAccount = sa;
//   return sa;
// }


// export async function sendTransaction(to: string, amount: string): Promise<string | null> {
//   if (!smartAccount) {
//     console.error("Smart Account not initialized. Please create it first.");
//     throw new Error("Smart Account not initialized. Please create it first.");
//   }
//   try {
//     const { hash } = await smartAccount.sendTransaction({
//       to: to as `0x${string}`,
//       value: parseEther(amount),
//     });
//     console.log('Transaction sent:', hash);
    
//     const publicClient = createPublicClient({ 
//       chain: monad, 
//       transport: http() 
//     });
    
//     const receipt = await publicClient.waitForTransactionReceipt({ hash });
//     console.log('Transaction receipt:', receipt);
//     return receipt?.transactionHash ?? null;

//   } catch (error) {
//     console.error("Transaction failed", error);
//     return null;
//   }
// }

export async function sendTransaction(to: string, amount: string): Promise<string | null> {
    if (!provider) {
        throw new Error("Provider not initialized. Please connect your wallet first.");
    }
    const ethersProvider = new BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();
    try {
        const tx = await signer.sendTransaction({
            to,
            value: parseEther(amount),
        });
        const receipt = await tx.wait();
        return receipt?.hash ?? null;
    } catch(e) {
        console.error("Transaction failed", e);
        return null;
    }
}
