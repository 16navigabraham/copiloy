'use server';

/**
 * @fileOverview AI Smart Account Action Suggestion Flow.
 *
 * - suggestSmartAccountAction - A function that suggests smart account actions.
 * - SuggestSmartAccountActionInput - The input type for the suggestSmartAccountAction function.
 * - SuggestSmartAccountActionOutput - The return type for the suggestSmartAccountAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSmartAccountActionInputSchema = z.object({
  walletData: z.string().describe('JSON string of the wallet data to analyze.'),
});
export type SuggestSmartAccountActionInput = z.infer<
  typeof SuggestSmartAccountActionInputSchema
>;

const SuggestSmartAccountActionOutputSchema = z.object({
  suggestion: z.string().describe('The AI suggested action for the smart account, e.g., \"Send 0.01 testETH to another wallet.\"'),
  reasoning: z.string().describe('The AI reasoning behind the suggested action.'),
});
export type SuggestSmartAccountActionOutput = z.infer<
  typeof SuggestSmartAccountActionOutputSchema
>;

export async function suggestSmartAccountAction(
  input: SuggestSmartAccountActionInput
): Promise<SuggestSmartAccountActionOutput> {
  return suggestSmartAccountActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSmartAccountActionPrompt',
  input: {schema: SuggestSmartAccountActionInputSchema},
  output: {schema: SuggestSmartAccountActionOutputSchema},
  prompt: `You are an AI assistant helping users manage their smart accounts.

  Based on the provided wallet data, suggest a smart account action that the user can take, such as sending testETH to another wallet.
  Also, provide a brief explanation of why you are suggesting this action.

  Wallet Data:
  {{walletData}}

  Output your suggestion and reasoning.
  `,
});

const suggestSmartAccountActionFlow = ai.defineFlow(
  {
    name: 'suggestSmartAccountActionFlow',
    inputSchema: SuggestSmartAccountActionInputSchema,
    outputSchema: SuggestSmartAccountActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
