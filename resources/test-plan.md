# BetterLinks WordPress Plugin - Comprehensive E2E Test Plan

## Executive Summary

This test plan provides comprehensive end-to-end test coverage for the BetterLinks WordPress plugin ecosystem (FREE + PRO versions). The plan is optimized for Playwright automation with grouped, workflow-based tests that minimize redundancy while ensuring complete feature coverage.

**Total Test Suites:** 12 major feature areas
**Testing Approach:** Workflow-based, grouped tests covering both admin UI and frontend behavior
**Estimated Execution Time:** ~45-60 minutes for full suite
**Browser:** Chrome desktop only
**WordPress Context:** Single site (no multisite)

---

## Coverage Matrix

| Feature Area | Admin | Editor | Author | Contributor | Subscriber | Unauthenticated | Priority |
|--------------|-------|--------|--------|-------------|------------|-----------------|----------|
| Link Management | ✓ | ✓* | ✓* | ✓* | ✗ | ✗ | High |
| Analytics Dashboard | ✓ | ✓* | ✓* | ✓* | ✗ | ✗ | High |
| Frontend Redirects | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | High |
| Categories & Tags | ✓ | ✓* | ✓* | ✗ | ✗ | ✗ | High |
| Settings | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | High |
| Import/Export | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | Medium |
| User Permissions (PRO) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | High |
| Link Scheduling (PRO) | ✓ | ✓* | ✓* | ✗ | ✗ | ✗ | Medium |
| Dynamic Redirects (PRO) | ✓ | ✓* | ✓* | ✗ | ✗ | ✗ | Medium |
| Broken Link Checker (PRO) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | Medium |
| Auto-Link Keywords (PRO) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | Medium |
| Google Analytics (PRO) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | Low |

*\* Subject to PRO role management settings*

---

## Test File Structure

```
tests/
├── link-management.spec.ts          # Core link CRUD operations
├── link-redirects.spec.ts           # Frontend redirect behavior
├── analytics.spec.ts                # Analytics dashboard & tracking
├── categories-tags.spec.ts          # Taxonomy management
├── settings.spec.ts                 # Plugin configuration
├── import-export.spec.ts            # Data import/export
├── user-permissions.spec.ts         # Role-based access (PRO)
├── link-scheduling.spec.ts          # Scheduled links (PRO)
├── dynamic-redirects.spec.ts        # Split testing & rotation (PRO)
├── broken-link-checker.spec.ts      # Link scanning (PRO)
├── auto-link-keywords.spec.ts       # Keyword automation (PRO)
└── external-analytics.spec.ts       # GA & Pixel tracking (PRO)
```

---

## Detailed Test Cases

### Test Suite 1: Link Management Lifecycle

**File:** `link-management.spec.ts`
**Feature Area:** Link Management
**User Role:** Admin
**Test Type:** Combined (UI + REST API)
**Priority:** High

**Description:**
Validates the complete lifecycle of BetterLinks short links including creation, editing, bulk operations, search/filter, favorites, and deletion.

**Prerequisites:**
- User logged in as Administrator
- BetterLinks plugin activated (FREE + PRO)

**Test Data:**
- Link title: `Test Link ${Date.now()}`
- Target URL: `https://example.com/test-${Date.now()}`
- Short slug: `test-${Date.now()}`
- Category: `Test Category ${Date.now()}`
- Tags: `test-tag-${Date.now()}`

**Test Steps:**

1. **Navigate to BetterLinks Dashboard**
   - Action: Go to WordPress Admin > BetterLinks > Manage Links
   - Expected Result: BetterLinks dashboard loads, shows links table with pagination

2. **Create New Short Link with Basic Settings**
   - Action: Click "Add New" button, fill form:
     - Link Title: test data
     - Target URL: test data
     - Short URL: test data (or auto-generate)
     - Redirect Type: 307
     - Enable "Track Me"
     - Enable "Nofollow"
   - Action: Click "Create Link"
   - Expected Result: Link created successfully, success message displayed, redirected to links list

3. **Verify Link Appears in List**
   - Action: Search for created link using title in search box
   - Expected Result: Link appears in table with correct title, URL, slug, and click count (0)

4. **Edit Link Details**
   - Action: Click edit icon on the link row
   - Expected Result: Edit modal opens with pre-filled data
   - Action: Change title to `${original_title} - Updated`, change redirect type to 301
   - Action: Add category and tags using test data
   - Action: Click "Update Link"
   - Expected Result: Changes saved, modal closes, updated values displayed in table

5. **Mark Link as Favorite**
   - Action: Click star icon on the link row
   - Expected Result: Star icon fills/highlights, link marked as favorite

6. **Filter by Favorite**
   - Action: Click "Favorites" filter tab
   - Expected Result: Only favorite links displayed

7. **Test Frontend Redirect**
   - Action: Open new tab, navigate to `[site-url]/[short-slug]`
   - Expected Result: Redirects to target URL with 301 status, click tracked

8. **Verify Click Tracking**
   - Action: Return to admin, refresh links list
   - Expected Result: Click count shows 1 for the test link

9. **Create Second Link for Bulk Operations**
   - Action: Create another link with similar test data pattern
   - Expected Result: Second link created successfully

10. **Bulk Delete Links**
    - Action: Select both test links using checkboxes
    - Action: Click "Bulk Actions" dropdown, select "Delete", click "Apply"
    - Action: Confirm deletion in modal
    - Expected Result: Both links deleted, removed from list

**Cleanup:**
- Delete any remaining test links by title pattern
- Delete test category and tags
- Clear any analytics data for test links

**Notes:**
- Test covers FREE version core functionality
- Verify slug uniqueness validation (attempt duplicate slug)
- Test auto-slug generation when slug field is empty
- Verify URL validation for target URL field

---

### Test Suite 2: Frontend Link Redirects & Tracking

