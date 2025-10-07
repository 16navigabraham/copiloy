'use server';

/**
 * @fileOverview AI Smart Account Suggestion Flow.
 *
 * - aiSmartAccountSuggestions - A function that suggests smart account actions.
 * - AiSmartAccountSuggestionsInput - The input type for the aiSmartAccountSuggestions function.
 * - AiSmartAccountSuggestionsOutput - The return type for the aiSmartAccountSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSmartAccountSuggestionsInputSchema = z.object({
  walletData: z.string().describe('JSON string of the wallet data to analyze.'),
});
export type AiSmartAccountSuggestionsInput = z.infer<
  typeof AiSmartAccountSuggestionsInputSchema
>;

const AiSmartAccountSuggestionsOutputSchema = z.object({
  suggestion: z.string().describe('The AI suggested action for the smart account.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested action.'),
});
export type AiSmartAccountSuggestionsOutput = z.infer<
  typeof AiSmartAccountSuggestionsOutputSchema
>;

export async function aiSmartAccountSuggestions(
  input: AiSmartAccountSuggestionsInput
): Promise<AiSmartAccountSuggestionsOutput> {
  return aiSmartAccountSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSmartAccountSuggestionsPrompt',
  input: {schema: AiSmartAccountSuggestionsInputSchema},
  output: {schema: AiSmartAccountSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping users manage their smart accounts.

  Based on the provided wallet data, suggest a smart account action that the user can take.
  Also, provide a brief explanation of why you are suggesting this action.

  Wallet Data:
  {{walletData}}

  Output your suggestion and reasoning in JSON format.
  `,
});

const aiSmartAccountSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiSmartAccountSuggestionsFlow',
    inputSchema: AiSmartAccountSuggestionsInputSchema,
    outputSchema: AiSmartAccountSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
