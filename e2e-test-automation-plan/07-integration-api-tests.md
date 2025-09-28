# Integration and API Test Cases

## Overview
This document contains comprehensive test cases for BetterLinks integrations and API functionality, including REST API endpoints, Gutenberg block integration, Elementor widget integration, and third-party service integrations.

## Test Case Categories
- REST API Endpoint Testing
- Gutenberg Block Integration
- Elementor Widget Integration
- Google Analytics Integration
- Facebook Pixel Integration
- Third-Party Plugin Compatibility
- Webhook and External API Integration

---

## REST API Endpoint Tests

### Test Case: Links API - GET All Links
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- REST API enabled
- Test links exist in database
- User authenticated with proper permissions

**Test Steps**:
1. Send GET request to `/wp-json/betterlinks/v1/links`
2. Verify response status code (200)
3. Check response format and structure
4. Validate data accuracy against database
5. Test pagination parameters
6. Test filtering parameters

**Expected Results**:
- Status code: 200 OK
- Response contains array of link objects
- All required fields present in response
- Data matches database records
- Pagination works correctly
- Filtering parameters function properly

**Data Cleanup**:
- No cleanup needed (read-only operation)

---

### Test Case: Links API - Create New Link
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- User authenticated with link creation permissions
- Valid request payload prepared

**Test Steps**:
1. Send POST request to `/wp-json/betterlinks/v1/links` with payload:
   ```json
   {
     "title": "API Test Link",
     "target_url": "https://example.com/api-test",
     "short_url": "api-test",
     "redirect_type": "307",
     "track_me": true
   }
   ```
2. Verify response status code (201)
3. Check created link in database
4. Verify response contains created link data
5. Test short URL functionality

**Expected Results**:
- Status code: 201 Created
- Link created in database with correct data
- Response contains complete link object
- Short URL redirects properly
- All fields saved correctly

**Data Cleanup**:
- Delete created test link via API or database

---

### Test Case: Links API - Update Existing Link
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link exists with known ID
- User has update permissions

**Test Steps**:
1. Send PUT request to `/wp-json/betterlinks/v1/links/{id}` with updated data:
   ```json
   {
     "title": "Updated API Test Link",
     "target_url": "https://example.com/updated",
     "redirect_type": "301"
   }
   ```
2. Verify response status code (200)
3. Check updated data in database
4. Test updated short URL functionality
5. Verify unchanged fields remain intact

**Expected Results**:
- Status code: 200 OK
- Database record updated correctly
- Response contains updated link data
- Short URL redirects to new target
- Unchanged fields preserved

**Data Cleanup**:
- Revert link to original state or delete

---

### Test Case: Links API - Delete Link
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link exists for deletion
- User has delete permissions

**Test Steps**:
1. Send DELETE request to `/wp-json/betterlinks/v1/links/{id}`
2. Verify response status code (200 or 204)
3. Confirm link removed from database
4. Test short URL returns 404
5. Verify associated data cleaned up

**Expected Results**:
- Status code: 200 OK or 204 No Content
- Link removed from database
- Short URL no longer accessible
- Associated clicks/metadata cleaned up
- Proper success response

**Data Cleanup**:
- No cleanup needed (link deleted)

---

### Test Case: Analytics API - Get Link Statistics
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link with click data exists
- Analytics API endpoint available

**Test Steps**:
1. Send GET request to `/wp-json/betterlinks/v1/analytics/links/{id}`
2. Verify response structure
3. Check data accuracy against database
4. Test date range parameters
5. Verify performance metrics calculation

**Expected Results**:
- Accurate click statistics returned
- Proper date range filtering
- Performance metrics calculated correctly
- Response format consistent
- No sensitive data exposed

**Data Cleanup**:
- No cleanup needed

---

### Test Case: API Authentication and Authorization
**Priority**: P0 (Critical)
**User Role**: Various
**Preconditions**: 
- Multiple user accounts with different permissions

**Test Steps**:
1. Test unauthenticated requests
2. Test with invalid authentication tokens
3. Test with valid authentication but insufficient permissions
4. Test with proper authentication and permissions
5. Verify nonce validation for state-changing operations

**Expected Results**:
- Unauthenticated requests return 401
- Invalid tokens return 401
- Insufficient permissions return 403
- Valid requests succeed with 200/201
- Nonce validation prevents CSRF attacks

**Data Cleanup**:
- Clear test authentication tokens

---

## Gutenberg Block Integration Tests

### Test Case: BetterLinks Block Registration
**Priority**: P1 (High)
**User Role**: Editor
**Preconditions**: 
- Gutenberg editor enabled
- BetterLinks blocks registered

**Test Steps**:
1. Create new post/page
2. Open Gutenberg editor
3. Search for "BetterLinks" in block inserter
4. Verify BetterLinks blocks appear
5. Check block categories and descriptions

**Expected Results**:
- BetterLinks blocks visible in inserter
- Blocks appear in correct category
- Block descriptions are clear
- Icons display properly
- No JavaScript errors in console

