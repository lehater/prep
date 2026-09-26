import { expect, test } from "@playwright/test";

test("boots the production frontend shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Prep");
  await expect(page.getByRole("heading", { name: "Prep" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Refresh Anki runtime status" }),
  ).toContainText("Anki: reachable");
});
