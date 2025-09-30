import { test, expect, Page } from '@playwright/test';
import { generateTestData, randomString } from '../helpers/test-data';

test.describe('Link Management', () => {
    let adminContext: any, adminPage: Page;
    let testData: ReturnType<typeof generateTestData>;

    test.beforeAll(async ({ browser }) => {
        testData = generateTestData();
        adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
        adminPage = await adminContext.newPage();
    });

    test.afterAll(async () => {
        //await adminContext.close();
    });

    test('should create a new link', async () => {
        // Navigate to BetterLinks Dashboard
        await adminPage.goto('/wp-admin/admin.php?page=betterlinks');
        await expect(adminPage.locator('.topbar__logo__text')).toHaveText('BetterLinks');
        await expect(adminPage.getByRole('button', { name: 'Add New Link' })).toBeVisible();
        await expect(adminPage.locator('.dnd-create-category-text')).toHaveText('Add New Category');

        // Create a new category
        await adminPage.locator('div').filter({ hasText: /^Add New Category$/ }).getByRole('button').click();
        await adminPage.locator('input#term_name').fill(testData.categoryName);
        await adminPage.getByRole('button', { name: 'Submit' }).click();
        await expect(adminPage.getByRole('heading', { name: `${testData.categoryName}` })).toBeVisible();
        
        // Create New Short Link with Basic Settings
        await adminPage.locator('div.dnd-category').filter({ hasText: `${testData.categoryName}` }).locator('button.btl-create-link-button').click();
        await expect(adminPage.getByRole('button', { name: 'Publish' })).toBeVisible();
        await adminPage.getByRole('textbox', { name: 'Title*' }).fill(testData.linkTitle);
        await adminPage.getByRole('textbox', { name: 'Target URL*' }).fill(testData.targetUrl);
        await adminPage.getByRole('textbox', { name: 'Shortened URL' }).fill(testData.shortSlug);
        await adminPage.getByRole('button', { name: 'Publish' }).click();

        // Verify Link Appears in List
        await adminPage.locator('button[title="List View"]').click();
        await adminPage.getByRole('textbox', { name: 'Search' }).fill(testData.linkTitle);
        await expect.soft(adminPage.getByRole('button', { name: `${testData.linkTitle}` })).toBeVisible();
        await expect.soft(adminPage.getByRole('gridcell', { name: `https://blinks.hurayraiit.com/${testData.shortSlug}` })).toBeVisible();
        await expect.soft(adminPage.getByRole('gridcell', { name: `${testData.targetUrl}` })).toBeVisible();
        await expect.soft(adminPage.getByRole('gridcell', { name: '307' })).toBeVisible();
        await expect.soft(adminPage.getByText('0/0')).toBeVisible();
        await expect.soft(adminPage.getByText('1-1 of 1')).toBeVisible();

        // Edit Link Details
        await adminPage.locator('button.dnd-link-button:has(i.btl-edit)').click();
        await expect(adminPage.getByRole('button', { name: 'Update' })).toBeVisible();
        await expect(adminPage.getByRole('textbox', { name: 'Title*' })).toHaveValue(testData.linkTitle);
        await adminPage.getByRole('textbox', { name: 'Title*' }).fill(`${testData.linkTitle} - Updated`);
        await adminPage.locator('div').filter({ hasText: /^307 \(Temporary\)$/ }).nth(2).click();
        await adminPage.getByText('301 (Permanent)').click();
        await adminPage.getByText(`${testData.categoryName}`).first().click();
        await adminPage.locator('div').filter({ hasText: `${testData.categoryName}` }).first().locator('..').locator('input').first().fill(`${testData.categoryName} - New`);



        await adminPage.waitForTimeout(5000);
    });
});
