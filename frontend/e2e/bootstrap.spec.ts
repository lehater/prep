import { expect, test } from "@playwright/test";

test("boots the neutral frontend shell", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("main[data-prep-bootstrap='ready']")).toHaveCount(1);
});
