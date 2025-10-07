'use server';

/**
 * @fileOverview AI flow for summarizing a user's portfolio, spending habits, and unusual activity.
 *
 * - aiPortfolioSummary - A function that handles the portfolio summary process.
 * - AiPortfolioSummaryInput - The input type for the aiPortfolioSummary function.
 * - AiPortfolioSummaryOutput - The return type for the aiPortfolioSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPortfolioSummaryInputSchema = z.object({
  walletData: z.string().describe('JSON string containing the user\'s wallet data, including token balances, transaction history, and other relevant financial information.'),
});
export type AiPortfolioSummaryInput = z.infer<typeof AiPortfolioSummaryInputSchema>;

const AiPortfolioSummaryOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of the user\'s portfolio, spending habits, and any unusual activity detected.'),
});
export type AiPortfolioSummaryOutput = z.infer<typeof AiPortfolioSummaryOutputSchema>;

export async function aiPortfolioSummary(input: AiPortfolioSummaryInput): Promise<AiPortfolioSummaryOutput> {
  return aiPortfolioSummaryFlow(input);
}

const portfolioSummaryPrompt = ai.definePrompt({
  name: 'portfolioSummaryPrompt',
  input: {schema: AiPortfolioSummaryInputSchema},
  output: {schema: AiPortfolioSummaryOutputSchema},
  prompt: `You are an AI wallet copilot. Given this wallet data:\n{{{walletData}}}\n\nSummarize the user’s current financial activity in a friendly and insightful tone.\nHighlight top 3 tokens, total received, total sent, and any notable changes.`,
});

const aiPortfolioSummaryFlow = ai.defineFlow(
  {
    name: 'aiPortfolioSummaryFlow',
    inputSchema: AiPortfolioSummaryInputSchema,
    outputSchema: AiPortfolioSummaryOutputSchema,
  },
  async input => {
    const {output} = await portfolioSummaryPrompt(input);
    return output!;
  }
);
