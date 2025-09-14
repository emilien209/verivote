'use server';

import { summarizeCandidates, type SummarizeCandidatesInput } from '@/ai/flows/candidate-info-summarization';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import type { Candidate } from '@/lib/types';


const dbPath = path.resolve(process.cwd(), 'src/lib/mock-candidates.json');

function readCandidates(): Candidate[] {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading candidates file:", error);
    return [];
  }
}

function writeCandidates(candidates: Candidate[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(candidates, null, 2));
  } catch (error)
    {
    console.error("Error writing candidates file:", error);
  }
}


export async function getCandidateSummary(candidatesInfo: SummarizeCandidatesInput) {
  try {
    const result = await summarizeCandidates(candidatesInfo);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to generate summary.' };
  }
}

async function removeCandidateFromDb(candidateId: string) {
  const candidates = readCandidates();
  const updatedCandidates = candidates.filter(c => c.id !== candidateId);
  if (candidates.length === updatedCandidates.length) {
    return { success: false, error: 'Candidate not found.' };
  }
  writeCandidates(updatedCandidates);
  return { success: true };
}


export async function removeCandidate(candidateId: string) {
  try {
    const result = await removeCandidateFromDb(candidateId);
    if (result.success) {
      revalidatePath('/candidates');
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to remove candidate.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function getCandidates(): Promise<Candidate[]> {
    return readCandidates();
}
