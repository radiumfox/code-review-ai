import { z } from 'zod';
import {
  CODE_SNIPPET_MAX_VALUE,
  CODE_SNIPPET_MIN_VALUE,
  LANGUAGE_MAX_VALUE,
  LANGUAGE_MIN_VALUE
} from '@/lib/validations/config';
import { FREE_AI_MODELS } from '@/lib/config';

export const reviewGenerateRequest = z.object({
  language: z.string().min(LANGUAGE_MIN_VALUE).max(LANGUAGE_MAX_VALUE),
  codeSnippet: z.string().min(CODE_SNIPPET_MIN_VALUE).max(CODE_SNIPPET_MAX_VALUE),
  model: z.literal(FREE_AI_MODELS),
});