**File:** `link-redirects.spec.ts`
**Feature Area:** Frontend Behavior
**User Role:** Unauthenticated User (frontend), Admin (setup)
**Test Type:** Combined (UI + Frontend)
**Priority:** High

**Description:**
Validates frontend redirect behavior for different redirect types, parameter forwarding, bot blocking, and click tracking accuracy.

**Prerequisites:**
- BetterLinks plugin activated
- Admin creates test links with different configurations

**Test Data:**
- Link 1: 301 redirect, no param forwarding
- Link 2: 302 redirect, with param forwarding
- Link 3: 307 redirect, with UTM parameters
- Link 4: Cloaked redirect (PRO)

**Test Steps:**

1. **Setup Test Links (Admin)**
   - Action: Login as admin, create 4 links with configurations above
   - Expected Result: All links created successfully

2. **Test 301 Permanent Redirect**
   - Action: Navigate to `[site-url]/[link1-slug]` in incognito window
   - Expected Result: Redirects to target URL with 301 status code
   - Action: Check response headers
   - Expected Result: `Location` header contains target URL

3. **Test 302 Temporary Redirect**
   - Action: Navigate to `[site-url]/[link2-slug]`
   - Expected Result: Redirects with 302 status code

4. **Test 307 Temporary Redirect**
   - Action: Navigate to `[site-url]/[link3-slug]`
   - Expected Result: Redirects with 307 status code

5. **Test Parameter Forwarding**
   - Action: Navigate to `[site-url]/[link2-slug]?utm_source=test&utm_campaign=demo`
   - Expected Result: Redirects to target URL with parameters appended
   - Expected Result: Final URL contains `?utm_source=test&utm_campaign=demo`

6. **Test Without Parameter Forwarding**
   - Action: Navigate to `[site-url]/[link1-slug]?param=value`
   - Expected Result: Redirects to target URL without parameters

7. **Test Cloaked Redirect (PRO)**
   - Action: Navigate to `[site-url]/[link4-slug]`
   - Expected Result: URL remains as short URL, content from target URL displayed
   - Expected Result: Browser address bar shows short URL, not target URL

8. **Verify Click Tracking for All Links**
   - Action: Login as admin, go to Analytics page
   - Expected Result: Each test link shows 1-2 clicks with correct timestamps

9. **Test Invalid Short URL (404 Handling)**
   - Action: Navigate to `[site-url]/nonexistent-slug-${Date.now()}`
   - Expected Result: WordPress 404 page displayed

10. **Test Case Sensitivity**
    - Action: If case-sensitive setting enabled, navigate to `[site-url]/[LINK1-SLUG-UPPERCASE]`
    - Expected Result: 404 if case-sensitive, redirect if case-insensitive

**Cleanup:**
- Delete all test links
- Clear analytics data

**Notes:**
- Test with bot user-agent to verify bot blocking (if enabled)
- Verify nofollow/sponsored attributes in cloaked links
- Test wildcard redirects if enabled (e.g., `/go/product/*` → `/shop/product/*`)

---

### Test Suite 3: Analytics Dashboard & Reporting

**File:** `analytics.spec.ts`
**Feature Area:** Analytics
**User Role:** Admin
**Test Type:** UI Interaction
**Priority:** High

**Description:**
Validates analytics dashboard displays, filtering, date range selection, and individual link analytics (PRO).

**Prerequisites:**
- BetterLinks activated
- Test links with existing click data

**Test Data:**
- Create 3 links with different categories
- Generate 10+ clicks across links using automation

**Test Steps:**

1. **Setup Test Data**
   - Action: Create 3 test links, simulate clicks from different browsers/OS
   - Expected Result: Click data recorded in database

2. **Navigate to Analytics Dashboard**
   - Action: Go to BetterLinks > Analytics
   - Expected Result: Dashboard loads with overview cards (Total Clicks, Total Links, Top Links)

3. **Verify Overview Statistics**
   - Action: Check overview cards
   - Expected Result: Total clicks matches expected count, top links displayed

4. **Test Date Range Filter**
   - Action: Click date picker, select "Last 7 Days"
   - Expected Result: Analytics data filtered to last 7 days
   - Action: Select custom date range (start: 30 days ago, end: today)
   - Expected Result: Data updates to custom range

5. **View Top Referrers**
   - Action: Scroll to "Top Referrers" section
   - Expected Result: List shows referrer URLs with click counts

6. **View Top Browsers**
   - Action: Check "Top Browsers" chart
   - Expected Result: Pie/bar chart shows browser distribution (Chrome, Firefox, etc.)

7. **View Top Operating Systems**
   - Action: Check "Top OS" chart
   - Expected Result: Chart shows OS distribution (Windows, Mac, Linux, etc.)

8. **View Top Devices**
   - Action: Check "Top Devices" section
   - Expected Result: Shows desktop/mobile/tablet breakdown

9. **Individual Link Analytics (PRO)**
   - Action: Click "View Analytics" on a specific link from links list
   - Expected Result: Individual analytics page opens
   - Expected Result: Shows click timeline graph, geographic data, detailed stats

10. **Export Analytics Data**
    - Action: Click "Export" button, select date range
    - Expected Result: CSV file downloads with analytics data

11. **Refresh Stats**
    - Action: Click "Refresh Stats" button
    - Expected Result: Analytics data refreshes, loading indicator shown

**Cleanup:**
- Delete test links
- Clear test analytics data

**Notes:**
- Verify IP tracking can be disabled in settings
- Test analytics with bot clicks (should be filtered if bot blocking enabled)
- Verify timezone handling for click timestamps

---

### Test Suite 4: Categories & Tags Management

**File:** `categories-tags.spec.ts`
**Feature Area:** Taxonomy Management
**User Role:** Admin
**Test Type:** UI Interaction
**Priority:** High

**Description:**
Validates creation, editing, deletion of categories and tags, and their association with links.

