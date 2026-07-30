import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

const mockOpenAIInstance = {};

function FakeOpenAI() {
  return mockOpenAIInstance;
}

vi.mock('openai', () => ({
  default: FakeOpenAI,
}));

describe('getAIClient', () => {
  const originalEnv = process.env.AI_API_KEY;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env.AI_API_KEY = originalEnv;
  });

  test('Throws when AI_API_KEY is missing', async () => {
    delete process.env.AI_API_KEY;

    const { getAIClient } = await import('@/lib/genAI/genAI');
    expect(() => getAIClient()).toThrow('Missing API key');
  });

  test('Returns an OpenAI instance with the API key', async () => {
    process.env.AI_API_KEY = 'test-key';

    const { getAIClient } = await import('@/lib/genAI/genAI');
    const client = getAIClient();

    expect(client).toBe(mockOpenAIInstance);
  });

  test('Returns same instance on subsequent calls', async () => {
    process.env.AI_API_KEY = 'test-key';

    const { getAIClient } = await import('@/lib/genAI/genAI');
    const first = getAIClient();
    const second = getAIClient();

    expect(first).toBe(second);
  });
});
