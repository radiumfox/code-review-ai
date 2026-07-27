import { describe, expect, test, vi, beforeEach } from 'vitest';
import { DEFAULT_LANGUAGE, DEFAULT_MODEL } from '@/lib/config';

const mockGenerateContent = vi.fn();
const mockReviewCreate = vi.fn();

vi.mock('@/lib/genAI', () => ({
  generateContent: mockGenerateContent,
}));

vi.mock('@/models/Review', () => ({
  ReviewModel: { create: mockReviewCreate },
}));

describe('isAiError', () => {
  test('Returns true for objects with success, message, and statusCode', async () => {
    const { isAiError } = await import('@/lib/createReviewService/createReviewService');

    expect(isAiError({
      success: false,
      statusCode: 502,
      message: 'AI returned invalid JSON',
    })).toBe(true);
  });

  test('Returns false for regular Error', async () => {
    const { isAiError } = await import('@/lib/createReviewService/createReviewService');

    expect(isAiError(new Error('test'))).toBe(false);
  });

  test('Returns false for null', async () => {
    const { isAiError } = await import('@/lib/createReviewService/createReviewService');

    expect(isAiError(null)).toBe(false);
  });

  test('Returns false for undefined', async () => {
    const { isAiError } = await import('@/lib/createReviewService/createReviewService');

    expect(isAiError(undefined)).toBe(false);
  });

  test('Returns false for objects missing required fields', async () => {
    const { isAiError } = await import('@/lib/createReviewService/createReviewService');

    expect(isAiError({ success: false, message: 'err' })).toBe(false);
    expect(isAiError({ success: false, statusCode: 502 })).toBe(false);
    expect(isAiError({ statusCode: 502, message: 'err' })).toBe(false);
  });
});

describe('createReview', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
    mockReviewCreate.mockReset();
  });

  test('Persists review with validated data from AI response', async () => {
    const aiPayload = {
      summary: 'Clean code with minor issues',
      issues: [{
        line: 3,
        severity: 'warning',
        category: 'style',
        message: 'Missing semicolon',
        suggestion: 'Add semicolon at end of line',
      }],
    };

    mockGenerateContent.mockResolvedValue([{
      content: { parts: [{ text: JSON.stringify(aiPayload) }] },
    }]);

    const created = { _id: 'rev-1', userId: 'user-1', ...aiPayload, language: DEFAULT_LANGUAGE, codeSnippet: 'let x = 1', model: DEFAULT_MODEL };

    mockReviewCreate.mockResolvedValue(created);

    const { createReview } = await import('@/lib/createReviewService/createReviewService');
    const result = await createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: DEFAULT_MODEL,
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockReviewCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: DEFAULT_MODEL,
      summary: 'Clean code with minor issues',
      issues: aiPayload.issues,
    }));
    expect(result).toEqual(created);
  });

  test('Throws when AI returns no candidates', async () => {
    mockGenerateContent.mockResolvedValue(undefined);

    const { createReview } = await import('@/lib/createReviewService/createReviewService');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: DEFAULT_MODEL,
    })).rejects.toThrow('AI returned no candidates');
  });

  test('Throws when AI returns empty candidates array', async () => {
    mockGenerateContent.mockResolvedValue([]);

    const { createReview } = await import('@/lib/createReviewService/createReviewService');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: DEFAULT_MODEL,
    })).rejects.toThrow();
  });

  test('Throws when AI returns invalid JSON', async () => {
    mockGenerateContent.mockResolvedValue([{
      content: { parts: [{ text: 'not valid json' }] },
    }]);

    const { createReview } = await import('@/lib/createReviewService/createReviewService');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: DEFAULT_MODEL,
    })).rejects.toThrow('AI returned invalid JSON');
  });

  test('Wraps generateContent errors as aiError', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network timeout'));

    const { createReview, isAiError } = await import('@/lib/createReviewService/createReviewService');

    try {
      await createReview('user-1', {
        language: DEFAULT_LANGUAGE,
        codeSnippet: 'let x = 1',
        model: DEFAULT_MODEL,
      });
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(isAiError(error)).toBe(true);
    }
  });

  test('Uses default model from prompt template when not specified', async () => {
    mockGenerateContent.mockResolvedValue([{
      content: { parts: [{ text: JSON.stringify({ summary: 'ok', issues: [] }) }] },
    }]);
    mockReviewCreate.mockResolvedValue({});

    const { createReview } = await import('@/lib/createReviewService/createReviewService');
    await createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'console.log("hi")',
      model: DEFAULT_MODEL,
    });

    const callArgs = mockGenerateContent.mock.calls[0][0];
    expect(callArgs.model).toBe(DEFAULT_MODEL);
    expect(callArgs.contents).toContain(DEFAULT_LANGUAGE);
    expect(callArgs.contents).toContain('console.log("hi")');
  });
});
