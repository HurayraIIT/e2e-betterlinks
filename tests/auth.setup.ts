import { test as setup, expect } from '@playwright/test';

const loginURL = `${process.env.BASE_URL}/wp-login.php`;

const roles = [
    { username: process.env.ADMIN_USERNAME, file: 'playwright/.auth/admin.json' },
    { username: process.env.EDITOR_USERNAME, file: 'playwright/.auth/editor.json' },
    { username: process.env.AUTHOR_USERNAME, file: 'playwright/.auth/author.json' },
    { username: process.env.CONTRIBUTOR_USERNAME, file: 'playwright/.auth/contributor.json' },
    { username: process.env.SUBSCRIBER_USERNAME, file: 'playwright/.auth/subscriber.json' },
];

setup('authenticate all roles in parallel', async ({ browser }) => {
    await Promise.all(
        roles.map(async (role) => {
            const context = await browser.newContext();
            const page = await context.newPage();

            await page.goto(loginURL);
            await page.waitForLoadState('networkidle');

            await page.getByLabel('Username or Email Address').fill(`${role.username}`);
            await page.getByLabel('Password', { exact: true }).fill(`${process.env.PASS}`);
            await page.getByLabel('Remember Me').check();
            await page.getByRole('button', { name: 'Log In' }).click();

            await expect(page.getByRole('menuitem', { name: `Howdy, ${role.username}` })).toBeVisible();

            await context.storageState({ path: role.file });
            await context.close();
        })
    );
});
