import { getAIClient } from './genAI';
import { AIModel, FetchModelReturn } from './types';

export async function fetchModels(): Promise<FetchModelReturn> {
  const client = getAIClient();
  const page = await client.models.list();

  return {
    models: page.data as AIModel[],
    nextPageToken: null,
  };
}
