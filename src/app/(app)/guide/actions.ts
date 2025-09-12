'use server';

import { electionGuide } from '@/ai/flows/ai-election-guide';

export async function getGuideAnswer(query: string) {
  try {
    if (!query) {
      return { success: false, error: 'Query cannot be empty.' };
    }
    const result = await electionGuide({ query });
    return { success: true, data: result.answer };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get an answer from the AI guide.' };
  }
}
