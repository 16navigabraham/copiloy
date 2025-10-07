import type { PortfolioSummary, Transaction } from './types';

// This file mocks fetching data from an Envio indexer.
// In a real app, you would use a GraphQL client to query your Envio endpoint.

// Mock function to get portfolio summary
export async function getPortfolioSummary(address: string): Promise<PortfolioSummary> {
  console.log(`Fetching portfolio summary for ${address} from Envio...`);
  // In a real app, replace this with a call to your indexer.
  // Returning zeroed-out data for production build without a real indexer.
  return {
    totalValue: 0,
    ethBalance: 0,
    tokenCount: 0,
    txnCount: 0,
    gasSpent: 0,
  };
}

// Mock function to get recent transactions
export async function getRecentTransactions(address: string): Promise<Transaction[]> {
  console.log(`Fetching recent transactions for ${address} from Envio...`);
  // In a real app, replace this with a call to your indexer.
  // Returning empty array for production build without a real indexer.
  return [];
}
