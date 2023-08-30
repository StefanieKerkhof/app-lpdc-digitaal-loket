import { defineConfig } from '@playwright/test';
import type { TestOptions } from './test-api/test-helpers/test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  testDir: './.',
  /* Run tests in files not in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  retries: 2,
  /* Opt out of parallel tests. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'line',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: true
  },
  projects: [
    {
      name: 'e2e-setup',
      testMatch: 'auth.setup.ts'
    },
    {
      name: 'api',
      testDir: './test-api',
    },
    {
      name: 'e2e',
      testDir: './test-e2e',
      use: {
        storageState: 'playwright/.auth/user.json',
        baseURL: 'http://localhost:4200'
      },
      dependencies: ['e2e-setup'],
    },
  ],
  globalSetup: require.resolve('./global-setup'),
});
