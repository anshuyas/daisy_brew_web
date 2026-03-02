import { test, expect } from "@playwright/test";

test.describe("User Features (/user/*)", () => {
  test("Profile page loads and displays user info", async ({ page, context }) => {
      const mockUser = {
        fullName: "Test User",
        email: "test@example.com",
        mobile: "1234567890",
        location: "Kathmandu",
        image: null,
      };

      await context.addCookies([
      {
        name: "user_data",
        value: encodeURIComponent(JSON.stringify(mockUser)),
        domain: "localhost", 
        path: "/",
      },
    ]);

    await page.goto("/user/profile");

    const fullNameInput = page.locator('[data-testid="fullNameInput"]');
    const emailInput = page.locator('[data-testid="emailInput"]');
    const mobileInput = page.locator('[data-testid="mobileInput"]');
    const locationInput = page.locator('[data-testid="locationInput"]');

    await expect(fullNameInput).toHaveValue("Test User");
    await expect(emailInput).toHaveValue("test@example.com");
    await expect(mobileInput).toHaveValue("1234567890");
    await expect(locationInput).toHaveValue("Kathmandu");
  });
});

  test("Orders page loads and displays orders or empty state", async ({ page }) => {
    // Mock orders API
    await page.route("**/api/orders", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            _id: "order123456",
            items: [{ name: "Latte", quantity: 2, price: 150 }],
            total: 300,
            status: "confirmed",
            createdAt: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto("/user/orders");

    // Grouped container for first order
    const orderCard = page.locator('div[class*="bg-white"][class*="rounded-2xl"]').first();
    await expect(orderCard).toBeVisible();

    // Check item
    await expect(orderCard.locator("text=Latte x 2")).toBeVisible();

    // Check item price
    await expect(orderCard.locator("text=Rs. 300").first()).toBeVisible();

    // Check status
    await expect(orderCard.locator('span:has-text("confirmed")')).toBeVisible();
  });

  test("Notifications page loads and displays notifications", async ({ page }) => {
    // Mock notification API
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            _id: "notif1",
            message: "Your order is ready",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.goto("/user/notification");

    const notifCard = page.locator('div[class*="flex"][class*="p-4"]').first();
    await expect(notifCard).toBeVisible();
    await expect(notifCard.locator('text=Your order is ready')).toBeVisible();

    // Unread badge
    await expect(page.locator('span:has-text("1 New")')).toBeVisible();
  });
