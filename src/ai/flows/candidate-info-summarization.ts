'use server';
/**
 * @fileOverview AI tool to summarize candidate platforms and provide comparison charts.
 *
 * - summarizeCandidates - A function that takes in candidate information and generates a summary and comparison.
 * - SummarizeCandidatesInput - The input type for the summarizeCandidates function.
 * - SummarizeCandidatesOutput - The return type for the summarizeCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCandidatesInputSchema = z.object({
  candidatesInfo: z.array(
    z.object({
      name: z.string().describe('Name of the candidate'),
      platform: z.string().describe('Platform of the candidate'),
    })
  ).describe('Array of candidate information, including name and platform.'),
});
export type SummarizeCandidatesInput = z.infer<typeof SummarizeCandidatesInputSchema>;

const SummarizeCandidatesOutputSchema = z.object({
  summary: z.string().describe('A summary of all candidates and their platforms.'),
  comparisonChart: z.string().describe('A comparison chart highlighting the key differences between the candidates.'),
});
export type SummarizeCandidatesOutput = z.infer<typeof SummarizeCandidatesOutputSchema>;

export async function summarizeCandidates(input: SummarizeCandidatesInput): Promise<SummarizeCandidatesOutput> {
  return summarizeCandidatesFlow(input);
}

const summarizeCandidatesPrompt = ai.definePrompt({
  name: 'summarizeCandidatesPrompt',
  input: {schema: SummarizeCandidatesInputSchema},
  output: {schema: SummarizeCandidatesOutputSchema},
  prompt: `You are an AI assistant that summarizes candidate platforms and provides comparison charts.

  Summarize the following candidates and their platforms, and create a comparison chart highlighting the key differences between them:

  {{#each candidatesInfo}}
  Candidate Name: {{this.name}}
  Candidate Platform: {{this.platform}}
  {{/each}}

  Ensure that the summary and comparison chart are easy to understand and highlight the most important aspects of each candidate's platform.
  `,
});

const summarizeCandidatesFlow = ai.defineFlow(
  {
    name: 'summarizeCandidatesFlow',
    inputSchema: SummarizeCandidatesInputSchema,
    outputSchema: SummarizeCandidatesOutputSchema,
  },
  async input => {
    const {output} = await summarizeCandidatesPrompt(input);
    return output!;
  }
);
