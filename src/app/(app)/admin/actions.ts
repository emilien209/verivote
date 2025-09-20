'use server';

import { db } from '@/lib/firebase';
import type { VoteCount } from '@/lib/types';
import { collection, getDocs, query, where } from 'firebase/firestore';

export async function getDashboardStats(): Promise<{
  totalVoters: number;
  votesCast: number;
  results: VoteCount[];
}> {
  try {
    // 1. Get total voters
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('role', '==', 'voter'));
    const votersSnapshot = await getDocs(q);
    const totalVoters = votersSnapshot.size;

    // 2. Get votes cast and results by candidate
    const votesCollection = collection(db, 'votes');
    const votesSnapshot = await getDocs(votesCollection);
    const votesCast = votesSnapshot.size;

    const resultsMap: Map<string, { name: string, votes: number }> = new Map();

    votesSnapshot.forEach(doc => {
      const vote = doc.data();
      const { candidateId, candidateName } = vote;
      
      if (resultsMap.has(candidateId)) {
        resultsMap.get(candidateId)!.votes++;
      } else {
        resultsMap.set(candidateId, { name: candidateName, votes: 1 });
      }
    });

    const results: VoteCount[] = Array.from(resultsMap.entries()).map(([candidateId, data]) => ({
      candidateId,
      candidateName: data.name,
      votes: data.votes,
    }));
    
    // Sort results by votes descending
    results.sort((a, b) => b.votes - a.votes);

    return { totalVoters, votesCast, results };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { totalVoters: 0, votesCast: 0, results: [] };
  }
}
