'use server';

/**
 * @fileOverview Manages admin login verification.
 * This flow is now deprecated as authentication is handled by Firebase Auth.
 * It is kept for historical reference but is no longer used in the application.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MOCK_ADMINS } from './mock-admins';

const AdminVerificationInputSchema = z.object({
  email: z.string().email().describe("The admin's email."),
  password: z.string().describe("The admin's password."),
});
export type AdminVerificationInput = z.infer<typeof AdminVerificationInputSchema>;

const AdminVerificationOutputSchema = z.object({
  isVerified: z.boolean().describe('Whether the admin credentials are valid.'),
});
export type AdminVerificationOutput = z.infer<
  typeof AdminVerificationOutputSchema
>;

// DEPRECATED: This function is no longer called by the application.
export async function verifyAdmin(
  input: AdminVerificationInput
): Promise<AdminVerificationOutput> {
  return verifyAdminFlow(input);
}

const verifyAdminFlow = ai.defineFlow(
  {
    name: 'verifyAdminFlow',
    inputSchema: AdminVerificationInputSchema,
    outputSchema: AdminVerificationOutputSchema,
  },
  async (input) => {
    const admin = MOCK_ADMINS.find(
      (a) =>
        a.email.toLowerCase() === input.email.toLowerCase() &&
        a.password === input.password
    );

    return {
      isVerified: !!admin,
    };
  }
);