**Prerequisites:**
- BetterLinks activated
- User logged in as Administrator

**Test Data:**
- Category: `Test Category ${Date.now()}`
- Tag 1: `test-tag-1-${Date.now()}`
- Tag 2: `test-tag-2-${Date.now()}`

**Test Steps:**

1. **Navigate to Tags & Categories Page**
   - Action: Go to BetterLinks > Tags & Categories
   - Expected Result: Page loads with two tabs: Categories and Tags

2. **Create New Category**
   - Action: Click "Add New Category" button
   - Action: Enter category name, optional slug, optional description
   - Action: Click "Create"
   - Expected Result: Category created, appears in categories list

3. **Edit Category**
   - Action: Click edit icon on category row
   - Action: Change name to `${original_name} - Updated`
   - Action: Click "Update"
   - Expected Result: Category updated, changes reflected in list

4. **Create Link with Category**
   - Action: Go to Manage Links, create new link
   - Action: Assign test category to link
   - Expected Result: Link created with category association

5. **View Category Analytics**
   - Action: Return to Tags & Categories, click "View Analytics" on category
   - Expected Result: Shows links in category with click statistics

6. **Create Multiple Tags**
   - Action: Switch to Tags tab, create 2 tags using test data
   - Expected Result: Both tags created successfully

7. **Assign Tags to Link**
   - Action: Edit existing test link, add both tags
   - Expected Result: Tags assigned, displayed in link details

8. **Filter Links by Tag**
   - Action: Go to Manage Links, click on a tag chip
   - Expected Result: Links list filtered to show only links with that tag

9. **Bulk Delete Tags**
   - Action: Select multiple tags, use bulk delete
   - Expected Result: Tags deleted, removed from associated links

10. **Delete Category with Links**
    - Action: Attempt to delete category that has links
    - Expected Result: Warning shown, option to reassign links or delete anyway
    - Action: Reassign to "Uncategorized", confirm delete
    - Expected Result: Category deleted, links moved to Uncategorized

**Cleanup:**
- Delete all test categories and tags
- Delete test links

**Notes:**
- Verify slug auto-generation for categories/tags
- Test duplicate name validation
- Verify category/tag search functionality
- Test PRO role permissions for managing tags/categories

---

### Test Suite 5: Plugin Settings & Configuration

**File:** `settings.spec.ts`
**Feature Area:** Settings
**User Role:** Admin
**Test Type:** UI Interaction
**Priority:** High

**Description:**
Validates all plugin settings including general settings, link options, tools, and PRO features configuration.

**Prerequisites:**
- BetterLinks activated (FREE + PRO)
- User logged in as Administrator

**Test Steps:**

1. **Navigate to Settings Page**
   - Action: Go to BetterLinks > Settings
   - Expected Result: Settings page loads with tabs: General, Options, Tools, Role Management (PRO), License (PRO)

2. **Configure General Settings**
   - Action: Switch to General tab
   - Action: Change default redirect type to 301
   - Action: Set link prefix to "go"
   - Action: Enable "Track Me" by default
   - Action: Enable "Nofollow" by default
   - Action: Enable "Parameter Forwarding"
   - Action: Click "Save Settings"
   - Expected Result: Settings saved successfully, confirmation message shown

3. **Verify Default Settings Applied**
   - Action: Create new link without changing defaults
   - Expected Result: Link created with redirect type 301, tracking enabled, nofollow enabled

4. **Configure Bot Blocking**
   - Action: Return to Settings > General
   - Action: Enable "Disable Bot Clicks"
   - Action: Save settings
   - Expected Result: Bot clicks will be filtered from analytics

5. **Configure Case Sensitivity**
   - Action: Enable "Case Sensitive URLs"
   - Action: Save settings
   - Expected Result: Short URLs become case-sensitive

6. **Test Options Tab - Custom Fields**
   - Action: Switch to Options tab > Custom Fields
   - Action: Enable QR Code generation
   - Action: Enable random string generation for slugs
   - Action: Save settings
   - Expected Result: Settings saved, QR code option appears in link creation

7. **Test Options Tab - External Analytics (PRO)**
   - Action: Go to Options > External Analytics
   - Action: Enable Google Analytics integration
   - Action: Enter GA tracking code (UA-XXXXX or G-XXXXX)
   - Action: Enable Facebook Pixel tracking
   - Action: Enter Pixel ID
   - Action: Save settings
   - Expected Result: External analytics configured

8. **Test Options Tab - Auto-Link Create (PRO)**
   - Action: Go to Options > Auto-Link Create
   - Action: Enable auto-link creation for Posts
   - Action: Select default category for auto-created links
   - Action: Save settings
   - Expected Result: New posts will auto-generate short links

9. **Test Options Tab - Affiliate Disclosure (PRO)**
   - Action: Go to Options > Affiliate Disclosure
   - Action: Enable disclosure
   - Action: Enter disclosure text with rich text editor
   - Action: Select post types to show disclosure
   - Action: Save settings
   - Expected Result: Disclosure will appear on selected post types

10. **Test Tools Tab - Export Links**
    - Action: Switch to Tools tab
    - Action: Click "Export Links" button
    - Expected Result: CSV file downloads with all links data

11. **Test Tools Tab - Import Links**
    - Action: Upload sample CSV file with valid link data
    - Action: Click "Import"
    - Expected Result: Links imported successfully, count shown

12. **Test Tools Tab - Migration**
    - Action: Check for PrettyLinks/ThirstyAffiliates plugins
    - Action: If detected, click "Migrate" button
    - Expected Result: Migration starts, progress shown, links imported

**Cleanup:**
- Reset settings to defaults
- Delete imported test links

**Notes:**
- Verify settings persistence across page reloads
- Test validation for invalid GA codes, Pixel IDs
- Verify role-based access to settings (PRO)
- Test settings export/import functionality

---

