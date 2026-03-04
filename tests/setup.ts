import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Go to your login page
  await page.goto('http://localhost:3000/login');

  // Fill login form 
  await page.fill('#email', 'testuser@gmail.com');
  await page.fill('#password', '123456');

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect (user goes to /dashboard)
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // Save cookies + localStorage (JWT token)
  await page.context().storageState({
    path: 'tests/auth.json',
  });

  await browser.close();
}

export default globalSetup;