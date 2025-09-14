'use server';

/**
 * @fileOverview A user verification AI agent that checks against a mock NIDA database.
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
  firstName: z.string().optional().describe("The user's first name."),
  lastName: z.string().optional().describe("The user's last name."),
});
export type VerifyUserInput = z.infer<typeof VerifyUserInputSchema>;

const VerifyUserOutputSchema = z.object({
  isRecognized: z.boolean().describe('Whether or not the user is recognized in the NIDA database.'),
  isNameMatch: z.boolean().describe('Whether the provided name matches the record for the National ID.'),
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

    if (!user) {
      return {
        isRecognized: false,
        isNameMatch: false,
      };
    }
    
    // If names are not provided, we can't check for a match, but the user is recognized.
    if (!input.firstName || !input.lastName) {
        return {
            isRecognized: true,
            isNameMatch: false, // Cannot confirm name match
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
            }
        }
    }


    const nameMatches = user.firstName.toLowerCase() === input.firstName.toLowerCase() && user.lastName.toLowerCase() === input.lastName.toLowerCase();

    if (nameMatches) {
        return {
            isRecognized: true,
            isNameMatch: true,
            user: {
            firstName: user.firstName,
            lastName: user.lastName,
            },
        };
    }

    return {
        isRecognized: true,
        isNameMatch: false,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
        }
    };
  }
);
