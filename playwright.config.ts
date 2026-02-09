// import { defineConfig } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',
//   timeout: 60 * 1000,
//   retries: 0,
  
//   // Add reporter to generate HTML report
//   reporter: [['html', { open: 'never' }]],

//   use: {
//     headless: true,
//     viewport: { width: 1280, height: 720 },
//     baseURL: 'https://sit-desktop.freedemokit.com',
//     screenshot: 'only-on-failure',
//     trace: 'on-first-retry'
//   },
// });


//for dev folder mobile and desktop tests

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: {
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    baseURL: 'https://sit-desktop.freedemokit.com',
  },
    // Add reporter to generate HTML report
  reporter: [['html', { open: 'never' }]],
});

//for dev 001 folder mobile tests only
