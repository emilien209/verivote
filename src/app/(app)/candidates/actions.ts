'use server';

import { summarizeCandidates, type SummarizeCandidatesInput } from '@/ai/flows/candidate-info-summarization';
import { revalidatePath } from 'next/cache';

export async function getCandidateSummary(candidatesInfo: SummarizeCandidatesInput) {
  try {
    const result = await summarizeCandidates(candidatesInfo);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}

// This is a mock function. In a real app, you would remove from a database.
async function removeCandidateFromDb(candidateId: string) {
  console.log('Removing candidate from DB:', candidateId);
  // This would be a database operation.
  // We can't modify the mock file, so we can't truly remove a candidate.
  // We will just simulate success.
  return { success: true };
}


export async function removeCandidate(candidateId: string) {
  try {
    const result = await removeCandidateFromDb(candidateId);
    if (result.success) {
      revalidatePath('/candidates');
      return { success: true };
    }
    return { success: false, error: 'Failed to remove candidate.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
