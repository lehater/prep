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

test("target overview exposes purpose and keeps interview target related but separate", async ({ page }) => {
  await page.goto(`/learning/${targetId}/overview`);

  await expect(page.getByRole("heading", { name: "Target purpose" })).toBeVisible();
  await expect(page.getByText("Professional role capability")).toBeVisible();
  await expect(page.getByText(/Related target:/)).toContainText("selection");
  await expect(page.getByText(/do not inherit requirements automatically/i)).toBeVisible();
  await expect(page.getByText(/Company-specific interview format/)).toBeVisible();
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

  await page.getByRole("textbox", { name: "Why this focus now?" }).fill(
    "Interview in 10 days; limited evening study time.",
  );
  const gap = page.getByText("Reliable payment commands", { exact: true }).locator("..").locator("..");
  await gap.getByRole("button", { name: "Learn this" }).click();

  await expect(page.getByText("Current focus")).toBeVisible();
  await expect(page.getByText(/Interview in 10 days/)).toBeVisible();
  await page.getByRole("link", { name: "Continue with focus" }).click();
  await expect(page).toHaveURL(new RegExp(`/learning/${targetId}/learning`));
  await expect(page.getByText("Idempotency and retry safety")).toBeVisible();
});

test("learning practice produces a work product without inventing evidence", async ({ page }) => {
  await page.goto(`/learning/${targetId}/gaps`);

  const gap = page.getByText("Reliable payment commands", { exact: true }).locator("..").locator("..");
  await gap.getByRole("button", { name: "Learn this" }).click();
  await page.getByRole("link", { name: "Continue with focus" }).click();

  await page.getByRole("button", { name: "Start practice" }).click();
  const practice = page.getByRole("region", { name: "Practice: Retry-safe payment endpoint" });
  await practice.getByRole("textbox", { name: "Your approach" }).fill(
    "Use one stable idempotency key per logical payment command, persist the first outcome, return the same result for duplicates, and retry only transient failures.",
  );
  await practice.getByRole("button", { name: "Finish practice" }).click();

  await expect(page.getByText("Practice completed")).toBeVisible();
  await expect(page.getByText(/does not establish capability or close the gap/i)).toBeVisible();

  await page
    .getByRole("navigation", { name: "Learning target sections" })
    .getByRole("link", { name: "Progress", exact: true })
    .click();
  await expect(page.getByText("No established change yet")).toBeVisible();
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
  await expect(page.getByText(/^Why this evidence counts:/)).toBeVisible();
  await expect(page.getByText(/^Current conclusion:/)).toBeVisible();

  await page.getByRole("link", { name: "Review progress" }).click();
  await expect(page.getByText("Challenged → Satisfied")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Target refinement" })).toBeVisible();
  await expect(page.getByText(/Learner-state change is shown separately from target refinement/)).toBeVisible();
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
