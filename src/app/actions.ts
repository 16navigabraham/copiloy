'use server';

import { getPortfolioSummary, getRecentTransactions } from '@/lib/envio';
import { summarizePortfolio } from '@/ai/summarize-portfolio';
import { suggestSmartAccountAction } from '@/ai/suggest-smart-account-action';
import { SendAction } from '@/lib/types';

const ACTION_SUGGESTION_PROMPT = `Based on the user's request and wallet data, suggest a relevant action.
User request: "{{USER_MESSAGE}}"
Wallet data: {{WALLET_DATA}}
`;

export async function getAiResponse(
  message: string,
  walletAddress: string
): Promise<{ content: string; action?: SendAction }> {
  const [summary, transactions] = await Promise.all([
    getPortfolioSummary(walletAddress),
    getRecentTransactions(walletAddress),
  ]);

  const walletData = JSON.stringify({ summary, transactions }, null, 2);

  // Decide whether to summarize or suggest an action
  if (message.toLowerCase().includes('send') || message.toLowerCase().includes('action')) {
    const suggestionResult = await suggestSmartAccountAction({ walletData });
    const action: SendAction = {
      type: 'SEND',
      // This is a sample action, in a real scenario you might parse this from the suggestion
      to: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', 
      amount: '0.01',
      currency: 'MONAD'
    };
    return {
      content: `${suggestionResult.suggestion} ${suggestionResult.reasoning}`,
      action: action
    };
  } else {
    const summaryResult = await summarizePortfolio({ walletData });
    return { content: summaryResult.summary };
  }
}