### Test Suite 6: Import & Export Functionality

**File:** `import-export.spec.ts`
**Feature Area:** Data Import/Export
**User Role:** Admin
**Test Type:** UI Interaction
**Priority:** Medium

**Description:**
Validates CSV import/export, migration from PrettyLinks and ThirstyAffiliates, and data integrity.

**Prerequisites:**
- BetterLinks activated
- Sample CSV files prepared
- (Optional) PrettyLinks or ThirstyAffiliates installed for migration testing

**Test Data:**
- Sample BetterLinks CSV with 5 links
- Sample PrettyLinks CSV
- Sample ThirstyAffiliates CSV

**Test Steps:**

1. **Export Existing Links**
   - Action: Go to Settings > Tools
   - Action: Click "Export Links" button
   - Expected Result: CSV file downloads with filename `betterlinks.YYYY-MM-DD.csv`

2. **Verify Export File Structure**
   - Action: Open exported CSV in text editor
   - Expected Result: Contains headers: ID, link_author, link_date, link_title, short_url, target_url, redirect_type, etc.
   - Expected Result: Data properly formatted, no corruption

3. **Export Clicks Data**
   - Action: Click "Export Clicks" button
   - Expected Result: CSV file downloads with clicks data

4. **Download Sample Import File**
   - Action: Click "Download Sample File" button
   - Expected Result: Sample CSV downloads with example data

5. **Import Valid CSV File**
   - Action: Click "Import Links" button
   - Action: Select valid BetterLinks CSV file
   - Action: Click "Import"
   - Expected Result: Import progress shown, success message with count
   - Expected Result: Imported links appear in Manage Links

6. **Verify Imported Link Data**
   - Action: Check imported links in list
   - Expected Result: All fields imported correctly (title, URL, redirect type, categories, tags)

7. **Import with Duplicate Slugs**
   - Action: Import CSV with slug that already exists
   - Expected Result: Error message for duplicate, other links imported successfully

8. **Import Invalid CSV Format**
   - Action: Upload CSV with missing required columns
   - Expected Result: Validation error shown, import rejected

9. **Migrate from PrettyLinks (One-Click)**
   - Action: If PrettyLinks detected, click "Migrate from PrettyLinks"
   - Expected Result: Migration modal opens with link count
   - Action: Click "Start Migration"
   - Expected Result: Progress bar shown, links migrated with categories and clicks

10. **Migrate from ThirstyAffiliates (CSV)**
    - Action: Export links from ThirstyAffiliates as CSV
    - Action: In BetterLinks, select "Import from ThirstyAffiliates"
    - Action: Upload CSV, enter link prefix if needed
    - Action: Click "Import"
    - Expected Result: Links imported with keywords and settings preserved

11. **Verify Migration Data Integrity**
    - Action: Check migrated links
    - Expected Result: All data preserved (titles, URLs, categories, click counts)

**Cleanup:**
- Delete imported test links
- Remove test CSV files

**Notes:**
- Test large CSV imports (100+ links) for performance
- Verify character encoding (UTF-8) for international characters
- Test import rollback on errors
- Verify auto-link keywords import/export (PRO)

---

### Test Suite 7: User Role Permissions (PRO)

**File:** `user-permissions.spec.ts`
**Feature Area:** Role Management (PRO)
**User Role:** Admin, Editor, Author, Contributor
**Test Type:** Combined (UI + Permission Checks)
**Priority:** High

**Description:**
Validates role-based access control for different user roles with custom permissions configured in PRO version.

**Prerequisites:**
- BetterLinks PRO activated
- Test users created for each role: Editor, Author, Contributor

**Test Data:**
- Test link for permission testing
- Role configurations for different capabilities

**Test Steps:**

1. **Configure Role Permissions (Admin)**
   - Action: Login as Admin, go to Settings > Role Management
   - Expected Result: Role management page loads with permission checkboxes

2. **Grant Editor Full Permissions**
   - Action: Check all permissions for Editor role:
     - View Links
     - Create Links
     - Edit Links
     - Check Analytics
     - Edit Settings
     - Mark Favorites
     - Manage Auto-Keywords
     - Manage Tags & Categories
   - Action: Click "Save Settings"
   - Expected Result: Permissions saved successfully

3. **Grant Author Limited Permissions**
   - Action: Check only "View Links" and "Create Links" for Author role
   - Action: Save settings
   - Expected Result: Author can only view and create, not edit or delete

4. **Test Editor Permissions - Full Access**
   - Action: Logout, login as Editor user
   - Expected Result: BetterLinks menu visible in admin
   - Action: Navigate to Manage Links
   - Expected Result: Can view all links, create/edit/delete buttons visible
   - Action: Create new link
   - Expected Result: Link created successfully
   - Action: Edit existing link
   - Expected Result: Can edit and save changes
   - Action: Go to Analytics
   - Expected Result: Analytics page accessible
   - Action: Go to Settings
   - Expected Result: Settings page accessible

5. **Test Author Permissions - Limited Access**
   - Action: Logout, login as Author user
   - Expected Result: BetterLinks menu visible
   - Action: Navigate to Manage Links
   - Expected Result: Can view links list
   - Action: Click "Add New"
   - Expected Result: Can create new link
   - Action: Try to edit existing link
   - Expected Result: Edit button disabled or shows permission error
   - Action: Try to access Analytics
   - Expected Result: Menu item hidden or access denied
   - Action: Try to access Settings
   - Expected Result: Menu item hidden or access denied

6. **Test Contributor Permissions - No Access**
   - Action: Logout, login as Contributor user
   - Expected Result: BetterLinks menu not visible (no permissions granted)
   - Action: Try to access via direct URL: `/wp-admin/admin.php?page=betterlinks`
   - Expected Result: Access denied message or redirect

