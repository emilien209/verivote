import { config } from 'dotenv';
config();

import '@/ai/flows/candidate-info-summarization.ts';
import '@/ai/flows/faq-chatbot.ts';
import '@/ai/flows/ai-election-guide.ts';
import '@/ai/flows/user-verification.ts';
import '@/ai/flows/admin-verification.ts';
import '@/ai/flows/official-verification.ts';
