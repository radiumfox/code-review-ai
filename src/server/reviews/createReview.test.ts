import { describe, expect, test, vi, beforeEach } from 'vitest';
import { DEFAULT_LANGUAGE } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/openai/config';

const mockGenerateContent = vi.fn();
const mockReviewCreate = vi.fn();

vi.mock('@/lib/genAI/openai', () => ({
  generateContent: mockGenerateContent,
}));

vi.mock('@/models/Review', () => ({
  ReviewModel: { create: mockReviewCreate },
}));

describe('createReview', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
    mockReviewCreate.mockReset();
  });

  test('Persists review with validated data from AI response', async () => {
    const aiPayload = {
      summary: 'Clean code with minor issues',
      issues: [{
        line: 1,
        severity: 'warning',
        category: 'style',
        message: 'Missing semicolon',
        suggestion: 'Add semicolon at end of line',
      }],
    };

    mockGenerateContent.mockResolvedValue([{
      message: { content: JSON.stringify(aiPayload) },
    }]);

    const created = { _id: 'rev-1', userId: 'user-1', ...aiPayload, language: DEFAULT_LANGUAGE, codeSnippet: 'let x = 1', model: AI_MODEL };

    mockReviewCreate.mockResolvedValue(created);

    const { createReview } = await import('@/server/reviews/createReview');
    const result = await createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: AI_MODEL,
    });

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockReviewCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: AI_MODEL,
      summary: 'Clean code with minor issues',
      issues: aiPayload.issues,
    }));
    expect(result).toEqual(created);
  });

  test('Clamps an out-of-range AI issue line to the snippet length and persists the review', async () => {
    const codeSnippet = 'const a = 1;\nconst b = 2;\nconst c = 3;';
    const aiPayload = {
      summary: 'Review with a hallucinated line number',
      issues: [{
        line: 9999,
        severity: 'warning',
        category: 'style',
        message: 'Out-of-range line',
        suggestion: 'Clamp the line to the last line',
      }],
    };

    mockGenerateContent.mockResolvedValue([{
      message: { content: JSON.stringify(aiPayload) },
    }]);

    const clampedIssues = [{ ...aiPayload.issues[0], line: 3 }];

    const created = {
      _id: 'rev-2',
      userId: 'user-1',
      ...aiPayload,
      issues: clampedIssues,
      language: DEFAULT_LANGUAGE,
      codeSnippet,
      model: AI_MODEL,
    };

    mockReviewCreate.mockResolvedValue(created);

    const { createReview } = await import('@/server/reviews/createReview');
    const result = await createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet,
      model: AI_MODEL,
    });

    expect(mockReviewCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      codeSnippet,
      issues: clampedIssues,
    }));

    expect(result).toEqual(created);
  });

  test('Throws when AI returns no candidates', async () => {
    mockGenerateContent.mockResolvedValue(undefined);

    const { createReview } = await import('@/server/reviews/createReview');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: AI_MODEL,
    })).rejects.toThrow('AI returned no candidates');
  });

  test('Throws when AI returns empty candidates array', async () => {
    mockGenerateContent.mockResolvedValue([]);

    const { createReview } = await import('@/server/reviews/createReview');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: AI_MODEL,
    })).rejects.toThrow();
  });

  test('Throws when AI returns invalid JSON', async () => {
    mockGenerateContent.mockResolvedValue([{
      message: { content: 'not valid json' },
    }]);

    const { createReview } = await import('@/server/reviews/createReview');

    await expect(createReview('user-1', {
      language: DEFAULT_LANGUAGE,
      codeSnippet: 'let x = 1',
      model: AI_MODEL,
    })).rejects.toThrow('AI returned invalid JSON');
  });

  test('Wraps generateContent errors as aiError matching ApiError contract', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network timeout'));

    const { createReview } = await import('@/server/reviews/createReview');
    const { isApiError, ERROR_CODES, STATUS_CODE_BY_CODE } = await import('@/lib/api/errors');

    try {
      await createReview('user-1', {
        language: DEFAULT_LANGUAGE,
        codeSnippet: 'let x = 1',
        model: AI_MODEL,
      });

      expect.unreachable('Should have thrown');
    } catch (error) {
      if (isApiError(error)) {
        expect(error.message).toBe('Network timeout');
        expect(error.code).toBe(ERROR_CODES.AI);
        expect(error.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
      } else {
        expect.unreachable('Expected an ApiError');
      }
    }
  });
});
