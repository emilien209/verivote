import { config } from 'dotenv';
config();

// This file is used to register AI flows for development and testing.
// You can add or remove imports here to control which flows are active.

import '@/ai/flows/faq-chatbot.ts';
import '@/ai/flows/ai-election-guide.ts';
import '@/ai/flows/candidate-info-summarization.ts';
// import '@/ai/flows/user-verification.ts';
// import '@/ai/flows/admin-verification.ts';
// import '@/ai/flows/official-verification.ts';
