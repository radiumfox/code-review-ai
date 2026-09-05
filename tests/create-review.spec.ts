import { test, expect } from '@playwright/test';
import { CODE_SNIPPET_MAX_VALUE, CODE_SNIPPET_MIN_VALUE } from '@/lib/validations/config';
import { mockReview } from './helpers';
import { API_ROUTES, ROUTES } from '@/lib/config';
import { ERROR_CODES } from '@/lib/errors';

test.describe('Create review pipeline', () => {
  test.beforeEach('Log in', async ({ page }) => {
    await page.goto(API_ROUTES.authE2E);
    await page.waitForURL(ROUTES.main);
  });

  test('Create review', async ({ page }) => {
    await page.route(API_ROUTES.createReview, async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: mockReview() }),
      });
    });

    await page.route(API_ROUTES.reviewsList, async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metadata: { totalCount: 1, page: 0, pageSize: 20 },
          data: [mockReview()],
        }),
      });
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();
    await codeEditor.fill('let x = 1; \nx += 2; \nconsole.log(x);');

    await page.getByRole('button', { name: 'Get review' }).click();

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

    const buttonGetReview = page.getByRole('button', { name: 'Get review' });
    await expect(buttonGetReview).not.toBeDisabled();

    await expect(page.getByText(data.summary).first()).toBeVisible();
  });

  test('Shows validation error on empty code', async ({ page }) => {
    await page.route(API_ROUTES.createReview, async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: `Code length must be more than ${CODE_SNIPPET_MIN_VALUE} character(s) and less than ${CODE_SNIPPET_MAX_VALUE} character(s)`,
          code: ERROR_CODES.VALIDATION,
          statusCode: 400,
        })
      });
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.clear();

    await page.getByRole('button', { name: 'Get review' }).click();

    await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.createReview) && resp.status() === 400
    );

    const button = page.getByRole('button', { name: 'Get review' });
    await expect(button).not.toBeDisabled();

    const closeButton = page.getByRole('button', { name: 'Close notification' });
    await expect(closeButton).toBeVisible();
  });

  test('Shows validation error on code exceeding max length', async ({ page }) => {
    await page.route(API_ROUTES.createReview, async route => {
      await new Promise(f => setTimeout(f, 500));
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          message: `Code length must be more than ${CODE_SNIPPET_MIN_VALUE} character(s) and less than ${CODE_SNIPPET_MAX_VALUE} character(s)`,
          code: ERROR_CODES.VALIDATION,
          statusCode: 400,
        })
      });
    });

    const codeEditor = page.locator('[contenteditable=true]');
    await codeEditor.fill('a'.repeat(CODE_SNIPPET_MAX_VALUE + 1));

    await page.getByRole('button', { name: 'Get review' }).click();

    await page.waitForResponse(resp =>
      resp.url().includes(API_ROUTES.createReview) && resp.status() === 400
    );

    const closeButton = page.getByRole('button', { name: 'Close notification' });
    await expect(closeButton).toBeVisible();
  });
});

