'use server';

import { getPortfolioSummary, getRecentTransactions } from '@/lib/envio';

const AI_PROMPT_TEMPLATE = `You are an AI wallet copilot. Given this wallet data:
{{WALLET_DATA}}

Summarize the user’s current financial activity in a friendly and insightful tone.
Highlight top 3 tokens, total received, total sent, and any notable changes.
Your response should be concise, informative, and easy to understand.
You can also suggest actions. To suggest sending ETH, include a special block in your response like this:
[ACTION:SEND:{"to":"0x...","amount":"0.01","currency":"MONAD"}]
`;

const AI_RESPONSES = [
  `Based on your recent activity, your portfolio looks healthy! Your top tokens by value are Wrapped MONAD, USDC, and LINK. You've received about $550 in the last month and sent out $120. Keep an eye on your LINK holdings; they've been volatile.`,
  `Here's a quick look at your wallet: You're mostly holding stablecoins, which is a conservative strategy. Your transaction activity is low, with only a few swaps recently. It seems you've interacted with a new DeFi protocol last week. Would you like to explore sending some funds to a new savings contract? I've noticed you have some idle testnet funds. [ACTION:SEND:{"to":"0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B","amount":"0.01","currency":"MONAD"}]`,
  `Your portfolio is doing great! You've had a significant increase in your Wrapped MONAD balance. You seem to be an active trader. The total value has increased by 15% over the last 7 days. Excellent work!`,
];

export async function getAiResponse(
  message: string,
  walletAddress: string
): Promise<string> {
  // 1. Fetch wallet data using Envio mock
  const [summary, transactions] = await Promise.all([
    getPortfolioSummary(walletAddress),
    getRecentTransactions(walletAddress),
  ]);

  const walletData = JSON.stringify({ summary, transactions }, null, 2);

  // 2. Construct the prompt
  const prompt = AI_PROMPT_TEMPLATE.replace('{{WALLET_DATA}}', walletData);

  // In a real app, you would send this prompt to OpenAI API
  console.log('--- AI PROMPT ---');
  console.log(prompt);
  console.log('User message:', message);

  // 3. Simulate AI response
  await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

  // 4. Return a pseudo-random response from the canned list
  const randomIndex = Math.floor(Math.random() * AI_RESPONSES.length);
  return AI_RESPONSES[randomIndex];
}
