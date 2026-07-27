import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockList = vi.fn();
const mockGoogleGenAI = vi.fn();

vi.mock('@/lib/genAI/genAI', () => ({
  googleGenAI: mockGoogleGenAI,
}));

describe('fetchModels', () => {
  beforeEach(() => {
    mockList.mockClear();
    mockGoogleGenAI.mockClear();
  });

  test('Returns models from the pager', async () => {
    const mockModels = [{ name: 'model-a' }, { name: 'model-b' }];
    mockList.mockResolvedValue({
      page: mockModels,
      hasNextPage: vi.fn().mockReturnValue(false),
      params: { config: {} },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    const result = await fetchModels();

    expect(mockGoogleGenAI).toHaveBeenCalled();
    expect(result.models).toEqual(mockModels);
  });

  test('Returns nextPageToken when hasNextPage is true and token exists in params', async () => {
    mockList.mockResolvedValue({
      page: [],
      hasNextPage: vi.fn().mockReturnValue(true),
      params: { config: { pageToken: 'next-token-abc' } },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    const result = await fetchModels();

    expect(result.nextPageToken).toBe('next-token-abc');
  });

  test('Returns null nextPageToken when hasNextPage is false', async () => {
    mockList.mockResolvedValue({
      page: [],
      hasNextPage: vi.fn().mockReturnValue(false),
      params: { config: { pageToken: 'some-token' } },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    const result = await fetchModels();

    expect(result.nextPageToken).toBeNull();
  });

  test('Returns null nextPageToken when hasNextPage is true but token is missing', async () => {
    mockList.mockResolvedValue({
      page: [],
      hasNextPage: vi.fn().mockReturnValue(true),
      params: { config: {} },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    const result = await fetchModels();

    expect(result.nextPageToken).toBeNull();
  });

  test('Passes pageToken to list when provided', async () => {
    mockList.mockResolvedValue({
      page: [],
      hasNextPage: vi.fn().mockReturnValue(false),
      params: { config: {} },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    await fetchModels('cursor-xyz');

    expect(mockList).toHaveBeenCalledWith({
      config: { pageSize: 20, pageToken: 'cursor-xyz' },
    });
  });

  test('Passes undefined pageToken when not provided', async () => {
    mockList.mockResolvedValue({
      page: [],
      hasNextPage: vi.fn().mockReturnValue(false),
      params: { config: {} },
    });

    mockGoogleGenAI.mockResolvedValue({ models: { list: mockList } });

    const { fetchModels } = await import('@/lib/genAI/fetchModels');
    await fetchModels();

    expect(mockList).toHaveBeenCalledWith({
      config: { pageSize: 20, pageToken: undefined },
    });
  });
});
