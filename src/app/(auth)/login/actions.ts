'use server';

import { verifyUser } from '@/ai/flows/user-verification';

export async function checkUserRecognition(nationalId: string) {
  try {
    if (!nationalId) {
      return { success: false, error: 'National ID cannot be empty.' };
    }
    // This is a simplified check. In a real scenario, you'd likely have a more robust login flow.
    // The updated verifyUser flow requires more fields, which we don't collect at login.
    // For now, we'll just check if the ID exists for login purposes.
    const { MOCK_USERS } = await import('@/ai/flows/mock-users');
    const user = MOCK_USERS.find(u => u.nationalId === nationalId);
    
    return { success: true, data: { isRecognized: !!user, user: user ? { firstName: user.firstName, lastName: user.lastName } : undefined } };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to verify user.' };
  }
}
