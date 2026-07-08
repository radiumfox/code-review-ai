import { z } from 'zod';

export const generateSchema = z.object({
  model: z.string().min(1),
  contents: z.string().min(1),
});
