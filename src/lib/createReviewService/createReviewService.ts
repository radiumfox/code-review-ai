import { fillTemplate } from './helpers/fillTemplate';
import promptTemplate from '@/prompts/code-review-default.json';
import { generateContent } from '@/lib/genAI';
import { Candidate } from '@google/genai';
import { reviewPersistRequestSchema } from '@/lib/validations/reviewPersistRequest';
import { ReviewModel } from '@/models/Review';
import { ReviewGenerateRequest, ReviewPersistRequest } from '@/lib/types';
import { DEFAULT_MODEL } from '@/lib/config';

function buildPrompt(input: ReviewGenerateRequest) {
  return fillTemplate(promptTemplate.template, {
    language: input.language,
    codeSnippet: input.codeSnippet
  });
}

function aiError(message: string, statusCode = 502): Error & { success: false; statusCode: number } {
  return Object.assign(new Error(message), { success: false as const, statusCode });
}

export function isAiError(error: unknown): error is ReturnType<typeof aiError> {
  return typeof error === 'object'
        && error !== null
        && 'success' in error
        && 'message' in error
        && 'statusCode' in error
        && typeof error.statusCode === 'number';
}

async function callAI(prompt: string, model?: string) {
  try {
    return await generateContent({ contents: prompt, model: model ?? DEFAULT_MODEL });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI generation failed';
    throw aiError(message, 502);
  }
}

function extractText(candidates: Candidate[] | undefined): string | null {
  return candidates?.[0]?.content?.parts?.[0]?.text ?? null;
}

function parseAIResponse(aiResponse: Candidate[]) {
  const text = extractText(aiResponse) ?? '';

  try {
    return JSON.parse(text);
  } catch {
    throw aiError('AI returned invalid JSON');
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
    throw aiError('AI returned no candidates', 502);
  }

  const reviewData = parseAIResponse(aiResponse);
  const validated = validateReviewData({ ...reviewData, ...params });
  return persistReview(userId, { ...params, ...validated });
}