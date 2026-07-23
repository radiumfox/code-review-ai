import { MODELS_PAGE_SIZE } from './config';
import { googleGenAI } from './genAI';
import { FetchModelReturn } from './types';

export async function fetchModels(pageToken?: string): Promise<FetchModelReturn> {
  const aiClient = await googleGenAI();

  const pager = await aiClient.models.list({
    config: {
      pageSize: MODELS_PAGE_SIZE,
      pageToken
    }
  });

  const models = pager.page;

  const nextPageToken = pager.hasNextPage() ? pager.params.config?.pageToken ?? null : null;

  return {
    models,
    nextPageToken
  };
}