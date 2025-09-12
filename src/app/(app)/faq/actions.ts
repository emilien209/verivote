'use server';

import { faqChatbot } from '@/ai/flows/faq-chatbot';

export async function getFaqAnswer(question: string) {
  try {
    if (!question) {
      return { success: false, error: 'Question cannot be empty.' };
    }
    const result = await faqChatbot({ question });
    return { success: true, data: result.answer };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get an answer from the chatbot.' };
  }
}
