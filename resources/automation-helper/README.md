=== Automation Helper ===
Contributors: abuhurayra
Tags: database, table, display, automation, testing, e2e, shortcode
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPL v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A WordPress tool designed to assist with end-to-end (e2e) automation testing by providing database table display functionality with advanced features like pagination, search, and sorting.

== Description ==

Automation Helper is a powerful WordPress tool that provides database table display functionality specifically designed for automation testing scenarios. It allows you to display any WordPress database table using simple shortcodes with advanced features like real-time search, pagination, and sorting.

== Features ==

- 🎯 **Database Table Display**: Display any WordPress database table using shortcodes
- 🔍 **Advanced Search**: Real-time search across all table columns
- 📄 **Smart Pagination**: AJAX-powered pagination with 50 rows per page by default
- 🔀 **Column Sorting**: Sort data by clicking on column headers
- 🎭 **Playwright-Ready**: All elements include unique `data-testid` attributes for automation
- 📱 **Responsive Design**: Works on all device sizes
- ♿ **Accessibility**: WCAG compliant with proper ARIA attributes
- ⚡ **Performance Optimized**: AJAX loading with loading states and error handling

== Installation ==

1. Download the plugin files
2. Upload the `automation-helper` folder to your `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Navigate to **Tools > Automation Helper** in your WordPress admin

== Usage ==

=== Admin Interface ===

1. Go to **WordPress Admin > Tools > Automation Helper**
2. Select a database table from the dropdown (shows all tables with WordPress prefix)
3. Copy the generated shortcode
4. Paste the shortcode into any page or post

=== Shortcode Usage ===

**Basic Usage**
```
[ahjah_db_display table='wp_posts']
```

**Default Behavior**
```
[ahjah_db_display]
```
*Displays the wp_options table by default*

**Available Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `table` | string | `wp_options` | Name of the database table to display |

== File Structure ==

```
automation-helper/
├── automation-helper.php          # Main plugin file
├── assets/
│   ├── css/
│   │   ├── admin.css             # Admin panel styles
│   │   └── frontend.css          # Frontend shortcode styles
│   └── js/
│       ├── admin.js              # Admin panel JavaScript
│       └── frontend.js           # Frontend functionality
├── languages/                    # Translation files (future use)
└── README.md                     # This documentation
```

== Technical Details ==

=== Code Standards ===

- Follows WordPress Coding Standards
- All functions, classes, and variables prefixed with `ahjah_` to avoid conflicts
- Proper sanitization and validation of all user inputs
- Nonce verification for AJAX requests
- Prepared statements for all database queries

=== AJAX Endpoints ===

**ahjah_get_table_data**
Fetches table data with pagination, search, and sorting.

**Parameters:**
- `table` (string): Table name
- `page` (int): Current page number
- `per_page` (int): Items per page (default: 50)
- `search` (string): Search query
- `orderby` (string): Column to sort by
- `order` (string): Sort order ('ASC' or 'DESC')
- `nonce` (string): Security nonce

**Response Format:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "columns": [...],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total_items": 100,
      "total_pages": 2,
      "start_item": 1,
      "end_item": 50
    }
  }
}
```

=== CSS Classes Reference ===

**Admin Panel**
- `.ahjah-admin-container` - Main admin container
- `.ahjah-card` - Card-style sections
- `#ahjah-shortcode-generator` - Shortcode generator form
- `#ahjah-table-select` - Table dropdown
- `#ahjah-generated-shortcode` - Generated shortcode input
- `#ahjah-copy-shortcode` - Copy button
- `#ahjah-copy-message` - Copy feedback message

**Frontend Display**
- `.ahjah-table-container` - Main table container
- `.ahjah-table-controls` - Search and info controls
- `.ahjah-search` - Search input field
- `.ahjah-data-table` - Main data table
- `.ahjah-pagination-wrapper` - Pagination container
- `.ahjah-pagination-btn` - Pagination buttons
- `.ahjah-loading` - Loading indicator
- `.ahjah-error` - Error messages
- `.ahjah-no-data` - No data message

=== Data-TestId Attributes for Automation ===

**Admin Panel Test IDs**
```javascript
// Page elements
'ahjah-page-title'              // Main page title
'ahjah-admin-container'         // Admin container
'ahjah-generator-title'         // Generator section title
'ahjah-shortcode-generator'     // Main form
'ahjah-table-select'            // Table dropdown
'ahjah-table-option-{table}'    // Individual table options
'ahjah-generated-shortcode'     // Shortcode input
'ahjah-copy-button'             // Copy button
'ahjah-copy-message'            // Copy feedback
```

**Frontend Test IDs**
```javascript
// Table elements
'ahjah-table-container'         // Main container
'ahjah-table-controls'          // Control panel
'ahjah-search-input'            // Search field
'ahjah-table-name'              // Table name badge
'ahjah-data-table'              // Data table
'ahjah-header-{column}'         // Column headers
'ahjah-row-{index}'             // Table rows
'ahjah-cell-{column}-{index}'   // Individual cells

// Pagination elements
'ahjah-pagination-wrapper'      // Pagination container
'ahjah-pagination-info'         // Info text
'ahjah-pagination-controls'     // Button container
'ahjah-prev-btn'                // Previous button
'ahjah-next-btn'                // Next button
'ahjah-page-{number}'           // Page number buttons

// State elements
'ahjah-loading'                 // Loading indicator
'ahjah-error'                   // Error messages
'ahjah-no-data'                 // No data message
```

