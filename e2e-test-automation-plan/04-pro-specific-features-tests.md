# BetterLinks PRO-Specific Feature Test Cases

## Overview
This document contains comprehensive test cases for features exclusive to BetterLinks PRO version, including individual analytics, role management, Google Analytics integration, dynamic redirects, broken link checker, auto-link keywords, password protection, and custom domains.

## Test Case Categories
- License Management and Activation
- Role-Based Permissions and User Management
- Individual Link Analytics
- Google Analytics Integration
- Dynamic Redirects and Split Testing
- Broken Link Checker and Email Notifications
- Auto-Link Keywords
- Password Protection
- Custom Domain Configuration

---

## License Management Tests

### Test Case: License Activation
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- BetterLinks PRO plugin installed
- Valid license key available
- Internet connectivity

**Test Steps**:
1. Navigate to BetterLinks > Settings > License
2. Enter valid license key
3. Click "Activate License" button
4. Verify activation success message
5. Check PRO features are now accessible

**Expected Results**:
- License activates successfully
- Success message displayed
- PRO features unlocked in menu
- License status shows "Active"
- Expiration date displayed correctly

**Data Cleanup**:
- Keep license active for subsequent tests

---

### Test Case: Invalid License Key Handling
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- BetterLinks PRO plugin installed
- Invalid/expired license key

**Test Steps**:
1. Navigate to BetterLinks > Settings > License
2. Enter invalid license key
3. Click "Activate License" button
4. Verify error message
5. Confirm PRO features remain locked

**Expected Results**:
- Clear error message about invalid license
- PRO features remain inaccessible
- License status shows "Invalid" or "Inactive"
- User guided to purchase/renew license
- No PHP errors or crashes

**Data Cleanup**:
- Clear invalid license key

---

## Role-Based Permissions Tests

### Test Case: Configure User Role Permissions
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- BetterLinks PRO activated
- Multiple user roles exist (Editor, Author)

**Test Steps**:
1. Navigate to BetterLinks > Settings > Role Management
2. Configure permissions for Editor role:
   - Enable "Manage Links"
   - Enable "View Analytics"
   - Disable "Manage Settings"
3. Save role configuration
4. Login as Editor user
5. Verify accessible features match permissions

**Expected Results**:
- Role permissions save successfully
- Editor can access allowed features
- Editor cannot access restricted features
- Menu items reflect permissions
- Proper error messages for restricted access

**Data Cleanup**:
- Reset role permissions to defaults

---

### Test Case: Role Permission Inheritance
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Role permissions configured
- Test users with different roles

**Test Steps**:
1. Configure permissions for multiple roles
2. Test each role's access to:
   - Link creation/editing
   - Analytics viewing
   - Settings management
   - Category/tag management
3. Verify permission inheritance works correctly

**Expected Results**:
- Each role has appropriate access
- Higher roles inherit lower role permissions
- Permission conflicts resolved correctly
- UI adapts to user permissions
- No unauthorized access possible

**Data Cleanup**:
- Reset all role permissions

---

## Individual Link Analytics Tests

### Test Case: Individual Link Performance Metrics
**Priority**: P0 (Critical)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Test links with click data

**Test Steps**:
1. Navigate to BetterLinks > Manage Links
2. Click "Analytics" for specific link
3. Verify individual metrics display:
   - Click-through rate
   - Conversion tracking
   - Geographic breakdown
   - Time-based analytics
   - Device-specific data

**Expected Results**:
- Individual link analytics load correctly
- Detailed metrics display accurately
- Charts and graphs render properly
- Data export functionality available
- Performance comparisons possible

**Data Cleanup**:
- No cleanup needed (read-only)

---

### Test Case: Link Performance Comparison
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Multiple links with analytics data

**Test Steps**:
1. Navigate to individual link analytics
2. Select multiple links for comparison
3. View comparative performance metrics
4. Export comparison data
5. Verify accuracy of comparisons

**Expected Results**:
- Link comparison feature works
- Comparative metrics accurate
- Visual comparisons clear
- Export includes all compared links
- Performance insights actionable

**Data Cleanup**:
- Clear comparison selections

---

## Google Analytics Integration Tests

### Test Case: Google Analytics 4 Integration
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Valid GA4 property and API secret
- PRO license active

