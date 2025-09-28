# Core Link Management Test Cases

## Overview
This document contains comprehensive test cases for core link management functionality that is common to both BetterLinks FREE and PRO versions. These tests cover the fundamental CRUD operations and basic link management features.

## Test Case Categories
- Link Creation and Validation
- Link Editing and Updates
- Link Deletion and Bulk Operations
- Link Status Management
- URL Validation and Sanitization
- Short URL Generation and Conflicts

---

## Link Creation Tests

### Test Case: Create Basic Short Link
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator
- BetterLinks plugin activated
- Clean database state

**Test Steps**:
1. Navigate to WordPress admin dashboard
2. Click on "BetterLinks" menu item
3. Click "Add New Link" button or equivalent
4. Fill in the following fields:
   - Link Title: "Test Product Link"
   - Target URL: "https://example.com/product/123"
   - Short URL: "product-123"
5. Select redirect type: "307 Temporary Redirect"
6. Enable "Track clicks" option
7. Click "Save Link" button

**Expected Results**:
- Link created successfully with ID assigned
- Short URL accessible at: `{site_url}/product-123`
- Link appears in links list with correct details
- Database record created in `wp_betterlinks` table
- Success notification displayed

**Data Cleanup**:
- Delete created link via admin interface
- Verify database record removed

---

### Test Case: Create Link with Auto-Generated Short URL
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator
- Clean database state

**Test Steps**:
1. Navigate to BetterLinks > Add New Link
2. Fill in Link Title: "Auto Generated Short URL Test"
3. Fill in Target URL: "https://example.com/auto-test"
4. Leave Short URL field empty
5. Click "Save Link" button

**Expected Results**:
- Link created with auto-generated short URL based on title
- Short URL follows pattern: "auto-generated-short-url-test"
- Link accessible via generated short URL
- No conflicts with existing short URLs

**Data Cleanup**:
- Delete created link
- Verify auto-generated slug removed from database

---

### Test Case: Create Link with Special Characters in Title
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator

**Test Steps**:
1. Navigate to BetterLinks > Add New Link
2. Fill in Link Title: "Special Chars: @#$%^&*()_+{}|:<>?[]\\;'\",./"
3. Fill in Target URL: "https://example.com/special"
4. Fill in Short URL: "special-chars-test"
5. Click "Save Link" button

**Expected Results**:
- Link created successfully
- Title stored exactly as entered
- Short URL sanitized properly
- No JavaScript injection or XSS vulnerabilities

**Data Cleanup**:
- Delete created link

---

### Test Case: Validate Required Fields
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator

**Test Steps**:
1. Navigate to BetterLinks > Add New Link
2. Leave all fields empty
3. Click "Save Link" button
4. Fill only Link Title: "Test Title"
5. Click "Save Link" button
6. Add Target URL: "https://example.com"
7. Click "Save Link" button

**Expected Results**:
- Step 3: Validation error for missing required fields
- Step 5: Validation error for missing Target URL
- Step 7: Link created successfully
- Appropriate error messages displayed for each validation failure

**Data Cleanup**:
- Delete successfully created link

---

## Link Editing Tests

### Test Case: Edit Existing Link Details
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- Test link exists with ID=1, title="Original Title", target="https://example.com/original"

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Click "Edit" action for the test link
3. Update Link Title to: "Updated Title"
4. Update Target URL to: "https://example.com/updated"
5. Change redirect type from 307 to 301
6. Click "Update Link" button

**Expected Results**:
- Link updated successfully
- Title changed in database and UI
- Target URL updated correctly
- Redirect type changed to 301
- Short URL remains unchanged
- Update timestamp modified

**Data Cleanup**:
- Revert changes or delete test link

---

### Test Case: Edit Short URL with Conflict Detection
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Two test links exist: "test-1" and "test-2"

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Edit link with short URL "test-1"
3. Change short URL to "test-2" (existing URL)
4. Click "Update Link" button
5. Change short URL to "test-3" (non-existing URL)
6. Click "Update Link" button

**Expected Results**:
- Step 4: Validation error about duplicate short URL
- Step 6: Update successful with new short URL "test-3"
- Original "test-2" link remains unchanged
- Proper error messaging for conflicts

**Data Cleanup**:
- Delete test links

---

## Link Deletion Tests

### Test Case: Delete Single Link
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- Test link exists with associated click data

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Hover over test link row
3. Click "Delete" action link
4. Confirm deletion in popup/modal
5. Verify link removed from list
6. Test short URL returns 404

**Expected Results**:
- Link removed from database
- Associated click data deleted (cascade)
- Short URL no longer accessible
- Success message displayed
- Links list updated without deleted item

**Data Cleanup**:
- No cleanup needed (link deleted)

---

### Test Case: Bulk Delete Multiple Links
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- 5 test links exist in database

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Select checkboxes for 3 links
3. Choose "Delete" from bulk actions dropdown
4. Click "Apply" button
5. Confirm bulk deletion

**Expected Results**:
- All 3 selected links deleted
- 2 unselected links remain
- Bulk action success message
- Database records removed
- Associated data cleaned up