== Playwright Automation Examples ==

=== Basic Table Display Test ===
```javascript
// Navigate to a page with the shortcode
await page.goto('/your-page-with-shortcode');

// Wait for table to load
await page.waitForSelector('[data-testid="ahjah-data-table"]');

// Verify table is visible
const table = page.locator('[data-testid="ahjah-data-table"]');
await expect(table).toBeVisible();
```

=== Search Functionality Test ===
```javascript
// Perform search
const searchInput = page.locator('[data-testid="ahjah-search-input"]');
await searchInput.fill('search term');

// Wait for results
await page.waitForTimeout(1000); // Wait for debounce

// Verify results
const rows = page.locator('[data-testid^="ahjah-row-"]');
await expect(rows).toHaveCount(expectedCount);
```

=== Pagination Test ===
```javascript
// Click next page
const nextBtn = page.locator('[data-testid="ahjah-next-btn"]');
await nextBtn.click();

// Wait for new data
await page.waitForLoadState('networkidle');

// Verify page changed
const pageInfo = page.locator('[data-testid="ahjah-pagination-info"]');
await expect(pageInfo).toContainText('Showing 51 to 100');
```

=== Sorting Test ===
```javascript
// Click column header to sort
const columnHeader = page.locator('[data-testid="ahjah-header-id"]');
await columnHeader.click();

// Verify sort order
await expect(columnHeader).toHaveAttribute('aria-sort', 'ascending');
```

=== Admin Panel Test ===
```javascript
// Navigate to admin page
await page.goto('/wp-admin/tools.php?page=automation-helper');

// Select table
const tableSelect = page.locator('[data-testid="ahjah-table-select"]');
await tableSelect.selectOption('wp_posts');

// Verify shortcode generated
const shortcodeInput = page.locator('[data-testid="ahjah-generated-shortcode"]');
await expect(shortcodeInput).toHaveValue('[ahjah_db_display table=\'wp_posts\']');

// Copy shortcode
const copyBtn = page.locator('[data-testid="ahjah-copy-button"]');
await copyBtn.click();

// Verify copy success message
const copyMessage = page.locator('[data-testid="ahjah-copy-message"]');
await expect(copyMessage).toContainText('copied to clipboard');
```

== Security Considerations ==

- **Access Control**: Available to all users (configurable in code)
- **Input Sanitization**: All inputs are properly sanitized
- **SQL Injection Prevention**: Uses WordPress prepared statements
- **Nonce Verification**: All AJAX requests include nonce verification
- **Table Validation**: Only existing tables can be accessed
- **Prefix Restriction**: Only shows tables with WordPress prefix

== Performance Considerations ==

- **AJAX Loading**: Reduces page load times
- **Pagination**: Limits database queries to manageable chunks
- **Search Debouncing**: Prevents excessive AJAX requests during typing
- **Caching**: Leverages WordPress object caching where applicable
- **Optimized Queries**: Uses efficient SQL with proper indexing

== Browser Support ==

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **JavaScript**: ES6+ features with fallbacks
- **CSS**: Flexbox and Grid with fallbacks
- **Mobile**: Responsive design for all screen sizes

== Troubleshooting ==

=== Common Issues ===

**Table not displaying**
1. Verify the table name is correct
2. Check if the table exists in the database
3. Ensure the table has the WordPress prefix

**Search not working**
1. Check browser console for JavaScript errors
2. Verify AJAX requests are reaching the server
3. Check if the search query contains valid characters

**Pagination issues**
1. Ensure JavaScript is enabled
2. Check for conflicting plugins
3. Verify AJAX endpoints are accessible

**Copy button not working**
1. Check if the browser supports the Clipboard API
2. Ensure the page is served over HTTPS (for modern clipboard features)
3. Check for JavaScript errors in console

=== Debug Mode ===

Add this to your `wp-config.php` for debugging:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('SCRIPT_DEBUG', true);
```

== Future Enhancements ==

- [ ] Export functionality (CSV, Excel)
- [ ] Custom column filtering
- [ ] Data editing capabilities
- [ ] Table relationship visualization
- [ ] Query builder interface
- [ ] Custom SQL execution
- [ ] Data comparison tools
- [ ] Automated testing helpers

== Changelog ==

= 1.0.0 =
- Initial release
- Database table display with shortcode
- Search, pagination, and sorting functionality
- Admin interface for shortcode generation
- Playwright-ready with data-testid attributes
- Responsive design and accessibility features

== Contributing ==

1. Fork the repository
2. Create a feature branch
3. Follow WordPress coding standards
4. Add appropriate data-testid attributes for new elements
5. Test with multiple browsers and devices
6. Submit a pull request

== License ==

This tool is licensed under the GPL v2 or later.

== Support ==

For issues, feature requests, or questions:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify all files are properly uploaded
4. Test in a clean WordPress environment

---

**Built for automation testing excellence** 🚀