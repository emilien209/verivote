'use server';

/**
 * @fileOverview An official verification AI agent.
 *
 * - verifyOfficial - A function that handles the official verification process.
 * - VerifyOfficialInput - The input type for the verifyOfficial function.
 * - VerifyOfficialOutput - The return type for the verifyOfficial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MOCK_OFFICIALS } from './mock-officials';

const VerifyOfficialInputSchema = z.object({
  email: z.string().email().describe("The official's email."),
  password: z.string().describe("The official's password."),
});
export type VerifyOfficialInput = z.infer<typeof VerifyOfficialInputSchema>;

const VerifyOfficialOutputSchema = z.object({
  isAuthenticated: z.boolean().describe('Whether or not the official is authenticated.'),
});
export type VerifyOfficialOutput = z.infer<typeof VerifyOfficialOutputSchema>;

export async function verifyOfficial(input: VerifyOfficialInput): Promise<VerifyOfficialOutput> {
  return verifyOfficialFlow(input);
}

const verifyOfficialFlow = ai.defineFlow(
  {
    name: 'verifyOfficialFlow',
    inputSchema: VerifyOfficialInputSchema,
    outputSchema: VerifyOfficialOutputSchema,
  },
  async (input) => {
    const official = MOCK_OFFICIALS.find(o => o.email === input.email && o.password === input.password);

    if (official) {
      return {
        isAuthenticated: true,
      };
    }

    return {
      isAuthenticated: false,
    };
  }
);
