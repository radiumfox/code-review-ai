import { z } from 'zod';
import { IssueCategory, IssueSeverity, type Issue } from '@/lib/types';
import { sanitizeCodeSnippet } from './sanitizeCodeSnippet';
import { clampLineNumber } from '@/lib/validations/helpers/clampLineNumber';

const rawIssueSchema = z.object({
  line: z.coerce.number().finite(),
  severity: z.enum(IssueSeverity),
  category: z.enum(IssueCategory),
  message: z.string().min(1),
  suggestion: z.string().min(1),
});

interface SanitizeIssuesResult {
    issues: Issue[];
    droppedCount: number;
    clampedCount: number;
}

const countSnippetLines = function (codeSnippet: string): number {
  return sanitizeCodeSnippet(codeSnippet).split('\n').length;
};

export const sanitizeIssues = function (rawIssues: unknown, codeSnippet: string): SanitizeIssuesResult {
  const maxLine = countSnippetLines(codeSnippet);

  if (!Array.isArray(rawIssues)) {
    return { issues: [], droppedCount: 0, clampedCount: 0 };
  }

  const issues: Issue[] = [];
  let droppedCount = 0;
  let clampedCount = 0;

  for (const rawIssue of rawIssues) {
    const parsed = rawIssueSchema.safeParse(rawIssue);

    if (!parsed.success) {
      droppedCount += 1;
      continue;
    }

    const line = clampLineNumber(parsed.data.line, maxLine);
    if (line !== parsed.data.line) clampedCount += 1;

    issues.push({ ...parsed.data, line });
  }

  return { issues, droppedCount, clampedCount };
};
