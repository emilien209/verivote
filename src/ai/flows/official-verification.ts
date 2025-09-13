'use server';

/**
 * @fileOverview Manages and verifies election officials.
 *
 * - verifyOfficial: Authenticates an official's credentials.
 * - getOfficials: Returns a list of all officials.
 * - addOfficial: Adds a new official.
 * - removeOfficial: Removes an official.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MOCK_OFFICIALS, type MockOfficial } from './mock-officials';

// --- Verification Flow ---

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


// --- Management Functions ---

export async function getOfficials(): Promise<Omit<MockOfficial, 'password'>[]> {
  // Return a copy of the officials array, omitting the password.
  return MOCK_OFFICIALS.map(({ password, ...rest }) => rest);
}

export async function addOfficial(official: Omit<MockOfficial, 'id'>): Promise<{ success: boolean; error?: string }> {
  if (MOCK_OFFICIALS.some(o => o.email === official.email)) {
    return { success: false, error: 'An official with this email already exists.' };
  }
  const newId = `off${Date.now()}`;
  MOCK_OFFICIALS.push({ ...official, id: newId });
  return { success: true };
}

export async function removeOfficial(officialId: string): Promise<{ success: boolean; error?: string }> {
  const index = MOCK_OFFICIALS.findIndex(o => o.id === officialId);
  if (index === -1) {
    return { success: false, error: 'Official not found.' };
  }
  MOCK_OFFICIALS.splice(index, 1);
  return { success: true };
}
