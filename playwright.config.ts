import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config();

export default defineConfig({
  testDir: './tests',
  // fullyParallel: true,
  retries: process.env.CI ? 1 : 1,
  workers: process.env.CI ? 1 : 1,
  timeout: 30 * 1000,

  expect: {
    timeout: 5_000,
    toMatchSnapshot: { maxDiffPixelRatio: 0.03 },
    toHaveScreenshot: { maxDiffPixelRatio: 0.03 },
  },
  
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-testid',
    screenshot: "on",
    trace: "on-first-retry",
    video: "on-first-retry",
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
