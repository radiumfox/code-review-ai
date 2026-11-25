import { getAIClient } from '@/lib/genAI/openai/genAI';
import { type AllowedAIModel } from '@/lib/types';



export async function generateContent({ contents, model, userApiKey }: { contents: string, model: AllowedAIModel, userApiKey?: string }) {
  const client = getAIClient(userApiKey);
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: contents }],
    response_format: { type: 'json_object' },
  });

  return response.choices;
}