import type { PortfolioSummary, Transaction } from './types';

// This file mocks fetching data from an Envio indexer.
// In a real app, you would use a GraphQL client to query your Envio endpoint.

const mockTokens = ['MONAD', 'WETH', 'USDC', 'LINK', 'UNI'];

// Mock function to get portfolio summary
export async function getPortfolioSummary(address: string): Promise<PortfolioSummary> {
  console.log(`Fetching portfolio summary for ${address} from Envio...`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  return {
    totalValue: Math.random() * 10000 + 500,
    ethBalance: Math.random() * 10 + 1,
    tokenCount: 5,
    txnCount: Math.floor(Math.random() * 50) + 10,
    gasSpent: Math.random() * 25,
  };
}

// Mock function to get recent transactions
export async function getRecentTransactions(address: string): Promise<Transaction[]> {
  console.log(`Fetching recent transactions for ${address} from Envio...`);
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  return Array.from({ length: 5 }, (_, i) => {
    const type = Math.random() > 0.5 ? 'send' : 'receive';
    const otherAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    return {
      hash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      type,
      from: type === 'send' ? address : otherAddress,
      to: type === 'send' ? otherAddress : address,
      amount: Math.random() * (type === 'send' ? 1 : 5),
      token: mockTokens[Math.floor(Math.random() * mockTokens.length)],
      timestamp: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(), // one transaction per day
    };
  });
}
