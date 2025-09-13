'use server';

import { verifyUser } from '@/ai/flows/user-verification';

export async function checkUserRecognition(nationalId: string) {
  try {
    if (!nationalId) {
      return { success: false, error: 'National ID cannot be empty.' };
    }
    const result = await verifyUser({ nationalId });
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to verify user.' };
  }
}
