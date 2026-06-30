import { GoogleGenAI } from '@google/genai';

export const googleGenAI = () => {
  const API_KEY = process.env.GEMINI_API_KEY;

  if(!API_KEY) {
    throw new Error('Missing API key environment variable');
  }

  const genAI = new GoogleGenAI({ apiKey: API_KEY });

  return {
    genAI
  };
};