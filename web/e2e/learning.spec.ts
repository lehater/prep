import { expect, test } from "@playwright/test";

const targetId = "linux-backend-interview";

test("selects a prepared target and preserves it across learner sections", async ({
  page,
}) => {
  await page.goto("/learning");

  await expect(
    page.getByRole("heading", { name: "Choose a learning target" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Open target" }).click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/overview`));
  await expect(
    page.getByRole("heading", { name: "Linux backend interview" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Study" }).click();
  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/study`));
  await page.getByRole("link", { name: "Statistics" }).click();
  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/statistics`));
});

test("overview shows read-only scope and factual material counts", async ({ page }) => {
  await page.goto(`/learning/${targetId}/overview`);

  await expect(page.getByRole("heading", { name: "Scope" })).toBeVisible();
  await expect(page.getByText("Linux resource management")).toBeVisible();
  await expect(page.getByText("Knowledge").locator("..")).toContainText("5");
  await expect(page.getByText("Questions").locator("..")).toContainText("3");
  await expect(page.getByText("Study Set").locator("..")).toContainText("Available");
  await expect(page.getByText(/recorded reviews/)).toContainText("4");
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
  await expect(page.getByText(/readiness/i)).toHaveCount(0);
});

test("Question to Knowledge navigation preserves target and focuses all alignments", async ({
  page,
}) => {
  await page.goto(`/learning/${targetId}/study`);

  await expect(
    page.getByRole("heading", {
      name: "What problem do Linux cgroups help address?",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Show in Knowledge Map" }).click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/knowledge`));
  const url = new URL(page.url());
  expect(url.searchParams.get("focus")).toBe(
    "resource-contention,resource-isolation,linux-cgroups",
  );
});

test("builds, inspects and exports the exact Study Set preview", async ({ page }) => {
  await page.goto(`/learning/${targetId}/study`);

  await page.getByRole("button", { name: "Build Study Set" }).click();
  await expect(page.getByText("3 Questions in the exact inspected preview.")).toBeVisible();
  await page.getByRole("button", { name: "Export to Anki" }).click();

  await expect(page.getByText("Study Set export completed")).toBeVisible();
  await expect(page.getByText(/question-cgroups-purpose: success/)).toBeVisible();
});

test("statistics remain factual and review sync is explicit", async ({ page }) => {
  await page.goto(`/learning/${targetId}/statistics`);

  const aggregates = page.getByRole("region", { name: "Review aggregates" });
  await expect(aggregates).toContainText("Total");
  await expect(aggregates).toContainText("4");
  await expect(page.getByText(/question-cgroups-purpose/)).toBeVisible();

  await page.getByRole("button", { name: "Sync reviews from Anki" }).click();
  await expect(page.getByRole("status")).toContainText("Review sync completed");
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
});
