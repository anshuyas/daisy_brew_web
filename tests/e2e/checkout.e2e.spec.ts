import { test, expect } from "@playwright/test";

test.describe("Checkout Flow – /user/checkout", () => {
  const baseUrl = "http://localhost:3000";

  test("User can access checkout page", async ({ page }) => {
    await page.goto(`${baseUrl}/user/checkout`);
    await expect(page.getByText("Checkout")).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm Order" })).toBeVisible();
  });

  test("Cannot checkout with empty cart", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("cart");
    });

    await page.goto(`${baseUrl}/user/checkout`);
    await page.getByRole("button", { name: "Confirm Order" }).click();

    await expect(page.getByText("Your cart is empty")).toBeVisible();
  });

  test("Successful order placement redirects to dashboard", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("auth_token", "fake-test-token");
    });

    await page.addInitScript(() => {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          {
            name: "Latte",
            price: 200,
            quantity: 1,
            image: "/coffee.jpg",
          },
        ])
      );
    });

    await page.route("http://localhost:5050/api/user/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            fullName: "Test User",
            email: "test@example.com",
            phone: "1234567890",
            address: "Kathmandu",
          },
        }),
      });
    });

    await page.route("http://localhost:5050/api/orders", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          _id: "order123456",
        }),
      });
    });

    await page.route("http://localhost:5050/api/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Notification created" }),
      });
    });

    // Go to checkout AFTER mocks
    await page.goto(`${baseUrl}/user/checkout`);

    // Fill address 
    await page.fill('input[placeholder="Delivery Address"]', "Kathmandu");

    // Click confirm order
    await page.getByRole("button", { name: "Confirm Order" }).click();

    // Wait for success modal container 
    const successModal = page.locator('[data-testid="order-success"]');
    await expect(successModal).toBeVisible({ timeout: 15000 });

    //  click OK
    const okButton = page.getByRole("button", { name: "OK" });
    await expect(okButton).toBeVisible({ timeout: 15000 });
    await okButton.click();

    // Check redirect
    await page.waitForURL("**/dashboard", { timeout: 15000 });
  });
});