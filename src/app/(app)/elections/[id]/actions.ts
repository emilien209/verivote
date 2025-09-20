'use server';

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

interface CastVoteInput {
  voterId: string;
  electionId: string;
  candidateId: string;
  candidateName: string;
}

export async function castVote(input: CastVoteInput): Promise<{ success: boolean; error?: string }> {
  try {
    const { voterId, electionId, candidateId, candidateName } = input;

    // Use a composite ID to ensure a voter can only vote once per election
    const voteDocId = `${voterId}_${electionId}`;
    const voteDocRef = doc(db, 'votes', voteDocId);

    // Check if the vote document already exists
    const voteDoc = await getDoc(voteDocRef);
    if (voteDoc.exists()) {
      return { success: false, error: 'This voter has already voted in this election.' };
    }

    // If it doesn't exist, create the vote document
    await setDoc(voteDocRef, {
      voterId,
      electionId,
      candidateId,
      candidateName,
      votedAt: Timestamp.now(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error casting vote:', error);
    return { success: false, error: 'An unexpected error occurred while casting the vote.' };
  }
}
