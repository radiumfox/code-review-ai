import { z } from 'zod';
import { IssueCategory, IssueSeverity, type Issue } from '@/lib/types';
import {
  ISSUE_LINE_MIN_VALUE,
  ISSUE_MESSAGE_MIN_VALUE,
  ISSUE_SUGGESTION_MIN_VALUE,
  SUMMARY_MIN_VALUE,
} from '@/lib/validations/config';
import type { AIReviewResponse } from './types';

const aiReviewIssueSchema = z.object({
  line: z.number().int().min(ISSUE_LINE_MIN_VALUE),
  severity: z.enum(IssueSeverity),
  category: z.enum(IssueCategory),
  message: z.string().trim().min(ISSUE_MESSAGE_MIN_VALUE),
  suggestion: z.string().trim().min(ISSUE_SUGGESTION_MIN_VALUE),
}).strict() satisfies z.ZodType<Issue>;

export const aiReviewResponseSchema = z.object({
  summary: z.string().trim().min(SUMMARY_MIN_VALUE),
  issues: z.array(aiReviewIssueSchema),
}).strict() satisfies z.ZodType<AIReviewResponse>;
