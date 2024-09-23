import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test("Verify the main menu navigation", async ({ page }) => {
  await page.goto("/site_a.html");

  // Verify the menu items are present
  await expect(page.locator(".menu-home")).toBeVisible();
  await expect(page.locator(".menu-site-a")).toBeVisible();
  await expect(page.locator(".menu-site-b")).toBeVisible();

  // Verify the menu items are clickable and navigate correctly
  await page.click(".menu-home");
  await expect(page.url()).toContain("/");

  await page.click(".menu-site-a");
  await expect(page.url()).toContain("/site_a.html");

  await page.click(".menu-site-b");
  await expect(page.url()).toContain("/site_b.html");
});