7. **Test Favorite Permission**
   - Action: Login as Admin, revoke "Mark Favorites" from Editor
   - Action: Login as Editor, try to mark link as favorite
   - Expected Result: Star icon disabled or action fails with permission error

8. **Test Tags & Categories Management Permission**
   - Action: Login as Admin, revoke "Manage Tags & Categories" from Editor
   - Action: Login as Editor, go to Tags & Categories page
   - Expected Result: Page not accessible or shows read-only view

9. **Test Auto-Keywords Management Permission (PRO)**
   - Action: Login as Admin, grant "Manage Auto-Keywords" to Author
   - Action: Login as Author, go to Settings > Options > Auto-Link Keywords
   - Expected Result: Can create and manage auto-link keywords

10. **Test REST API Permission Enforcement**
    - Action: As Author (with limited permissions), attempt API call to delete link
    - Expected Result: API returns 403 Forbidden error

**Cleanup:**
- Reset role permissions to defaults
- Delete test links created by test users

**Notes:**
- Verify permission checks on both UI and API level
- Test that Administrators always have full access regardless of settings
- Verify permission inheritance (e.g., Edit Links implies View Links)
- Test permission changes take effect immediately without logout

---

### Test Suite 8: Link Scheduling & Expiration (PRO)

**File:** `link-scheduling.spec.ts`
**Feature Area:** Link Scheduling (PRO)
**User Role:** Admin
**Test Type:** Combined (UI + Cron)
**Priority:** Medium

**Description:**
Validates scheduled link publishing, link expiration by date or click count, and redirect behavior for expired links.

**Prerequisites:**
- BetterLinks PRO activated
- WordPress cron enabled

**Test Data:**
- Scheduled link: publish 5 minutes in future
- Expiring link: expire after 3 clicks
- Date-based expiring link: expire tomorrow

**Test Steps:**

1. **Create Scheduled Link**
   - Action: Go to Manage Links, click "Add New"
   - Action: Fill link details
   - Action: Change status to "Scheduled"
   - Action: Set publish date to 5 minutes in future
   - Action: Click "Create Link"
   - Expected Result: Link created with "Scheduled" status

2. **Verify Scheduled Link Not Accessible**
   - Action: Try to access short URL in frontend
   - Expected Result: 404 error or "Link not yet available" message

3. **Verify Scheduled Link in Admin**
   - Action: Check Manage Links list
   - Expected Result: Link shows "Scheduled" badge with publish date

4. **Wait for Scheduled Publish**
   - Action: Wait 5+ minutes (or trigger WP cron manually)
   - Expected Result: Link status changes to "Published"

5. **Verify Published Link Accessible**
   - Action: Access short URL in frontend
   - Expected Result: Redirects successfully to target URL

6. **Create Link with Click-Based Expiration**
   - Action: Create new link
   - Action: Enable "Link Expiration"
   - Action: Set expiration type to "Clicks"
   - Action: Set click limit to 3
   - Action: Set expiration redirect URL
   - Action: Save link
   - Expected Result: Link created with expiration settings

7. **Test Click-Based Expiration**
   - Action: Access short URL 3 times from different browsers/IPs
   - Expected Result: First 3 clicks redirect to target URL
   - Action: Access short URL 4th time
   - Expected Result: Redirects to expiration redirect URL or shows expired message

8. **Create Link with Date-Based Expiration**
   - Action: Create new link
   - Action: Enable "Link Expiration"
   - Action: Set expiration type to "Date"
   - Action: Set expiration date to tomorrow
   - Action: Set expiration redirect URL
   - Action: Save link
   - Expected Result: Link created with date expiration

9. **Verify Link Active Before Expiration**
   - Action: Access short URL
   - Expected Result: Redirects to target URL normally

10. **Test Date-Based Expiration**
    - Action: Manually change system date to day after expiration (or wait)
    - Expected Result: Link redirects to expiration URL or shows expired message

11. **Edit Expiration Settings**
    - Action: Edit expired link, disable expiration
    - Action: Save changes
    - Expected Result: Link becomes active again

**Cleanup:**
- Delete all test scheduled/expired links
- Reset system date if changed

**Notes:**
- Test timezone handling for scheduled publish dates
- Verify expiration works with different redirect types
- Test that expired links still show in analytics
- Verify scheduled links appear in calendar view (if available)

---

### Test Suite 9: Dynamic Redirects & Split Testing (PRO)

**File:** `dynamic-redirects.spec.ts`
**Feature Area:** Dynamic Redirects (PRO)
**User Role:** Admin
**Test Type:** Combined (UI + Frontend)
**Priority:** Medium

**Description:**
Validates dynamic redirect configurations including rotation modes (sequential, random, weighted) and split testing with goal tracking.

**Prerequisites:**
- BetterLinks PRO activated
- Multiple target URLs for testing

**Test Data:**
- Target URL 1: `https://example.com/page-a`
- Target URL 2: `https://example.com/page-b`
- Target URL 3: `https://example.com/page-c`

**Test Steps:**

1. **Create Link with Sequential Rotation**
   - Action: Create new link
   - Action: Enable "Dynamic Redirect"
   - Action: Select rotation type: "Sequential"
   - Action: Add 3 target URLs with test data
   - Action: Save link
   - Expected Result: Link created with dynamic redirect enabled

2. **Test Sequential Rotation**
   - Action: Access short URL 6 times
   - Expected Result: Redirects cycle through URLs in order: A, B, C, A, B, C

3. **Verify Rotation Tracking**
   - Action: Check link analytics
   - Expected Result: Shows which target URL was used for each click

4. **Create Link with Random Rotation**
   - Action: Create new link with dynamic redirect
   - Action: Select rotation type: "Random"
   - Action: Add 3 target URLs
   - Action: Save link
   - Expected Result: Link created

5. **Test Random Rotation**
   - Action: Access short URL 10 times
   - Expected Result: Redirects to random URLs (distribution may vary)

