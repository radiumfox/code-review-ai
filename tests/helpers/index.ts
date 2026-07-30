import { DEFAULT_LANGUAGE } from '@/lib/config';
import { AI_MODEL, AI_MODEL_NAME } from '@/lib/genAI/config';

export function mockReview(overrides = {}) {
  return {
    id: 'mock-review-id',
    language: DEFAULT_LANGUAGE,
    codeSnippet: 'let x = 1;',
    model: AI_MODEL,
    summary: 'Prefer const over let for variables that are never reassigned.',
    issues: [
      {
        line: 1,
        severity: 'warning',
        category: 'style',
        message: 'Prefer const over let',
        suggestion: 'Use const instead of let',
      },
    ],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export const MOCK_MODELS_LIST = [{ name: `models/${AI_MODEL}`, displayName: AI_MODEL_NAME }];