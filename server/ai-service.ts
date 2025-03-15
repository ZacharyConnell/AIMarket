import OpenAI from 'openai';
import type { Product } from '@shared/schema';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required environment variable: OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VERIFICATION_PROMPT = `You are an AI product verifier for an AI marketplace platform. 
Your task is to analyze product listings and determine if they appear legitimate or potentially fraudulent.

Analyze the following product information and respond with:
1. A verification status: "approved" or "rejected"
2. Detailed notes explaining your decision
3. A risk score from 0-100 (0 being safest, 100 being highest risk)

Focus on these aspects:
- Realistic pricing for the type of AI product
- Clear and specific description of functionality
- Reasonable promises/claims about capabilities
- Professional presentation
- Appropriate categorization

Product details:`;

const CHATBOT_PROMPT = `You are a helpful AI assistant for an AI marketplace platform where users can buy, sell, and request custom AI programs.
Your role is to:
1. Help users understand how the platform works
2. Assist with technical questions about AI products
3. Guide users through the buying/selling process
4. Explain platform policies and features
5. Provide general AI/ML knowledge

Keep responses friendly, concise, and focused on helping users achieve their goals.`;

export interface VerificationResult {
  status: "approved" | "rejected";
  notes: string;
  riskScore: number;
}

export interface ChatResponse {
  answer: string;
}

export async function verifyProduct(product: Product): Promise<VerificationResult> {
  const productDetails = `
Name: ${product.name}
Price: $${product.price}
Category: ${product.category}
Description: ${product.description}
Tags: ${product.tags?.join(', ') || 'None'}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      { role: "system", content: VERIFICATION_PROMPT },
      { role: "user", content: productDetails }
    ],
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content || '';
  
  // Parse the response - expects format like:
  // Status: approved/rejected
  // Notes: detailed explanation
  // Risk Score: 0-100
  const lines = response.split('\n');
  const status = lines[0].toLowerCase().includes('approved') ? 'approved' : 'rejected';
  const notes = lines.slice(1, -1).join('\n').replace('Notes:', '').trim();
  const riskScore = parseInt(lines[lines.length - 1].match(/\d+/)?.[0] || '50');

  return {
    status,
    notes,
    riskScore
  };
}

export async function getChatbotResponse(userMessage: string): Promise<ChatResponse> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    messages: [
      { role: "system", content: CHATBOT_PROMPT },
      { role: "user", content: userMessage }
    ],
    temperature: 0.7,
  });

  return {
    answer: completion.choices[0].message.content || 'I apologize, but I am unable to provide an answer at this moment.'
  };
}