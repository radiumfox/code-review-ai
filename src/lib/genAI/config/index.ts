export const MODELS_PAGE_SIZE = 20;

export const AI_API_KEY = process.env.AI_API_KEY;
export const AI_BASE_URL = process.env.AI_BASE_URL ?? 'https://api.groq.com/openai/v1';
export const AI_MODEL = process.env.AI_MODEL ?? 'llama-3.3-70b-versatile';
export const AI_MODEL_NAME = process.env.AI_MODEL_NAME ?? 'Llama 3.3 70B';
export const MODELS_LIST_ENABLED = process.env.MODELS_LIST_ENABLED === 'true';