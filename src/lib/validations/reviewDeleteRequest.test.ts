import { describe, expect, test } from 'vitest';
import { reviewDeleteRequestSchema } from './reviewDeleteRequest';
import { REVIEWS_DELETE_MAX_VALUE, REVIEWS_DELETE_MIN_VALUE } from '@/lib/validations/config';

const VALID_ID = '507f1f77bcf86cd799439011';

describe('reviewDeleteRequestSchema', () => {
  test('Successfully parse valid ids', () => {
    const validation = reviewDeleteRequestSchema.safeParse({ ids: [VALID_ID] });

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual({ ids: [VALID_ID] });
  });

  test('Parse with error if ids are not provided', () => {
    const validation = reviewDeleteRequestSchema.safeParse({});

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if ids array is empty', () => {
    const validation = reviewDeleteRequestSchema.safeParse({ ids: [] });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if id is not a valid ObjectId', () => {
    const validation = reviewDeleteRequestSchema.safeParse({ ids: ['not-an-object-id'] });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if ids count exceeds max value', () => {
    const ids = Array.from({ length: REVIEWS_DELETE_MAX_VALUE + 1 }, () => VALID_ID);
    const validation = reviewDeleteRequestSchema.safeParse({ ids });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if ids count is below min value', () => {
    const ids = Array.from({ length: REVIEWS_DELETE_MIN_VALUE - 1 }, () => VALID_ID);
    const validation = reviewDeleteRequestSchema.safeParse({ ids });

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });
});
