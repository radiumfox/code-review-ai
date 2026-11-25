import { describe, expect, test } from 'vitest';
import { IssueCategory, IssueSeverity } from '@/lib/types';
import { aiReviewResponseSchema } from './aiReviewResponse';

const validResponse = {
  summary: 'Looks good',
  issues: [{
    line: 1,
    severity: IssueSeverity.Warning,
    category: IssueCategory.Style,
    message: 'Missing semicolon',
    suggestion: 'Add a semicolon',
  }],
};

describe('aiReviewResponseSchema', () => {
  test('Accepts a valid AI review response', () => {
    const validation = aiReviewResponseSchema.safeParse(validResponse);

    expect(validation.success).toBe(true);
  });

  test('Trims text fields', () => {
    const validation = aiReviewResponseSchema.safeParse({
      summary: '  Looks good  ',
      issues: [{
        ...validResponse.issues[0],
        message: '  Missing semicolon  ',
      }],
    });

    expect(validation.success).toBe(true);
    if (validation.success) {
      expect(validation.data.summary).toBe('Looks good');
      expect(validation.data.issues[0].message).toBe('Missing semicolon');
    }
  });

  test.each([
    ['summary', { summary: '   ' }],
    ['message', { issues: [{ ...validResponse.issues[0], message: '   ' }] }],
    ['suggestion', { issues: [{ ...validResponse.issues[0], suggestion: '   ' }] }],
  ])('Rejects whitespace-only %s', (_, override) => {
    expect(aiReviewResponseSchema.safeParse({ ...validResponse, ...override }).success).toBe(false);
  });

  test.each([
    ['zero line', 0],
    ['fractional line', 1.5],
  ])('Rejects %s', (_, line) => {
    expect(aiReviewResponseSchema.safeParse({
      ...validResponse,
      issues: [{ ...validResponse.issues[0], line }],
    }).success).toBe(false);
  });

  test.each([
    ['severity', { severity: 'critical' }],
    ['category', { category: 'unknown' }],
  ])('Rejects invalid %s', (_, override) => {
    expect(aiReviewResponseSchema.safeParse({
      ...validResponse,
      issues: [{ ...validResponse.issues[0], ...override }],
    }).success).toBe(false);
  });

  test('Rejects extra root field', () => {
    expect(aiReviewResponseSchema.safeParse({ ...validResponse, model: 'gpt-4' }).success).toBe(false);
  });

  test('Rejects extra issue field', () => {
    expect(aiReviewResponseSchema.safeParse({
      ...validResponse,
      issues: [{ ...validResponse.issues[0], confidence: 1 }],
    }).success).toBe(false);
  });

  test('Rejects missing issues', () => {
    expect(aiReviewResponseSchema.safeParse({ summary: 'Looks good' }).success).toBe(false);
  });
});
