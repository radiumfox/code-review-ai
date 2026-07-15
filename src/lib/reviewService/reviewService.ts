import { fillTemplate } from '@/lib/helpers/fillTemplate';
import promptTemplate from '@/prompts/code-review-default.json';
import { generateContent } from '@/lib/genAI';
import { Candidate } from '@google/genai';
import { reviewSchema } from '@/lib/validations/review';
import { ReviewModel } from '@/models/Review';
import { Review, ReviewInput } from './types';

function buildPrompt(input: ReviewInput) {
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
    return await generateContent({ contents: prompt, model: model ?? promptTemplate.model });
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
  const reviewData = reviewSchema.safeParse(data);

  if(!reviewData.success) {
    throw reviewData.error;
  }

  return reviewData.data;
}

async function persistReview(payload: Review) {
  return await ReviewModel.create(payload);
}

export async function createReview(userId: string, input: ReviewInput) {
  const prompt = buildPrompt(input);

  const aiResponse = await callAI(prompt, input.model);

  if(!aiResponse) {
    throw aiError('AI returned no candidates', 502);
  }

  const reviewData = parseAIResponse(aiResponse);
  const validated = validateReviewData(reviewData);
  return persistReview({ userId, ...input, ...validated });
}