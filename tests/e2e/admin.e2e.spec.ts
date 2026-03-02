import { test, expect } from "@playwright/test";

test.describe("Admin Menu Management", () => {
  const adminEmail = "admin@example.com"; 
  const adminPassword = "12345678"; 

  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto("/login");

    // Fill credentials
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', adminPassword);

    // Click login
    await page.click('button[type="submit"]');

    // Wait for navigation to any page
    await page.waitForLoadState("networkidle");

    // Navigate explicitly to Admin Menu page
    await page.goto("/admin/menu");

    // Wait for page content to be visible
    await page.waitForSelector("h1:text('Menu Management')", { timeout: 30000 });
  });

  test("should display menu items", async ({ page }) => {
    await page.waitForSelector("div.bg-white.rounded-xl.shadow.p-4", { timeout: 30000 });
    const items = await page.locator("div.bg-white.rounded-xl.shadow.p-4").count();
    expect(items).toBeGreaterThan(0);
  });

  test("should open add menu modal", async ({ page }) => {
  await page.click("text=+ Add Menu Item");
  await expect(page.locator('h2', { hasText: "Add Menu Item" })).toBeVisible();
});

  test("should open edit menu modal", async ({ page }) => {
    await page.click("button:has-text('Edit')");
    await expect(page.locator("text=Edit Menu Item")).toBeVisible();
  });

  test("should open delete confirmation modal", async ({ page }) => {
  const itemCard = page.locator("div.bg-white.rounded-xl.shadow.p-4").first();
  await expect(itemCard).toBeVisible({ timeout: 10000 });

  await itemCard.locator("button:has-text('Delete')").click();

  const modal = page.locator("div.fixed.inset-0 >> div.bg-white").first();
  await expect(modal).toBeVisible({ timeout: 10000 });

  const heading = modal.locator("h2", { hasText: "Confirm Delete" }).first();
  await expect(heading).toBeVisible();
});
});