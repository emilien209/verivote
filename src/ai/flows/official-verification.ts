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
import { MOCK_OFFICIALS as initialMockOfficials, type MockOfficial } from './mock-officials';
import fs from 'fs';
import path from 'path';

// Use a simple JSON file as a database for this mock data.
const dbPath = path.resolve(process.cwd(), 'src/ai/flows/mock-officials.json');

function readOfficials(): MockOfficial[] {
  try {
    if (!fs.existsSync(dbPath)) {
      // If the file doesn't exist, start with the initial data and create the file.
      fs.writeFileSync(dbPath, JSON.stringify(initialMockOfficials, null, 2));
      return initialMockOfficials;
    }
    const data = fs.readFileSync(dbPath, 'utf-8');
    // If the file is empty, initialize it with seed data.
    if (!data.trim()) {
        fs.writeFileSync(dbPath, JSON.stringify(initialMockOfficials, null, 2));
        return initialMockOfficials;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or creating officials file:", error);
    // Fallback to initial data if there's an error
    return initialMockOfficials;
  }
}

function writeOfficials(officials: MockOfficial[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(officials, null, 2));
  } catch (error) {
    console.error("Error writing officials file:", error);
  }
}


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
    const officials = readOfficials();
    const official = officials.find(o => o.email === input.email && o.password === input.password);

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
  const officials = readOfficials();
  // Return a copy of the officials array, omitting the password.
  return officials.map(({ password, ...rest }) => rest);
}

export async function addOfficial(official: MockOfficial): Promise<{ success: boolean; error?: string }> {
  const officials = readOfficials();
  if (officials.some(o => o.email.toLowerCase() === official.email.toLowerCase())) {
    return { success: false, error: 'An official with this email already exists.' };
  }
  const newId = `off${Date.now()}`;
  officials.push({ ...official, id: newId });
  writeOfficials(officials);
  return { success: true };
}

export async function removeOfficial(officialId: string): Promise<{ success: boolean; error?: string }> {
  let officials = readOfficials();
  const initialLength = officials.length;
  officials = officials.filter(o => o.id !== officialId);
  
  if (officials.length === initialLength) {
    return { success: false, error: 'Official not found.' };
  }
  
  writeOfficials(officials);
  return { success: true };
}
