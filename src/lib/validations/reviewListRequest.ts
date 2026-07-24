import { z } from 'zod';
import { REVIEWS_PAGE_MAX_VALUE, REVIEWS_PAGE_MIN_VALUE } from '@/lib/validations/config';

export const reviewListRequestSchema = z.object({
  page: z.number().min(REVIEWS_PAGE_MIN_VALUE).max(REVIEWS_PAGE_MAX_VALUE).default(REVIEWS_PAGE_MIN_VALUE)
});