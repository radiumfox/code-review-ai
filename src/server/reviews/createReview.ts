import { generateContent } from '@/lib/genAI/openai';
import { reviewPersistRequestSchema } from '@/lib/validations/reviewPersistRequest';
import { ReviewModel } from '@/models/Review';
import { ReviewGenerateRequest, ReviewPersistRequest } from '@/lib/types';
import { ERROR_CODES, STATUS_CODE_BY_CODE, apiError } from '@/lib/api/errors';
import { buildPrompt } from './helpers/buildPrompt';

import { AIChoice } from '@/lib/genAI/openai/types';


async function callAI(prompt: string, model?: string) {
  if(!model) {
    throw new Error('Model is missing');
  }

  try {
    return await generateContent({ contents: prompt, model: model });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI generation failed';
    throw apiError(message, ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
  }
}

function extractText(choices: AIChoice[] | undefined): string | null {
  return choices?.[0]?.message?.content ?? null;
}

function parseAIResponse(aiResponse: AIChoice[]) {
  const text = extractText(aiResponse) ?? '';

  try {
    return JSON.parse(text);
  } catch {
    throw apiError('AI returned invalid JSON', ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
  }
}

function validateReviewData(data: unknown) {
  const reviewData = reviewPersistRequestSchema.safeParse(data);

  if(!reviewData.success) {
    throw reviewData.error;
  }

  return reviewData.data;
}

async function persistReview(userId: string, params: ReviewPersistRequest) {
  return await ReviewModel.create({ userId, ...params });
}

export async function createReview(userId: string, params: ReviewGenerateRequest) {
  const prompt = buildPrompt(params);

  const aiResponse = await callAI(prompt, params.model);

  if(!aiResponse) {
    throw apiError('AI returned no candidates', ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
  }

  const reviewData = parseAIResponse(aiResponse);
  const validated = validateReviewData({ ...reviewData, ...params });
  return persistReview(userId, { ...params, ...validated });
}