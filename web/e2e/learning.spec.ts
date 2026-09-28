import { expect, test } from "@playwright/test";

const targetId = "python-backend-fintech";

test("selects a career target and exposes the complete target-work navigation", async ({ page }) => {
  await page.goto("/learning");

  await expect(page.getByRole("heading", { name: "Choose a target" })).toBeVisible();
  await expect(page.getByText("Middle Python Backend — Fintech / Card Payments")).toBeVisible();
  await page.getByRole("link", { name: "Open target" }).click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/overview`));
  await expect(page.getByRole("heading", { name: "Middle Python Backend — Fintech / Card Payments" })).toBeVisible();

  for (const section of ["State", "Gaps", "Learning", "Diagnostics", "Knowledge", "Progress"]) {
    await expect(page.getByRole("link", { name: section, exact: true })).toBeVisible();
  }
});

test("current state distinguishes satisfied unresolved and challenged", async ({ page }) => {
  await page.goto(`/learning/${targetId}/state`);

  const state = page.getByRole("region", { name: "Target requirement state" });
  await expect(state).toContainText("Satisfied");
  await expect(state).toContainText("Unresolved");
  await expect(state).toContainText("Challenged");
  await expect(page.getByText(/proficiency score/i)).toHaveCount(0);
});

test("gap can become an explicit learning focus", async ({ page }) => {
  await page.goto(`/learning/${targetId}/gaps`);

  const gap = page.getByText("Reliable payment commands", { exact: true }).locator("..").locator("..");
  await gap.getByRole("button", { name: "Learn this" }).click();

  await expect(page.getByText("Current focus")).toBeVisible();
  await page.getByRole("link", { name: "Continue with focus" }).click();
  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/learning`));
  await expect(page.getByText("Idempotency and retry safety")).toBeVisible();
});

test("current focus stays visible when moving into Knowledge", async ({ page }) => {
  await page.goto(`/learning/${targetId}/gaps`);

  const gap = page.getByText("Reliable payment commands").locator("..").locator("..");
  await gap.getByRole("button", { name: "Learn this" }).click();

  await page
    .getByRole("navigation", { name: "Learning target sections" })
    .getByRole("link", { name: "Knowledge", exact: true })
    .click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/knowledge`));
  await expect(page.getByText("Current focus: Reliable payment commands · learning")).toBeVisible();
});

test("diagnostic evidence changes target-relative progress", async ({ page }) => {
  await page.goto(`/learning/${targetId}/gaps`);

  const gap = page.getByText("Reliable payment commands").locator("..").locator("..");
  await gap.getByRole("button", { name: "Diagnose this" }).click();
  await page.getByRole("link", { name: "Continue with focus" }).click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/diagnostics`));
  await page.getByRole("button", { name: "Accept mock diagnostic evidence" }).click();
  await expect(page.getByText("New evidence accepted")).toBeVisible();
  await expect(page.getByText(/^Observation:/)).toBeVisible();
  await expect(page.getByText(/^Evidence argument:/)).toBeVisible();
  await expect(page.getByText(/^Claim projection:/)).toBeVisible();

  await page.getByRole("link", { name: "Review progress" }).click();
  await expect(page.getByText("Challenged → Satisfied")).toBeVisible();
});

test("new accepted evidence may validly leave target satisfaction unchanged", async ({ page }) => {
  await page.goto(`/learning/${targetId}/diagnostics`);

  const diagnostic = page
    .getByRole("heading", { name: "Python backend confirmation diagnostic" })
    .locator("..");
  await diagnostic
    .getByRole("button", { name: "Accept mock diagnostic evidence" })
    .click();

  await expect(page.getByText("New evidence accepted")).toBeVisible();
  await page.getByRole("link", { name: "Review progress" }).click();
  await expect(page.getByText("No established change yet")).toBeVisible();
});

test("target overview is capability-oriented and Knowledge remains target-scoped", async ({ page }) => {
  await page.goto(`/learning/${targetId}/overview`);

  await expect(page.getByRole("heading", { name: "Target capabilities" })).toBeVisible();
  await expect(page.getByText("Card-payment processing", { exact: true })).toBeVisible();
  await expect(page.getByText("Reliable payment commands")).toBeVisible();
  await expect(page.getByText("Relevant Knowledge").locator("..")).toContainText("12");
});
