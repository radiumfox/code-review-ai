import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockList = vi.fn();
const mockGetAIClient = vi.fn();

vi.mock('@/lib/genAI/genAI', () => ({
  getAIClient: mockGetAIClient,
}));

describe('fetchModels', () => {
  beforeEach(() => {
    mockList.mockClear();
    mockGetAIClient.mockClear();
  });

  test('Returns models from the list', async () => {
    const mockModels = [{ id: 'gpt-4' }, { id: 'gpt-3.5-turbo' }];
    mockList.mockResolvedValue({ data: mockModels });
    mockGetAIClient.mockReturnValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    const result = await fetchModels();

    expect(mockGetAIClient).toHaveBeenCalled();
    expect(result.models).toEqual(mockModels);
    expect(result.nextPageToken).toBeNull();
  });

  test('Ignores pageToken parameter', async () => {
    mockList.mockResolvedValue({ data: [] });
    mockGetAIClient.mockReturnValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    await fetchModels();

    expect(mockList).toHaveBeenCalledWith();
  });
});