6. **Create Link with Weighted Rotation**
   - Action: Create new link with dynamic redirect
   - Action: Select rotation type: "Weighted"
   - Action: Add 3 target URLs with weights:
     - URL A: 50%
     - URL B: 30%
     - URL C: 20%
   - Action: Save link
   - Expected Result: Link created with weighted distribution

7. **Test Weighted Rotation**
   - Action: Access short URL 100 times (automated)
   - Expected Result: Distribution approximately matches weights (50/30/20)

8. **Enable Split Testing**
   - Action: Edit weighted rotation link
   - Action: Enable "Split Test" mode
   - Action: Set goal link (conversion URL)
   - Action: Save link
   - Expected Result: Split test activated

9. **Test Split Test Tracking**
   - Action: Access short URL, click through to target
   - Action: Navigate to goal URL
   - Expected Result: Conversion tracked for that target URL variant

10. **View Split Test Results**
    - Action: Go to link analytics
    - Expected Result: Shows conversion rates for each variant
    - Expected Result: Displays winner based on conversion rate

11. **Test Geographic-Based Dynamic Redirect (if available)**
    - Action: Create link with geo-targeting
    - Action: Set different URLs for different countries
    - Action: Test with VPN from different locations
    - Expected Result: Redirects to country-specific URL

**Cleanup:**
- Delete all dynamic redirect test links
- Clear analytics data

**Notes:**
- Verify rotation state persists across server restarts
- Test that dynamic redirects work with parameter forwarding
- Verify split test data accuracy
- Test device-based and time-based dynamic redirects if available

---

### Test Suite 10: Broken Link Checker & Link Scanner (PRO)

**File:** `broken-link-checker.spec.ts`
**Feature Area:** Link Scanner (PRO)
**User Role:** Admin
**Test Type:** Combined (UI + Background Process)
**Priority:** Medium

**Description:**
Validates broken link detection for BetterLinks short links and full-site link scanning with email notifications.

**Prerequisites:**
- BetterLinks PRO activated
- Test links with valid and broken target URLs

**Test Data:**
- Valid link: `https://example.com/valid-page`
- Broken link: `https://example.com/404-page-not-found`
- Slow link: `https://httpstat.us/200?sleep=5000`

**Test Steps:**

1. **Navigate to Link Scanner**
   - Action: Go to BetterLinks > Link Scanner
   - Expected Result: Link Scanner page loads with two tabs: BetterLinks Scanner, Full Site Scanner

2. **Configure BetterLinks Broken Link Scanner**
   - Action: Click "Settings" button
   - Action: Enable "Automatic Scan"
   - Action: Set scan frequency to "Daily"
   - Action: Set scan time to specific hour
   - Action: Enable email notifications
   - Action: Enter admin email
   - Action: Save settings
   - Expected Result: Scanner configured successfully

3. **Create Test Links**
   - Action: Create 3 links: one valid, one broken (404), one slow response
   - Expected Result: All links created

4. **Run Manual Scan**
   - Action: Click "Scan Now" button on Link Scanner page
   - Expected Result: Scan starts, progress indicator shown

5. **Verify Scan Results**
   - Action: Wait for scan to complete
   - Expected Result: Results table shows:
     - Valid link: Status "OK" (200)
     - Broken link: Status "Broken" (404)
     - Slow link: Status "OK" but with warning for slow response

6. **View Broken Link Details**
   - Action: Click on broken link row
   - Expected Result: Details modal shows error message, status code, last checked time

7. **Fix Broken Link**
   - Action: Click "Edit" on broken link
   - Action: Update target URL to valid URL
   - Action: Save changes
   - Expected Result: Link updated

8. **Re-scan Single Link**
   - Action: Click "Re-check" button on the fixed link
   - Expected Result: Link re-scanned, status updates to "OK"

9. **Test Email Notification**
   - Action: Wait for scheduled scan or trigger manually
   - Expected Result: Email sent to admin with broken links report
   - Expected Result: Email contains link titles, URLs, status codes

10. **Configure Full Site Scanner**
    - Action: Switch to "Full Site Scanner" tab
    - Action: Enable full site scanning
    - Action: Select post types to scan (Posts, Pages)
    - Action: Click "Start Scan"
    - Expected Result: Full site scan begins

11. **View Full Site Scan Results**
    - Action: Wait for scan completion
    - Expected Result: Results show all links found on site with status
    - Expected Result: Broken external links highlighted

12. **Export Scan Results**
    - Action: Click "Export Results" button
    - Expected Result: CSV file downloads with all scanned links and statuses

**Cleanup:**
- Delete test links
- Disable automatic scanning
- Clear scan results

**Notes:**
- Test scan performance with large number of links (100+)
- Verify timeout handling for very slow links
- Test that scanning doesn't impact site performance
- Verify SSL certificate validation for HTTPS links
- Test redirect chain detection (301 → 301 → 200)

---

### Test Suite 11: Auto-Link Keywords (PRO)

**File:** `auto-link-keywords.spec.ts`
**Feature Area:** Auto-Link Keywords (PRO)
**User Role:** Admin
**Test Type:** Combined (UI + Frontend)
**Priority:** Medium

**Description:**
Validates automatic keyword linking in post content, keyword management, and configuration options.

**Prerequisites:**
- BetterLinks PRO activated
- Test posts/pages with content

**Test Data:**
- Keyword 1: "WordPress"
- Keyword 2: "SEO optimization"
- Test post content containing keywords

**Test Steps:**

1. **Navigate to Auto-Link Keywords**
   - Action: Go to Settings > Options > Auto-Link Keywords
   - Expected Result: Auto-link keywords management page loads

2. **Create Auto-Link Keyword**
   - Action: Click "Add New Keyword"
   - Action: Enter keyword: "WordPress"
   - Action: Select target link from dropdown
   - Action: Set max replacements per page: 3
   - Action: Enable "Case Sensitive"
   - Action: Select post types: Posts, Pages
   - Action: Save keyword
   - Expected Result: Keyword created successfully

