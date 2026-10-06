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

async function establishBackendTarget(page: Page) {
  await compareAndContinueWithBackend(page);
  await page.getByRole("button", { name: "Establish Target" }).click();
  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();
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

  await expect(
    page.getByRole("heading", { name: "Explore the Knowledge that matters here" }),
  ).toBeVisible();
  await expect(
    page.getByText("System design", { exact: true }).last(),
  ).toBeVisible();
  await expect(page.getByText("2 results in the current semantic scope.")).toBeVisible();
  await expect(
    page.getByText(
      "Consistency choices trade latency and coordination against freshness guarantees.",
      { exact: true },
    ).first(),
  ).toBeVisible();
  await expect(page.getByText("Caching strategy", { exact: true }).first()).toBeVisible();
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


test("reviews current evidence and explicitly sets the Next focus before Activity", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);

  await page.getByRole("button", { name: "Current position" }).click();

  await expect(
    page.getByRole("heading", { name: "Understand where to focus next" }),
  ).toBeVisible();
  await expect(page.getByText("demonstrated", { exact: true })).toBeVisible();
  await expect(page.getByText("challenged", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("unknown", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "There is not enough attributable evidence to conclude either way.",
    ),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "What needs attention" }),
  ).toBeVisible();
  await expect(page.getByText("Core interview loop requirement.", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Required behavioral interview evidence.", { exact: true }),
  ).toBeVisible();

  await page.getByRole("radio", { name: /System design/ }).check();

  await expect(page.getByLabel("Focus purpose")).toHaveValue(
    "Work on System design next.",
  );
  await expect(page.getByLabel("Rationale")).toHaveValue(
    "High target relevance with suitable support available.",
  );

  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Not selected"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Set Next focus" }).click();

  await expect(page.getByText("Next focus accepted")).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();

  await page.getByText("Why this state: evidence basis").click();
  await expect(
    page.getByText(
      "Practice review found unclear consistency assumptions in a cache design.",
    ),
  ).toBeVisible();

  await expect(page.getByText(/mastery percentage/i)).toHaveCount(0);
  await expect(page.getByText(/readiness percentage/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Continue to Activity" }).click();
  await expect(page.getByRole("heading", { name: "Work on the accepted Next focus" })).toBeVisible();
});

test("preserves a missing-support focus and routes to contextual preparation", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Current position" }).click();

  await page
    .getByRole("radio", { name: /Behavioral communication/ })
    .check();
  await page.getByRole("button", { name: "Set Next focus" }).click();

  await expect(page.getByText("Next focus accepted")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Prepare missing support" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Prepare missing support" }).click();

  await expect(page.getByRole("heading", { name: "Prepare Support" })).toBeVisible();
  await expect(
    page
      .getByLabel("Active preparation context")
      .getByText("Backend Engineer interview"),
  ).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();
});


test("keeps Knowledge query, capability scope, detail and relations task-complete without spatial rendering", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);

  await page
    .getByRole("button", { name: "Explore Knowledge for System design" })
    .click();

  const knowledgeView = page.locator(
    '[data-view="knowledge"][data-renderer="nonspatial"]',
  );
  await expect(knowledgeView).toBeVisible();
  await expect(knowledgeView.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByText(
      "This task path is complete without a spatial renderer. Geometry is not Knowledge meaning.",
    ),
  ).toBeVisible();

  await expect(
    page.getByText("System design", { exact: true }).last(),
  ).toBeVisible();
  await expect(page.getByText("2 results in the current semantic scope.")).toBeVisible();

  await page.getByRole("button", { name: "Inspect proposition" }).click();
  await expect(page.locator("#knowledge-detail-heading")).toHaveText(
    "Consistency choices trade latency and coordination against freshness guarantees.",
  );
  await expect(
    page.getByText(
      "consistency-mode influences latency, coordination, and freshness",
      { exact: true },
    ).last(),
  ).toBeVisible();
  await expect(
    page.getByText("Caching strategy (object)", { exact: true }),
  ).toBeVisible();

  const query = page.getByLabel("Knowledge query");
  await query.fill("Caching");
  await query.press("Enter");
  await expect(page.getByText("1 result in the current semantic scope.")).toBeVisible();
  await expect(page.getByText("Caching strategy", { exact: true }).first()).toBeVisible();

  await page
    .getByRole("button", { name: "Clear Required Capability scope" })
    .click();
  await query.fill("event loop");
  await query.press("Enter");
  await expect(page.getByText("JavaScript event loop", { exact: true })).toBeVisible();
  await expect(page.getByText("1 result in the current semantic scope.")).toBeVisible();

  await page.getByRole("button", { name: "Target", exact: true }).click();
  await page.getByRole("button", { name: "Knowledge", exact: true }).click();

  await expect(page.getByLabel("Knowledge query")).toHaveValue("event loop");
  await expect(page.getByText("JavaScript event loop", { exact: true })).toBeVisible();
  await expect(page.getByText("No filter", { exact: true })).toBeVisible();
});

test("preserves accepted Next focus context when entering Knowledge", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Current position" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Set Next focus" }).click();

  await page.getByRole("button", { name: "Knowledge", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Explore the Knowledge that matters here" }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();
  await expect(page.getByText("Included", { exact: true })).toBeVisible();
});


test("performs one Activity attempt without fabricating learner progress", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Current position" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Set Next focus" }).click();
  await page.getByRole("button", { name: "Continue to Activity" }).click();

  await expect(
    page.getByRole("heading", { name: "Work on the accepted Next focus" }),
  ).toBeVisible();
  await expect(page.getByText("Reduce uncertainty in system-design trade-off reasoning.", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "High value because it affects multiple system-design questions.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByText("Cache consistency design case", { exact: true })).toBeVisible();
  await expect(page.getByText("Intended capability: System design", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Directly exercises the challenged consistency assumption.",
      { exact: true },
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Start Activity" }).click();

  await expect(page.getByRole("heading", { name: "Activity attempt" })).toBeVisible();
  await expect(page.getByText("active", { exact: true })).toBeVisible();

  await page
    .getByLabel("What happened")
    .fill("Completed the cache consistency design case and explained the trade-offs.");
  await page
    .getByLabel("Provenance / source")
    .fill("Observed deterministic prototype attempt");

  await page.getByRole("button", { name: "Submit completed attempt" }).click();

  await expect(page.getByRole("heading", { name: "Attempt submitted" })).toBeVisible();
  await expect(
    page.getByText(
      "Completion does not mark the capability demonstrated and does not close a gap.",
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Submit completed attempt" }),
  ).toHaveCount(0);

  await page.getByRole("button", { name: "Current position" }).click();
  const systemDesignState = page
    .locator(".state-card")
    .filter({ hasText: "System design" });
  await expect(systemDesignState.getByText("challenged", { exact: true })).toBeVisible();
});

test("routes an Activity with no suitable support to contextual preparation", async ({
  page,
}) => {
  await page.goto("/");
  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Current position" }).click();
  await page.getByRole("radio", { name: /Behavioral communication/ }).check();
  await page.getByRole("button", { name: "Set Next focus" }).click();

  await page.getByRole("button", { name: "Activity", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Work on the accepted Next focus" }),
  ).toBeVisible();
  await expect(
    page.getByText("No suitable support is currently prepared.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();

  await page.getByRole("button", { name: "Prepare missing support" }).click();

  await expect(page.getByRole("heading", { name: "Prepare Support" })).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();
});
