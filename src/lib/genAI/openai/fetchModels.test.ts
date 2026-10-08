import { describe, expect, test, vi, beforeEach } from 'vitest';
import { FREE_AI_MODELS } from '@/lib/config';

const mockList = vi.fn();
const mockGetAIClient = vi.fn();

vi.mock('@/lib/genAI/openai/genAI', () => ({
  getAIClient: mockGetAIClient,
}));

describe('fetchModels', () => {
  beforeEach(() => {
    mockList.mockClear();
    mockGetAIClient.mockClear();
  });

  test('Returns models from the list', async () => {
    const mockModels = [{ id: FREE_AI_MODELS[0] }, { id: FREE_AI_MODELS[1] }];
    mockList.mockResolvedValue({ data: mockModels });
    mockGetAIClient.mockReturnValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/openai/fetchModels');
    const result = await fetchModels();

    expect(mockGetAIClient).toHaveBeenCalled();
    expect(result.models).toEqual(mockModels);
    expect(result.nextPageToken).toBeNull();
  });

  test('Filters out models that are not free', async () => {
    mockList.mockResolvedValue({ data: [{ id: 'gpt-4' }, { id: FREE_AI_MODELS[0] }] });
    mockGetAIClient.mockReturnValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/openai/fetchModels');
    const result = await fetchModels();

    expect(result.models).toEqual([{ id: FREE_AI_MODELS[0] }]);
  });

  test('Ignores pageToken parameter', async () => {
    mockList.mockResolvedValue({ data: [] });
    mockGetAIClient.mockReturnValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/openai/fetchModels');
    await fetchModels();

    expect(mockList).toHaveBeenCalledWith();
  });
});
