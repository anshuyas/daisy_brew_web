import { test, expect } from "@playwright/test";

test.describe("Cart System Tests (Dashboard Modal)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector('text=Good to see you', { timeout: 20000 });
  });

  test("Add drink to cart updates UI", async ({ page }) => {
  // 1. Add a drink
  await page.locator('button:has-text("+")').first().click(); // open customizer
  await page.locator('button:has-text("Add to Cart")').click();

  // 2. Open cart modal
  const cartBtn = page.locator('button:has-text("🛒")');
  await cartBtn.click();

  // 3. Wait for modal to appear
  const cartModal = page.locator('[data-testid="cart-modal"]');
  await expect(cartModal).toBeVisible({ timeout: 10000 }); 

  // 4. Check first cart item
  const firstCartItem = page.locator('[data-testid^="cart-item-"]').first();
  await expect(firstCartItem).toBeVisible();
});

  test("Increase/decrease quantity works", async ({ page }) => {
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.locator('button:has-text("🛒")').click();

    const quantitySpan = page.locator('[data-testid^="cart-quantity-"]').first();
    const increaseBtn = page.locator('[data-testid^="cart-increase-"]').first();
    const decreaseBtn = page.locator('[data-testid^="cart-decrease-"]').first();

    const initialQty = parseInt(await quantitySpan.textContent() || "1");
    await increaseBtn.click();
    await expect(quantitySpan).toHaveText(String(initialQty + 1));

    await decreaseBtn.click();
    await expect(quantitySpan).toHaveText(String(initialQty));
  });

  test("Remove item from cart works", async ({ page }) => {
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.locator('button:has-text("🛒")').click();

    const removeBtn = page.locator('[data-testid^="cart-remove-"]').first();
    await removeBtn.click();

    const emptyMessage = page.locator('[data-testid="cart-empty-msg"]');
    await expect(emptyMessage).toBeVisible();
  });

  test("Cart persists after page refresh", async ({ page }) => {
    await page.locator('button:has-text("+")').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.locator('button:has-text("🛒")').click();

    const firstItemName = await page.locator('[data-testid^="cart-item-name-"]').first().textContent();

    await page.reload();
    await page.locator('button:has-text("🛒")').click();

    const firstItemAfterReload = page.locator('[data-testid^="cart-item-name-"]').first();
    await expect(firstItemAfterReload).toHaveText(firstItemName?.trim() || "");
  });
});