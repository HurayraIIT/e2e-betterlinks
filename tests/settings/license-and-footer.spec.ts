import { test, expect, Page } from '@playwright/test';

test.describe('license & footer section', () => {
    let adminContext, adminPage: Page;

    test.beforeAll(async ({ browser }) => {
        adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
        adminPage = await adminContext.newPage();

        // Navigate to the Settings >License Tab
        await adminPage.goto('/wp-admin');
        await expect(adminPage).toHaveTitle(/BetterLinks Automation/);
        await expect(adminPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
        await expect(adminPage.getByRole('link', { name: 'BetterLinks' })).toBeVisible();
        await adminPage.getByRole('link', { name: 'BetterLinks' }).click();
        await adminPage.locator('#toplevel_page_betterlinks').getByRole('link', { name: 'Settings' }).click();
        await expect(adminPage.getByRole('tab', { name: 'License' })).toBeVisible();
        await adminPage.getByRole('tab', { name: 'License' }).click();
    });

    test('license should be active & footer should be visible', async () => {
        // license should be active
        await expect(adminPage.getByRole('img', { name: 'Lock Icon' })).toBeVisible();
        await expect(adminPage.getByText('Enjoy the pro features & Supports!')).toBeVisible();
        await expect(adminPage.getByText('You have already activated BetterLinks Pro. You will able to update the plugin right from your WP dashboard.')).toBeVisible();
        await expect(adminPage.getByRole('paragraph').filter({ hasText: /^Activated$/ })).toBeVisible();
        await expect(adminPage.getByRole('button', { name: 'Deactivate' })).toBeVisible();

        // Footer container and count
        const docs = adminPage.locator('.btl-doc');
        await expect(docs).toHaveCount(4);

        // 1) Documentation card
        const doc0 = docs.nth(0);
        await expect(doc0.getByRole('heading', { name: 'Documentation', level: 3 })).toBeVisible();
        await expect(doc0.locator('.btl-doc__content')).toHaveText(
            'Get started by spending some time with the documentation to get familiar with BetterLinks. Create Shortened URLs and start cross-promoting your brands & products.'
        );
        await expect(doc0.locator('.btl-doc__icon img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/doc.svg'
        );
        const doc0Link = doc0.getByRole('link', { name: 'Documentation' });
        await expect(doc0Link).toBeVisible();
        await expect(doc0Link).toHaveAttribute('href', 'https://betterlinks.io/docs/');
        await expect(doc0Link).toHaveAttribute('target', '_blank');
        await expect(doc0Link.locator('img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/arrow-right.svg'
        );

        // 2) Need Help? card
        const doc1 = docs.nth(1);
        await expect(doc1.getByRole('heading', { name: 'Need Help?', level: 3 })).toBeVisible();
        await expect(doc1.locator('.btl-doc__content')).toHaveText(
            'Stuck with something? Feel free to reach out to our Live Chat agent or create a support ticket.'
        );
        await expect(doc1.locator('.btl-doc__icon img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/user.svg'
        );
        const doc1Link = doc1.getByRole('link', { name: 'Get Help' });
        await expect(doc1Link).toBeVisible();
        await expect(doc1Link).toHaveAttribute('href', 'https://wpdeveloper.com/support/');
        await expect(doc1Link).toHaveAttribute('target', '_blank');
        await expect(doc1Link.locator('img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/arrow-right.svg'
        );

        // 3) Join the Community card
        const doc2 = docs.nth(2);
        await expect(doc2.getByRole('heading', { name: 'Join the Community', level: 3 })).toBeVisible();
        await expect(doc2.locator('.btl-doc__content')).toHaveText(
            'Join the Facebook community and discuss with fellow developers and users. Best way to connect with people and get feedback on your projects.'
        );
        await expect(doc2.locator('.btl-doc__icon img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/community.svg'
        );
        const doc2Link = doc2.getByRole('link', { name: 'Join the Community' });
        await expect(doc2Link).toBeVisible();
        await expect(doc2Link).toHaveAttribute('href', 'https://www.facebook.com/groups/wpdeveloper.net/');
        await expect(doc2Link).toHaveAttribute('target', '_blank');
        await expect(doc2Link.locator('img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/arrow-right.svg'
        );

        // 4) Show Your Love card
        const doc3 = docs.nth(3);
        await expect(doc3.getByRole('heading', { name: 'Show Your Love', level: 3 })).toBeVisible();
        await expect(doc3.locator('.btl-doc__content')).toHaveText(
            'We love to have you in BetterLinks family. We are making it more awesome everyday. Take your 2 minutes to review the plugin and spread the love to encourage us to keep it going.'
        );
        await expect(doc3.locator('.btl-doc__icon img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/heart.svg'
        );
        const doc3Link = doc3.getByRole('link', { name: 'Leave a Review' });
        await expect(doc3Link).toBeVisible();
        await expect(doc3Link).toHaveAttribute('href', 'https://wpdeveloper.com/review-betterlinks');
        await expect(doc3Link).toHaveAttribute('target', '_blank');
        await expect(doc3Link.locator('img')).toHaveAttribute(
            'src',
            'https://blinks.hurayraiit.com/wp-content/plugins/betterlinks/assets/images/arrow-right.svg'
        );

        //
        // Accessibility / basic visibility checks for the whole footer wrapper
        //
        const wrapper = adminPage.locator('.btl-docs');
        await expect(wrapper).toBeVisible();
        // ensure all titles are present (extra safety)
        await expect(wrapper.getByRole('heading', { name: 'Documentation', level: 3 })).toBeVisible();
        await expect(wrapper.getByRole('heading', { name: 'Need Help?', level: 3 })).toBeVisible();
        await expect(wrapper.getByRole('heading', { name: 'Join the Community', level: 3 })).toBeVisible();
        await expect(wrapper.getByRole('heading', { name: 'Show Your Love', level: 3 })).toBeVisible();
    });
});
