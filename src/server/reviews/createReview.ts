import { ReviewModel } from '@/models/Review';
import { ReviewGenerateRequest, ReviewPersistRequest } from '@/lib/types';
import { buildPrompt } from './helpers/buildPrompt';
import { callAIWithRetry } from './callAI';

async function persistReview(userId: string, params: ReviewPersistRequest) {
  return await ReviewModel.create({ userId, ...params });
}

export async function createReview(userId: string, params: ReviewGenerateRequest) {
  const prompt = buildPrompt(params);
  const aiReview = await callAIWithRetry(prompt, params.model);

  const reviewToPersist: ReviewPersistRequest = {
    language: params.language,
    codeSnippet: params.codeSnippet,
    model: params.model,
    summary: aiReview.summary,
    issues: aiReview.issues,
  };

  return persistReview(userId, reviewToPersist);
}
