'use server';

/**
 * @fileOverview A user verification AI agent.
 *
 * - verifyUser - A function that handles the user verification process.
 * - VerifyUserInput - The input type for the verifyUser function.
 * - VerifyUserOutput - The return type for the verifyUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MOCK_USERS } from './mock-users';

const VerifyUserInputSchema = z.object({
  nationalId: z.string().describe("The user's National ID."),
});
export type VerifyUserInput = z.infer<typeof VerifyUserInputSchema>;

const VerifyUserOutputSchema = z.object({
  isRecognized: z.boolean().describe('Whether or not the user is recognized.'),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }).optional(),
});
export type VerifyUserOutput = z.infer<typeof VerifyUserOutputSchema>;

export async function verifyUser(input: VerifyUserInput): Promise<VerifyUserOutput> {
  return verifyUserFlow(input);
}

const verifyUserFlow = ai.defineFlow(
  {
    name: 'verifyUserFlow',
    inputSchema: VerifyUserInputSchema,
    outputSchema: VerifyUserOutputSchema,
  },
  async (input) => {
    const user = MOCK_USERS.find(u => u.nationalId === input.nationalId);

    if (user) {
      return {
        isRecognized: true,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    }

    return {
      isRecognized: false,
    };
  }
);
