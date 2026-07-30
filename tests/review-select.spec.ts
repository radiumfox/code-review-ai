import { test, expect } from '@playwright/test';
import { DEFAULT_EDITOR_VALUE, ROUTES } from '@/lib/config';
import { EDITOR_TEST_IDS } from '@/components/CodeEditor/config';
import { MOCK_MODELS_LIST, mockReview } from './helpers';

test.describe('Review selection', () => {
  test.beforeEach('Log in', async ({ page }) => {
    await page.route(ROUTES.modelsList, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: MOCK_MODELS_LIST,
        }),
      });
    });

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(ROUTES.authE2E);
    await page.waitForURL('/');
  });

  test('Review list is fetched and displayed', async ({ page }) => {
    const review = mockReview();

    await page.route(ROUTES.reviewsList, async route => {
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
      resp.url().includes(ROUTES.reviewsList) && resp.status() === 200
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

    await page.route(ROUTES.reviewsList, async route => {
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
      resp.url().includes(ROUTES.reviewsList) && resp.status() === 200
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

    await page.route(ROUTES.reviewsList, async route => {
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
      resp.url().includes(ROUTES.reviewsList) && resp.status() === 200
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
