import { z } from 'zod';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import {
  CODE_SNIPPET_MAX_VALUE,
  CODE_SNIPPET_MIN_VALUE,
  LANGUAGE_MAX_VALUE,
  LANGUAGE_MIN_VALUE,
  SUMMARY_MIN_VALUE,
  ISSUE_LINE_MIN_VALUE,
  ISSUE_MESSAGE_MIN_VALUE,
  ISSUE_SUGGESTION_MIN_VALUE
} from '@/lib/validations/config';
import { FREE_AI_MODELS } from '@/lib/config';

export const reviewPersistRequestSchema = z.object({
  language: z.string().min(LANGUAGE_MIN_VALUE).max(LANGUAGE_MAX_VALUE),
  codeSnippet: z.string().min(CODE_SNIPPET_MIN_VALUE).max(CODE_SNIPPET_MAX_VALUE),
  model: z.literal(FREE_AI_MODELS),
  summary: z.string().min(SUMMARY_MIN_VALUE),
  issues: z.array(
    z.object({
      line: z.number().min(ISSUE_LINE_MIN_VALUE),
      severity: z.enum(IssueSeverity),
      category: z.enum(IssueCategory),
      message: z.string().min(ISSUE_MESSAGE_MIN_VALUE),
      suggestion: z.string().min(ISSUE_SUGGESTION_MIN_VALUE),
    })
  ).optional()
});