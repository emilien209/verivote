'use server';

import { addOfficial, removeOfficial as removeOfficialFromDb } from '@/ai/flows/official-verification';
import { revalidatePath } from 'next/cache';
import type { MockOfficial } from '@/ai/flows/mock-officials';

export async function handleAddOfficial(official: Omit<MockOfficial, 'id'>) {
  try {
    const result = await addOfficial(official as MockOfficial); // Pass the full official object
    if (result.success) {
      revalidatePath('/admin/manage-officials');
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to add official.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function handleRemoveOfficial(officialId: string) {
    try {
      const result = await removeOfficialFromDb(officialId);
      if (result.success) {
        revalidatePath('/admin/manage-officials');
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to remove official.' };
    } catch (error) {
      console.error(error);
      return { success: false, error: 'An unexpected error occurred.' };
    }
}
