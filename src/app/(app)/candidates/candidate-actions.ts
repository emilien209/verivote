'use server';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Candidate } from '@/lib/types';


export async function getCandidates(): Promise<Candidate[]> {
    try {
        const candidatesCollection = collection(db, 'candidates');
        const q = query(candidatesCollection, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        const candidates: Candidate[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            candidates.push({
                id: doc.id,
                name: data.name,
                party: data.party,
                platform: data.platform,
            });
        });
        return candidates;
    } catch (error) {
        console.error("Error fetching candidates:", error);
        return [];
    }
}
