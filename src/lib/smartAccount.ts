'use client';
import { MetaMaskSDK } from '@metamask/sdk';
import { BrowserProvider, parseEther } from 'ethers';
import { MONAD_TESTNET_CHAIN_ID } from './constants';

let sdk: MetaMaskSDK | undefined;
let provider: BrowserProvider | undefined;

const getMetaMaskSDK = () => {
  if (sdk) {
    return sdk;
  }
  sdk = new MetaMaskSDK({
    dappMetadata: {
      name: 'Portfolio Copilot',
      url: typeof window !== 'undefined' ? window.location.host : '',
    },
  });
  return sdk;
};

export async function connectAndGetSmartAccount() {
  const sdk = getMetaMaskSDK();
  await sdk.connect();

  provider = new BrowserProvider(sdk.getProvider()!);
  const signer = await provider.getSigner();
  
  const eoaAddress = signer.address;

  console.log('EOA address:', eoaAddress);

  return {
    eoa: eoaAddress,
  };
}

export function disconnect() {
    sdk?.terminate();
    sdk = undefined;
    provider = undefined;
}

export async function sendTransaction(to: string, amount: string): Promise<string | null> {
  if (!provider) {
    console.error("Provider not initialized");
    return null;
  }
  try {
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: parseEther(amount)
    });
    const receipt = await tx.wait();
    return receipt?.hash ?? null;
  } catch (error) {
    console.error("Transaction failed", error);
    return null;
  }
}
