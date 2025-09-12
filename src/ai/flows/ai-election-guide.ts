'use server';

/**
 * @fileOverview An AI election guide that explains election rules and voting procedures.
 *
 * - electionGuide - A function that explains election rules and voting procedures.
 * - ElectionGuideInput - The input type for the electionGuide function.
 * - ElectionGuideOutput - The return type for the electionGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ElectionGuideInputSchema = z.object({
  query: z.string().describe('The question about election rules or voting procedures.'),
});
export type ElectionGuideInput = z.infer<typeof ElectionGuideInputSchema>;

const ElectionGuideOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about election rules or voting procedures.'),
});
export type ElectionGuideOutput = z.infer<typeof ElectionGuideOutputSchema>;

export async function electionGuide(input: ElectionGuideInput): Promise<ElectionGuideOutput> {
  return electionGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'electionGuidePrompt',
  input: {schema: ElectionGuideInputSchema},
  output: {schema: ElectionGuideOutputSchema},
  prompt: `You are an AI election guide. Your role is to explain election rules and voting procedures to citizens.

  Answer the following question:
  {{query}}`,
});

const electionGuideFlow = ai.defineFlow(
  {
    name: 'electionGuideFlow',
    inputSchema: ElectionGuideInputSchema,
    outputSchema: ElectionGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
