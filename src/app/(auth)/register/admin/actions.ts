
'use server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import fs from 'fs';
import path from 'path';

const MOCK_ADMIN_CODE = '0792662109';
const mockAdminsPath = path.resolve(process.cwd(), 'src/ai/flows/mock-admins.ts');

type MockAdmin = { email: string; password?: string };

function readAdmins(): MockAdmin[] {
    try {
        const fileContent = fs.readFileSync(mockAdminsPath, 'utf-8');
        const match = fileContent.match(/export const MOCK_ADMINS = (\[[\s\S]*?\]);/);
        if (match && match[1]) {
            // This is a bit fragile, but it avoids needing a full parser for this simple case.
            // It uses eval, which is safe here because we control the source file.
            return eval(match[1]);
        }
        return [];
    } catch (error) {
        console.error("Error reading mock-admins.ts:", error);
        return [];
    }
}

function writeAdmins(admins: MockAdmin[]): void {
    const fileContent = `export const MOCK_ADMINS = ${JSON.stringify(admins, null, 4)};\n`;
    try {
        fs.writeFileSync(mockAdminsPath, fileContent, 'utf-8');
    } catch (error) {
        console.error("Error writing mock-admins.ts:", error);
    }
}


export async function handleAdminRegistration(
    prevState: any,
    formData: FormData
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const adminCode = formData.get('adminCode') as string;

    if (adminCode !== MOCK_ADMIN_CODE) {
        return { success: false, error: 'Invalid admin code.' };
    }

    try {
        // Step 1: Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Step 2: Create Firestore user document with 'admin' role
        const userDoc = {
            id: user.uid,
            fullName: 'Administrator',
            email: email,
            role: 'admin',
            status: 'approved',
        };
        await setDoc(doc(db, 'users', user.uid), userDoc);

        // Step 3: Add the new admin to the mock-admins.ts file
        const admins = readAdmins();
        if (!admins.some(admin => admin.email.toLowerCase() === email.toLowerCase())) {
            admins.push({ email, password });
            writeAdmins(admins);
        }

        return { success: true, message: "Admin account successfully created. You can now log in." };

    } catch (error: any) {
        let errorMessage = 'An unexpected error occurred during admin registration.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email address is already registered.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'The password is too weak. It must be at least 6 characters long.';
        }
        console.error("Admin registration error:", error);
        return { success: false, error: errorMessage };
    }
}
