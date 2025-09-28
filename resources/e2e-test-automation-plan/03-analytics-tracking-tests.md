# Analytics and Tracking Test Cases

## Overview
This document contains comprehensive test cases for analytics and click tracking functionality in BetterLinks FREE and PRO versions. These tests cover click data collection, analytics reporting, UTM parameter handling, and bot detection features.

## Test Case Categories
- Click Tracking and Data Collection
- Analytics Dashboard and Reporting
- UTM Parameter Processing
- Bot Detection and Filtering
- Geographic and Device Tracking
- Referrer and Browser Analytics

---

## Click Tracking Tests

### Test Case: Basic Click Tracking
**Priority**: P0 (Critical)
**User Role**: Guest/Visitor
**Preconditions**: 
- Test link exists with tracking enabled
- Link status is "publish"
- Clean click data state

**Test Steps**:
1. Navigate to short URL: `{site_url}/test-link`
2. Verify redirect to target URL occurs
3. Check admin analytics for new click record
4. Verify click data includes:
   - IP address
   - User agent
   - Timestamp
   - Browser information
   - Operating system

**Expected Results**:
- Redirect happens successfully (307 status)
- Click recorded in `wp_betterlinks_clicks` table
- Analytics dashboard shows +1 click
- All tracking data captured correctly
- No duplicate click records for same session

**Data Cleanup**:
- Clear click data for test link
- Reset analytics counters

---

### Test Case: Multiple Clicks from Same IP
**Priority**: P1 (High)
**User Role**: Guest/Visitor
**Preconditions**: 
- Test link with tracking enabled
- Clean analytics state

**Test Steps**:
1. Click test link 5 times from same browser/IP
2. Wait 1 minute between clicks
3. Check analytics dashboard
4. Verify click count and unique visitor count
5. Check individual click records in database

**Expected Results**:
- All 5 clicks recorded
- Unique visitor count = 1
- Total clicks count = 5
- Each click has same IP but different timestamps
- Visitor ID consistent across clicks

**Data Cleanup**:
- Clear test click data

---

### Test Case: Click Tracking with Disabled Analytics
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link exists with tracking disabled

**Test Steps**:
1. Navigate to BetterLinks > Edit Link
2. Disable "Track clicks" option
3. Save link
4. Click the short URL as visitor
5. Check analytics dashboard

**Expected Results**:
- Redirect works normally
- No click data recorded
- Analytics shows no new clicks
- Database remains unchanged
- Performance not impacted

**Data Cleanup**:
- Re-enable tracking for test link

---

## Analytics Dashboard Tests

### Test Case: View Link Analytics Overview
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- Test links with various click counts exist
- Click data from last 30 days available

**Test Steps**:
1. Navigate to BetterLinks > Analytics
2. Verify overview statistics display:
   - Total clicks
   - Total links
   - Top performing links
   - Recent activity
3. Check date range selector functionality
4. Verify data accuracy against database

**Expected Results**:
- Overview statistics accurate
- Charts and graphs display correctly
- Date range filtering works
- Data matches database records
- Performance metrics load quickly

**Data Cleanup**:
- No cleanup needed (read-only operation)

---

### Test Case: Individual Link Analytics
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Test link with 50+ clicks from various sources

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Click "Analytics" for specific link
3. Verify detailed analytics show:
   - Click timeline graph
   - Geographic distribution
   - Browser/OS breakdown
   - Referrer sources
   - Device types

**Expected Results**:
- Individual link analytics load correctly
- All data visualizations display
- Geographic data accurate (if available)
- Browser/OS detection working
- Referrer tracking functional

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Analytics Date Range Filtering
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Click data spanning multiple months

**Test Steps**:
1. Navigate to BetterLinks > Analytics
2. Set date range to "Last 7 days"
3. Verify data updates
4. Change to "Last 30 days"
5. Change to custom date range
6. Test invalid date ranges

**Expected Results**:
- Date filtering works accurately
- Charts update with filtered data
- Custom date ranges accepted
- Invalid ranges show error messages
- Performance remains good with large datasets

**Data Cleanup**:
- Reset to default date range

---

## UTM Parameter Tests

### Test Case: UTM Parameter Tracking
**Priority**: P1 (High)
**User Role**: Guest/Visitor
**Preconditions**: 
- Test link with UTM parameter forwarding enabled

**Test Steps**:
1. Visit link with UTM parameters:
   `{site_url}/test-link?utm_source=google&utm_medium=cpc&utm_campaign=test`
2. Verify redirect includes UTM parameters
3. Check click record for UTM data
4. Verify analytics show campaign data

**Expected Results**:
- UTM parameters forwarded to target URL
- Click record includes UTM data
- Campaign analytics show source/medium/campaign
- Parameter forwarding configurable per link

**Data Cleanup**:
- Clear UTM test data

---

### Test Case: UTM Parameter Validation
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Access to UTM builder feature

**Test Steps**:
1. Navigate to UTM Builder (if available)
2. Create UTM parameters:
   - Source: "facebook"
   - Medium: "social"
   - Campaign: "summer-sale"
   - Term: "discount"
   - Content: "banner-ad"
3. Generate tracking URL
4. Test generated URL

**Expected Results**:
- UTM builder generates correct URLs
- All UTM parameters included
- URL format valid
- Parameters properly encoded
- Generated URL works correctly

**Data Cleanup**:
- Delete test UTM campaigns

---

## Bot Detection Tests

### Test Case: Bot Click Filtering
**Priority**: P1 (High)
**User Role**: System/Bot
**Preconditions**: 
- Bot detection enabled in settings
- Test link available

**Test Steps**:
1. Configure bot detection settings
2. Simulate bot clicks with user agents:
   - "Googlebot/2.1"
   - "facebookexternalhit/1.1"
   - "Twitterbot/1.0"
