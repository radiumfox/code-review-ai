import { describe, expect, test, vi, beforeEach } from 'vitest';
import { DEFAULT_MODEL } from '@/lib/config';

const mockGenerateContentFn = vi.fn();
const mockGoogleGenAI = vi.fn();

vi.mock('@/lib/genAI/genAI', () => ({
  googleGenAI: mockGoogleGenAI,
}));

describe('generateContent', () => {
  beforeEach(() => {
    mockGenerateContentFn.mockClear();
    mockGoogleGenAI.mockClear();
  });

  test('Calls googleGenAI and returns candidates', async () => {
    const mockCandidates = [{ content: { parts: [{ text: '{"result":true}' }] } }];
    mockGenerateContentFn.mockResolvedValue({ candidates: mockCandidates });
    mockGoogleGenAI.mockResolvedValue({ models: { generateContent: mockGenerateContentFn } });

    const { generateContent } = await import('@/lib/genAI/generateContent');
    const result = await generateContent({ contents: 'test prompt', model: DEFAULT_MODEL });

    expect(mockGoogleGenAI).toHaveBeenCalled();
    expect(mockGenerateContentFn).toHaveBeenCalledWith({
      model: DEFAULT_MODEL,
      contents: 'test prompt',
      config: { responseMimeType: 'application/json' },
    });

    expect(result).toEqual(mockCandidates);
  });

  test('Passes contents as ContentListUnion', async () => {
    mockGenerateContentFn.mockResolvedValue({ candidates: [] });
    mockGoogleGenAI.mockResolvedValue({ models: { generateContent: mockGenerateContentFn } });

    const { generateContent } = await import('@/lib/genAI/generateContent');

    const contents = ['part1', 'part2'];
    await generateContent({ contents, model: DEFAULT_MODEL });

    expect(mockGenerateContentFn).toHaveBeenCalledWith(
      expect.objectContaining({ contents })
    );
  });
});
