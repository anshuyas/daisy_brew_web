import { test, expect } from "@playwright/test";

test.describe("Security & Middleware Tests", () => {

  test("Unauthenticated user is redirected when accessing /user/orders", async ({ page, context }) => {
    //Clear cookies and storage properly
    await context.clearCookies();
    await context.clearPermissions();

    //  Go to the orders page
    await page.goto("/user/orders");

    //  Clear localStorage 
    await page.evaluate(() => localStorage.clear());

    //  Wait for client-side redirect to login
    await page.waitForURL("**/login", { timeout: 5000 });

    //  Confirm login page content exists
    await expect(page.getByText("Welcome Back!")).toBeVisible();
    await expect(page.getByText("Sign in to explore Daisy Brew")).toBeVisible();
  });

});