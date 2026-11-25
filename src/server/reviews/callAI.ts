import { apiError, ERROR_CODES, isApiError, STATUS_CODE_BY_CODE } from '@/lib/api/errors';
import type { AllowedAIModel } from '@/lib/types';
import { generateContent } from '@/lib/genAI/openai';
import { aiReviewResponseSchema } from './aiReviewResponse';
import type { AIReviewResponse } from './types';

const AI_OUTPUT_ERRORS = {
  invalidJson: 'AI returned invalid JSON',
  invalidStructure: 'AI returned invalid review structure',
  noCandidates: 'AI returned no candidates',
};

const RETRYABLE_AI_ERROR_MESSAGES = new Set<string>(Object.values(AI_OUTPUT_ERRORS));

function aiError(message: string) {
  return apiError(message, ERROR_CODES.AI, STATUS_CODE_BY_CODE[ERROR_CODES.AI]);
}

function parseAIResponse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw aiError(AI_OUTPUT_ERRORS.invalidJson);
  }
}

function validateAIResponse(data: unknown): AIReviewResponse {
  const aiReview = aiReviewResponseSchema.safeParse(data);

  if (!aiReview.success) {
    throw aiError(AI_OUTPUT_ERRORS.invalidStructure);
  }

  return aiReview.data;
}

async function callAI(prompt: string, model: AllowedAIModel): Promise<AIReviewResponse> {
  try {
    const choices = await generateContent({ contents: prompt, model });

    if (!choices || choices.length === 0) {
      throw aiError(AI_OUTPUT_ERRORS.noCandidates);
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

function isRetryableAiOutputError(error: unknown): boolean {
  return isApiError(error)
    && error.code === ERROR_CODES.AI
    && RETRYABLE_AI_ERROR_MESSAGES.has(error.message);
}

export async function callAIWithRetry(
  prompt: string,
  model: AllowedAIModel
): Promise<AIReviewResponse> {
  try {
    return await callAI(prompt, model);
  } catch (error) {
    if (!isRetryableAiOutputError(error)) {
      throw error;
    }

    return await callAI(prompt, model);
  }
}
