'use server';

/**
 * @fileOverview FAQ Chatbot AI agent.
 *
 * - faqChatbot - A function that answers common questions about registration, deadlines, and results.
 * - FAQChatbotInput - The input type for the faqChatbot function.
 * - FAQChatbotOutput - The return type for the faqChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQChatbotInputSchema = z.object({
  question: z.string().describe('The question from the user about the election.'),
});
export type FAQChatbotInput = z.infer<typeof FAQChatbotInputSchema>;

const FAQChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type FAQChatbotOutput = z.infer<typeof FAQChatbotOutputSchema>;

export async function faqChatbot(input: FAQChatbotInput): Promise<FAQChatbotOutput> {
  return faqChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqChatbotPrompt',
  input: {schema: FAQChatbotInputSchema},
  output: {schema: FAQChatbotOutputSchema},
  prompt: `You are an AI-powered FAQ chatbot for the VeriVote platform, which provides information and answers questions related to elections.
  Your goal is to provide clear, concise, and helpful answers to user questions about registration, deadlines, results, and the election process in general.
  Be polite and professional in your responses.

  Question: {{{question}}}`,
});

const faqChatbotFlow = ai.defineFlow(
  {
    name: 'faqChatbotFlow',
    inputSchema: FAQChatbotInputSchema,
    outputSchema: FAQChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
