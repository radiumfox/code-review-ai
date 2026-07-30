import { describe, expect, test, vi, beforeEach } from 'vitest';
import { AI_MODEL } from './config';

const mockCreate = vi.fn();
const mockGetAIClient = vi.fn();

vi.mock('@/lib/genAI/genAI', () => ({
  getAIClient: mockGetAIClient,
}));

describe('generateContent', () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockGetAIClient.mockClear();
  });

  test('Calls chat.completions.create and returns choices', async () => {
    const mockChoices = [{ message: { content: '{"result":true}' } }];
    mockCreate.mockResolvedValue({ choices: mockChoices });
    mockGetAIClient.mockReturnValue({ chat: { completions: { create: mockCreate } } });

    const { generateContent } = await import('@/lib/genAI/generateContent');
    const result = await generateContent({ contents: 'test prompt', model: AI_MODEL });

    expect(mockGetAIClient).toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith({
      model: AI_MODEL,
      messages: [{ role: 'user', content: 'test prompt' }],
      response_format: { type: 'json_object' },
    });

    expect(result).toEqual(mockChoices);
  });
});
