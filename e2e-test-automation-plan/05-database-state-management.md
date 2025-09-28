# Database State Management Plan

## Overview
This document outlines comprehensive database state management strategies for BetterLinks E2E testing, including cleanup procedures, data dependencies, isolation techniques, and database operations to ensure reliable and repeatable test execution.

## Database Schema Overview

### Core Tables
1. **wp_betterlinks** - Main links table
2. **wp_betterlinks_terms** - Categories and tags
3. **wp_betterlinks_term_relationships** - Link-term associations
4. **wp_betterlinks_clicks** - Click tracking data
5. **wp_betterlinkmeta** - Link metadata
6. **wp_betterlinks_password** - Password protection (PRO)
7. **wp_betterlinks_clicks_rotations** - Dynamic redirect tracking (PRO)

### WordPress Integration Tables
- **wp_options** - Plugin settings and configuration
- **wp_posts** - Auto-created pages (password forms, etc.)
- **wp_usermeta** - User-specific plugin data

---

## Data Dependencies Mapping

### Primary Dependencies
```
wp_betterlinks (parent)
├── wp_betterlinks_clicks (child - FK: link_id)
├── wp_betterlinks_term_relationships (child - FK: link_id)
├── wp_betterlinkmeta (child - FK: link_id)
├── wp_betterlinks_password (child - FK: link_id)
└── wp_betterlinks_clicks_rotations (child - FK: link_id)

wp_betterlinks_terms (parent)
└── wp_betterlinks_term_relationships (child - FK: term_id)

wp_betterlinks_clicks (parent)
└── wp_betterlinks_clicks_rotations (child - FK: click_id)
```

### WordPress Options Dependencies
```
Plugin Settings:
- betterlinks_links (main settings)
- betterlinks_menu_notice
- betterlinks_activation_flag
- betterlinks_db_version
- betterlinkspro_role_permissions (PRO)
- betterlinkspro_broken_links_logs (PRO)
- betterlinkspro_reporting_settings (PRO)
```

---

## Test Isolation Strategies

### 1. Database Transaction Approach
```sql
-- Start transaction before each test
START TRANSACTION;

-- Run test operations
-- ...

-- Rollback after test completion
ROLLBACK;
```

**Pros**: Complete isolation, no data persistence
**Cons**: Cannot test commit-dependent features, complex with WordPress

### 2. Snapshot and Restore Approach
```sql
-- Create backup before test suite
CREATE TABLE wp_betterlinks_backup AS SELECT * FROM wp_betterlinks;
CREATE TABLE wp_betterlinks_clicks_backup AS SELECT * FROM wp_betterlinks_clicks;
-- ... backup all tables

-- Restore after each test
TRUNCATE TABLE wp_betterlinks;
INSERT INTO wp_betterlinks SELECT * FROM wp_betterlinks_backup;
-- ... restore all tables
```

### 3. Incremental Cleanup Approach (Recommended)
Track created data during tests and clean up specifically created records.

---

## Cleanup Procedures

### Before Each Test Suite
```javascript
async function setupCleanDatabase() {
    // 1. Clear all BetterLinks data
    await clearAllBetterLinksData();
    
    // 2. Reset plugin options
    await resetPluginOptions();
    
    // 3. Import base test data
    await importBaseTestData();
    
    // 4. Clear caches
    await clearAllCaches();
}
```

### Before Each Test Case
```javascript
async function setupTestCase() {
    // 1. Clear transients
    await clearTransients();
    
    // 2. Reset user sessions
    await resetUserSessions();
    
    // 3. Clear temporary files
    await clearTempFiles();
    
    // 4. Initialize test-specific data
    await initializeTestData();
}
```

### After Each Test Case
```javascript
async function cleanupTestCase() {
    // 1. Remove test-created links
    await removeTestLinks();
    
    // 2. Clear click data
    await clearTestClickData();
    
    // 3. Reset modified settings
    await resetModifiedSettings();
    
    // 4. Clear uploaded files
    await clearTestUploads();
}
```

### After Each Test Suite
```javascript
async function teardownTestSuite() {
    // 1. Full database cleanup
    await fullDatabaseCleanup();
    
    // 2. Reset file system
    await resetFileSystem();
    
    // 3. Clear all caches
    await clearAllCaches();
}
```

