import OpenAI from 'openai';
import { AI_API_KEY, AI_BASE_URL } from './config';

let aiClient: OpenAI | null = null;

export const getAIClient = (userApiKey?: string) => {
  const apiKey = userApiKey ?? AI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing API key');
  }

  if (userApiKey) {
    return new OpenAI({ apiKey: userApiKey, baseURL: AI_BASE_URL });
  }

  if (!aiClient) {
    aiClient = new OpenAI({ apiKey, baseURL: AI_BASE_URL });
  }

  return aiClient;
};
