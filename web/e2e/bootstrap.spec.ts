import { expect, test } from "@playwright/test";

test("completely empty corpus uses learner-facing delegated preparation before optional self-curation", async ({
  page,
}) => {
  const intent = "Payments role";

  await page.goto(
    "/learning?scenario=empty-corpus&search=" + encodeURIComponent(intent),
  );

  await expect(page.getByRole("heading", { name: "Preparation is missing" })).toBeVisible();
  await expect(page.getByText("Target/search context: " + intent)).toBeVisible();

  await expect(page.getByRole("button", { name: "Ask Prep to prepare it" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Self-curate instead" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Prepare in bulk" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Curate manually" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Start mixed preparation" })).toHaveCount(0);

  await page.getByRole("button", { name: "Ask Prep to prepare it" }).click();

  await expect(
    page.getByRole("heading", { name: "Prepared target ready for review" }),
  ).toBeVisible();
  await expect(page.getByText("Payments role — prepared")).toBeVisible();

  await page.getByRole("link", { name: "Review prepared target" }).click();

  await expect(page.getByRole("heading", { name: "Payments role — prepared" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Target capabilities" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "Learning target sections" })
    .getByRole("link", { name: "State", exact: true })
    .click();

  await expect(
    page.getByRole("region", { name: "Target requirement state" }),
  ).toContainText("Unresolved");
});

test("self-curation remains an explicit optional handoff", async ({ page }) => {
  await page.goto("/learning?scenario=empty-corpus&search=Payments%20role");

  await page.getByRole("link", { name: "Self-curate instead" }).click();

  await expect(
    page.getByRole("navigation", { name: "Curation sections" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/curation\/capabilities/);
});
