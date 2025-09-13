'use server';
/**
 * @fileOverview Manages election officials.
 *
 * - getOfficials: Returns a list of all officials.
 * - addOfficial: Adds a new official.
 * - removeOfficial: Removes an official.
 */
import { MOCK_OFFICIALS, type MockOfficial } from './mock-officials';

// NOTE: In a real application, these functions would interact with a database.
// Modifying an in-memory array like this will only persist for the lifetime of the server process.

export async function getOfficials(): Promise<MockOfficial[]> {
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
