import { describe, expect, test } from 'vitest';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import { sanitizeIssues } from './sanitizeIssues';

const CODE_SNIPPET = 'a\nb\nc';

const createIssue = (line: unknown) => ({
  line,
  severity: IssueSeverity.Warning,
  category: IssueCategory.Style,
  message: 'Message',
  suggestion: 'Suggestion',
});

describe('sanitizeIssues', () => {
  test('Clamps issue lines into the valid range', () => {
    const result = sanitizeIssues(
      [createIssue(0), createIssue(2.9), createIssue(999)],
      CODE_SNIPPET,
    );

    expect(result.issues.map((issue) => issue.line)).toEqual([1, 2, 3]);
    expect(result.clampedCount).toBe(3);
    expect(result.droppedCount).toBe(0);
  });

  test('Drops structurally invalid issues and keeps valid ones', () => {
    const result = sanitizeIssues([
      createIssue('not-a-number'),
      createIssue(Number.NaN),
      { ...createIssue(1), severity: 'invalid' },
      createIssue(2),
      createIssue(999),
    ], CODE_SNIPPET);

    expect(result.issues.map((issue) => issue.line)).toEqual([2, 3]);
    expect(result.droppedCount).toBe(3);
    expect(result.clampedCount).toBe(1);
  });

  test('Counts CRLF snippets correctly when clamping', () => {
    const result = sanitizeIssues([createIssue(999)], 'a\r\nb\r\nc');

    expect(result.issues[0].line).toBe(3);
  });
});
