# User Roles and Permissions Test Cases

## Overview
This document contains comprehensive test cases for user role management and permission-based access control in BetterLinks FREE and PRO versions. These tests cover WordPress user roles, PRO role management features, and capability-based access restrictions.

## Test Case Categories
- WordPress Default Role Testing
- PRO Role Management Configuration
- Capability-Based Access Control
- Permission Inheritance and Conflicts
- Menu and Feature Visibility
- API Endpoint Access Control

---

## WordPress Default Role Tests

### Test Case: Administrator Full Access
**Priority**: P0 (Critical)
**User Role**: Administrator
**Preconditions**: 
- Administrator user account exists
- BetterLinks plugin activated

**Test Steps**:
1. Login as administrator
2. Navigate to WordPress admin dashboard
3. Verify BetterLinks menu appears
4. Access all BetterLinks submenu items:
   - Manage Links
   - Tags & Categories
   - Analytics
   - Settings
5. Test link creation, editing, deletion
6. Test settings modification

**Expected Results**:
- All BetterLinks features accessible
- No permission errors or restrictions
- Full CRUD operations available
- Settings can be modified
- All menu items visible

**Data Cleanup**:
- No cleanup needed (admin access maintained)

---

### Test Case: Editor Role Default Access
**Priority**: P1 (High)
**User Role**: Editor
**Preconditions**: 
- Editor user account exists
- Default BetterLinks permissions (no PRO customization)

**Test Steps**:
1. Login as editor user
2. Check WordPress admin dashboard
3. Verify BetterLinks menu visibility
4. Attempt to access BetterLinks features
5. Test link management capabilities
6. Try to access settings page

**Expected Results**:
- BetterLinks menu may not be visible (depends on capability filter)
- Limited or no access to BetterLinks features
- Cannot modify plugin settings
- Appropriate error messages for restricted access

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Author Role Access Restrictions
**Priority**: P1 (High)
**User Role**: Author
**Preconditions**: 
- Author user account exists
- Default WordPress capabilities

**Test Steps**:
1. Login as author user
2. Check admin dashboard for BetterLinks menu
3. Attempt direct URL access to BetterLinks pages
4. Test REST API endpoint access
5. Verify no unauthorized access possible

**Expected Results**:
- No BetterLinks menu visible
- Direct URL access blocked with permission errors
- REST API returns authorization errors
- No data exposure through unauthorized access

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Subscriber Role Complete Restriction
**Priority**: P2 (Medium)
**User Role**: Subscriber
**Preconditions**: 
- Subscriber user account exists

**Test Steps**:
1. Login as subscriber user
2. Verify no BetterLinks admin access
3. Test frontend link functionality (clicking short links)
4. Attempt API access
5. Check for any data leakage

**Expected Results**:
- No admin access to BetterLinks
- Frontend link functionality works normally
- No API access granted
- No sensitive data accessible
- Proper permission boundaries maintained

**Data Cleanup**:
- No cleanup needed

---

## PRO Role Management Tests

### Test Case: Configure Custom Role Permissions
**Priority**: P0 (Critical)
**User Role**: Administrator
**Preconditions**: 
- BetterLinks PRO activated
- Multiple user roles available

**Test Steps**:
1. Navigate to BetterLinks > Settings > Role Management
2. Configure Editor role permissions:
   - Enable "Manage Links"
   - Enable "View Analytics"
   - Disable "Manage Categories"
   - Disable "Manage Settings"
3. Save role configuration
4. Login as Editor user
5. Verify permissions applied correctly

**Expected Results**:
- Role configuration saves successfully
- Editor can manage links
- Editor can view analytics
- Editor cannot manage categories
- Editor cannot access settings
- Menu items reflect permissions

**Data Cleanup**:
- Reset role permissions to defaults

---

### Test Case: Multiple Role Permission Inheritance
**Priority**: P1 (High)
**User Role**: Administrator
**Preconditions**: 
- PRO role management active
- Users with multiple roles

**Test Steps**:
1. Create user with multiple roles (Editor + Author)
2. Configure different permissions for each role
3. Test access with multi-role user
4. Verify permission inheritance logic
5. Test permission conflicts resolution

**Expected Results**:
- Multi-role users get combined permissions
- Higher permissions take precedence
- No permission conflicts cause errors
- Access logic is predictable
- UI reflects combined permissions

