'use server';

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

export async function getCandidates(): Promise<Candidate[]> {
    return readCandidates();
}
