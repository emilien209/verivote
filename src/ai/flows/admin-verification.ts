'use server';

/**
 * @fileOverview An admin verification AI agent.
 *
 * - verifyAdmin - A function that handles the admin verification process.
 * - VerifyAdminInput - The input type for the verifyAdmin function.
 * - VerifyAdminOutput - The return type for the verifyAdmin function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MOCK_ADMINS } from './mock-admins';

const VerifyAdminInputSchema = z.object({
  email: z.string().email().describe("The admin's email."),
  password: z.string().describe("The admin's password."),
});
export type VerifyAdminInput = z.infer<typeof VerifyAdminInputSchema>;

const VerifyAdminOutputSchema = z.object({
  isAuthenticated: z.boolean().describe('Whether or not the admin is authenticated.'),
});
export type VerifyAdminOutput = z.infer<typeof VerifyAdminOutputSchema>;

export async function verifyAdmin(input: VerifyAdminInput): Promise<VerifyAdminOutput> {
  return verifyAdminFlow(input);
}

const verifyAdminFlow = ai.defineFlow(
  {
    name: 'verifyAdminFlow',
    inputSchema: VerifyAdminInputSchema,
    outputSchema: VerifyAdminOutputSchema,
  },
  async (input) => {
    const admin = MOCK_ADMINS.find(a => a.email === input.email && a.password === input.password);

    if (admin) {
      return {
        isAuthenticated: true,
      };
    }

    return {
      isAuthenticated: false,
    };
  }
);