**Data Cleanup**:
- Delete remaining test links

---

## Link Status Management Tests

### Test Case: Toggle Link Status (Publish/Draft)
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link exists with status "publish"

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Click status toggle for test link (publish → draft)
3. Test short URL accessibility
4. Toggle back to publish status
5. Test short URL accessibility again

**Expected Results**:
- Step 2: Status changed to "draft" in database
- Step 3: Short URL returns 404 or redirect disabled
- Step 4: Status changed back to "publish"
- Step 5: Short URL works normally
- Status changes reflected in UI immediately

**Data Cleanup**:
- Ensure link status is "publish"
- Delete test link

---

## URL Validation Tests

### Test Case: Validate Target URL Formats
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator

**Test Steps**:
1. Try creating links with various target URLs:
   - "https://example.com" (valid HTTPS)
   - "http://example.com" (valid HTTP)
   - "ftp://files.example.com" (FTP protocol)
   - "mailto:test@example.com" (mailto protocol)
   - "example.com" (no protocol)
   - "invalid-url" (invalid format)
   - "" (empty URL)

**Expected Results**:
- HTTPS/HTTP URLs accepted
- FTP and mailto protocols handled appropriately
- URLs without protocol auto-prefixed with http://
- Invalid formats rejected with error message
- Empty URLs rejected
- Proper validation messages displayed

**Data Cleanup**:
- Delete any successfully created test links

---

### Test Case: Short URL Character Validation
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator

**Test Steps**:
1. Try creating links with various short URLs:
   - "valid-slug" (valid format)
   - "valid_slug_123" (underscores and numbers)
   - "UPPERCASE" (uppercase letters)
   - "special@chars#" (special characters)
   - "spaces in url" (spaces)
   - "very-long-url-that-exceeds-normal-length-limits-and-should-be-tested"

**Expected Results**:
- Valid slugs accepted
- Uppercase converted to lowercase (if case-insensitive)
- Special characters sanitized or rejected
- Spaces converted to hyphens or rejected
- Length limits enforced
- Appropriate validation messages

**Data Cleanup**:
- Delete successfully created test links

---

## Link Categories and Tags Tests

### Test Case: Assign Categories to Links
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Categories "Marketing" and "Business" exist

**Test Steps**:
1. Create new link with title "Categorized Link"
2. Assign to "Marketing" category
3. Save link
4. Edit link and change category to "Business"
5. Save changes

**Expected Results**:
- Link created with Marketing category
- Category relationship stored in database
- Category change updated successfully
- Link appears in category-filtered views

**Data Cleanup**:
- Delete test link
- Remove test categories if created

---

### Test Case: Add Multiple Tags to Link
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- User logged in as administrator

**Test Steps**:
1. Create new link
2. Add tags: "affiliate", "marketing", "social"
3. Save link
4. Edit link and remove "social" tag
5. Add new tag "business"
6. Save changes

**Expected Results**:
- Link created with 3 tags
- Tag relationships stored correctly
- Tag removal and addition work properly
- Tags display correctly in link list

**Data Cleanup**:
- Delete test link and associated tags

---

## Link Search and Filtering Tests

### Test Case: Search Links by Title
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Multiple test links with different titles exist

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Use search box to search for "Product"
3. Verify results show only links with "Product" in title
4. Clear search and verify all links shown
5. Search for non-existent term

**Expected Results**:
- Search returns accurate results
- Only matching links displayed
- Clear search restores full list
- No results message for non-existent terms
- Search is case-insensitive

**Data Cleanup**:
- Delete test links

---

### Test Case: Filter Links by Status
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Links exist with different statuses (publish, draft)

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Filter by "Published" status
3. Verify only published links shown
4. Filter by "Draft" status
5. Verify only draft links shown
6. Select "All" status filter

**Expected Results**:
- Status filters work correctly
- Link counts match filter criteria
- Filter UI updates appropriately
- All links shown when "All" selected

**Data Cleanup**:
- Delete test links

---

## Pagination and Sorting Tests

### Test Case: Links List Pagination
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- More than 20 test links exist (assuming 20 per page)

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Verify pagination controls appear
3. Click "Next" page
4. Verify different links shown
5. Click specific page number
6. Test "Previous" navigation

**Expected Results**:
- Pagination controls display correctly
- Page navigation works properly
- Correct number of items per page
- Page numbers accurate
- Navigation maintains any active filters

**Data Cleanup**:
- Delete test links

---

### Test Case: Sort Links by Different Columns
**Priority**: P3 (Low)
**User Role**: Admin
**Preconditions**: 
- Multiple test links with different creation dates and titles

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Click "Title" column header to sort
3. Verify alphabetical sorting
4. Click "Date" column header
5. Verify chronological sorting
6. Click same header again for reverse sort

**Expected Results**:
- Column sorting works correctly
- Sort direction indicators display
- Data sorted appropriately
- Reverse sorting functions
- Sort state maintained during pagination

**Data Cleanup**:
- Delete test links
