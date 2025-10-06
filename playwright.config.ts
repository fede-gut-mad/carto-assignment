import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: '.env', quiet: true });

export default defineConfig({
  testDir: 'tests',
  timeout: 200000,
  expect: { timeout: 10000 },
  retries: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  workers: 1,

  use: {
    baseURL: process.env.CARTO_BASE_URL || 'https://app.carto.com',
    trace:  'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    { 
      name: 'chromium',
       testDir: 'tests/ui',
        use: {
        ...devices['Desktop Chrome'] 
      } 
    },
    { 
      name: 'firefox',  
      testDir: 'tests/ui', 
      use: { 
        ...devices['Desktop Firefox'] 
      } 
    },

    // API tests (no browser)
    { 
      name: 'api',      
      testDir: 'tests/api', 
      use: {} 
    },
  ],
});