**Data Cleanup**:
- Remove test users
- Reset role configurations

---

### Test Case: Dynamic Permission Updates
**Priority**: P1 (High)
**User Role**: Administrator
**Preconditions**: 
- Active user sessions with different roles

**Test Steps**:
1. Have Editor user logged in and active
2. As Administrator, modify Editor role permissions
3. Editor user refreshes page or navigates
4. Verify new permissions apply immediately
5. Test with multiple simultaneous users

**Expected Results**:
- Permission changes apply immediately
- No need for user re-login
- All active sessions updated
- No caching issues with permissions
- Consistent behavior across users

**Data Cleanup**:
- Reset permission changes

---

## Capability-Based Access Control Tests

### Test Case: Link Management Capabilities
**Priority**: P0 (Critical)
**User Role**: Editor (with custom permissions)
**Preconditions**: 
- Editor role configured with "Manage Links" permission

**Test Steps**:
1. Login as Editor user
2. Navigate to BetterLinks > Manage Links
3. Test link creation
4. Test link editing
5. Test link deletion
6. Test bulk operations
7. Attempt to access restricted features

**Expected Results**:
- Link management interface accessible
- Can create new links
- Can edit existing links
- Can delete links (if permitted)
- Bulk operations work correctly
- Restricted features remain inaccessible

**Data Cleanup**:
- Delete test links created by Editor

---

### Test Case: Analytics Access Control
**Priority**: P1 (High)
**User Role**: Editor (with analytics permission)
**Preconditions**: 
- Editor role has "View Analytics" permission
- Analytics data available

**Test Steps**:
1. Login as Editor user
2. Navigate to BetterLinks > Analytics
3. View overall analytics dashboard
4. Access individual link analytics
5. Test analytics export functionality
6. Attempt to modify analytics settings

**Expected Results**:
- Analytics dashboard accessible
- Can view all analytics data
- Individual link analytics available
- Export functionality works (if permitted)
- Cannot modify analytics settings
- Read-only access maintained

**Data Cleanup**:
- No cleanup needed (read-only access)

---

### Test Case: Category and Tag Management Permissions
**Priority**: P1 (High)
**User Role**: Editor (with limited permissions)
**Preconditions**: 
- Editor role without "Manage Categories" permission

**Test Steps**:
1. Login as Editor user
2. Attempt to access Tags & Categories page
3. Try to create new category during link creation
4. Test tag assignment capabilities
5. Verify category/tag restrictions

**Expected Results**:
- Cannot access Tags & Categories management page
- Cannot create new categories
- Can only assign existing categories/tags
- Appropriate error messages shown
- No unauthorized category/tag operations

**Data Cleanup**:
- No cleanup needed

---

## Menu and Feature Visibility Tests

### Test Case: Dynamic Menu Generation
**Priority**: P1 (High)
**User Role**: Various roles
**Preconditions**: 
- Different role permissions configured

**Test Steps**:
1. Login as Administrator - verify full menu
2. Login as Editor with limited permissions
3. Login as Author with no permissions
4. Compare menu visibility across roles
5. Test direct URL access for hidden menu items

**Expected Results**:
- Menu items appear based on permissions
- Hidden items not accessible via direct URL
- Menu structure adapts to user capabilities
- No broken or empty menu sections
- Consistent behavior across different roles

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Feature Toggle Based on Permissions
**Priority**: P2 (Medium)
**User Role**: Editor (with partial permissions)
**Preconditions**: 
- Editor has some but not all permissions

**Test Steps**:
1. Login as Editor user
2. Navigate to accessible pages
3. Verify feature availability within pages:
   - Create/Edit buttons
   - Delete actions
   - Export options
   - Settings sections
4. Test feature interactions

**Expected Results**:
- Only permitted features visible/enabled
- Disabled features clearly indicated
- No functional buttons for restricted actions
- Tooltips or messages explain restrictions
- UI adapts gracefully to permissions

**Data Cleanup**:
- No cleanup needed

---

## API Endpoint Access Control Tests

### Test Case: REST API Permission Validation
**Priority**: P1 (High)
**User Role**: Editor (with limited API access)
**Preconditions**: 
- Editor role configured with specific permissions
- REST API endpoints available

**Test Steps**:
1. Authenticate as Editor user
2. Test GET requests to allowed endpoints:
   - `/wp-json/betterlinks/v1/links`
   - `/wp-json/betterlinks/v1/analytics`