3. **Create Second Keyword with Filters**
   - Action: Add keyword "SEO optimization"
   - Action: Select target link
   - Action: Add category filter: only posts in "Marketing" category
   - Action: Add tag filter: only posts with "tutorial" tag
   - Action: Save keyword
   - Expected Result: Keyword created with filters

4. **Create Test Post**
   - Action: Go to Posts > Add New
   - Action: Write content containing "WordPress" 5 times and "SEO optimization" 2 times
   - Action: Publish post
   - Expected Result: Post published

5. **Verify Auto-Linking on Frontend**
   - Action: View published post on frontend
   - Expected Result: First 3 instances of "WordPress" are linked to target URL
   - Expected Result: Remaining 2 instances are plain text (max limit reached)
   - Expected Result: "SEO optimization" instances are linked

6. **Verify Link Attributes**
   - Action: Inspect auto-linked keywords in browser
   - Expected Result: Links have class "btl_autolink_hyperlink"
   - Expected Result: Links have data-link-id attribute
   - Expected Result: Nofollow/sponsored attributes applied if configured

7. **Test Case Sensitivity**
   - Action: Create post with "wordpress" (lowercase)
   - Expected Result: Not linked (case sensitive enabled)
   - Action: Edit keyword, disable case sensitivity
   - Expected Result: "wordpress" now gets linked

