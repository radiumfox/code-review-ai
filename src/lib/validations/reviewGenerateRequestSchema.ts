import { z } from 'zod';

export const reviewGenerateRequestSchema = z.object({
  language: z.string().min(1),
  codeSnippet: z.string().min(1).max(50_000),
  model: z.string().min(1).max(100).optional(),
});
