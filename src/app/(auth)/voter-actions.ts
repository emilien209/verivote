'use server';

import type { Voter } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { verifyUser } from '@/ai/flows/user-verification';


const dbPath = path.resolve(process.cwd(), 'src/lib/mock-voters.json');

// --- Helper Functions ---
function readVoters(): Voter[] {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    }
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
    return [];
  } catch (error) {
    console.error("Error reading voters file:", error);
    return [];
  }
}

function writeVoters(voters: Voter[]): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(voters, null, 2));
  } catch (error) {
    console.error("Error writing voters file:", error);
  }
}


// --- Public Actions ---

// Called from the voter registration page
export async function handleVoterRegistration(voterData: Omit<Voter, 'id' | 'status'> & { firstName: string; lastName: string }) {
    
    const voters = readVoters();
    
    // Check for duplicates in our local voter database
    if (voters.some(v => v.email === voterData.email || v.nationalId === voterData.nationalId)) {
        return { success: false, error: 'A user with this email or National ID is already registered or pending approval.' };
    }

    // If all checks pass, create the pending registration
    const newVoter: Voter = {
        fullName: voterData.fullName,
        nationalId: voterData.nationalId,
        email: voterData.email,
        password: voterData.password,
        id: `voter-${Date.now()}`,
        status: 'pending',
    };

    voters.push(newVoter);
    writeVoters(voters);

    revalidatePath('/admin/manage-voters');

    return { success: true };
}

// Called from the login page
export async function verifyVoterLogin(credentials: {email: string; password: string}) {
    const voters = readVoters();
    const voter = voters.find(v => v.email === credentials.email && v.password === credentials.password);

    if (voter) {
        return {
            isAuthenticated: true,
            status: voter.status,
            name: voter.fullName
        };
    }

    return { isAuthenticated: false };
}

// --- Admin Actions ---

// Called from the admin/manage-voters page
export async function getVoters(): Promise<Voter[]> {
    return readVoters();
}

// Called from the admin/manage-voters page
export async function updateVoterStatus(voterId: string, newStatus: 'approved' | 'rejected') {
    const voters = readVoters();
    const voterIndex = voters.findIndex(v => v.id === voterId);

    if (voterIndex === -1) {
        return { success: false, error: 'Voter not found.' };
    }

    voters[voterIndex].status = newStatus;

    if (newStatus === 'approved') {
        // Simulate sending a confirmation email
        console.log(`Simulating: Sending approval confirmation email to ${voters[voterIndex].email}`);
    }

    writeVoters(voters);

    revalidatePath('/admin/manage-voters');
    return { success: true };
}

// Called from the admin/manage-voters page
export async function removeVoter(voterId: string) {
    let voters = readVoters();
    const initialLength = voters.length;
    voters = voters.filter(v => v.id !== voterId);

    if (voters.length === initialLength) {
        return { success: false, error: 'Voter not found.' };
    }
  
    writeVoters(voters);
revalidatePath('/admin/manage-voters');
    return { success: true };
}
