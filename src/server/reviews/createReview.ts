import { generateContent } from '@/lib/genAI/openai';
import { reviewPersistRequestSchema } from '@/lib/validations/reviewPersistRequest';
import { ReviewModel } from '@/models/Review';
import { ReviewGenerateRequest, ReviewPersistRequest, type AllowedAIModel } from '@/lib/types';
import { ERROR_CODES, STATUS_CODE_BY_CODE, apiError, isApiError } from '@/lib/api/errors';
import { buildPrompt } from './helpers/buildPrompt';
import { aiReviewResponseSchema } from './aiReviewResponse';
import type { AIReviewResponse } from './types';

function aiError(message: string) {
  return apiError(message, ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
}

function parseAIResponse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw aiError('AI returned invalid JSON');
  }
}

function validateAIResponse(data: unknown): AIReviewResponse {
  const aiReview = aiReviewResponseSchema.safeParse(data);

  if (!aiReview.success) {
    throw aiError('AI returned invalid review structure');
  }

  return aiReview.data;
}

async function callAI(prompt: string, model: AllowedAIModel | undefined): Promise<AIReviewResponse> {
  if (!model) {
    throw new Error('Model is missing');
  }

  try {
    const choices = await generateContent({ contents: prompt, model });

    if (!choices) {
      throw aiError('AI returned no candidates');
    }

    const text = choices[0]?.message?.content ?? '';
    return validateAIResponse(parseAIResponse(text));
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'AI generation failed';
    throw aiError(message);
  }
}

function validateReviewData(data: unknown): ReviewPersistRequest {
  const reviewData = reviewPersistRequestSchema.safeParse(data);

  if (!reviewData.success) {
    throw aiError('AI returned invalid review structure');
  }

  return reviewData.data;
}

async function persistReview(userId: string, params: ReviewPersistRequest) {
  return await ReviewModel.create({ userId, ...params });
}

export async function createReview(userId: string, params: ReviewGenerateRequest) {
  const prompt = buildPrompt(params);
  const aiReview = await callAI(prompt, params.model);
  const validated = validateReviewData({ ...params, ...aiReview });

  return persistReview(userId, validated);
}
