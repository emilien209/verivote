'use server';

import type { Voter } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { verifyUserByPhoto } from '@/ai/flows/user-verification';
import { sendVerificationCode, confirmVerificationCode } from '@/ai/flows/phone-verification';

// --- Registration for "Eligible Voters" with Photos ---

export async function handleVoterPhotoRegistration(
    prevState: any,
    formData: FormData
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const idPhotoDataUri = formData.get('idPhoto') as string;
    const locationPhotoDataUri = formData.get('locationPhoto') as string;

    try {
        // Step 1: Use AI to verify photos and extract info
        const verificationResult = await verifyUserByPhoto({
            idPhotoDataUri,
            locationPhotoDataUri,
        });

        if (!verificationResult.isVerified) {
            return { success: false, error: 'AI verification failed. Please ensure your photos are clear and valid.' };
        }

        // Step 2: Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 3: Create Firestore user document
        const voterDoc: Omit<Voter, 'password'> = {
            id: user.uid,
            fullName: verificationResult.extractedName || 'Name from Photo',
            nationalId: verificationResult.extractedNationalId,
            email: email,
            idPhotoUrl: 'simulated_url/id_photo.jpg', // In a real app, you'd store the photo in Cloud Storage and save the URL
            locationPhotoUrl: 'simulated_url/location_photo.jpg',
            status: 'approved', // Auto-approved after AI verification
            role: 'voter',
        };

        await setDoc(doc(db, 'users', user.uid), voterDoc);

        revalidatePath('/admin/manage-voters');

        return { success: true, message: "You've been successfully registered and approved!" };

    } catch (error: any) {
        let errorMessage = 'An unexpected error occurred during photo registration.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already registered.';
        }
        console.error("Voter photo registration error:", error);
        return { success: false, error: errorMessage };
    }
}


// --- Registration for "General Users" with Phone ---

export async function handlePhoneRegistration(
    prevState: any,
    formData: FormData
) {
     const email = formData.get('email') as string;
     const phone = formData.get('phone') as string;
     const password = formData.get('password') as string;

     try {
        // Since this is the first step (sending code), we just create the user for now.
        // In a real app, you might create a temporary user record.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const voterDoc: Omit<Voter, 'password'> = {
             id: user.uid,
             fullName: `User ${user.uid.substring(0, 5)}`, // Placeholder name
             email: email,
             phone: phone,
             status: 'pending', // Pending phone verification
             role: 'voter',
        };
        await setDoc(doc(db, 'users', user.uid), voterDoc);

        // Send verification code
        const codeResult = await sendVerificationCode({ phone });
        if (!codeResult.success) {
            return { success: false, error: 'Failed to send verification code.' };
        }

        return { 
            success: true, 
            step: 'verify', 
            phone, 
            email,
            // This is for the prototype only. In production, never send the code to the client.
            mockCode: codeResult.mockCode 
        };

     } catch(error: any) {
        let errorMessage = 'An unexpected error occurred during phone registration.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already registered.';
        }
        console.error("Voter phone registration error:", error);
        return { success: false, error: errorMessage };
     }
}


export async function handlePhoneVerification(
    prevState: any,
    formData: FormData
) {
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const code = formData.get('code') as string;
    const expectedCode = formData.get('expectedCode') as string; // From previous step (prototype only)

    try {
        const confirmationResult = await confirmVerificationCode({ phone, code, expectedCode });
        
        if(!confirmationResult.isConfirmed) {
            return { ...prevState, success: false, error: 'Invalid verification code. Please try again.'}
        }
        
        // Find the user by email (in a real app, you'd have a more robust way to link them)
        // For this prototype, we'll assume the user is logged in after the first step.
        const user = auth.currentUser;
        if (!user || user.email !== email) {
            return { success: false, error: 'User session not found. Please start over.'}
        }

        // Update user status to 'approved'
        await setDoc(doc(db, 'users', user.uid), { status: 'approved' }, { merge: true });

        revalidatePath('/admin/manage-voters');

        return { success: true, step: 'complete', message: "Your phone has been verified and your account is active!" };

    } catch (error: any) {
        console.error("Phone verification error:", error);
        return { ...prevState, success: false, error: 'An unexpected error occurred during verification.' };
    }
}