---

## Specific Cleanup Procedures

### Link Data Cleanup
```sql
-- Delete links created during testing (by pattern or timestamp)
DELETE FROM wp_betterlinks 
WHERE link_title LIKE 'TEST_%' 
   OR link_slug LIKE 'test-%'
   OR link_date > '2024-01-01 00:00:00';

-- Clean up dependent data (cascading)
DELETE FROM wp_betterlinks_clicks 
WHERE link_id NOT IN (SELECT ID FROM wp_betterlinks);

DELETE FROM wp_betterlinks_term_relationships 
WHERE link_id NOT IN (SELECT ID FROM wp_betterlinks);

DELETE FROM wp_betterlinkmeta 
WHERE link_id NOT IN (SELECT ID FROM wp_betterlinks);
```

### Terms and Categories Cleanup
```sql
-- Remove test terms
DELETE FROM wp_betterlinks_terms 
WHERE term_name LIKE 'Test %' 
   OR term_slug LIKE 'test-%';

-- Clean up orphaned relationships
DELETE FROM wp_betterlinks_term_relationships 
WHERE term_id NOT IN (SELECT ID FROM wp_betterlinks_terms);
```

### Click Data Cleanup
```sql
-- Clear test click data
DELETE FROM wp_betterlinks_clicks 
WHERE created_at > '2024-01-01 00:00:00'
   OR ip LIKE '127.0.0.1'
   OR visitor_id LIKE 'test_%';

-- Clear rotation data
DELETE FROM wp_betterlinks_clicks_rotations 
WHERE click_id NOT IN (SELECT ID FROM wp_betterlinks_clicks);
```

### Options Cleanup
```sql
-- Reset plugin options to defaults
DELETE FROM wp_options 
WHERE option_name LIKE 'betterlinks_%' 
   AND option_name NOT IN (
       'betterlinks_db_version',
       'betterlinks_activation_flag'
   );

-- Reset PRO options
DELETE FROM wp_options 
WHERE option_name LIKE 'betterlinkspro_%';
```

---

## Data Seeding Strategies

### Base Test Data Structure
```javascript
const baseTestData = {
    links: [
        {
            title: "Base Test Link 1",
            slug: "base-test-1",
            target_url: "https://example.com/test1",
            status: "publish",
            redirect_type: "307"
        },
        // ... more base links
    ],
    categories: [
        { name: "Test Category", slug: "test-category" },
        { name: "Marketing", slug: "marketing" }
    ],
    tags: [
        { name: "affiliate", slug: "affiliate" },
        { name: "social", slug: "social" }
    ]
};
```

### Dynamic Test Data Generation
```javascript
function generateTestLink(options = {}) {
    const timestamp = Date.now();
    return {
        title: options.title || `Test Link ${timestamp}`,
        slug: options.slug || `test-link-${timestamp}`,
        target_url: options.target_url || `https://example.com/test-${timestamp}`,
        status: options.status || "publish",
        redirect_type: options.redirect_type || "307",
        track_me: options.track_me || "1",
        created_at: new Date().toISOString()
    };
}
```

---

## State Verification Procedures

### Pre-Test State Verification
```javascript
async function verifyCleanState() {
    // Verify no test data exists
    const testLinks = await query(`
        SELECT COUNT(*) as count 
        FROM wp_betterlinks 
        WHERE link_title LIKE 'TEST_%' OR link_slug LIKE 'test-%'
    `);
    
    if (testLinks[0].count > 0) {
        throw new Error('Database not clean - test data found');
    }
    
    // Verify base data exists
    const baseLinks = await query(`
        SELECT COUNT(*) as count 
        FROM wp_betterlinks 
        WHERE link_title LIKE 'Base Test Link%'
    `);
    
    if (baseLinks[0].count === 0) {
        throw new Error('Base test data missing');
    }
}
```

### Post-Test State Verification
```javascript
async function verifyTestCleanup() {
    // Check for orphaned records
    const orphanedClicks = await query(`
        SELECT COUNT(*) as count 
        FROM wp_betterlinks_clicks c
        LEFT JOIN wp_betterlinks l ON c.link_id = l.ID
        WHERE l.ID IS NULL
    `);
    
    if (orphanedClicks[0].count > 0) {
        console.warn('Orphaned click records found');
    }
    
    // Verify test data removed
    const remainingTestData = await query(`
        SELECT COUNT(*) as count 
        FROM wp_betterlinks 
        WHERE link_title LIKE 'TEST_%'
    `);
    
    if (remainingTestData[0].count > 0) {
        console.warn('Test data not fully cleaned');
    }
}
```

---

## Performance Considerations

### Batch Operations
```javascript
// Use batch operations for large cleanups
async function batchDeleteClicks(batchSize = 1000) {
    let deletedCount = 0;
    let totalDeleted = 0;
    
    do {
        const result = await query(`
            DELETE FROM wp_betterlinks_clicks 
            WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
            LIMIT ${batchSize}
        `);
        
        deletedCount = result.affectedRows;
        totalDeleted += deletedCount;
        
        // Small delay to prevent database overload
        await sleep(100);
        
    } while (deletedCount === batchSize);
    
    return totalDeleted;
}
```

### Index Optimization
```sql
-- Ensure proper indexes for cleanup operations
CREATE INDEX idx_betterlinks_test_cleanup 
ON wp_betterlinks (link_title, link_date);

