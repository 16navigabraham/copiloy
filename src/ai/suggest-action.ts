'use server';

/**
 * @fileOverview AI Smart Account Action Suggestion Flow.
 *
 * - suggestAction - A function that suggests smart account actions.
 * - SuggestActionInput - The input type for the suggestAction function.
 * - SuggestActionOutput - The return type for the suggestAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionInputSchema = z.object({
  walletData: z.string().describe('JSON string of the wallet data to analyze.'),
});
export type SuggestActionInput = z.infer<
  typeof SuggestActionInputSchema
>;

const SuggestActionOutputSchema = z.object({
  suggestion: z.string().describe('The AI suggested action for the smart account, e.g., \"Send 0.01 testETH to another wallet.\"'),
  reasoning: z.string().describe('The AI reasoning behind the suggested action.'),
});
export type SuggestActionOutput = z.infer<
  typeof SuggestActionOutputSchema
>;

export async function suggestAction(
  input: SuggestActionInput
): Promise<SuggestActionOutput> {
  return suggestActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionPrompt',
  input: {schema: SuggestActionInputSchema},
  output: {schema: SuggestActionOutputSchema},
  prompt: `You are an AI assistant helping users manage their crypto wallets.

  Based on the provided wallet data, suggest an action that the user can take, such as sending testETH to another wallet.
  Also, provide a brief explanation of why you are suggesting this action.

  Wallet Data:
  {{walletData}}

  Output your suggestion and reasoning.
  `,
});

const suggestActionFlow = ai.defineFlow(
  {
    name: 'suggestActionFlow',
    inputSchema: SuggestActionInputSchema,
    outputSchema: SuggestActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
