import { describe, expect, test } from 'vitest';
import { type ReviewGenerateRequest } from '@/lib/types';
import { reviewGenerateRequest } from './reviewGenerateRequest';
import {
  CODE_SNIPPET_MAX_VALUE,
  LANGUAGE_MAX_VALUE,
  MODEL_MAX_VALUE,
} from '@/lib/validations/config';
import promptTemplate from '@/prompts/code-review-default.json';

const mockDataTemplate: ReviewGenerateRequest = Object.freeze({
  language: 'js',
  codeSnippet: 'console.log(\'hello world!\');',
  model: promptTemplate.model,
});

const createMockData = (params?: Partial<ReviewGenerateRequest>) => {
  return {
    ...mockDataTemplate,
    ...params,
  };
};

describe('reviewGenerateRequest', () => {
  test('Successfully parse valid data', () => {
    const data = createMockData();
    const validation = reviewGenerateRequest.safeParse(data);

    expect(validation.success).toBe(true);
    expect(validation.data).toEqual(data);
  });

  test.each([
    ['language', { language: undefined }],
    ['codeSnippet', { codeSnippet: undefined }],
    ['model', { model: undefined }],
  ])('Parse with error if %s is missing', (_, override) => {
    const data = createMockData(override);
    const result = reviewGenerateRequest.safeParse(data);

    expect(result.success).toBe(false);
  });

  test('Parse with error if language length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ language: '' });
    const data2 = createMockData({ language: 'x'.repeat(LANGUAGE_MAX_VALUE + 1) });
    const validation1 = reviewGenerateRequest.safeParse(data1);
    const validation2 = reviewGenerateRequest.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });

  test('Parse with error if codeSnippet length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ codeSnippet: '' });
    const data2 = createMockData({ codeSnippet: 'x'.repeat(CODE_SNIPPET_MAX_VALUE + 1) });
    const validation1 = reviewGenerateRequest.safeParse(data1);
    const validation2 = reviewGenerateRequest.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });

  test('Parse with error if model name length doesn\'t satisfy constraints', () => {
    const data1 = createMockData({ model: '' });
    const data2 = createMockData({ model: 'x'.repeat(MODEL_MAX_VALUE + 1) });
    const validation1 = reviewGenerateRequest.safeParse(data1);
    const validation2 = reviewGenerateRequest.safeParse(data2);

    expect(validation1.success).toBe(false);
    expect(validation1.error).toBeTruthy();
    expect(validation2.success).toBe(false);
    expect(validation2.error).toBeTruthy();
  });
});