**Data Cleanup**:
- Delete test post/page

---

### Test Case: Insert BetterLinks Block
**Priority**: P1 (High)
**User Role**: Editor
**Preconditions**: 
- Gutenberg editor open
- Existing BetterLinks available

**Test Steps**:
1. Insert BetterLinks block in editor
2. Select existing link from dropdown
3. Configure block settings:
   - Display text
   - Button style
   - Open in new tab
4. Preview block in editor
5. Save and view on frontend

**Expected Results**:
- Block inserts successfully
- Link selection works correctly
- Settings apply properly
- Preview matches configuration
- Frontend display correct

**Data Cleanup**:
- Delete test post with block

---

### Test Case: BetterLinks Block Settings Panel
**Priority**: P2 (Medium)
**User Role**: Editor
**Preconditions**: 
- BetterLinks block inserted in editor

**Test Steps**:
1. Select BetterLinks block
2. Open block settings panel
3. Test all available settings:
   - Link selection
   - Display options
   - Styling options
   - Advanced settings
4. Verify settings persistence
5. Test settings validation

**Expected Results**:
- Settings panel opens correctly
- All options function properly
- Settings save and persist
- Validation prevents invalid configurations
- UI is intuitive and responsive

**Data Cleanup**:
- Delete test content

---

### Test Case: Block Editor Link Creation
**Priority**: P2 (Medium)
**User Role**: Editor
**Preconditions**: 
- BetterLinks block in editor
- User has link creation permissions

**Test Steps**:
1. Insert BetterLinks block
2. Click "Create New Link" option
3. Fill in link creation form within editor
4. Save new link
5. Verify link appears in block selection
6. Test created link functionality

**Expected Results**:
- Link creation form opens in editor
- New link saves successfully
- Link immediately available for selection
- Created link functions correctly
- No page refresh required

**Data Cleanup**:
- Delete created test link

---

## Elementor Widget Integration Tests

### Test Case: BetterLinks Widget Registration
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Elementor plugin active
- BetterLinks Elementor integration enabled

**Test Steps**:
1. Open Elementor editor
2. Search for BetterLinks widgets
3. Verify widget availability in panel
4. Check widget categories and icons
5. Test widget drag and drop

**Expected Results**:
- BetterLinks widgets visible in Elementor
- Widgets in appropriate category
- Icons and descriptions clear
- Drag and drop works smoothly
- No conflicts with Elementor

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Configure BetterLinks Elementor Widget
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Elementor editor open
- BetterLinks widget added to page

**Test Steps**:
1. Add BetterLinks widget to Elementor page
2. Configure widget settings:
   - Select link
   - Set display text
   - Choose button style
   - Configure colors and typography
3. Preview changes in real-time
4. Save and view frontend

**Expected Results**:
- Widget configuration panel works
- Real-time preview updates correctly
- All styling options apply
- Frontend matches preview
- Responsive design maintained

**Data Cleanup**:
- Delete test Elementor page

---

### Test Case: Elementor Widget Responsive Design
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- BetterLinks widget configured in Elementor

**Test Steps**:
1. Configure widget for desktop view
2. Switch to tablet view in Elementor
3. Adjust tablet-specific settings
4. Switch to mobile view
5. Configure mobile-specific settings
6. Test responsive behavior on frontend

**Expected Results**:
- Responsive controls available
- Settings apply per device type
- Frontend displays correctly on all devices
- No layout breaking on smaller screens
- Smooth transitions between breakpoints

**Data Cleanup**:
- Delete test responsive page

---

## Google Analytics Integration Tests

### Test Case: GA4 Configuration and Setup
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- BetterLinks PRO active
- Valid GA4 Measurement ID and API Secret

**Test Steps**:
1. Navigate to BetterLinks > Settings > Integrations
2. Configure GA4 settings:
   - Enter Measurement ID
   - Enter API Secret
   - Enable event tracking
3. Save configuration
4. Test configuration validation
5. Verify settings persistence

**Expected Results**:
- Configuration saves successfully
- Validation checks pass
- Settings persist after save
- Clear success/error messages
- Help text guides configuration

**Data Cleanup**:
- Clear GA4 configuration after testing

---

### Test Case: GA4 Event Tracking
**Priority**: P1 (High)
**User Role**: Guest/Visitor
**Preconditions**: 
- GA4 integration configured
- Test links available

**Test Steps**:
1. Click BetterLinks short URL
2. Verify redirect works normally
3. Check GA4 Real-Time reports
4. Verify custom event appears
5. Check event parameters and data

**Expected Results**:
- Link redirect functions normally
- GA4 events appear in real-time
- Event parameters include link data
- No duplicate events sent
- Event timing accurate

**Data Cleanup**:
- Events remain in GA4 for analysis

---

### Test Case: Legacy Universal Analytics Support
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Universal Analytics property available (if still supported)

**Test Steps**:
1. Configure Universal Analytics tracking ID
2. Enable legacy event tracking
3. Test link clicks generate UA events
4. Verify event categories and actions
5. Check for conflicts with GA4

