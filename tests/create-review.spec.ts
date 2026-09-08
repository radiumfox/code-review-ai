import { test, expect } from '@playwright/test';
import { CODE_SNIPPET_MAX_VALUE, CODE_SNIPPET_MIN_VALUE } from '@/lib/validations/config';
import { mockReview } from './helpers';
import { API_ROUTES, ROUTES } from '@/lib/config';
import { ERROR_CODES } from '@/lib/api/errors';
import type { Page } from '@playwright/test';

const REVIEW_BUTTON_NAME = 'Review Code';
const REVIEW_AGAIN_BUTTON_NAME = 'Review Again';

async function mockCreateReview(page: Page, status: number, body: object): Promise<void> {
  await page.route(API_ROUTES.createReview, async route => {
    await new Promise(f => setTimeout(f, 500));
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
}

async function mockReviewsList(page: Page): Promise<void> {
  await page.route(API_ROUTES.reviewsList, async route => {
    await new Promise(f => setTimeout(f, 500));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ok: true,
        data: {
          metadata: { totalCount: 1, page: 0, pageSize: 20 },
          data: [mockReview()],
        },
      }),
    });
  });
}

async function logIn(page: Page): Promise<void> {
  await page.goto(API_ROUTES.authE2E);
  await page.waitForURL(ROUTES.main);
}

test.describe('Create review pipeline', () => {
  test('Create review', async ({ page }) => {
    await mockReviewsList(page);
    await mockCreateReview(page, 200, { ok: true, data: mockReview() });
    await logIn(page);

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();
    await codeEditor.fill('let x = 1; \nx += 2; \nconsole.log(x);');

    await expect(page.getByPlaceholder('Search model...')).not.toHaveValue('');

    await page.getByRole('button', { name: REVIEW_BUTTON_NAME }).click();

    const button = page.getByRole('button', { name: 'Reviewing...' });
    await expect(button).toBeDisabled();

    const createResponse = await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.createReview) && resp.status() === 200
    );

    const { data } = await createResponse.json();
    expect(data).toHaveProperty('id');
    expect(data.summary).toBeTruthy();

    await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.reviewsList) && resp.status() === 200
    );

    const buttonGetReview = page.getByRole('button', { name: REVIEW_AGAIN_BUTTON_NAME });
    await expect(buttonGetReview).not.toBeDisabled();

    await expect(page.getByText(data.summary).first()).toBeVisible();
  });

  test('Shows validation error on empty code', async ({ page }) => {
    await mockReviewsList(page);
    await mockCreateReview(page, 400, {
      message: `Code length must be more than ${CODE_SNIPPET_MIN_VALUE} character(s) and less than ${CODE_SNIPPET_MAX_VALUE} character(s)`,
      code: ERROR_CODES.VALIDATION,
      statusCode: 400,
    });
    await logIn(page);

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();

    await expect(page.getByPlaceholder('Search model...')).not.toHaveValue('');

    await page.getByRole('button', { name: REVIEW_BUTTON_NAME }).click();

    await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.createReview) && resp.status() === 400
    );

    const button = page.getByRole('button', { name: REVIEW_BUTTON_NAME });
    await expect(button).not.toBeDisabled();

    const closeButton = page.getByRole('button', { name: 'Close notification' });
    await expect(closeButton).toBeVisible();
  });

  test('Shows validation error on code exceeding max length', async ({ page }) => {
    await mockReviewsList(page);
    await mockCreateReview(page, 400, {
      message: `Code length must be more than ${CODE_SNIPPET_MIN_VALUE} character(s) and less than ${CODE_SNIPPET_MAX_VALUE} character(s)`,
      code: ERROR_CODES.VALIDATION,
      statusCode: 400,
    });
    await logIn(page);

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.fill('a'.repeat(CODE_SNIPPET_MAX_VALUE + 1));

    await expect(page.getByPlaceholder('Search model...')).not.toHaveValue('');

    await page.getByRole('button', { name: REVIEW_BUTTON_NAME }).click();

    await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.createReview) && resp.status() === 400
    );

    const closeButton = page.getByRole('button', { name: 'Close notification' });
    await expect(closeButton).toBeVisible();
  });
});