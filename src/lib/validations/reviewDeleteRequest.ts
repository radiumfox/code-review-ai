import { z } from 'zod';
import { REVIEWS_DELETE_MAX_VALUE, REVIEWS_DELETE_MIN_VALUE } from '@/lib/validations/config';

export const reviewDeleteRequestSchema = z.object({
  ids: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .min(REVIEWS_DELETE_MIN_VALUE)
    .max(REVIEWS_DELETE_MAX_VALUE)
});
