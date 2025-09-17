'use server';

import { summarizeCandidates, type SummarizeCandidatesInput } from '@/ai/flows/candidate-info-summarization';

export async function getCandidateSummary(candidatesInfo: SummarizeCandidatesInput) {
  try {
    const result = await summarizeCandidates(candidatesInfo);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}
