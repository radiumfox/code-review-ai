import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { apiErrorResponse } from './apiErrorResponse';
import { ERROR_CODES, STATUS_CODE_BY_CODE } from '@/lib/errors';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const rateLimit = UPSTASH_URL && UPSTASH_TOKEN
  ? new Ratelimit({
    redis: new Redis({ url: UPSTASH_URL, token: UPSTASH_TOKEN }),
    limiter: Ratelimit.slidingWindow(1, '5 s'),
    analytics: true,
    prefix: 'rate-limit',
  })
  : null;

export const applyRateLimiter = async (
  key: string
): Promise<NextResponse | undefined> => {
  if (!rateLimit) return undefined;
  
  const { success } = await rateLimit.limit(key);
  if (success) return undefined;

  return apiErrorResponse('Too many requests', ERROR_CODES.TOO_MANY_REQUESTS, STATUS_CODE_BY_CODE[ERROR_CODES.TOO_MANY_REQUESTS]);
};