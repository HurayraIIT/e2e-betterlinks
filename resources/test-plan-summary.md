# BetterLinks E2E Test Plan - Executive Summary

## Overview

This document provides a comprehensive end-to-end test plan for the BetterLinks WordPress plugin (FREE + PRO versions). The test plan is optimized for Playwright automation with workflow-based tests that maximize coverage while minimizing redundancy.

## Quick Stats

- **Total Test Suites:** 12
- **Total Test Cases:** 120+ individual test steps
- **Estimated Execution Time:** 45-60 minutes (full suite)
- **Priority Breakdown:**
  - High Priority: 7 suites (Core functionality)
  - Medium Priority: 4 suites (Advanced features)
  - Low Priority: 1 suite (External integrations)

## Test Suites Overview

### High Priority (Core Features)

1. **Link Management Lifecycle** (`link-management.spec.ts`)
   - Create, edit, delete links
   - Bulk operations
   - Search and filtering
   - Favorites management
   - ~15 test steps

2. **Frontend Link Redirects** (`link-redirects.spec.ts`)
   - 301, 302, 307 redirects
   - Parameter forwarding
   - Cloaked redirects (PRO)
   - Click tracking
   - ~10 test steps

3. **Analytics Dashboard** (`analytics.spec.ts`)
   - Overview statistics
   - Date range filtering
   - Browser/OS/Device reports
   - Individual link analytics (PRO)
   - ~11 test steps

4. **Categories & Tags Management** (`categories-tags.spec.ts`)
   - Create/edit/delete taxonomies
   - Link associations
   - Analytics by category/tag
   - ~10 test steps

5. **Plugin Settings** (`settings.spec.ts`)
   - General settings
   - Default link options
   - External analytics config (PRO)
   - Auto-link settings (PRO)
   - ~12 test steps

6. **Import & Export** (`import-export.spec.ts`)
   - CSV export (links & clicks)
   - CSV import with validation
   - PrettyLinks migration
   - ThirstyAffiliates migration
   - ~11 test steps

7. **User Role Permissions** (`user-permissions.spec.ts`) - PRO
   - Role configuration
   - Permission enforcement (UI & API)
   - Multi-role testing
   - ~10 test steps

### Medium Priority (Advanced Features)

8. **Link Scheduling** (`link-scheduling.spec.ts`) - PRO
   - Scheduled publishing
   - Click-based expiration
   - Date-based expiration
   - ~11 test steps

9. **Dynamic Redirects** (`dynamic-redirects.spec.ts`) - PRO
   - Sequential rotation
   - Random rotation
   - Weighted rotation
   - Split testing
   - ~11 test steps

10. **Broken Link Checker** (`broken-link-checker.spec.ts`) - PRO
    - Automatic scanning
    - Manual scanning
    - Email notifications
    - Full-site scanning
    - ~12 test steps

11. **Auto-Link Keywords** (`auto-link-keywords.spec.ts`) - PRO
    - Keyword creation
    - Frontend auto-linking
    - Filters (category, tag, post type)
    - Import/export
    - ~13 test steps

### Low Priority (External Integrations)

12. **External Analytics** (`external-analytics.spec.ts`) - PRO
    - Google Analytics UA
    - Google Analytics 4
    - Facebook Pixel
    - Parameter tracking
    - ~12 test steps

## Key Features Tested

### FREE Version Features
- ✅ Link creation, editing, deletion
- ✅ Multiple redirect types (301, 302, 307)
- ✅ Click tracking and analytics
- ✅ Categories and tags
- ✅ Search and filtering
- ✅ Bulk operations
- ✅ Import/Export (CSV)
- ✅ Migration from PrettyLinks/ThirstyAffiliates
- ✅ Parameter forwarding
- ✅ Nofollow/Sponsored attributes
- ✅ Bot blocking
- ✅ QR code generation
- ✅ UTM builder

