import { ContentListUnion } from '@google/genai';
import { googleGenAI } from './genAI';

export async function generateContent({ contents, model }: { contents: ContentListUnion, model: string }) {
  const aiClient = await googleGenAI();

  const response = await aiClient.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: 'application/json'
    }
  });

  return response.candidates;
}