'use server';

/**
 * @fileOverview A user verification AI agent that checks against a mock NIDA database.
 *
 * - verifyUser - A function that handles the user verification process.
 * - VerifyUserInput - The input type for the verifyUser function.
 * - VerifyUserOutput - The return type for the verifyUser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MOCK_USERS } from './mock-users';

const VerifyUserInputSchema = z.object({
  nationalId: z.string().describe("The user's National ID."),
  firstName: z.string().optional().describe("The user's first name."),
  lastName: z.string().optional().describe("The user's last name."),
});
export type VerifyUserInput = z.infer<typeof VerifyUserInputSchema>;

const VerifyUserOutputSchema = z.object({
  isRecognized: z.boolean().describe('Whether or not the user is recognized in the NIDA database.'),
  isNameMatch: z.boolean().describe('Whether the provided name matches the record for the National ID.'),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }).optional(),
});
export type VerifyUserOutput = z.infer<typeof VerifyUserOutputSchema>;

export async function verifyUser(input: VerifyUserInput): Promise<VerifyUserOutput> {
  return verifyUserFlow(input);
}

const verifyUserFlow = ai.defineFlow(
  {
    name: 'verifyUserFlow',
    inputSchema: VerifyUserInputSchema,
    outputSchema: VerifyUserOutputSchema,
  },
  async (input) => {
    const user = MOCK_USERS.find(u => u.nationalId === input.nationalId);

    if (!user) {
      return {
        isRecognized: false,
        isNameMatch: false,
      };
    }
    
    // If names are not provided, we can't check for a match, but the user is recognized.
    if (!input.firstName || !input.lastName) {
        return {
            isRecognized: true,
            isNameMatch: false, // Cannot confirm name match
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
            }
        }
    }


    const nameMatches = user.firstName.toLowerCase() === input.firstName.toLowerCase() && user.lastName.toLowerCase() === input.lastName.toLowerCase();

    if (nameMatches) {
        return {
            isRecognized: true,
            isNameMatch: true,
            user: {
            firstName: user.firstName,
            lastName: user.lastName,
            },
        };
    }

    return {
        isRecognized: true,
        isNameMatch: false,
        user: {
            firstName: user.firstName,
            lastName: user.lastName,
        }
    };
  }
);


// --- Photo Verification Flow ---

const VerifyUserByPhotoInputSchema = z.object({
    idPhotoDataUri: z.string().describe("A data URI of the user's ID card photo."),
    locationPhotoDataUri: z.string().describe("A data URI of the user's proof of voting location photo.")
});
export type VerifyUserByPhotoInput = z.infer<typeof VerifyUserByPhotoInputSchema>;


const VerifyUserByPhotoOutputSchema = z.object({
    isVerified: z.boolean().describe('Whether the user is verified based on the photos.'),
    extractedNationalId: z.string().optional().describe('The national ID extracted from the photo.'),
    extractedName: z.string().optional().describe('The name extracted from the photo.'),
});
export type VerifyUserByPhotoOutput = z.infer<typeof VerifyUserByPhotoOutputSchema>;


export async function verifyUserByPhoto(input: VerifyUserByPhotoInput): Promise<VerifyUserByPhotoOutput> {
    return verifyUserByPhotoFlow(input);
}

const verifyUserByPhotoPrompt = ai.definePrompt({
    name: 'verifyUserByPhotoPrompt',
    input: { schema: VerifyUserByPhotoInputSchema },
    output: { schema: VerifyUserByPhotoOutputSchema },
    prompt: `You are an AI verification agent. Your task is to analyze the provided ID card and proof of location photos.
    
    ID Photo: {{media url=idPhotoDataUri}}
    Location Photo: {{media url=locationPhotoDataUri}}

    1.  Analyze the ID photo to determine if it is a valid government-issued ID.
    2.  Extract the National ID number and the Full Name from the ID.
    3.  Analyze the location photo to ensure it's a valid place of voting.
    4.  Based on your analysis, decide if the user is verified.
    
    For this prototype, assume the photos are always valid and extract mock data.`
});


const verifyUserByPhotoFlow = ai.defineFlow(
    {
        name: 'verifyUserByPhotoFlow',
        inputSchema: VerifyUserByPhotoInputSchema,
        outputSchema: VerifyUserByPhotoOutputSchema,
    },
    async (input) => {
        // In a real application, you would use a multimodal model to analyze the images.
        // For this prototype, we'll just simulate a successful verification.
        console.log("Simulating AI analysis of ID and location photos.");
        
        // For now, let's return mock data.
        return {
            isVerified: true,
            extractedNationalId: '1199080123456789', // Mock extracted ID
            extractedName: 'Jane Doe (from Photo)', // Mock extracted name
        };
    }
);
