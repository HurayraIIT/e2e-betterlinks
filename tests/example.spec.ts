import { test, expect, Page } from '@playwright/test';

test.describe('admin auth tests', () => {
  let adminContext, adminPage: Page;

  test.beforeAll(async ({ browser }) => {
    adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
    adminPage = await adminContext.newPage();
  });

  test('has title', async () => {
    await adminPage.goto('/');
    await expect(adminPage).toHaveTitle(/BetterLinks Automation/);
  });
});
