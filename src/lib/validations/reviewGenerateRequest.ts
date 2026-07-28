import { z } from 'zod';
import {
  CODE_SNIPPET_MAX_VALUE,
  CODE_SNIPPET_MIN_VALUE,
  LANGUAGE_MAX_VALUE,
  LANGUAGE_MIN_VALUE,
  MODEL_MAX_VALUE,
  MODEL_MIN_VALUE
} from '@/lib/validations/config';

export const reviewGenerateRequest = z.object({
  language: z.string().min(LANGUAGE_MIN_VALUE).max(LANGUAGE_MAX_VALUE),
  codeSnippet: z.string().min(CODE_SNIPPET_MIN_VALUE).max(CODE_SNIPPET_MAX_VALUE),
  model: z.string().min(MODEL_MIN_VALUE).max(MODEL_MAX_VALUE),
});
