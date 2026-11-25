import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ERROR_CODES, STATUS_CODE_BY_CODE, isApiError } from '@/lib/api/errors';
import { DEFAULT_LANGUAGE } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/openai/config';

const mockGenerateContent = vi.fn();
const mockReviewCreate = vi.fn();

const reviewRequest = {
  language: DEFAULT_LANGUAGE,
  codeSnippet: 'let x = 1',
  model: AI_MODEL,
};

function createIssuePayload(line: number) {
  return {
    summary: 'Minor issue',
    issues: [{
      line,
      severity: 'warning',
      category: 'style',
      message: 'Missing semicolon',
      suggestion: 'Add semicolon at end of line',
    }],
  };
}

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
    const aiPayload = createIssuePayload(1);

    mockGenerateContent.mockResolvedValue([{
      message: { content: JSON.stringify(aiPayload) },
    }]);

    const created = { _id: 'rev-1', userId: 'user-1', ...aiPayload, ...reviewRequest };
    mockReviewCreate.mockResolvedValue(created);

    const { createReview } = await import('@/server/reviews/createReview');
    const result = await createReview('user-1', reviewRequest);

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockReviewCreate).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      ...reviewRequest,
      summary: aiPayload.summary,
      issues: aiPayload.issues,
    }));
    expect(result).toEqual(created);
  });

  test.each([
    {
      name: 'invalid JSON',
      response: [{ message: { content: 'not valid json' } }],
    },
    {
      name: 'out-of-range issue line',
      response: [{ message: { content: JSON.stringify(createIssuePayload(2)) } }],
    },
  ])('Retries $name once with the same prompt', async ({ response }) => {
    mockGenerateContent
      .mockResolvedValueOnce(response)
      .mockResolvedValueOnce([{ message: { content: JSON.stringify({ summary: 'Clean code', issues: [] }) } }]);

    mockReviewCreate.mockResolvedValue({ _id: 'rev-1' });

    const { createReview } = await import('@/server/reviews/createReview');
    await createReview('user-1', reviewRequest);

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent.mock.calls[0]).toEqual(mockGenerateContent.mock.calls[1]);
    expect(mockReviewCreate).toHaveBeenCalledTimes(1);
  });

  test.each([
    {
      name: 'invalid review structure',
      payload: { summary: '', issues: [] },
      message: 'AI returned invalid review structure',
    },
    {
      name: 'out-of-range issue line',
      payload: createIssuePayload(2),
      message: 'AI returned issue line outside snippet',
    },
  ])('Throws aiError and does not persist when AI returns $name twice', async ({ payload, message }) => {
    mockGenerateContent.mockResolvedValue([{
      message: { content: JSON.stringify(payload) },
    }]);

    const { createReview } = await import('@/server/reviews/createReview');

    try {
      await createReview('user-1', reviewRequest);
      expect.unreachable('Should have thrown');
    } catch (error) {
      if (isApiError(error)) {
        expect(error.message).toBe(message);
        expect(error.code).toBe(ERROR_CODES.AI);
        expect(error.statusCode).toBe(STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
      } else {
        expect.unreachable('Expected an ApiError');
      }
    }

    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockReviewCreate).not.toHaveBeenCalled();
  });

  test('Wraps generateContent errors as aiError and does not retry', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network timeout'));

    const { createReview } = await import('@/server/reviews/createReview');

    try {
      await createReview('user-1', reviewRequest);
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

    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });
});
