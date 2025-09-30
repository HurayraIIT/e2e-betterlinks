# BetterLinks Test Implementation Guide

## Quick Start

This guide provides practical information for implementing the BetterLinks E2E test plan with Playwright.

## Project Structure

```
e2e-betterlinks/
├── tests/
│   ├── link-management.spec.ts
│   ├── link-redirects.spec.ts
│   ├── analytics.spec.ts
│   ├── categories-tags.spec.ts
│   ├── settings.spec.ts
│   ├── import-export.spec.ts
│   ├── user-permissions.spec.ts
│   ├── link-scheduling.spec.ts
│   ├── dynamic-redirects.spec.ts
│   ├── broken-link-checker.spec.ts
│   ├── auto-link-keywords.spec.ts
│   └── external-analytics.spec.ts
├── fixtures/
│   ├── sample-links.csv
│   ├── sample-prettylinks.csv
│   ├── sample-thirstyaffiliates.csv
│   └── test-users.json
├── helpers/
│   ├── auth.ts
│   ├── cleanup.ts
│   ├── link-helpers.ts
│   └── api-helpers.ts
├── test-plan.md
├── test-plan-summary.md
└── playwright.config.ts
```

## Key Selectors & Locators

### Admin Dashboard

```typescript
// Navigation
const betterlinksMenu = page.locator('#toplevel_page_betterlinks');
const manageLinksMenuItem = page.locator('a[href*="page=betterlinks"]');
const analyticsMenuItem = page.locator('a[href*="betterlinks-analytics"]');
const settingsMenuItem = page.locator('a[href*="betterlinks-settings"]');

// Links Table
const linksTable = page.locator('.btl-links-table');
const addNewButton = page.locator('.btl-add-new-link, button:has-text("Add New")');
const searchInput = page.locator('.btl-search-input, input[placeholder*="Search"]');
const linkRow = (title: string) => page.locator(`tr:has-text("${title}")`);

// Link Creation/Edit Modal
const linkTitleInput = page.locator('#link_title, input[name="link_title"]');
const targetUrlInput = page.locator('#target_url, input[name="target_url"]');
const shortUrlInput = page.locator('#short_url, input[name="short_url"]');
const redirectTypeSelect = page.locator('#redirect_type');
const trackMeCheckbox = page.locator('#track_me, input[name="track_me"]');
const nofollowCheckbox = page.locator('#nofollow, input[name="nofollow"]');
const saveLinkButton = page.locator('button:has-text("Create Link"), button:has-text("Update Link")');

// Bulk Actions
const selectAllCheckbox = page.locator('input[type="checkbox"].select-all');
const bulkActionsDropdown = page.locator('#bulk-actions, select[name="bulk-action"]');
const applyBulkButton = page.locator('button:has-text("Apply")');

// Categories & Tags
const categorySelect = page.locator('#cat_id, select[name="cat_id"]');
const tagsInput = page.locator('#tags_id, input[name="tags_id"]');
```

### Frontend

```typescript
// Short URL redirect
const shortUrl = (slug: string) => `${baseURL}/${slug}`;

// Auto-linked keywords
const autoLinkedKeyword = page.locator('.btl_autolink_hyperlink');
const linkWithTracking = page.locator('[data-link-id]');
```

## API Endpoints

### REST API Base

```typescript
const apiBase = '/wp-json/betterlinks/v1';
const apiHeaders = {
  'X-WP-Nonce': nonce, // Get from WordPress
  'Content-Type': 'application/json'
};
```

### Common Endpoints

```typescript
// Links
GET    /wp-json/betterlinks/v1/links/              // Get all links
POST   /wp-json/betterlinks/v1/links/              // Create link
GET    /wp-json/betterlinks/v1/links/{id}          // Get single link
PUT    /wp-json/betterlinks/v1/links/{id}          // Update link
DELETE /wp-json/betterlinks/v1/links/{id}          // Delete link

// Analytics
GET    /wp-json/betterlinks/v1/clicks/             // Get clicks data
GET    /wp-json/betterlinks/v1/clicks/{link_id}    // Get clicks for link

// Settings
GET    /wp-json/betterlinks/v1/settings/           // Get settings
PUT    /wp-json/betterlinks/v1/settings/           // Update settings

// Terms (Categories/Tags)
GET    /wp-json/betterlinks/v1/terms/              // Get all terms
POST   /wp-json/betterlinks/v1/terms/              // Create term
PUT    /wp-json/betterlinks/v1/terms/{id}          // Update term
DELETE /wp-json/betterlinks/v1/terms/{id}          // Delete term

// PRO - Keywords
GET    /wp-json/betterlinks/v1/keywords/           // Get keywords
POST   /wp-json/betterlinks/v1/keywords/           // Create keyword
```