**Test Steps**:
1. Navigate to BetterLinks > Settings > Integrations
2. Configure GA4 settings:
   - Measurement ID
   - API Secret
   - Event tracking options
3. Save configuration
4. Test link clicks generate GA4 events
5. Verify events in GA4 dashboard

**Expected Results**:
- GA4 configuration saves successfully
- Link clicks trigger GA4 events
- Events appear in GA4 real-time reports
- Custom parameters included
- No duplicate events created

**Data Cleanup**:
- Disable GA4 integration after testing

---

### Test Case: Legacy Google Analytics Integration
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Universal Analytics property (if still available)

**Test Steps**:
1. Configure Universal Analytics tracking
2. Set tracking ID
3. Enable event tracking
4. Test link clicks
5. Verify events in UA dashboard

**Expected Results**:
- UA integration works correctly
- Events tracked properly
- Custom dimensions supported
- No conflicts with GA4
- Backward compatibility maintained

**Data Cleanup**:
- Disable UA integration

---

## Dynamic Redirects and Split Testing Tests

### Test Case: Create Dynamic Redirect Campaign
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Multiple target URLs for testing

**Test Steps**:
1. Navigate to link creation/editing
2. Enable "Dynamic Redirects"
3. Add multiple target URLs with weights:
   - URL A: 50% weight
   - URL B: 30% weight
   - URL C: 20% weight
4. Save configuration
5. Test multiple clicks to verify distribution

**Expected Results**:
- Dynamic redirects configure successfully
- Traffic splits according to weights
- Click distribution tracked separately
- Performance metrics for each variant
- Easy weight adjustment interface

**Data Cleanup**:
- Disable dynamic redirects
- Clear split test data

---

### Test Case: A/B Test Performance Analysis
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Active split test with sufficient data

**Test Steps**:
1. Navigate to split test analytics
2. View performance metrics for each variant
3. Check statistical significance
4. Export A/B test results
5. Declare winning variant

**Expected Results**:
- A/B test analytics display correctly
- Statistical significance calculated
- Clear winner identification
- Performance differences highlighted
- Easy winner selection process

**Data Cleanup**:
- Archive completed A/B tests

---

## Broken Link Checker Tests

### Test Case: Automated Broken Link Detection
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Links with various target URL statuses

**Test Steps**:
1. Navigate to BetterLinks > Link Scanner
2. Configure broken link checker settings
3. Run manual scan
4. Review scan results
5. Verify accuracy of broken link detection

**Expected Results**:
- Scan completes successfully
- Broken links identified correctly
- HTTP status codes captured
- Response times recorded
- False positives minimized

**Data Cleanup**:
- Fix or remove broken test links

---

### Test Case: Broken Link Email Notifications
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Email notifications configured
- SMTP settings working

**Test Steps**:
1. Configure email notification settings:
   - Recipient email
   - Notification frequency
   - Email template
2. Create link with broken target URL
3. Wait for scheduled scan or trigger manually
4. Verify email notification received
5. Check email content accuracy

**Expected Results**:
- Email notifications sent correctly
- Email content includes broken link details
- Notification frequency respected
- Unsubscribe options available
- Professional email formatting

**Data Cleanup**:
- Disable email notifications
- Clear email queue

---

### Test Case: Scheduled Link Scanning
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Cron jobs configured properly

**Test Steps**:
1. Configure scheduled scanning:
   - Daily/weekly/monthly frequency
   - Scan time preferences
   - Notification settings
2. Wait for scheduled scan execution
3. Verify scan runs automatically
4. Check scan results and logs

**Expected Results**:
- Scheduled scans execute correctly
- Scan frequency respected
- Results logged properly
- Performance impact minimal
- Manual override available

**Data Cleanup**:
- Disable scheduled scanning

---

## Auto-Link Keywords Tests

### Test Case: Configure Auto-Link Keywords
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Test content with target keywords

**Test Steps**:
1. Navigate to BetterLinks > Auto-Link Keywords
2. Add keyword configuration:
   - Keyword: "WordPress"
   - Target link: existing BetterLink
   - Match options: case-sensitive, whole words
3. Save keyword configuration
4. Create/edit post with keyword
5. Verify automatic linking occurs

**Expected Results**:
- Keywords configure successfully
- Automatic linking works in content
- Match options respected
- Link attributes applied correctly
- No over-linking occurs