**Expected Results**:
- UA configuration works correctly
- Events tracked in UA dashboard
- Event structure follows UA format
- No conflicts with GA4 tracking
- Backward compatibility maintained

**Data Cleanup**:
- Disable UA tracking after testing

---

## Facebook Pixel Integration Tests

### Test Case: Facebook Pixel Configuration
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- BetterLinks PRO active
- Valid Facebook Pixel ID

**Test Steps**:
1. Navigate to Facebook Pixel settings
2. Enter Pixel ID and Access Token
3. Configure event tracking options
4. Save configuration
5. Test pixel validation

**Expected Results**:
- Pixel configuration saves correctly
- Validation confirms pixel setup
- Settings interface user-friendly
- Help documentation available
- Error handling for invalid pixels

**Data Cleanup**:
- Clear Facebook Pixel configuration

---

### Test Case: Facebook Pixel Event Tracking
**Priority**: P2 (Medium)
**User Role**: Guest/Visitor
**Preconditions**: 
- Facebook Pixel configured
- Pixel Helper browser extension available

**Test Steps**:
1. Click BetterLinks short URL
2. Use Facebook Pixel Helper to verify events
3. Check Facebook Events Manager
4. Verify custom parameters
5. Test event deduplication

**Expected Results**:
- Pixel events fire correctly
- Events appear in Facebook dashboard
- Custom parameters included
- No duplicate events
- Event timing accurate

**Data Cleanup**:
- Events remain in Facebook for analysis

---

## Third-Party Plugin Compatibility Tests

### Test Case: Caching Plugin Compatibility
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Popular caching plugin installed (WP Rocket, W3 Total Cache, etc.)

**Test Steps**:
1. Configure caching plugin
2. Create and test BetterLinks
3. Verify link redirection works with caching
4. Test analytics tracking with cache
5. Check for cache exclusion rules
6. Test cache purging on link updates

**Expected Results**:
- Links work correctly with caching enabled
- Analytics tracking not affected by cache
- Appropriate cache exclusions in place
- Cache purges on relevant updates
- No performance degradation

**Data Cleanup**:
- Reset caching plugin settings

---

### Test Case: SEO Plugin Integration
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- SEO plugin installed (Yoast, RankMath, etc.)

**Test Steps**:
1. Create BetterLinks with SEO considerations
2. Test nofollow/sponsored attributes
3. Verify meta tag handling
4. Check sitemap inclusion/exclusion
5. Test canonical URL handling

**Expected Results**:
- SEO attributes applied correctly
- Meta tags handled appropriately
- Sitemap behavior configurable
- No SEO conflicts
- Proper canonical URL handling

**Data Cleanup**:
- Remove test links and SEO configurations

---

### Test Case: Security Plugin Compatibility
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Security plugin installed (Wordfence, Sucuri, etc.)

**Test Steps**:
1. Configure security plugin
2. Test BetterLinks functionality
3. Verify no false positive security alerts
4. Test rate limiting compatibility
5. Check firewall rule interactions

**Expected Results**:
- BetterLinks works with security plugins
- No false positive alerts
- Rate limiting doesn't break functionality
- Firewall rules don't interfere
- Security logs show normal activity

**Data Cleanup**:
- Review and clear security logs

---

## Webhook and External API Integration Tests

### Test Case: Webhook Configuration and Testing
**Priority**: P3 (Low)
**User Role**: Admin
**Preconditions**: 
- Webhook endpoint available for testing
- BetterLinks supports webhook functionality

**Test Steps**:
1. Configure webhook URL in settings
2. Set webhook triggers (link creation, clicks, etc.)
3. Perform actions that should trigger webhooks
4. Verify webhook payload format
5. Test webhook authentication

**Expected Results**:
- Webhooks configure successfully
- Triggers fire at appropriate times
- Payload format consistent and complete
- Authentication works correctly
- Error handling for failed webhooks

**Data Cleanup**:
- Disable webhook configuration

---

### Test Case: External API Rate Limiting
**Priority**: P2 (Medium)
**User Role**: System
**Preconditions**: 
- External API integrations configured

**Test Steps**:
1. Generate high volume of API calls
2. Monitor rate limiting behavior
3. Test retry mechanisms
4. Verify graceful degradation
5. Check error logging

**Expected Results**:
- Rate limiting respected
- Retry mechanisms work correctly
- System degrades gracefully under limits
- Appropriate error messages
- Comprehensive error logging

**Data Cleanup**:
- Clear API rate limiting test data

---

## Performance and Load Testing

### Test Case: API Performance Under Load
**Priority**: P2 (Medium)
**User Role**: System
**Preconditions**: 
- Load testing tools available
- Test environment configured

**Test Steps**:
1. Generate concurrent API requests
2. Monitor response times
3. Check error rates
4. Test database performance
5. Verify system stability

**Expected Results**:
- API maintains acceptable response times
- Error rates remain low under load
- Database performance stable
- System remains responsive
- No memory leaks or crashes

**Data Cleanup**:
- Clear load testing data
- Reset system resources
