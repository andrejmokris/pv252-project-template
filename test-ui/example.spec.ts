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

test("Go to GH and find repositary of the template", async ({ page }) => {
  await page.goto("https://github.com");

  await page.click('button[data-target="qbsearch-input.inputButton"]');

  await page.waitForSelector("#query-builder-test");

  await page.fill("#query-builder-test", "pv252-project-template");

  await page.press("#query-builder-test", "Enter");

  // Verify URL
  await expect(page).toHaveURL(
    "https://github.com/search?q=pv252-project-template&type=repositories",
  );

  // Check if the specific repository is found
  const repoLink = page.getByRole("link", {
    name: "daemontus/pv252-project-template",
  });

  await expect(repoLink).toBeVisible();
});

test("Get the repository link and navigate to it", async ({ page }) => {
  await page.goto(
    "https://github.com/search?q=pv252-project-template&type=repositories",
  );

  const repoLinkSelector =
    'a.Link__StyledLink-sc-14289xe-0:has-text("daemontus/pv252-project-template")';
  await expect(page.locator(repoLinkSelector)).toBeVisible();

  // Click on the repository link
  await page.click(repoLinkSelector);

  await expect(page).toHaveURL(
    "https://github.com/daemontus/pv252-project-template",
  );
});

test("Verify the number of forks", async ({ page }) => {
  await page.goto("https://github.com/daemontus/pv252-project-template");

  const forksSelector = 'a[href$="/forks"].Link--muted';

  await expect(page.locator(forksSelector)).toBeVisible();

  const forksText = await page.locator(forksSelector).innerText();
  const forksCount = parseInt(forksText.match(/\d+/)?.[0] || "0", 10);

  expect(forksCount).toBeGreaterThan(20);
});

test("Get list of forks and verify the user andrejmokris has forked the repo", async ({
  page,
}) => {
  await page.goto("https://github.com/daemontus/pv252-project-template");

  const forksSelector = 'a[href$="/forks"].Link--muted';

  await expect(page.locator(forksSelector)).toBeVisible();

  await page.click(forksSelector);

  await expect(page).toHaveURL(
    "https://github.com/daemontus/pv252-project-template/forks",
  );

  await expect(page.getByText("andrejmokris", { exact: false })).toBeVisible();
});
