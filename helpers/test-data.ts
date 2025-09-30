// Generate unique test data
export function generateTestData() {
    // Create timestamp in YYYYMMDD-HHMMSS format in gmt+6 instead of 2025-09-30T13:38:40.131Z
    const timestamp = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(2, 19).replace(/[:.-]/g, '').replace(/[T]/g, '-');
    return {
        linkTitle: `Test Link ${timestamp}`,
        targetUrl: `https://example.com/test-${timestamp}`,
        shortSlug: `test-${timestamp}`,
        categoryName: `Test Category ${timestamp}`,
        tagName: `test-tag-${timestamp}`
    };
}

// Generate random string
export function randomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
}
