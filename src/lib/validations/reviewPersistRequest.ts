import { z } from 'zod';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import {
  CODE_SNIPPET_MAX_VALUE,
  CODE_SNIPPET_MIN_VALUE,
  LANGUAGE_MAX_VALUE,
  LANGUAGE_MIN_VALUE,
  MODEL_MAX_VALUE,
  MODEL_MIN_VALUE
} from '@/lib/validations/config';

export const reviewPersistRequestSchema = z.object({
  language: z.string().min(LANGUAGE_MIN_VALUE).max(LANGUAGE_MAX_VALUE),
  codeSnippet: z.string().min(CODE_SNIPPET_MIN_VALUE).max(CODE_SNIPPET_MAX_VALUE),
  model: z.string().min(MODEL_MIN_VALUE).max(MODEL_MAX_VALUE),
  summary: z.string().min(1),
  issues: z.array(
    z.object({
      line: z.number().min(1),
      severity: z.enum(IssueSeverity),
      category: z.enum(IssueCategory),
      message: z.string().min(1),
      suggestion: z.string().min(1),
    })
  ).optional()
});