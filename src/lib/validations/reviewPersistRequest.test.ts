import { describe, expect, test } from 'vitest';
import { type Issue, IssueCategory, IssueSeverity, type ReviewPersistRequest } from '@/lib/types';
import promptTemplate from '@/prompts/code-review-default.json';
import { reviewPersistRequestSchema } from './reviewPersistRequest';
import { CODE_SNIPPET_MAX_VALUE, LANGUAGE_MAX_VALUE, MODEL_MAX_VALUE } from '@/lib/validations/config';

const mockDataTemplate: ReviewPersistRequest = Object.freeze({
  summary: 'Summary',
  issues: undefined,
  language: 'js',
  codeSnippet: 'console.log(\'hello world!\');',
  model: promptTemplate.model,
});

const issueMockDataTemplate: Issue = Object.freeze({
  line: 1,
  message: 'Message about performance suggestion',
  severity: IssueSeverity.Suggestion,
  category: IssueCategory.Performance,
  suggestion: 'Suggestion to improve performance'
});

const createMockData = (params?: Partial<ReviewPersistRequest>) => {
  return {
    ...mockDataTemplate,
    ...params,
  };
};

const createIssueMockData = (params?: Partial<Issue>) => {
  return {
    ...issueMockDataTemplate,
    ...params,
  };
};

describe('reviewPersistRequestSchema', () => {
  test('Successfully parse data that doesn\'t have issues array', () => {
    const data = createMockData();

    const validation = reviewPersistRequestSchema.safeParse(data);
    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test('Successfully parse data that have empty issues array', () => {
    const data = createMockData({ issues: [] });

    const validation = reviewPersistRequestSchema.safeParse(data);
    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test('Successfully parse data that have issues array', () => {
    const data = createMockData({ issues: [issueMockDataTemplate] });

    const validation = reviewPersistRequestSchema.safeParse(data);
    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test.each([
    ['summary', { summary: undefined }],
    ['language', { language: undefined }],
    ['codeSnippet', { codeSnippet: undefined }],
    ['model', { model: undefined }],
  ])('Parse with error if %s is missing', (_, override) => {
    const data = createMockData(override);
    const result = reviewPersistRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  test.each([
    ['issue line', { issues: [createIssueMockData({ line: undefined })] }],
    ['issue severity', { issues: [createIssueMockData({ severity: undefined })] }],
    ['issue category', { issues: [createIssueMockData({ category: undefined })] }],
    ['issue suggestion', { issues: [createIssueMockData({ suggestion: undefined })] }],
    ['issue message', { issues: [createIssueMockData({ message: undefined })] }],
  ])('Parse with error if %s is missing', (_, override) => {
    const data = createMockData(override);
    const result = reviewPersistRequestSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  test('Parse with error if issue line is zero', () => {
    const issueData = createIssueMockData({ line: 0 });
    const data = createMockData({ issues: [issueData] });
    const validation = reviewPersistRequestSchema.safeParse(data);

    expect(validation.success).toBe(false);
    expect(validation.error).toBeTruthy();
  });

  test('Parse with error if language name length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ language: '' });
    const data2 = createMockData({ language: 'x'.repeat(LANGUAGE_MAX_VALUE + 1) });
    const validation1 = reviewPersistRequestSchema.safeParse(data1);
    const validation2 = reviewPersistRequestSchema.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });

  test('Parse with error if codeSnippet length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ codeSnippet: '' });
    const data2 = createMockData({ codeSnippet: 'x'.repeat(CODE_SNIPPET_MAX_VALUE + 1) });
    const validation1 = reviewPersistRequestSchema.safeParse(data1);
    const validation2 = reviewPersistRequestSchema.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });

  test('Parse with error if model name length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ model: '' });
    const data2 = createMockData({ model: 'x'.repeat(MODEL_MAX_VALUE + 1) });
    const validation1 = reviewPersistRequestSchema.safeParse(data1);
    const validation2 = reviewPersistRequestSchema.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });
});