3. Check if clicks are recorded
4. Verify analytics exclude bot traffic

**Expected Results**:
- Bot clicks identified correctly
- Bot traffic excluded from analytics
- Known bot user agents filtered
- Settings allow bot filtering toggle
- Legitimate traffic not affected

**Data Cleanup**:
- Clear bot test data

---

### Test Case: Custom Bot Detection Rules
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Access to advanced bot detection settings

**Test Steps**:
1. Navigate to BetterLinks > Settings
2. Configure custom bot detection rules
3. Add custom user agent patterns
4. Test with matching user agents
5. Verify filtering works

**Expected Results**:
- Custom bot rules configurable
- Pattern matching works correctly
- Custom bots filtered from analytics
- Rules can be enabled/disabled
- No false positives for real users

**Data Cleanup**:
- Reset bot detection rules

---

## Geographic and Device Tracking Tests

### Test Case: Geographic Location Tracking
**Priority**: P2 (Medium)
**User Role**: Guest/Visitor
**Preconditions**: 
- Geographic tracking enabled
- Test links available

**Test Steps**:
1. Click test links from different IP addresses (if possible)
2. Use VPN to simulate different locations
3. Check analytics for geographic data
4. Verify country/region detection
5. Test geographic filtering in analytics

**Expected Results**:
- Geographic data captured when available
- Country detection reasonably accurate
- Analytics show geographic distribution
- Privacy considerations respected
- No errors when geo data unavailable

**Data Cleanup**:
- Clear geographic test data

---

### Test Case: Device and Browser Detection
**Priority**: P1 (High)
**User Role**: Guest/Visitor
**Preconditions**: 
- Device detection enabled
- Multiple test devices/browsers available

**Test Steps**:
1. Click test link from desktop Chrome
2. Click from mobile Safari (if available)
3. Click from Firefox
4. Check analytics for device breakdown
5. Verify browser version detection

**Expected Results**:
- Device types detected correctly (desktop/mobile/tablet)
- Browser names and versions captured
- Operating system information accurate
- Analytics show device/browser breakdown
- Unknown devices handled gracefully

**Data Cleanup**:
- Clear device test data

---

## Referrer Tracking Tests

### Test Case: Referrer Source Tracking
**Priority**: P1 (High)
**User Role**: Guest/Visitor
**Preconditions**: 
- Test link available
- Referrer tracking enabled

**Test Steps**:
1. Click test link directly (no referrer)
2. Click from Google search results page
3. Click from social media link
4. Click from email client
5. Check analytics for referrer data

**Expected Results**:
- Direct traffic identified correctly
- Search engine referrers captured
- Social media sources detected
- Email referrers tracked
- Referrer analytics display properly

**Data Cleanup**:
- Clear referrer test data

---

### Test Case: Social Media Referrer Detection
**Priority**: P2 (Medium)
**User Role**: Guest/Visitor
**Preconditions**: 
- Social media referrer detection enabled

**Test Steps**:
1. Simulate clicks from various social platforms:
   - Facebook (facebook.com)
   - Twitter/X (twitter.com, x.com)
   - LinkedIn (linkedin.com)
   - Instagram (instagram.com)
2. Check analytics for social media breakdown
3. Verify platform-specific tracking

**Expected Results**:
- Social platforms identified correctly
- Platform-specific analytics available
- Social media traffic segmented
- Unknown social sources handled
- Analytics show social media performance

**Data Cleanup**:
- Clear social media test data

---

## Performance and Scalability Tests

### Test Case: High Volume Click Tracking
**Priority**: P2 (Medium)
**User Role**: System
**Preconditions**: 
- Test environment with performance monitoring

**Test Steps**:
1. Generate 1000+ clicks rapidly
2. Monitor database performance
3. Check analytics loading times
4. Verify data accuracy
5. Test concurrent click handling

**Expected Results**:
- System handles high click volume
- Database performance acceptable
- Analytics remain responsive
- No data loss or corruption
- Concurrent clicks processed correctly

**Data Cleanup**:
- Clear high-volume test data

---

### Test Case: Analytics Data Retention
**Priority**: P3 (Low)
**User Role**: Admin
**Preconditions**: 
- Old click data exists (90+ days)

**Test Steps**:
1. Check data retention settings
2. Verify old data handling
3. Test data cleanup processes
4. Check analytics with historical data
5. Verify performance with large datasets

**Expected Results**:
- Data retention policies configurable
- Old data handled appropriately
- Cleanup processes work correctly
- Historical analytics accessible
- Performance maintained with large datasets

**Data Cleanup**:
- Configure appropriate retention settings

---

## Export and Reporting Tests

### Test Case: Export Analytics Data
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Analytics data available
- Export functionality accessible

**Test Steps**:
1. Navigate to analytics export feature
2. Select date range for export
3. Choose export format (CSV/Excel)
4. Download exported file
5. Verify data accuracy in export

**Expected Results**:
- Export functionality works correctly
- Data exported in chosen format
- File downloads successfully
- Exported data matches analytics
- All relevant fields included

**Data Cleanup**:
- Delete downloaded test files

---

### Test Case: Scheduled Analytics Reports
**Priority**: P3 (Low)
**User Role**: Admin
**Preconditions**: 
- Email reporting configured
- SMTP settings working

**Test Steps**:
1. Configure scheduled analytics reports
2. Set report frequency (daily/weekly/monthly)
3. Configure recipient email addresses
4. Wait for scheduled report or trigger manually
5. Verify email report received

**Expected Results**:
- Scheduled reports configurable
- Reports sent at correct intervals
- Email format professional and readable
- Data accuracy in reports
- Unsubscribe options available

**Data Cleanup**:
- Disable scheduled reports
- Clear email queue
