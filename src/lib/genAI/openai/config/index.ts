import { DEFAULT_AI_MODEL } from '@/lib/config';

export const AI_API_KEY = process.env.AI_API_KEY;
export const AI_BASE_URL = process.env.AI_BASE_URL ?? 'https://api.groq.com/openai/v1';
export const AI_MODEL = process.env.AI_MODEL ?? DEFAULT_AI_MODEL;
