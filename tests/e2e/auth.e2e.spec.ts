import { test, expect } from '@playwright/test';

async function loginWithToken(page: any, token: string) {
  await page.goto('/'); // load app first
  await page.evaluate((jwt: string) => {
    localStorage.setItem('token', jwt);
  }, token);
}

const TEST_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTQ3NjA3MTQ3MDBjYzY4MGUwY2RkYyIsImVtYWlsIjoidGVzdHVzZXJAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzIzOTQzOTQsImV4cCI6MTc3NDk4NjM5NH0.G2U9keB81z-JJKrSQbWun838kGPexPveY6mVCLQxKhc'; 

test('Login success redirects to dashboard', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'testuser@gmail.com');
  await page.fill('#password', '123456');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard');
  await expect(page.locator('text=Good to see you')).toBeVisible();
});

test('Login failure shows error', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'testuser@gmail.com');
  await page.fill('#password', 'wrongpassword');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Login failed')).toBeVisible();
});

test('Already logged in redirects from login page', async ({ page }) => {
  // Programmatically inject JWT
  await loginWithToken(page, TEST_JWT);

  await page.goto('/login');
  await page.waitForURL('**/dashboard');
  await expect(page.locator('text=Good to see you')).toBeVisible();
});

test('Logout clears token and redirects to login', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('#email', 'testuser@gmail.com');
  await page.fill('#password', '123456');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // Click logout \
  await page.waitForSelector('button#logout', { state: 'visible' });
  await page.click('button#logout');

  // Verify redirect
  await page.waitForURL('**/login');
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeNull();
});