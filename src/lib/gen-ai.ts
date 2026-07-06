import {GoogleGenAI} from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;
const MODELS_PAGE_SIZE = 20;

export const googleGenAI = async () => {
  if(!API_KEY) {
    throw new Error('Missing API key environment variable');
  }

  return new GoogleGenAI({ apiKey: API_KEY });
};

export interface ModelItem {
  name: string;
  displayName: string
}

interface FetchModelReturn {
  models: ModelItem[];
  nextPageToken: string | null
}

export async function fetchModels(pageToken?: string): Promise<FetchModelReturn> {
  const aiClient = await googleGenAI();

  const pager = await aiClient.models.list({
    config: {
      pageSize: MODELS_PAGE_SIZE,
      pageToken
    }
  });

  const models = pager.page
    .map(model => ({
      name: model.name ?? '',
      displayName: model.displayName ?? model.name ?? '' })
    );

  const nextPageToken = pager.hasNextPage() ? pager.params.config?.pageToken ?? null : null;

  return {
    models,
    nextPageToken
  };
}