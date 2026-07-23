import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from './config';

let aiClient: GoogleGenAI | null = null;

export const googleGenAI = async () => {
  if(!aiClient) {
    if(!GEMINI_API_KEY) {
      throw new Error('Missing API key environment variable');
    }

    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  return aiClient;
};

