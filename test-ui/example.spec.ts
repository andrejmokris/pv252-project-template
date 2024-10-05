import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test("Verify the main menu navigation", async ({ page }) => {
  await page.goto("/");

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

test("Verify Site A div click and navigation", async ({ page }) => {
  await page.goto("/");

  const siteADiv = page.locator("#site-a");
  await expect(siteADiv).toHaveText("Factorial value 5! is 120.");
  await siteADiv.click();

  // Wait for navigation to occur (should happen after about 3 seconds)
  await page.waitForURL("**/site_a.html", { timeout: 4000 });

  expect(page.url()).toContain("/site_a.html");
});

test("Verify Site B div click and navigation", async ({ page }) => {
  await page.goto("/");

  const siteBDiv = page.locator("#site-b");
  await expect(siteBDiv).toHaveText("5th fibonacci number is 5");
  await siteBDiv.click();

  await page.waitForURL("**/site_b.html", { timeout: 4000 });

  expect(page.url()).toContain("/site_b.html");
});
