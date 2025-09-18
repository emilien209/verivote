'use server';

import type { Voter } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// This file is now deprecated for registration, see /register/actions.ts
// It is still used for voter management by admins.

// --- Admin Actions ---

// Called from the admin/manage-voters page
export async function getVoters(): Promise<Voter[]> {
    try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const voters: Voter[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // We only care about users with the 'voter' role here
            if (data.role === 'voter') {
                 voters.push({
                    id: doc.id,
                    fullName: data.fullName,
                    nationalId: data.nationalId,
                    email: data.email,
                    status: data.status,
                    role: data.role
                });
            }
        });
        return voters;
    } catch (error) {
        console.error("Error fetching voters:", error);
        return [];
    }
}

// Called from the admin/manage-voters page
export async function updateVoterStatus(voterId: string, newStatus: 'approved' | 'rejected') {
    try {
        const voterDocRef = doc(db, 'users', voterId);
        await updateDoc(voterDocRef, {
            status: newStatus
        });

        revalidatePath('/admin/manage-voters');
        return { success: true };
    } catch (error) {
        console.error("Error updating voter status:", error);
        return { success: false, error: 'Failed to update voter status.' };
    }
}

// Called from the admin/manage-voters page
export async function removeVoter(voterId: string) {
     try {
        // This is a complex operation. In a real app, you would not delete the user from Auth
        // immediately. You would disable them. For this prototype, we'll just delete from Firestore.
        await deleteDoc(doc(db, 'users', voterId));

        // You would also need an admin SDK to delete the user from Firebase Auth.
        // This cannot be done from the client-side/server-action securely.
        // e.g., admin.auth().deleteUser(voterId);

        revalidatePath('/admin/manage-voters');
        return { success: true };
    } catch (error) {
        console.error("Error removing voter:", error);
        return { success: false, error: 'Failed to remove voter from the database.' };
    }
}

// This function is no longer needed as login is handled on the client with Firebase Auth
// export async function verifyVoterLogin(credentials: {email: string; password: string}) {}
