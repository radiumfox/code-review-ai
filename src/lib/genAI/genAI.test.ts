import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

class MockGoogleGenAI {
  static instances: MockGoogleGenAI[] = [];

  constructor(public init: { apiKey: string }) {
    MockGoogleGenAI.instances.push(this);
  }
}

vi.mock('@google/genai', () => ({
  GoogleGenAI: MockGoogleGenAI,
}));

describe('googleGenAI', () => {
  const originalEnv = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    vi.resetModules();
    MockGoogleGenAI.instances = [];
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = originalEnv;
  });

  test('Throws when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const { googleGenAI } = await import('@/lib/genAI/genAI');

    await expect(googleGenAI()).rejects.toThrow('Missing API key environment variable');
  });

  test('Returns a GoogleGenAI instance with the API key', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const { googleGenAI } = await import('@/lib/genAI/genAI');
    const client = await googleGenAI();

    expect(MockGoogleGenAI.instances).toHaveLength(1);
    expect(client).toBeInstanceOf(MockGoogleGenAI);
    expect(MockGoogleGenAI.instances[0].init).toEqual({ apiKey: 'test-key' });
  });

  test('Caches and returns same instance on subsequent calls', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const { googleGenAI } = await import('@/lib/genAI/genAI');
    const first = await googleGenAI();
    const second = await googleGenAI();

    expect(first).toBe(second);
    expect(MockGoogleGenAI.instances).toHaveLength(1);
  });
});
