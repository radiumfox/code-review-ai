import { test, expect } from '@playwright/test';
import { CODE_SNIPPET_MAX_VALUE } from '@/lib/validations/config';
import { DEFAULT_LANGUAGE, DEFAULT_MODEL } from '@/lib/config';

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

test.describe('Create review pipeline', () => {
  test.beforeEach('Log in', async ({ page }) => {
    await page.goto('/api/auth/e2e-signin');
    await page.waitForURL('/');
  });

  test('Create review', async ({ page }) => {
    await page.route('/api/reviews/create', async route => {
      setTimeout(async () => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mockReview() }),
        });
      }, 2000);
    });

    await page.route('/api/reviews', async route => {
      setTimeout(async () => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            metadata: { totalCount: 1, page: 0, pageSize: 20 },
            data: [mockReview()],
          }),
        });
      }, 2000);
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();
    await codeEditor.fill('let x = 1; \nx += 2; \nconsole.log(x);');

    await page.getByRole('button', { name: 'Get review' }).click();

    const button = page.getByRole('button', { name: 'Reviewing...' });
    await expect(button).toBeDisabled();

    const createResponse = await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews/create') && resp.status() === 200
    );

    const { data } = await createResponse.json();
    expect(data).toHaveProperty('id');
    expect(data.summary).toBeTruthy();

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews') && resp.status() === 200
    );

    const buttonGetReview = page.getByRole('button', { name: 'Get review' });
    await expect(buttonGetReview).not.toBeDisabled();

    await expect(page.getByText(data.summary).first()).toBeVisible({ timeout: 50000 });
  });

  test('Shows validation error on empty code', async ({ page }) => {
    await page.route('/api/reviews/create', async route => {
      setTimeout(async () => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: 'String must contain at least 1 character(s)',
        });
      }, 2000);
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();

    await page.getByRole('button', { name: 'Get review' }).click();

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews/create') && resp.status() === 400
    );

    const button = page.getByRole('button', { name: 'Get review' });
    await expect(button).not.toBeDisabled();

    const closeButton = page.getByTestId('notification-button-close');
    await expect(closeButton).toBeVisible();
  });

  test('Shows validation error on code exceeding max length', async ({ page }) => {
    await page.route('/api/reviews/create', async route => {
      setTimeout(async () => {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: 'String must contain at least 1 character(s)',
        });
      }, 2000);
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.fill('a'.repeat(CODE_SNIPPET_MAX_VALUE + 1));

    await page.getByRole('button', { name: 'Get review' }).click();

    await page.waitForResponse(resp =>
      resp.url().includes('/api/reviews/create') && resp.status() === 400
    );

    const closeButton = page.getByTestId('notification-button-close');
    await expect(closeButton).toBeVisible();
  });
});

