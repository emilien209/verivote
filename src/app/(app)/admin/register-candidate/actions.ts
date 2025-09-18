'use server';

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

async function addCandidateToDb(candidate: Omit<Candidate, 'id'>) {
  const candidates = readCandidates();
  const newId = `c${Date.now()}`;
  const newCandidate: Candidate = { ...candidate, id: newId };
  candidates.push(newCandidate);
  writeCandidates(candidates);
  return { success: true };
}

export async function addCandidate(candidate: { name: string, party: string, platform: string }) {
  try {
    const result = await addCandidateToDb(candidate);
    if (result.success) {
      revalidatePath('/candidates');
      revalidatePath('/admin/register-candidate');
      return { success: true };
    }
    return { success: false, error: 'Failed to save candidate.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
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
