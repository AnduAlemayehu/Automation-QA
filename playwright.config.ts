import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  retries: 0,
  
  // Add reporter to generate HTML report
  reporter: [['html', { open: 'never' }]],

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://sit-desktop.freedemokit.com',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  },
});
