'use server';

/**
 * @fileOverview AI flow for summarizing a user's portfolio, spending habits, and unusual activity.
 *
 * - summarizePortfolio - A function that handles the portfolio summary process.
 * - SummarizePortfolioInput - The input type for the summarizePortfolio function.
 * - SummarizePortfolioOutput - The return type for the summarizePortfolio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePortfolioInputSchema = z.object({
  walletData: z.string().describe('JSON string containing the user\'s wallet data, including token balances, transaction history, and other relevant financial information.'),
});
export type SummarizePortfolioInput = z.infer<typeof SummarizePortfolioInputSchema>;

const SummarizePortfolioOutputSchema = z.object({
  summary: z.string().describe('A natural language summary of the user\'s portfolio, spending habits, and any unusual activity detected.'),
});
export type SummarizePortfolioOutput = z.infer<typeof SummarizePortfolioOutputSchema>;

export async function summarizePortfolio(input: SummarizePortfolioInput): Promise<SummarizePortfolioOutput> {
  return summarizePortfolioFlow(input);
}

const portfolioSummaryPrompt = ai.definePrompt({
  name: 'portfolioSummaryPrompt',
  input: {schema: SummarizePortfolioInputSchema},
  output: {schema: SummarizePortfolioOutputSchema},
  prompt: `You are an AI crypto analyst. Given this wallet data:\n{{{walletData}}}\n\nSummarize the user’s current financial activity in a friendly and insightful tone.\nHighlight top 3 tokens, total received, total sent, and any notable changes. Also highlight any unusual activity.`,
});

const summarizePortfolioFlow = ai.defineFlow(
  {
    name: 'summarizePortfolioFlow',
    inputSchema: SummarizePortfolioInputSchema,
    outputSchema: SummarizePortfolioOutputSchema,
  },
  async input => {
    const {output} = await portfolioSummaryPrompt(input);
    return output!;
  }
);
