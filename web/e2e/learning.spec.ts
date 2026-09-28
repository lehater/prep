import { expect, test } from "@playwright/test";

const targetId = "python-backend-fintech";

test("selects a career target and exposes the complete target-work navigation", async ({ page }) => {
  await page.goto("/learning");

  await expect(page.getByRole("heading", { name: "Choose a learning target" })).toBeVisible();
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

  const gap = page.getByText("Design reliable payment commands").locator("..").locator("..");
  await gap.getByRole("button", { name: "Learn this" }).click();

  await expect(page.getByText("Current focus")).toBeVisible();
  await page.getByRole("link", { name: "Continue with focus" }).click();
  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/learning`));
  await expect(page.getByText("Idempotency and retry safety")).toBeVisible();
});

test("diagnostic evidence changes target-relative progress", async ({ page }) => {
  await page.goto(`/learning/${targetId}/gaps`);

  const gap = page.getByText("Design reliable payment commands").locator("..").locator("..");
  await gap.getByRole("button", { name: "Diagnose this" }).click();
  await page.getByRole("link", { name: "Continue with focus" }).click();

  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/diagnostics`));
  await page.getByRole("button", { name: "Complete mock diagnostic" }).click();
  await expect(page.getByText("New evidence accepted")).toBeVisible();

  await page.getByRole("link", { name: "Review progress" }).click();
  await expect(page.getByText("Challenged → Satisfied")).toBeVisible();
});

test("target overview is capability-oriented and Knowledge remains target-scoped", async ({ page }) => {
  await page.goto(`/learning/${targetId}/overview`);

  await expect(page.getByRole("heading", { name: "Target capabilities" })).toBeVisible();
  await expect(page.getByText("Explain the card-payment processing chain")).toBeVisible();
  await expect(page.getByText("Design reliable payment commands")).toBeVisible();
  await expect(page.getByText("Relevant Knowledge").locator("..")).toContainText("12");
});
