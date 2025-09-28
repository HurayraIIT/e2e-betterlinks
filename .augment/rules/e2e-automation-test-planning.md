---
type: "manual"
---

# AI Instructions: WordPress Plugin E2E Test Analysis & Plan Generation

## Objective
Analyze WordPress plugin BetterLinks (FREE & PRO) source code comprehensively and generate a detailed end-to-end test automation plan using Playwright Node.js for desktop Chrome testing.

## Analysis Phase

### 1. Code Structure Analysis
- **Examine plugin architecture**: Identify main plugin file, class structures, and organizational patterns
- **Map plugin components**: Frontend components, admin interfaces, REST API endpoints, AJAX handlers
- **Identify entry points**: Plugin activation hooks, admin menus, shortcodes, widgets, blocks
- **Analyze database operations**: Table creation, data storage patterns, migration scripts
- **Review security implementations**: Nonce verification, capability checks, input sanitization

### 2. Feature Discovery
- **Core functionalities**: Extract primary features from plugin headers, readme files, and main classes
- **User interfaces**: Admin pages, settings panels, frontend displays, modal dialogs
- **User workflows**: Complete user journeys from feature discovery to completion
- **Integration points**: WordPress hooks, filters, third-party service integrations
- **Data flow mapping**: How data moves through the system (create, read, update, delete operations)

### 3. WordPress-Specific Analysis
- **Hook and filter usage**: Identify custom hooks/filters that might affect testing
- **User role requirements**: Determine which features require specific WordPress capabilities
- **WordPress core dependencies**: Features that rely on WordPress core functionality
- **Theme compatibility considerations**: Frontend elements that might be theme-dependent

## Test Plan Generation Requirements

### Priority Classification System
Assign one of these priorities to each test case:

1. **P0 (Critical)**: Core functionality that would break the plugin's primary purpose
2. **P1 (High)**: Important features that affect user experience significantly
3. **P2 (Medium)**: Secondary features and edge cases
4. **P3 (Low)**: Nice-to-have features and minor UI elements

### Test Case Structure
For each test case, provide:

```markdown
### Test Case: [Descriptive Name]
**Priority**: P0/P1/P2/P3
**User Role**: Admin/Editor/Subscriber/Guest
**Preconditions**: 
- [Required setup conditions]
- [Database state requirements]

**Test Steps**:
1. [Detailed step with specific UI elements to interact with]
2. [Include expected page URLs where relevant]
3. [Specify form fields, buttons, links by their likely selectors]

**Expected Results**:
- [Specific outcomes to verify]
- [Database changes to validate]
- [UI state changes to confirm]

**Data Cleanup**:
- [Required cleanup steps for database]
- [Settings to reset]
```

### Coverage Requirements

#### Unit-Level Feature Testing
- Test each individual feature in isolation
- Verify form submissions and validations
- Check AJAX operations and API endpoints
- Validate database operations (CRUD)
- Test user permission restrictions

#### User Journey Testing  
- Complete workflows from start to finish
- Multi-step processes across different pages
- Integration between different plugin features
- User role transitions and capability changes

#### Database State Management
- Identify data dependencies between tests
- Plan for database cleanup after each test
- Handle plugin options and custom table data
- Consider WordPress transients and cache

### Special Considerations for BetterLinks Plugin

Since you're working with the BetterLinks plugin, pay special attention to:
- Link creation, editing, and deletion workflows
- Click tracking and analytics functionality
- Bulk operations and import/export features
- Link categorization and tagging
- Redirect functionality testing
- Statistics and reporting features
- Settings and configuration options

### Output Format

Generate the test plan as a markdown document with:

1. **Executive Summary**
   - Plugin overview
   - Key features identified
   - Testing approach summary
   - Total test cases by priority

2. **Environment Setup**
   - Required WordPress setup
   - Plugin configuration needs
   - Test data requirements
   - User account prerequisites

3. **Test Cases by Feature**
   - Group related test cases together
   - Organize by user workflows
   - Include both positive and negative test scenarios

4. **Database Management Plan**
   - Cleanup procedures between tests
   - Data dependency mapping
   - State management strategy

5. **Risk Assessment**
   - High-risk areas requiring extra attention
   - Potential testing challenges
   - Areas requiring manual verification

## Analysis Instructions

1. **Start with plugin metadata**: Examine the main plugin file header, readme.txt, and composer.json if present
2. **Map the codebase systematically**: Follow the plugin's directory structure and identify key files
3. **Trace user interactions**: Follow code paths from user actions to database operations
4. **Identify integration points**: Look for WordPress hooks, AJAX handlers, and REST API endpoints  
5. **Consider error scenarios**: Plan tests for validation failures, permission errors, and edge cases
6. **Think like an end user**: Consider realistic usage patterns and potential user mistakes

## Output Guidelines

- Use clear, actionable language in test steps
- Be specific about UI elements (buttons, forms, menus)
- Include realistic test data examples
- Specify exact URLs and page locations where possible
- Consider mobile-responsive elements (even though testing desktop Chrome)
- Plan for both fresh installations and existing data scenarios

## Quality Checklist

Before finalizing the test plan, ensure:
- [ ] All major plugin features are covered
- [ ] Critical user paths have P0 priority
- [ ] Database cleanup is planned for each test
- [ ] User roles are appropriately assigned
- [ ] Edge cases and error scenarios are included
- [ ] Test cases are independent and can run in any order
- [ ] Realistic test data is specified
- [ ] Expected results are measurable and specific