## Helper Functions

### Authentication

```typescript
// helpers/auth.ts
export async function loginAsAdmin(page: Page) {
  await page.goto('/wp-admin');
  await page.fill('#user_login', 'admin');
  await page.fill('#user_pass', 'password');
  await page.click('#wp-submit');
  await page.waitForURL('**/wp-admin/**');
}

export async function loginAsRole(page: Page, role: 'editor' | 'author' | 'contributor') {
  const credentials = {
    editor: { username: 'editor', password: 'editor_pass' },
    author: { username: 'author', password: 'author_pass' },
    contributor: { username: 'contributor', password: 'contributor_pass' }
  };
  
  const { username, password } = credentials[role];
  await page.goto('/wp-admin');
  await page.fill('#user_login', username);
  await page.fill('#user_pass', password);
  await page.click('#wp-submit');
  await page.waitForURL('**/wp-admin/**');
}
```

### Link Management

```typescript
// helpers/link-helpers.ts
export async function createLink(page: Page, data: {
  title: string;
  targetUrl: string;
  shortUrl?: string;
  redirectType?: string;
}) {
  await page.goto('/wp-admin/admin.php?page=betterlinks');
  await page.click('.btl-add-new-link');
  
  await page.fill('#link_title', data.title);
  await page.fill('#target_url', data.targetUrl);
  
  if (data.shortUrl) {
    await page.fill('#short_url', data.shortUrl);
  }
  
  if (data.redirectType) {
    await page.selectOption('#redirect_type', data.redirectType);
  }
  
  await page.click('button:has-text("Create Link")');
  await page.waitForSelector('.success-message, .btl-success');
}

export async function deleteLink(page: Page, linkTitle: string) {
  await page.goto('/wp-admin/admin.php?page=betterlinks');
  const row = page.locator(`tr:has-text("${linkTitle}")`);
  await row.locator('.delete-icon, button[title="Delete"]').click();
  await page.click('button:has-text("Confirm"), button:has-text("Delete")');
  await page.waitForSelector('.success-message');
}

export async function searchLink(page: Page, query: string) {
  await page.goto('/wp-admin/admin.php?page=betterlinks');
  await page.fill('.btl-search-input', query);
  await page.press('.btl-search-input', 'Enter');
  await page.waitForLoadState('networkidle');
}
```

### API Helpers

```typescript
// helpers/api-helpers.ts
export async function createLinkViaAPI(request: APIRequestContext, data: any) {
  const response = await request.post('/wp-json/betterlinks/v1/links/', {
    data: data,
    headers: apiHeaders
  });
  return response.json();
}

export async function deleteLinkViaAPI(request: APIRequestContext, linkId: number) {
  await request.delete(`/wp-json/betterlinks/v1/links/${linkId}`, {
    headers: apiHeaders
  });
}

export async function getLinksViaAPI(request: APIRequestContext) {
  const response = await request.get('/wp-json/betterlinks/v1/links/', {
    headers: apiHeaders
  });
  return response.json();
}
```

### Cleanup

```typescript
// helpers/cleanup.ts
export async function cleanupTestLinks(page: Page) {
  await page.goto('/wp-admin/admin.php?page=betterlinks');
  
  // Search for test links
  await page.fill('.btl-search-input', 'test-');
  await page.press('.btl-search-input', 'Enter');
  await page.waitForLoadState('networkidle');
  
  // Select all and delete
  const hasLinks = await page.locator('.btl-links-table tbody tr').count() > 0;
  if (hasLinks) {
    await page.check('.select-all');
    await page.selectOption('#bulk-actions', 'delete');
    await page.click('button:has-text("Apply")');
    await page.click('button:has-text("Confirm")');
  }
}

export async function cleanupTestCategories(page: Page) {
  await page.goto('/wp-admin/admin.php?page=betterlinks-manage-tags-and-categories');
  
  // Similar cleanup for categories with "Test Category" pattern
  const categories = page.locator('tr:has-text("Test Category")');
  const count = await categories.count();
  
  for (let i = 0; i < count; i++) {
    await categories.nth(0).locator('.delete-icon').click();
    await page.click('button:has-text("Confirm")');
    await page.waitForTimeout(500);
  }
}
```

