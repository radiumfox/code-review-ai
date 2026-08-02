import { getAIClient } from '@/lib/genAI/openai/genAI';



export async function generateContent({ contents, model, userApiKey }: { contents: string, model: string, userApiKey?: string }) {
  const client = getAIClient(userApiKey);
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: contents }],
    response_format: { type: 'json_object' },
  });

  return response.choices;
}