### PRO Version Features
- ✅ Individual link analytics
- ✅ Role-based permissions (8 permission types)
- ✅ Link scheduling
- ✅ Link expiration (date & click-based)
- ✅ Dynamic redirects (rotation & split testing)
- ✅ Cloaked redirects
- ✅ Broken link checker
- ✅ Full-site link scanner
- ✅ Auto-link keywords
- ✅ Google Analytics integration (UA & GA4)
- ✅ Facebook Pixel integration
- ✅ Parameter tracking
- ✅ Affiliate disclosure
- ✅ Password-protected redirects
- ✅ Custom scripts
- ✅ Custom domain support

## User Roles Tested

| Role | Access Level | Test Coverage |
|------|--------------|---------------|
| Administrator | Full access | All features |
| Editor | Configurable (PRO) | Permission-based |
| Author | Configurable (PRO) | Permission-based |
| Contributor | Configurable (PRO) | Permission-based |
| Subscriber | No access | Access denial |
| Unauthenticated | Frontend only | Redirects only |

## Test Data Strategy

### Naming Convention
All test data uses timestamps to ensure uniqueness:
- Links: `test-link-${Date.now()}`
- Categories: `Test Category ${Date.now()}`
- Tags: `test-tag-${Date.now()}`

### Cleanup Strategy
- Each test creates and cleans up its own data
- Teardown functions ensure cleanup even on failure
- Global cleanup function for orphaned data
- Database queries to find and remove test patterns

## Success Criteria

### Pass Rates
- High Priority: 100% pass required
- Medium Priority: 95%+ pass required
- Low Priority: 90%+ pass required

### Performance Benchmarks
- Admin page load: < 2 seconds
- Link redirect: < 500ms
- Analytics query: < 3 seconds
- Import 100 links: < 10 seconds

### Coverage Goals
- PHP code coverage: 80%+
- REST API endpoints: 100%
- Admin UI pages: 100%
- Frontend scenarios: 100%

## Implementation Notes

### Prerequisites
1. WordPress 5.0+ with PHP 7.4+
2. BetterLinks FREE 2.3.1+ installed
3. BetterLinks PRO 2.3.2+ installed and licensed
4. Test user accounts for each role
5. Permalink structure configured

### Test Environment
- Browser: Chrome desktop only
- WordPress: Single site (no multisite)
- Database: Clean state before each suite
- Caching: Disabled during tests

### Execution Approach
1. Run settings tests first (establish baseline)
2. Run core feature tests (links, redirects, analytics)
3. Run taxonomy tests (categories, tags)
4. Run data operation tests (import/export)
5. Run PRO feature tests (advanced functionality)

### Parallel Execution
Tests can be parallelized by suite:
- Group 1: Link management, Categories, Settings
- Group 2: Redirects, Analytics, Import/Export
- Group 3: All PRO features

## Known Limitations

1. **Onboarding wizard** - Tests assume setup is complete
2. **External services** - Use test/demo credentials only
3. **Email delivery** - Tests sending, not actual delivery
4. **Multisite** - Not covered in this test plan
5. **Cross-browser** - Chrome only (no Firefox, Safari)
6. **Mobile** - Desktop only (no mobile responsive testing)

## Edge Cases Covered

- ✅ Duplicate slug validation
- ✅ Invalid URL handling
- ✅ Special characters in titles/slugs
- ✅ Parameter forwarding with complex URLs
- ✅ Concurrent user edits
- ✅ Large dataset performance (100+ links)
- ✅ Timezone handling for scheduled links
- ✅ Expired link behavior
- ✅ Bot traffic filtering
- ✅ Case sensitivity options

## Next Steps

1. **Review** - Stakeholder review of test plan
2. **Setup** - Prepare test environment and data
3. **Implementation** - Write Playwright test scripts
4. **Execution** - Run initial test suite
5. **Refinement** - Adjust based on results
6. **CI/CD Integration** - Automate in pipeline
7. **Maintenance** - Update as plugin evolves

## Contact & Support

For questions about this test plan:
- Review the full test plan document: `test-plan.md`
- Check plugin documentation: https://betterlinks.io/docs/
- Review source code in: `resources/wordpress-plugins/betterlinks/` and `resources/wordpress-plugins/betterlinks-pro/`

---

**Document Version:** 1.0  
**Created:** 2025-09-30  
**Status:** Ready for Implementation