8. **Test Category/Tag Filters**
   - Action: Create post in different category (not "Marketing")
   - Action: Include "SEO optimization" keyword
   - Expected Result: Keyword NOT linked (category filter doesn't match)

9. **Test Post Type Exclusion**
   - Action: Go to Settings > General
   - Action: Add "Page" to excluded post types for auto-linking
   - Action: Create page with keywords
   - Expected Result: Keywords not linked on pages

10. **Disable Auto-Linking for Specific Post**
    - Action: Edit test post
    - Action: Check "Disable Auto-Link Keywords" meta box
    - Action: Update post
    - Expected Result: Keywords no longer linked in that specific post

11. **Test Auto-Link Icon (if enabled)**
    - Action: Enable "Show Auto-Link Icon" in settings
    - Action: View post on frontend
    - Expected Result: Small icon appears next to auto-linked keywords

12. **Import/Export Keywords**
    - Action: Go to Auto-Link Keywords page
    - Action: Click "Export Keywords"
    - Expected Result: JSON file downloads with all keywords
    - Action: Click "Import Keywords", upload file
    - Expected Result: Keywords imported successfully

13. **Bulk Delete Keywords**
    - Action: Select multiple keywords, click "Bulk Delete"
    - Expected Result: Keywords deleted, no longer applied to content

**Cleanup:**
- Delete all test keywords
- Delete test posts
- Reset auto-link settings

**Notes:**
- Verify auto-linking doesn't break HTML structure
- Test that keywords inside HTML tags are not linked
- Verify performance with large content and many keywords
- Test that auto-linking respects heading exclusion setting
- Verify click tracking works for auto-linked keywords

---

### Test Suite 12: External Analytics Integration (PRO)

**File:** `external-analytics.spec.ts`
**Feature Area:** External Analytics (PRO)
**User Role:** Admin
**Test Type:** Combined (UI + API)
**Priority:** Low

**Description:**
Validates Google Analytics (UA & GA4) and Facebook Pixel integration for tracking link clicks.

**Prerequisites:**
- BetterLinks PRO activated
- Google Analytics account (UA or GA4)
- Facebook Pixel account (optional)

**Test Data:**
- GA UA Tracking ID: `UA-XXXXX-X` (test/demo)
- GA4 Measurement ID: `G-XXXXXXXXXX` (test/demo)
- GA4 API Secret: `test_secret`
- Facebook Pixel ID: `123456789`

**Test Steps:**

1. **Navigate to External Analytics Settings**
   - Action: Go to Settings > Options > External Analytics
   - Expected Result: External analytics configuration page loads

2. **Configure Google Analytics UA**
   - Action: Enable "Google Analytics Integration"
   - Action: Enter UA Tracking ID
   - Action: Save settings
   - Expected Result: GA UA configured successfully

3. **Test GA UA Tracking**
   - Action: Create test link, access it on frontend
   - Expected Result: Click event sent to Google Analytics
   - Action: Check GA Real-Time reports
   - Expected Result: Event appears in GA dashboard

4. **Configure Google Analytics 4**
   - Action: Change tracking ID to GA4 Measurement ID (G-XXXXX)
   - Action: Enter GA4 API Secret
   - Action: Save settings
   - Expected Result: GA4 configured

5. **Test GA4 Tracking**
   - Action: Access test link on frontend
   - Expected Result: Page view event sent to GA4 via Measurement Protocol
   - Action: Check GA4 Real-Time reports
   - Expected Result: Event appears in GA4 dashboard

6. **Configure Facebook Pixel**
   - Action: Enable "Facebook Pixel Integration"
   - Action: Enter Pixel ID
   - Action: Save settings
   - Expected Result: Pixel configured

7. **Test Facebook Pixel Tracking**
   - Action: Access test link on frontend
   - Action: Open browser console, check for fbq() calls
   - Expected Result: Facebook Pixel fires with custom event
   - Action: Check Facebook Events Manager
   - Expected Result: Event appears in real-time events

8. **Test Parameter Tracking**
   - Action: Enable "Parameter Tracking" in settings
   - Action: Select parameters to track: UTM, Target URL, Platform
   - Action: Save settings
   - Expected Result: Parameter tracking enabled

9. **Verify Parameter Tracking**
   - Action: Access link with UTM parameters: `?utm_source=test&utm_campaign=demo`
   - Expected Result: Parameters sent to GA/Pixel with event
   - Action: Check analytics platform
   - Expected Result: UTM parameters visible in event data

10. **Test Server-Side Tracking**
    - Action: Access link with JavaScript disabled
    - Expected Result: Server-side tracking still sends events to GA/Pixel

11. **Verify Privacy Compliance**
    - Action: Check that IP addresses are anonymized (if configured)
    - Expected Result: Analytics data doesn't contain full IP addresses

12. **Test Multiple Analytics Platforms**
    - Action: Enable both GA and Pixel simultaneously
    - Action: Access test link
    - Expected Result: Events sent to both platforms successfully

**Cleanup:**
- Disable external analytics integrations
- Remove test tracking IDs
- Delete test links

**Notes:**
- Use test/demo tracking IDs to avoid polluting production analytics
- Verify GDPR compliance features (cookie consent integration)
- Test that tracking doesn't slow down redirects
- Verify error handling for invalid tracking IDs
- Test that bot traffic is excluded from external analytics

---

## Test Execution Guidelines

### Setup Requirements

1. **WordPress Environment:**
   - WordPress 5.0+ installed
   - PHP 7.4+ configured
   - MySQL/MariaDB database
   - Permalink structure set to "Post name" or custom

2. **Plugin Installation:**
   - BetterLinks FREE version 2.3.1+ installed and activated
   - BetterLinks PRO version 2.3.2+ installed and activated
   - License activated for PRO features

3. **Test Users:**
   - Administrator account
   - Editor account
   - Author account
   - Contributor account
   - Subscriber account

4. **Test Data Preparation:**
   - Sample CSV files for import testing
   - Test images for QR codes
   - Sample post/page content

### Test Data Management

**Naming Convention:**
- Use timestamps in test data: `test-link-${Date.now()}`
- Prefix all test data with "test-" or "e2e-"
- Include unique identifiers to prevent conflicts

**Cleanup Strategy:**
- Each test should clean up its own data in teardown
- Use try-finally blocks to ensure cleanup runs
- Implement global cleanup function for orphaned test data
- Query database for test data patterns and remove

### Execution Order

**Recommended sequence:**
1. Settings configuration tests (establish baseline)
2. Link management tests (core functionality)
3. Frontend redirect tests (verify basic behavior)
4. Analytics tests (verify tracking)
5. Categories/tags tests (taxonomy)
6. Import/export tests (data operations)
7. PRO feature tests (advanced functionality)

### Error Handling

- Capture screenshots on test failures
- Log API responses for debugging
- Save browser console logs
- Record network traffic for redirect tests

### Performance Considerations

- Run tests in parallel where possible (independent tests)
- Use database transactions for faster cleanup
- Cache WordPress admin authentication
- Reuse browser contexts when appropriate

---

## Known Limitations & Edge Cases

### Limitations

1. **Onboarding Wizard:** Tests skip the initial setup wizard (assumes completed)
2. **External Services:** No testing of actual external API integrations (GA, Pixel use test IDs)
3. **Multisite:** Tests only cover single-site WordPress installations
4. **Cross-Browser:** Tests only run on Chrome desktop
5. **Email Delivery:** Email notifications tested for sending, not actual delivery

### Edge Cases to Consider

1. **Concurrent Edits:** Multiple users editing same link simultaneously
2. **Large Datasets:** Performance with 10,000+ links
3. **Special Characters:** Unicode, emojis in link titles and slugs
4. **Long URLs:** Target URLs exceeding 2000 characters
5. **Rapid Clicks:** Multiple clicks on same link within milliseconds
6. **Timezone Changes:** Links scheduled across DST transitions
7. **Database Failures:** Handling of connection errors during operations
8. **Cache Conflicts:** Interaction with caching plugins
9. **Permalink Changes:** Behavior when WordPress permalink structure changes
10. **Plugin Conflicts:** Compatibility with other link management plugins

---

## Success Criteria

### Test Pass Criteria

- All high-priority tests pass (100%)
- Medium-priority tests: 95%+ pass rate
- Low-priority tests: 90%+ pass rate
- No critical bugs identified
- Performance benchmarks met (page load < 2s, redirect < 500ms)

### Quality Metrics

- Code coverage: 80%+ of plugin PHP code
- API coverage: 100% of REST endpoints tested
- UI coverage: All admin pages and modals tested
- Frontend coverage: All redirect types and scenarios tested

---

## Appendix

### Test Data Templates

**Sample Link CSV:**
```csv
ID,link_author,link_date,link_title,short_url,target_url,redirect_type,nofollow,track_me
1,1,2024-01-01 00:00:00,Test Link,go/test,https://example.com,307,1,1
```

**Sample Keyword JSON:**
```json
{
  "keywords": "WordPress",
  "link_id": 123,
  "limit": 3,
  "case_sensitive": false,
  "post_types": ["post", "page"]
}
```

### Useful Selectors

**Admin UI:**
- Add New Link Button: `.btl-add-new-link`
- Links Table: `.btl-links-table`
- Search Input: `.btl-search-input`
- Redirect Type Dropdown: `#redirect_type`
- Save Button: `.btl-save-link`

**Frontend:**
- Auto-linked keyword: `.btl_autolink_hyperlink`
- Link with tracking: `[data-link-id]`

### API Endpoints

- Get Links: `GET /wp-json/betterlinks/v1/links/`
- Create Link: `POST /wp-json/betterlinks/v1/links/`
- Update Link: `PUT /wp-json/betterlinks/v1/links/{id}`
- Delete Link: `DELETE /wp-json/betterlinks/v1/links/{id}`
- Get Analytics: `GET /wp-json/betterlinks/v1/clicks/`
- Get Settings: `GET /wp-json/betterlinks/v1/settings/`

---

**Document Version:** 1.0
**Last Updated:** 2025-09-30
**Author:** AI Test Automation Analyst
**Status:** Ready for Implementation