3. Test POST requests to restricted endpoints:
   - `/wp-json/betterlinks/v1/settings`
4. Verify proper HTTP status codes
5. Check error message format

**Expected Results**:
- Allowed endpoints return data successfully
- Restricted endpoints return 403 Forbidden
- Error messages are informative
- No data leakage in error responses
- Authentication properly validated

**Data Cleanup**:
- No cleanup needed

---

### Test Case: AJAX Request Permission Handling
**Priority**: P1 (High)
**User Role**: Editor (with partial permissions)
**Preconditions**: 
- Editor user logged in
- AJAX endpoints configured

**Test Steps**:
1. Navigate to BetterLinks admin pages
2. Trigger AJAX requests through UI interactions:
   - Link creation
   - Analytics loading
   - Settings updates
3. Monitor network requests and responses
4. Verify permission checks in AJAX handlers

**Expected Results**:
- Permitted AJAX requests succeed
- Restricted requests return appropriate errors
- UI handles permission errors gracefully
- No unauthorized data modifications
- Proper nonce validation

**Data Cleanup**:
- Revert any successful modifications

---

## Permission Conflict Resolution Tests

### Test Case: Conflicting Role Permissions
**Priority**: P2 (Medium)
**User Role**: Administrator
**Preconditions**: 
- User with multiple conflicting role assignments

**Test Steps**:
1. Create user with Editor and Author roles
2. Configure conflicting permissions:
   - Editor: Can manage links
   - Author: Cannot manage links
3. Test access with conflicting user
4. Verify conflict resolution logic
5. Document behavior for edge cases

**Expected Results**:
- Conflict resolution follows defined precedence
- Higher permissions generally take precedence
- Behavior is consistent and predictable
- No system errors from conflicts
- Clear documentation of resolution logic

**Data Cleanup**:
- Remove test user
- Reset role configurations

---

### Test Case: Permission Caching and Updates
**Priority**: P2 (Medium)
**User Role**: Administrator
**Preconditions**: 
- Permission caching enabled

**Test Steps**:
1. Configure role permissions
2. Test user access with cached permissions
3. Update role permissions
4. Verify cache invalidation
5. Test immediate permission updates
6. Check for stale permission issues

**Expected Results**:
- Permissions cached for performance
- Cache invalidated on permission changes
- Updates apply without user re-login
- No stale permission issues
- Performance maintained with caching

**Data Cleanup**:
- Clear permission cache
- Reset configurations

---

## Security and Edge Case Tests

### Test Case: Permission Bypass Attempts
**Priority**: P0 (Critical)
**User Role**: Editor (with limited permissions)
**Preconditions**: 
- Editor role with restricted permissions

**Test Steps**:
1. Attempt direct URL manipulation to access restricted pages
2. Try POST requests to restricted endpoints
3. Attempt to modify hidden form fields
4. Test cookie/session manipulation
5. Try privilege escalation techniques

**Expected Results**:
- All bypass attempts fail securely
- Proper permission validation at all levels
- No privilege escalation possible
- Security logs capture attempts
- System remains stable under attack

**Data Cleanup**:
- Review security logs
- No data cleanup needed

---

### Test Case: Guest User Access Control
**Priority**: P1 (High)
**User Role**: Guest/Unauthenticated
**Preconditions**: 
- No user authentication

**Test Steps**:
1. Access BetterLinks admin URLs without login
2. Test REST API endpoints without authentication
3. Attempt to access analytics data
4. Try to create/modify links
5. Verify frontend functionality still works

**Expected Results**:
- Admin access completely blocked
- API endpoints require authentication
- No data accessible without login
- Frontend link functionality unaffected
- Proper redirect to login page

**Data Cleanup**:
- No cleanup needed

---

### Test Case: Session Timeout and Permission Validation
**Priority**: P2 (Medium)
**User Role**: Editor
**Preconditions**: 
- Active Editor session

**Test Steps**:
1. Login as Editor user
2. Wait for session timeout or force session expiry
3. Attempt to perform actions with expired session
4. Test automatic re-authentication
5. Verify permission re-validation after re-auth

**Expected Results**:
- Expired sessions properly detected
- Actions fail with expired sessions
- Re-authentication required
- Permissions re-validated after re-auth
- No unauthorized actions possible

**Data Cleanup**:
- Clear expired sessions
