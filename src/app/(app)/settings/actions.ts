'use server';

import { auth } from '@/lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { z } from 'zod';

const formSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });


export async function changePassword(values: z.infer<typeof formSchema>) {
    const user = auth.currentUser;

    if (!user || !user.email) {
        return { success: false, error: 'You must be logged in to change your password.' };
    }
    
    const validatedFields = formSchema.safeParse(values);
    if (!validatedFields.success) {
        return { success: false, error: "Invalid input." };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        
        // Re-authenticate the user to confirm their identity
        await reauthenticateWithCredential(user, credential);

        // If re-authentication is successful, update the password
        await updatePassword(user, newPassword);

        return { success: true };

    } catch (error: any) {
        console.error("Password change error:", error);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            return { success: false, error: 'The current password you entered is incorrect.' };
        }
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
}
