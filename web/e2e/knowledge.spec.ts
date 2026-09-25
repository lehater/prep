import { expect, test } from "@playwright/test";

const targetKnowledgePath = "/learning/linux-backend-interview/knowledge";

test("switches explicit Learning and Curation Knowledge contexts", async ({ page }) => {
  await page.goto(targetKnowledgePath);

  await expect(
    page.getByRole("heading", { name: "Linux backend interview" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Curation" }).click();
  await expect(
    page.getByRole("heading", { name: "Curation Knowledge" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a learning target" }),
  ).toBeVisible();
});

test("preserves target search context while readable detail opens and closes", async ({
  page,
}) => {
  await page.goto(targetKnowledgePath);

  const search = page.getByRole("textbox", { name: "Search Knowledge" });
  await search.fill("cgroups");
  await page.getByRole("button", { name: "Search", exact: true }).click();

  const item = page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Linux cgroups/ });
  await expect(item).toBeVisible();
  await item.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Linux cgroups", level: 4 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close detail" }).click();

  await expect(search).toHaveValue("cgroups");
  await expect(
    page.getByRole("heading", { name: "Linux backend interview" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=cgroups/);
});

test("keeps a non-graph empty-state path when the 3D renderer is present or unavailable", async ({
  page,
}) => {
  await page.goto(targetKnowledgePath);

  await expect(
    page.getByRole("region", { name: "3D Knowledge graph" }),
  ).toBeVisible();

  const search = page.getByRole("textbox", { name: "Search Knowledge" });
  await search.fill("does-not-exist");
  await page.getByRole("button", { name: "Search", exact: true }).click();

  await expect(page.getByText("No Knowledge found")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "3D Knowledge graph" }),
  ).toBeVisible();
});
