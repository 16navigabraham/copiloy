'use client';
import { MetaMaskSDK } from '@metamask/sdk';
import { BrowserProvider } from 'ethers';
import { MONAD_TESTNET_CHAIN_ID } from './constants';

let sdk: MetaMaskSDK | undefined;

const getMetaMaskSDK = () => {
  if (sdk) {
    return sdk;
  }
  sdk = new MetaMaskSDK({
    dappMetadata: {
      name: 'Portfolio Copilot',
      url: window.location.host,
    },
  });
  return sdk;
};

export async function connectAndGetSmartAccount() {
  const sdk = getMetaMaskSDK();
  await sdk.connect();

  const provider = new BrowserProvider(sdk.getProvider()!);

  const signer = await provider.getSigner();

  console.log(
    'Connected to chain',
    MONAD_TESTNET_CHAIN_ID
  );
  
  const eoaAddress = signer.address;

  console.log('EOA address:', eoaAddress);

  return {
    eoa: eoaAddress,
  };
}

export function disconnect() {
    sdk?.terminate();
    sdk = undefined;
}
