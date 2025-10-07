export interface PortfolioSummary {
  totalValue: number;
  ethBalance: number;
  tokenCount: number;
  txnCount: number;
  gasSpent: number;
}

export interface Transaction {
  hash: string;
  type: 'send' | 'receive' | 'swap';
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: string;
}

export interface SendAction {
  type: 'SEND';
  to: string;
  amount: string;
  currency: 'MONAD' | 'ETH';
}
