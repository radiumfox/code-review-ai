import { describe, expect, test } from 'vitest';
import { reviewListRequestSchema } from './reviewListRequest';
import { REVIEWS_PAGE_MAX_VALUE, REVIEWS_PAGE_MIN_VALUE } from '@/lib/validations/config';

describe('reviewListRequestSchema', () => {
  test('Successfully parse valid page number', () => {
    const validation = reviewListRequestSchema.safeParse({ page: 1 });

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual({ page: 1 });
  });

  test('Apply default page value when page is not provided', () => {
    const validation = reviewListRequestSchema.safeParse({});

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual({ page: REVIEWS_PAGE_MIN_VALUE });
  });

  test('Parse with error if page is negative', () => {
    const validation = reviewListRequestSchema.safeParse({ page: -1 });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if page exceeds max value', () => {
    const validation = reviewListRequestSchema.safeParse({ page: REVIEWS_PAGE_MAX_VALUE + 1 });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });
});