## Test Data Generators

```typescript
// Generate unique test data
export function generateTestData() {
  const timestamp = Date.now();
  return {
    linkTitle: `Test Link ${timestamp}`,
    targetUrl: `https://example.com/test-${timestamp}`,
    shortSlug: `test-${timestamp}`,
    categoryName: `Test Category ${timestamp}`,
    tagName: `test-tag-${timestamp}`
  };
}

// Generate random string
export function randomString(length: number = 8): string {
  return Math.random().toString(36).substring(2, length + 2);
}
```

## Common Test Patterns

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { loginAsAdmin } from '../helpers/auth';
import { createLink, deleteLink } from '../helpers/link-helpers';
import { generateTestData } from '../helpers/test-data';

test.describe('Link Management', () => {
  let testData: ReturnType<typeof generateTestData>;
  
  test.beforeEach(async ({ page }) => {
    testData = generateTestData();
    await loginAsAdmin(page);
  });
  
  test.afterEach(async ({ page }) => {
    // Cleanup
    await deleteLink(page, testData.linkTitle).catch(() => {});
  });
  
  test('should create a new link', async ({ page }) => {
    await createLink(page, {
      title: testData.linkTitle,
      targetUrl: testData.targetUrl,
      shortUrl: testData.shortSlug
    });
    
    // Verify link appears in list
    await page.goto('/wp-admin/admin.php?page=betterlinks');
    await expect(page.locator(`tr:has-text("${testData.linkTitle}")`)).toBeVisible();
  });
});
```

### Testing Frontend Redirects

```typescript
test('should redirect with correct status code', async ({ page, context }) => {
  // Create link via API
  const link = await createLinkViaAPI(context.request, {
    link_title: testData.linkTitle,
    target_url: testData.targetUrl,
    short_url: testData.shortSlug,
    redirect_type: '301'
  });
  
  // Test redirect
  const response = await page.goto(`/${testData.shortSlug}`, {
    waitUntil: 'networkidle'
  });
  
  expect(response?.status()).toBe(301);
  expect(page.url()).toContain(testData.targetUrl);
});
```

### Testing with Different User Roles

```typescript
test.describe('User Permissions', () => {
  test('admin can create links', async ({ page }) => {
    await loginAsAdmin(page);
    // Test creation
  });
  
  test('editor with permissions can create links', async ({ page }) => {
    await loginAsRole(page, 'editor');
    // Test creation
  });
  
  test('contributor without permissions cannot access', async ({ page }) => {
    await loginAsRole(page, 'contributor');
    await page.goto('/wp-admin/admin.php?page=betterlinks');
    await expect(page.locator('text=Access Denied')).toBeVisible();
  });
});
```

## Debugging Tips

### Enable Verbose Logging

```typescript
test.use({ 
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
});
```

### Inspect Network Requests

```typescript
page.on('request', request => {
  if (request.url().includes('betterlinks')) {
    console.log('Request:', request.method(), request.url());
  }
});

page.on('response', response => {
  if (response.url().includes('betterlinks')) {
    console.log('Response:', response.status(), response.url());
  }
});
```

### Wait for Specific Conditions

```typescript
// Wait for API call to complete
await page.waitForResponse(
  response => response.url().includes('/wp-json/betterlinks/v1/links/') && response.status() === 200
);

// Wait for element to be stable
await page.locator('.btl-links-table').waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
```

## Performance Optimization

### Reuse Authentication

```typescript
// Save auth state
await context.storageState({ path: 'auth/admin.json' });

// Reuse in tests
test.use({ storageState: 'auth/admin.json' });
```

### Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4, // Run 4 tests in parallel
  fullyParallel: true,
  projects: [
    { name: 'core-features', testMatch: /link-management|analytics|settings/ },
    { name: 'pro-features', testMatch: /user-permissions|scheduling|dynamic/ }
  ]
});
```

## Next Steps

1. Set up Playwright project: `npm init playwright@latest`
2. Configure `playwright.config.ts` with WordPress URL
3. Create helper functions in `helpers/` directory
4. Implement tests following the test plan
5. Run tests: `npx playwright test`
6. View report: `npx playwright show-report`

## Resources

- Full Test Plan: `test-plan.md`
- Test Summary: `test-plan-summary.md`
- Playwright Docs: https://playwright.dev/
- BetterLinks Docs: https://betterlinks.io/docs/

