'use server';

import { db } from '@/lib/firebase';
import type { Voter } from '@/lib/types';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export async function getUserById(input: { nationalId: string }): Promise<{ success: boolean; user?: Voter; error?: string }> {
  try {
    const q = query(
      collection(db, "users"),
      where("nationalId", "==", input.nationalId),
      where("role", "==", "voter"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'No approved voter found with that National ID.' };
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as Omit<Voter, 'id'>;

    if (userData.status !== 'approved') {
        return { success: false, error: `This voter's status is currently '${userData.status}'. They are not approved to vote.` };
    }

    return {
      success: true,
      user: {
        id: userDoc.id,
        ...userData,
      },
    };
  } catch (error) {
    console.error("Error fetching user by National ID:", error);
    return { success: false, error: 'An unexpected error occurred while verifying the voter.' };
  }
}