**Data Cleanup**:
- Remove test keywords
- Clear auto-linked content

---

### Test Case: Auto-Link Keyword Limits and Exclusions
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Auto-link keywords configured

**Test Steps**:
1. Configure keyword limits:
   - Maximum links per post
   - Exclude specific post types
   - Exclude specific posts/pages
2. Test with content exceeding limits
3. Verify exclusions work correctly
4. Check performance with many keywords

**Expected Results**:
- Link limits enforced correctly
- Exclusions prevent unwanted linking
- Performance remains acceptable
- No infinite loops or recursion
- Easy management interface

**Data Cleanup**:
- Reset auto-link settings

---

## Password Protection Tests

### Test Case: Configure Password-Protected Links
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Test link available

**Test Steps**:
1. Edit existing link
2. Enable password protection
3. Set password: "TestPass123"
4. Configure protection settings:
   - Custom form title
   - Allow contact option
   - Remember password duration
5. Save link configuration

**Expected Results**:
- Password protection enables successfully
- Settings save correctly
- Link requires password when accessed
- Custom form displays properly
- Remember password option works

**Data Cleanup**:
- Disable password protection
- Clear password data

---

### Test Case: Password Protection User Experience
**Priority**: P0 (Critical)
**User Role**: Guest/Visitor
**Preconditions**: 
- Password-protected link configured

**Test Steps**:
1. Access password-protected short URL
2. Verify password form displays
3. Enter incorrect password
4. Enter correct password
5. Test "remember password" functionality
6. Test password form customization

**Expected Results**:
- Password form displays correctly
- Incorrect password shows error
- Correct password grants access
- Remember password works across sessions
- Form customization applies
- Mobile-responsive design

**Data Cleanup**:
- Clear password cookies
- Reset form customization

---

## Custom Domain Configuration Tests

### Test Case: Configure Custom Domain
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- PRO license active
- Custom domain available for testing
- DNS access for domain configuration

**Test Steps**:
1. Navigate to BetterLinks > Custom Domain
2. Add custom domain: "links.example.com"
3. Configure DNS settings as instructed
4. Verify domain validation
5. Test short links with custom domain

**Expected Results**:
- Custom domain configuration interface clear
- DNS instructions accurate
- Domain validation works
- Short links use custom domain
- SSL certificate handling proper

**Data Cleanup**:
- Remove custom domain configuration
- Reset DNS settings

---

### Test Case: Custom Domain SSL and Security
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- Custom domain configured
- SSL certificate available

**Test Steps**:
1. Configure SSL for custom domain
2. Test HTTPS redirects
3. Verify security headers
4. Test mixed content handling
5. Check certificate validation

**Expected Results**:
- SSL configuration works correctly
- HTTPS redirects function properly
- Security headers present
- No mixed content warnings
- Certificate validation passes

**Data Cleanup**:
- Maintain SSL configuration for security

---

## Facebook Pixel Integration Tests

### Test Case: Facebook Pixel Tracking Setup
**Priority**: P2 (Medium)
**User Role**: Admin
**Preconditions**: 
- Facebook Pixel ID available
- PRO license active

**Test Steps**:
1. Navigate to BetterLinks > Settings > Integrations
2. Configure Facebook Pixel:
   - Pixel ID
   - Access token
   - Event tracking options
3. Save configuration
4. Test link clicks trigger pixel events
5. Verify events in Facebook Events Manager

**Expected Results**:
- Pixel configuration saves successfully
- Link clicks trigger pixel events
- Events appear in Facebook dashboard
- Custom parameters included
- No duplicate events

**Data Cleanup**:
- Disable Facebook Pixel integration

---

## Advanced Scheduling Tests

### Test Case: Link Scheduling and Expiration
**Priority**: P1 (High)
**User Role**: Admin
**Preconditions**: 
- PRO license active

**Test Steps**:
1. Create new link with scheduling:
   - Publish date: future date
   - Expiration date: 1 week later
   - Expired redirect URL
2. Test link before publish date
3. Test link during active period
4. Test link after expiration
5. Verify scheduling accuracy

**Expected Results**:
- Link inactive before publish date
- Link active during scheduled period
- Link redirects to expired URL after expiration
- Scheduling interface user-friendly
- Timezone handling correct

**Data Cleanup**:
- Remove scheduled links
- Clear scheduling data
