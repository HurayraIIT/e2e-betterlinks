# BetterLinks E2E Test Environment Setup

## Overview
This document outlines the complete environment setup requirements for automated end-to-end testing of BetterLinks FREE and PRO plugins using Playwright Node.js for desktop Chrome testing.

## WordPress Environment Requirements

### Minimum System Requirements
- **WordPress Version**: 5.0 or higher (tested up to 6.7)
- **PHP Version**: 7.4 or higher
- **MySQL Version**: 5.6 or higher / MariaDB 10.0 or higher
- **Web Server**: Apache 2.4+ or Nginx 1.18+
- **Memory Limit**: 256MB minimum (512MB recommended)
- **Max Execution Time**: 300 seconds minimum

### WordPress Configuration
```php
// wp-config.php settings for testing
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', true);
define('WP_MEMORY_LIMIT', '512M');
```

## Plugin Installation Requirements

### BetterLinks FREE Plugin
- **Plugin File**: `betterlinks/betterlinks.php`
- **Version**: 2.3.1 or higher
- **Dependencies**: None (standalone)
- **Required Capabilities**: `manage_options` for admin access

### BetterLinks PRO Plugin
- **Plugin File**: `betterlinks-pro/betterlinks-pro.php`
- **Version**: 2.3.2 or higher
- **Dependencies**: BetterLinks FREE plugin must be installed first
- **License**: Valid license key required for full functionality
- **Required Capabilities**: `manage_options` + custom role-based permissions

## Database Setup

### Core Tables Created by BetterLinks
1. `wp_betterlinks` - Main links table
2. `wp_betterlinks_terms` - Categories and tags
3. `wp_betterlinks_term_relationships` - Link-term associations
4. `wp_betterlinks_clicks` - Click tracking data
5. `wp_betterlinkmeta` - Link metadata
6. `wp_betterlinks_password` - Password protection (PRO)
7. `wp_betterlinks_clicks_rotations` - Dynamic redirect tracking (PRO)

### Database Permissions
- CREATE, ALTER, DROP for table management
- INSERT, UPDATE, DELETE, SELECT for data operations
- INDEX privileges for performance optimization

## User Account Prerequisites

### WordPress User Roles Required
1. **Administrator** - Full access to all features
2. **Editor** - Limited access based on role permissions (PRO)
3. **Author** - Basic link creation (if permitted)
4. **Subscriber** - View-only access (if permitted)

### Test User Accounts Setup
```php
// Create test users with different roles
$admin_user = [
    'user_login' => 'test_admin',
    'user_pass' => 'TestAdmin123!',
    'user_email' => 'admin@test.local',
    'role' => 'administrator'
];

$editor_user = [
    'user_login' => 'test_editor',
    'user_pass' => 'TestEditor123!',
    'user_email' => 'editor@test.local',
    'role' => 'editor'
];

$author_user = [
    'user_login' => 'test_author',
    'user_pass' => 'TestAuthor123!',
    'user_email' => 'author@test.local',
    'role' => 'author'
];
```

## Plugin Configuration

### BetterLinks FREE Configuration
```json
{
    "prefix": "go",
    "is_case_sensitive": false,
    "wildcards": false,
    "disablebotclicks": true,
    "force_https": false,
    "is_disable_analytics_ip": false,
    "parameter_tracking": {
        "pf": 1,
        "target_url": 0,
        "utm": 0
    }
}
```

### BetterLinks PRO Configuration
```json
{
    "role_permissions": {
        "manageLinks": ["administrator", "editor"],
        "manageCategories": ["administrator"],
        "manageAnalytics": ["administrator", "editor"],
        "manageAutoliks": ["administrator"]
    },
    "broken_link_checker": {
        "enable_reporting": true,
        "email": "admin@test.local",
        "email_subject": "Broken Links Report"
    },
    "google_analytics": {
        "is_enable_ga": false,
        "ga_tracking_code": "",
        "ga4_api_secret": ""
    },
    "facebook_pixel": {
        "is_enable_pixel": false,
        "pixel_id": "",
        "pixel_access_token": ""
    }
}
```

## Test Data Requirements

### Sample Links Data
1. **Basic Short Links** (10 links)
   - Various redirect types (301, 302, 307)
   - Different target URL formats
   - Mixed nofollow/sponsored attributes

2. **Categorized Links** (5 categories, 15 links)
   - Business category (5 links)
   - Marketing category (5 links)
   - Social Media category (5 links)

3. **Tagged Links** (8 tags, 20 links)
   - affiliate, marketing, social, business tags
   - Multiple tags per link

4. **PRO-Specific Links**
   - Password-protected links (3 links)
   - Scheduled links (2 links)
   - Dynamic redirect links (2 links)
   - Auto-link keywords (5 keywords)

### Sample Click Data
- Generate 100+ click records with varied:
  - IP addresses
  - User agents (different browsers/devices)
  - Referrer URLs
  - Geographic locations
  - Timestamps (last 30 days)

## Playwright Test Configuration

### Browser Setup
```javascript
// playwright.config.js
module.exports = {
    testDir: './tests',
    timeout: 30000,
    expect: {
        timeout: 5000
    },
    use: {
        browserName: 'chromium',
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
            },
        }
    ]
};
```

### Environment Variables
```bash
# .env file for test configuration
WORDPRESS_URL=http://localhost/betterlinks-test
ADMIN_USERNAME=test_admin
ADMIN_PASSWORD=TestAdmin123!
EDITOR_USERNAME=test_editor
EDITOR_PASSWORD=TestEditor123!
DB_HOST=localhost
DB_NAME=betterlinks_test
DB_USER=test_user
DB_PASS=test_password
BETTERLINKS_PRO_LICENSE=your-license-key-here
```

## Pre-Test Setup Checklist

### WordPress Installation
- [ ] Fresh WordPress installation
- [ ] Required plugins installed and activated
- [ ] Test user accounts created
- [ ] Permalink structure set to "Post name"
- [ ] Timezone configured
- [ ] Email delivery configured (for notifications)

### BetterLinks Configuration
- [ ] Plugin settings configured
- [ ] Database tables created successfully
- [ ] License activated (PRO version)
- [ ] Role permissions configured (PRO)
- [ ] Sample data imported
- [ ] Cache cleared

### Test Environment Validation
- [ ] All admin pages accessible
- [ ] REST API endpoints responding
- [ ] Link redirection working
- [ ] Click tracking functional
- [ ] Email notifications working (PRO)
- [ ] Cron jobs scheduled properly

## Cleanup Procedures

### Between Test Runs
1. Clear all transients and cache
2. Reset link click counts
3. Clear temporary files
4. Reset user sessions

### Full Environment Reset
1. Truncate all BetterLinks tables
2. Delete plugin options
3. Clear uploaded files
4. Reset user roles and capabilities
5. Reimport base test data

## Troubleshooting Common Issues

### Plugin Activation Issues
- Check PHP version compatibility
- Verify file permissions
- Ensure database connectivity
- Check for plugin conflicts

### License Activation Issues (PRO)
- Verify license key format
- Check domain restrictions
- Ensure internet connectivity
- Validate license server response

### Database Issues
- Check table creation permissions
- Verify charset/collation settings
- Monitor query execution times
- Check for foreign key constraints

## Performance Considerations

### Optimization Settings
- Enable object caching
- Configure database query caching
- Optimize autoload options
- Set appropriate memory limits

### Monitoring
- Track database query performance
- Monitor memory usage
- Log slow operations
- Track API response times
