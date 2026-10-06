import { expect, test, type Page } from "@playwright/test";

async function compareAndContinueWithBackend(page: Page) {
  await page.getByRole("checkbox", { name: /Backend Engineer interview/ }).check();
  await page.getByRole("checkbox", { name: /Platform Engineer interview/ }).check();
  await page.getByRole("button", { name: "Compare selected" }).click();
  await page
    .getByRole("radio", { name: "Backend Engineer interview" })
    .check();
  await page
    .getByRole("button", { name: "Continue with selected Target" })
    .click();
}

test("compares candidate Targets and continues without activating one", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Choose what you are preparing for" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Not established"),
  ).toBeVisible();

  await page
    .getByRole("checkbox", { name: /Backend Engineer interview/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Platform Engineer interview/ })
    .check();

  await page.getByRole("button", { name: "Compare selected" }).click();

  await expect(
    page.getByRole("heading", { name: "Compare selected Targets" }),
  ).toBeVisible();
  await expect(
    page.getByText("System design", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Behavioral communication", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Kubernetes operations", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("The same learner evidence basis is used for every candidate."),
  ).toBeVisible();

  await page
    .getByRole("radio", { name: "Backend Engineer interview" })
    .check();
  await page
    .getByRole("button", { name: "Continue with selected Target" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Establish your Target" }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Target", exact: true })).toHaveValue(
    "target:backend-interview",
  );
  await expect(page.getByLabel("Source / context")).toHaveValue(
    "Backend interview brief",
  );
  await expect(
    page.getByLabel("Active preparation context").getByText("Not established"),
  ).toBeVisible();
});

test("establishes Target explicitly, then exposes requirements and direct Knowledge focus", async ({
  page,
}) => {
  await page.goto("/");
  await compareAndContinueWithBackend(page);

  await page.getByRole("button", { name: "Establish Target" }).click();

  await expect(
    page.getByRole("heading", { name: "What this Target requires" }),
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();

  await expect(
    page.getByText(
      "Design a scalable service and explain major trade-offs.",
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Conditions" }).first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Quality criteria" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Caching strategy")).toBeVisible();
  await expect(
    page.getByText(
      "Consistency choices trade latency and coordination against freshness guarantees.",
    ),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Explore Knowledge for System design" })
    .click();

  await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible();
  await expect(
    page.getByText(
      "Explore Subject Knowledge scoped to the selected Required Capability.",
    ),
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Target", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "What this Target requires" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Design a scalable service and explain major trade-offs.",
    ),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Request missing preparation support" })
    .click();
  await expect(page.getByRole("heading", { name: "Prepare Support" })).toBeVisible();
  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();
});

test("preserves Target draft after rejected establishment and accepts corrected input", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Target", exact: true }).click();

  const target = page.getByRole("combobox", { name: "Target", exact: true });
  const source = page.getByLabel("Source / context");

  await target.selectOption({ label: "Backend Engineer interview" });
  await expect(source).toHaveValue("Backend interview brief");
  await source.fill("");

  await page.getByRole("button", { name: "Establish Target" }).click();

  await expect(
    page.getByText("Target source/context is required."),
  ).toBeVisible();
  await expect(target).toHaveValue("target:backend-interview");
  await expect(source).toHaveValue("");
  await expect(
    page.getByLabel("Active preparation context").getByText("Not established"),
  ).toBeVisible();

  await source.fill("Backend interview brief");
  await page.getByRole("button", { name: "Establish Target" }).click();

  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Requirements" }),
  ).toBeVisible();
});

test("routes Target-dependent navigation to recovery when Target is absent", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Current position" }).click();

  await expect(
    page.getByRole("heading", { name: "Establish your Target" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Establish a Target before entering Target-dependent preparation work.",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Targets", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Choose what you are preparing for" }),
  ).toBeVisible();
});

test("preserves preparation hierarchy and serializes comparison on a narrow viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.locator("nav.prep-navigation + section.active-context"),
  ).toBeVisible();
  await expect(
    page.locator("section.active-context + main.active-child"),
  ).toBeVisible();

  await page
    .getByRole("checkbox", { name: /Backend Engineer interview/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Platform Engineer interview/ })
    .check();
  await page.getByRole("button", { name: "Compare selected" }).click();

  const cards = page.locator(".comparison-card");
  await expect(cards).toHaveCount(2);

  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  if (!firstBox || !secondBox) {
    throw new Error("Comparison cards must have measurable layout boxes.");
  }

  expect(Math.abs(firstBox.x - secondBox.x)).toBeLessThan(2);
  expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height - 2);
  await expect(
    page.getByText("Shared required capabilities").first(),
  ).toBeVisible();
  await expect(
    page.getByText("Current evidence-backed position").first(),
  ).toBeVisible();
});
