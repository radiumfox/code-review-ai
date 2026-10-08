import { DEFAULT_LANGUAGE } from '@/lib/config';
import { AI_MODEL } from '@/lib/genAI/openai/config';
import { Page } from '@playwright/test';

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


export async function mockModelsResponse(page: Page): Promise<void> {
  await page.route('**/api/models/openai', async route => {
    await new Promise(f => setTimeout(f, 300));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: {
          models: [
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
          ],
        },
      }),
    });
  });
}
