import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  fullyParallel: true,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    storageState: 'tests/auth.json', 
  },

   webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },

  globalSetup: './tests/setup.ts', 
});