import { z } from 'zod';
import { FREE_AI_MODELS } from '@/lib/config';

export const userUpdateRequest = z.object({
  aiModel: z.enum(FREE_AI_MODELS).nullable(),
})
  .partial()
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one updatable field is required',
  });