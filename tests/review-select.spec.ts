import { test, expect } from '@playwright/test';
import { DEFAULT_LANGUAGE, DEFAULT_MODEL, DEFAULT_EDITOR_VALUE, DEFAULT_MODEL_NAME } from '@/lib/config';
import { EDITOR_TEST_IDS } from '@/components/CodeEditor/config';

function mockReview(overrides = {}) {
  return {
    id: 'mock-review-id',
    language: DEFAULT_LANGUAGE,
    codeSnippet: 'let x = 1;',
    model: DEFAULT_MODEL,
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

test.describe('Review selection', () => {
  test.beforeEach('Log in', async ({ page }) => {
    await page.route('/api/models', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: [{ name: `models/${DEFAULT_MODEL}`, displayName: DEFAULT_MODEL_NAME }],
        }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/api/auth/e2e-signin');
    await page.waitForURL('/');
  });

  test('Review list is fetched and displayed', async ({ page }) => {
    const review = mockReview();

    await page.route('/api/reviews', async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metadata: { totalCount: 1, page: 0, pageSize: 20 },
          data: [review],
        }),
      });
    });

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews') && resp.status() === 200
    );

    await expect(page.getByText(review.summary).first()).toBeVisible();
  });

  test('User can click a review to see it in the code editor and summary', async ({ page }) => {
    const pyReview = mockReview({
      id: 'py-review-id',
      language: 'py',
      codeSnippet: 'print("Hello, World!")',
      summary: 'This is a review for a Python script.',
    });

    await page.route('/api/reviews', async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metadata: { totalCount: 1, page: 0, pageSize: 20 },
          data: [pyReview],
        }),
      });
    });

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews') && resp.status() === 200
    );

    await page.getByText(pyReview.summary).first().click();

    await expect(page.getByText(pyReview.summary).first()).toBeVisible({ timeout: 10000 });

    const editor = page.locator('[contenteditable=true]');
    await expect(editor).toContainText(pyReview.codeSnippet);

    const languageName = page.getByTestId(EDITOR_TEST_IDS.languageName);
    await expect(languageName).toBeVisible();
    await expect(languageName).toContainText('Python');
  });

  test('New Review button resets editor to default state', async ({ page }) => {
    const pyReview = mockReview({
      id: 'py-review-id',
      language: 'py',
      codeSnippet: 'print("Hello, World!")',
      summary: 'This is a review for a Python script.',
    });

    await page.route('/api/reviews', async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metadata: { totalCount: 1, page: 0, pageSize: 20 },
          data: [pyReview],
        }),
      });
    });

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews') && resp.status() === 200
    );

    await page.getByText(pyReview.summary).first().click();
    await expect(page.getByText(pyReview.summary).first()).toBeVisible({ timeout: 10000 });

    await page.getByRole('button', { name: 'New review' }).click();

    await expect(page.getByText('/** Summary will appear here: */').first()).toBeVisible();

    const languageName = page.getByTestId(EDITOR_TEST_IDS.languageName);
    await expect(languageName).toBeVisible();
    await expect(languageName).toContainText('JavaScript');

    const editor = page.locator('[contenteditable=true]');
    await expect(editor).toContainText(DEFAULT_EDITOR_VALUE);
  });
});
