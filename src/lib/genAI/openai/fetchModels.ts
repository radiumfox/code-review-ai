import { getAIClient } from './genAI';
import { AIModel, FetchModelReturn } from './types';
import { FREE_AI_MODELS } from '@/lib/config';

export async function fetchModels(): Promise<FetchModelReturn> {
  const client = getAIClient();
  const page = await client.models.list();
  const models = (page.data as AIModel[]).filter((model) =>
    FREE_AI_MODELS.includes(model.id as (typeof FREE_AI_MODELS)[number])
  );

  return {
    models,
    nextPageToken: null,
  };
}
