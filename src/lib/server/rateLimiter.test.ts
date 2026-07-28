import { describe, expect, test, vi, beforeEach } from 'vitest';

const mockLimit = vi.fn();
const RATE_LIMITER_KEY = 'user123.url';
const RATE_LIMIT_EXCEEDED_STATUS = 429;
const testUpstashUrl = 'https://test.upstash.io';
const testUpstashToken = 'test-token';

vi.mock('@upstash/ratelimit', () => {
  class Ratelimit {
    limit = mockLimit;
    static slidingWindow = vi.fn();
  }
  return { Ratelimit };
});

vi.mock('@upstash/redis', () => ({
  Redis: vi.fn(),
}));

beforeEach(() => {
  vi.resetModules();
  mockLimit.mockReset();
});

describe('rateLimiter', () => {
  test('Returns undefined when Redis env vars are not set', async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { applyRateLimiter } = await import('./rateLimiter');
    const result = await applyRateLimiter(RATE_LIMITER_KEY);

    expect(result).toBeUndefined();
  });

  test('Returns undefined when rate limit allows request', async () => {
    process.env.UPSTASH_REDIS_REST_URL = testUpstashUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = testUpstashToken;
    mockLimit.mockResolvedValue({ success: true });

    const { applyRateLimiter } = await import('./rateLimiter');
    const result = await applyRateLimiter(RATE_LIMITER_KEY);

    expect(result).toBeUndefined();
    expect(mockLimit).toHaveBeenCalledWith(RATE_LIMITER_KEY);
  });

  test(`Returns ${RATE_LIMIT_EXCEEDED_STATUS} response when rate limit is exceeded`, async () => {
    process.env.UPSTASH_REDIS_REST_URL = testUpstashUrl;
    process.env.UPSTASH_REDIS_REST_TOKEN = testUpstashToken;
    mockLimit.mockResolvedValue({ success: false });

    const { applyRateLimiter } = await import('./rateLimiter');
    const result = await applyRateLimiter(RATE_LIMITER_KEY);

    expect(result).toBeDefined();
    expect(result?.status).toBe(RATE_LIMIT_EXCEEDED_STATUS);

    const body = await result?.json();
    expect(body).toEqual({ error: 'Too many requests' });
  });
});
