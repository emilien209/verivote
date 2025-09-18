'use server';

/**
 * @fileOverview Manages and verifies election officials in Firestore.
 *
 * - verifyOfficial: Authenticates an official's credentials (DEPRECATED - handled by Firebase Auth).
 * - getOfficials: Returns a list of all officials from Firestore.
 * - addOfficial: Adds a new official to Firestore and creates a Firebase Auth user.
 * - removeOfficial: Removes an official from Firestore.
 */

import { z } from 'genkit';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Official } from '@/lib/types';


// --- Management Functions ---

export async function getOfficials(): Promise<Official[]> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('role', '==', 'official'));
    const querySnapshot = await getDocs(q);
    const officials: Official[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      officials.push({
        id: doc.id,
        name: data.fullName,
        email: data.email,
      });
    });
    return officials;
  } catch (error) {
    console.error("Error fetching officials:", error);
    return [];
  }
}

export async function addOfficial(official: Omit<Official, 'id'> & { password?: string }): Promise<{ success: boolean; error?: string }> {
  if (!official.password) {
    return { success: false, error: 'Password is required to create an official.' };
  }

  try {
     // Check if user with this email already exists
    const q = query(collection(db, "users"), where("email", "==", official.email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, error: 'An official with this email already exists.' };
    }

    // Step 1: Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, official.email, official.password);
    const user = userCredential.user;

    // Step 2: Create Firestore document
    const officialDoc = {
      id: user.uid,
      fullName: official.name,
      email: official.email,
      role: 'official',
      status: 'approved',
    };

    await setDoc(doc(db, 'users', user.uid), officialDoc);

    return { success: true };
  } catch (error: any) {
    console.error("Error adding official:", error);
    if (error.code === 'auth/email-already-in-use') {
        return { success: false, error: 'An official with this email already exists.' };
    }
     if (error.code === 'auth/weak-password') {
        return { success: false, error: 'Password is too weak. It must be at least 6 characters long.' };
    }
    return { success: false, error: 'An unexpected error occurred while adding the official.' };
  }
}

export async function removeOfficial(officialId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // In a real app, you would use the Firebase Admin SDK to delete the auth user.
    // For this prototype, we are only deleting the Firestore record.
    await deleteDoc(doc(db, 'users', officialId));
    return { success: true };
  } catch (error) {
    console.error("Error removing official:", error);
    return { success: false, error: 'Failed to remove official from the database.' };
  }
}
