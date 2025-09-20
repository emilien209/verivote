'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Candidate } from '@/lib/types';


async function addCandidateToDb(candidate: Omit<Candidate, 'id'>) {
  try {
    await addDoc(collection(db, 'candidates'), candidate);
    return { success: true };
  } catch (error) {
    console.error("Error adding candidate to Firestore:", error);
    return { success: false, error: "Failed to add candidate to the database." };
  }
}

export async function addCandidate(candidate: { name: string, party: string, platform: string }) {
  try {
    // Check if a candidate with the same name already exists to prevent duplicates
    const q = query(collection(db, "candidates"), where("name", "==", candidate.name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, error: 'A candidate with this name already exists.' };
    }

    const result = await addCandidateToDb(candidate);
    if (result.success) {
      revalidatePath('/candidates');
      revalidatePath('/admin/register-candidate');
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to save candidate.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

async function removeCandidateFromDb(candidateId: string) {
   try {
    await deleteDoc(doc(db, 'candidates', candidateId));
    return { success: true };
  } catch (error) {
    console.error("Error removing candidate from Firestore:", error);
    return { success: false, error: 'Failed to remove candidate from the database.' };
  }
}


export async function removeCandidate(candidateId: string) {
  try {
    const result = await removeCandidateFromDb(candidateId);
    if (result.success) {
      revalidatePath('/candidates');
      revalidatePath('/admin/register-candidate'); // Revalidate this page too
      return { success: true };
    }
    return { success: false, error: result.error || 'Failed to remove candidate.' };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
