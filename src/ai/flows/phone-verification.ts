'use server';

/**
 * @fileOverview Manages phone number verification for user registration.
 *
 * - sendVerificationCode: Simulates sending a verification code to a phone number.
 * - confirmVerificationCode: Simulates confirming a verification code.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// --- Send Verification Code Flow ---

const SendCodeInputSchema = z.object({
  phone: z.string().describe("The user's phone number."),
});
export type SendCodeInput = z.infer<typeof SendCodeInputSchema>;

const SendCodeOutputSchema = z.object({
  success: z.boolean().describe('Whether the code was sent successfully.'),
  // In a real app, you wouldn't return the code in the response.
  // This is just for demonstration purposes.
  mockCode: z.string().describe('The mock verification code.'),
});
export type SendCodeOutput = z.infer<typeof SendCodeOutputSchema>;


export async function sendVerificationCode(input: SendCodeInput): Promise<SendCodeOutput> {
  return sendCodeFlow(input);
}


const sendCodeFlow = ai.defineFlow(
  {
    name: 'sendVerificationCodeFlow',
    inputSchema: SendCodeInputSchema,
    outputSchema: SendCodeOutputSchema,
  },
  async (input) => {
    console.log(`Simulating sending verification code to: ${input.phone}`);
    // In a real app, you would integrate with an SMS gateway like Twilio.
    // For this prototype, we'll just generate a mock code and return it.
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    return {
      success: true,
      mockCode: mockCode,
    };
  }
);


// --- Confirm Verification Code Flow ---

const ConfirmCodeInputSchema = z.object({
  phone: z.string().describe("The user's phone number."),
  code: z.string().describe('The verification code entered by the user.'),
  // This is passed from the previous step to validate against
  expectedCode: z.string().describe('The code that was sent to the user.'),
});
export type ConfirmCodeInput = z.infer<typeof ConfirmCodeInputSchema>;


const ConfirmCodeOutputSchema = z.object({
  isConfirmed: z.boolean().describe('Whether the code is correct.'),
});
export type ConfirmCodeOutput = z.infer<typeof ConfirmCodeOutputSchema>;


export async function confirmVerificationCode(input: ConfirmCodeInput): Promise<ConfirmCodeOutput> {
    return confirmCodeFlow(input);
}

const confirmCodeFlow = ai.defineFlow(
  {
    name: 'confirmVerificationCodeFlow',
    inputSchema: ConfirmCodeInputSchema,
    outputSchema: ConfirmCodeOutputSchema,
  },
  async (input) => {
    // In a real app, you would have a more secure way to store and retrieve the expected code.
    const isCorrect = input.code === input.expectedCode;

    return {
      isConfirmed: isCorrect,
    };
  }
);