CREATE INDEX idx_clicks_cleanup 
ON wp_betterlinks_clicks (created_at, ip);

CREATE INDEX idx_terms_cleanup 
ON wp_betterlinks_terms (term_name, term_slug);
```

---

## Error Handling and Recovery

### Cleanup Failure Recovery
```javascript
async function recoverFromCleanupFailure() {
    try {
        // Attempt graceful cleanup
        await gracefulCleanup();
    } catch (error) {
        console.warn('Graceful cleanup failed, attempting force cleanup');
        
        try {
            // Force cleanup with more aggressive methods
            await forceCleanup();
        } catch (forceError) {
            console.error('Force cleanup failed, manual intervention required');
            
            // Log detailed error information
            await logCleanupFailure(error, forceError);
            
            // Attempt to restore from backup
            await restoreFromBackup();
        }
    }
}
```

### Data Corruption Detection
```javascript
async function detectDataCorruption() {
    const checks = [
        // Check foreign key integrity
        {
            name: 'Foreign Key Integrity',
            query: `
                SELECT COUNT(*) as count 
                FROM wp_betterlinks_clicks c
                LEFT JOIN wp_betterlinks l ON c.link_id = l.ID
                WHERE l.ID IS NULL
            `
        },
        
        // Check for duplicate slugs
        {
            name: 'Duplicate Slugs',
            query: `
                SELECT link_slug, COUNT(*) as count 
                FROM wp_betterlinks 
                GROUP BY link_slug 
                HAVING COUNT(*) > 1
            `
        }
    ];
    
    for (const check of checks) {
        const result = await query(check.query);
        if (result[0].count > 0) {
            console.error(`Data corruption detected: ${check.name}`);
            return false;
        }
    }
    
    return true;
}
```

---

## Monitoring and Logging

### Cleanup Operation Logging
```javascript
class CleanupLogger {
    constructor() {
        this.operations = [];
    }
    
    logOperation(operation, details) {
        this.operations.push({
            timestamp: new Date().toISOString(),
            operation,
            details,
            success: true
        });
    }
    
    logError(operation, error) {
        this.operations.push({
            timestamp: new Date().toISOString(),
            operation,
            error: error.message,
            success: false
        });
    }
    
    generateReport() {
        const successful = this.operations.filter(op => op.success).length;
        const failed = this.operations.filter(op => !op.success).length;
        
        return {
            total: this.operations.length,
            successful,
            failed,
            operations: this.operations
        };
    }
}
```

### Database State Monitoring
```javascript
async function monitorDatabaseState() {
    const stats = {
        links: await getTableCount('wp_betterlinks'),
        clicks: await getTableCount('wp_betterlinks_clicks'),
        terms: await getTableCount('wp_betterlinks_terms'),
        relationships: await getTableCount('wp_betterlinks_term_relationships'),
        metadata: await getTableCount('wp_betterlinkmeta')
    };
    
    // Log stats for trend analysis
    console.log('Database State:', stats);
    
    return stats;
}
```
