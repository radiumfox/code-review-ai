import { z } from 'zod';

export const reviewListRequestSchema = z.object({
  page: z.number().default(0)
});