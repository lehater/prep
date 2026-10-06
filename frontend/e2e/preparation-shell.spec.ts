import { expect, test, type Locator, type Page } from "@playwright/test";

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

async function tabTo(page: Page, target: Locator, maxTabs = 80) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");
    const focused = await target.evaluate(
      (element) => element === document.activeElement,
    );
    if (focused) {
      return;
    }
  }

  throw new Error("Keyboard focus did not reach the expected control.");
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
    "High value because it affects multiple system-design questions.",
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
  await expect(
    page.getByText(
      "Follow-up activity exposed another unresolved consistency assumption.",
      { exact: true },
    ),
  ).toHaveCount(0);

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
      "High target relevance with suitable support available.",
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

  await page
    .getByRole("button", { name: "Review evidence & changes" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Review what changed after the Activity" }),
  ).toBeVisible();
  await expect(page.getByText("Increased uncertainty", { exact: true })).toBeVisible();
  await expect(page.getByText("No change", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "The activity added attributable evidence but exposed another unresolved assumption; target requirements did not change.",
      { exact: true },
    ),
  ).toBeVisible();

  await page.getByText("Inspect evidence facts and provenance").click();
  await expect(
    page.getByText(
      "Follow-up activity exposed another unresolved consistency assumption.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(/System-design activity review/),
  ).toBeVisible();

  const reviewedSystemDesignState = page
    .locator(".current-state-after-region .state-card")
    .filter({ hasText: "System design" });
  await expect(
    reviewedSystemDesignState.getByText("challenged", { exact: true }),
  ).toBeVisible();

  await expect(page.getByText(/progress score/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Continue current focus" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Return to Current position" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Inspect Knowledge" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Return to Current position" }).click();
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
  await expect(page.getByText("Return destination: Activity", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Missing-support context")).toHaveValue(
    "No suitable support is currently prepared for the accepted Next focus.",
  );
  await expect(page.getByLabel("Provenance")).toHaveValue(
    "Current preparation context from Activity",
  );
  await expect(page.getByText(/corpus CRUD|import schema|item repair/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Request preparation support" }).click();

  await expect(
    page.getByRole("heading", { name: "Prepared support and explicit remainder" }),
  ).toBeVisible();
  await expect(page.getByText("Behavioral decision story guide", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Intended capability: Behavioral communication", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Interview-specific observation rubric", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("unresolved", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Mock interviewer availability", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("rejected", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Accepted support remains usable even when other requested support is unresolved or rejected.",
      { exact: false },
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Refresh preparation result" }).click();
  await expect(page.getByText("Behavioral decision story guide", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Return to Activity" }).last().click();

  await expect(
    page.getByRole("heading", { name: "Work on the accepted Next focus" }),
  ).toBeVisible();
  await expect(page.getByText("Behavioral decision story guide", { exact: true })).toBeVisible();
  await expect(
    page.getByLabel("Active preparation context").getByText("Selected"),
  ).toBeVisible();
});


for (const viewport of [
  { name: "wide", width: 1280, height: 900 },
  { name: "compact", width: 800, height: 900 },
  { name: "narrow", width: 390, height: 844 },
] as const) {
  test(`preserves semantic hierarchy and context in ${viewport.name} viewport`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");
    await establishBackendTarget(page);

    await expect(
      page.locator("nav.prep-navigation + section.active-context"),
    ).toBeVisible();
    await expect(
      page.locator("section.active-context + main.active-child"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Current position" }).click();
    await page.getByRole("radio", { name: /System design/ }).check();
    await page.getByRole("button", { name: "Set Next focus" }).click();

    await page.getByRole("button", { name: "Knowledge", exact: true }).click();
    await expect(
      page.getByRole("heading", {
        name: "Explore the Knowledge that matters here",
      }),
    ).toBeVisible();
    await expect(
      page
        .getByLabel("Active preparation context")
        .getByText("Backend Engineer interview"),
    ).toBeVisible();
    await expect(
      page.getByLabel("Active preparation context").getByText("Selected"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Activity", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Work on the accepted Next focus" }),
    ).toBeVisible();

    const overflow = await page.locator("html").evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(
      overflow.clientWidth + 1,
    );
  });
}

test("completes a representative preparation path with keyboard interaction only", async ({
  page,
}) => {
  await page.goto("/");

  const backend = page.getByRole("checkbox", {
    name: /Backend Engineer interview/,
  });
  await tabTo(page, backend);
  await page.keyboard.press("Space");

  const platform = page.getByRole("checkbox", {
    name: /Platform Engineer interview/,
  });
  await tabTo(page, platform);
  await page.keyboard.press("Space");

  const compare = page.getByRole("button", { name: "Compare selected" });
  await tabTo(page, compare);
  await page.keyboard.press("Enter");

  const backendChoice = page.getByRole("radio", {
    name: "Backend Engineer interview",
  });
  await tabTo(page, backendChoice);
  await page.keyboard.press("Space");

  const continueTarget = page.getByRole("button", {
    name: "Continue with selected Target",
  });
  await tabTo(page, continueTarget);
  await page.keyboard.press("Enter");

  const establish = page.getByRole("button", { name: "Establish Target" });
  await tabTo(page, establish);
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "What this Target requires" }),
  ).toBeVisible();

  const current = page.getByRole("button", { name: "Current position" });
  await tabTo(page, current);
  await page.keyboard.press("Enter");

  const systemDesign = page.getByRole("radio", { name: /System design/ });
  await tabTo(page, systemDesign);
  await page.keyboard.press("Space");

  const setFocus = page.getByRole("button", { name: "Set Next focus" });
  await tabTo(page, setFocus);
  await page.keyboard.press("Enter");

  const continueActivity = page.getByRole("button", {
    name: "Continue to Activity",
  });
  await tabTo(page, continueActivity);
  await page.keyboard.press("Enter");

  const startActivity = page.getByRole("button", { name: "Start Activity" });
  await tabTo(page, startActivity);
  await page.keyboard.press("Enter");

  const result = page.getByLabel("What happened");
  await tabTo(page, result);
  await page.keyboard.type(
    "Completed the keyboard-only system design attempt.",
  );

  const provenance = page.getByLabel("Provenance / source");
  await tabTo(page, provenance);
  await page.keyboard.type("Keyboard-only prototype observation");

  const submit = page.getByRole("button", {
    name: "Submit completed attempt",
  });
  await tabTo(page, submit);
  await page.keyboard.press("Enter");

  const review = page.getByRole("button", {
    name: "Review evidence & changes",
  });
  await tabTo(page, review);
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", {
      name: "Review what changed after the Activity",
    }),
  ).toBeVisible();
});

test("remains task-complete with reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  expect(
    await page.evaluate(() =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);

  await establishBackendTarget(page);
  await page.getByRole("button", { name: "Knowledge", exact: true }).click();
  await expect(
    page.locator('[data-view="knowledge"][data-renderer="nonspatial"]'),
  ).toBeVisible();

  const movingElements = await page.evaluate(() =>
    Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const style = window.getComputedStyle(element);
        const hasAnimation =
          style.animationName !== "none" &&
          style.animationDuration
            .split(",")
            .some((value) => Number.parseFloat(value) > 0);
        const hasTransition = style.transitionDuration
          .split(",")
          .some((value) => Number.parseFloat(value) > 0);
        return hasAnimation || hasTransition;
      })
      .map((element) => element.tagName.toLowerCase()),
  );

  expect(movingElements).toEqual([]);
});

test("uses declared composition variants without hidden route modes", async ({
  page,
}) => {
  await page.goto("/");

  const targets = page.locator('[data-view="targets"]');
  await expect(targets).toHaveAttribute("data-variant", "candidate-selection");

  await page
    .getByRole("checkbox", { name: /Backend Engineer interview/ })
    .check();
  await page
    .getByRole("checkbox", { name: /Platform Engineer interview/ })
    .check();
  await page.getByRole("button", { name: "Compare selected" }).click();
  await expect(targets).toHaveAttribute("data-variant", "comparison-ready");

  await page
    .getByRole("radio", { name: "Backend Engineer interview" })
    .check();
  await page
    .getByRole("button", { name: "Continue with selected Target" })
    .click();

  const target = page.locator('[data-view="target"]');
  await expect(target).toHaveAttribute("data-variant", "target-setup");
  await page.getByRole("button", { name: "Establish Target" }).click();
  await expect(target).toHaveAttribute("data-variant", "target-established");

  await page.getByRole("button", { name: "Current position" }).click();
  await page.getByRole("radio", { name: /System design/ }).check();
  await page.getByRole("button", { name: "Set Next focus" }).click();
  await page.getByRole("button", { name: "Continue to Activity" }).click();

  const activity = page.locator('[data-view="activity"]');
  await expect(activity).toHaveAttribute("data-variant", "support-selection");
  await page.getByRole("button", { name: "Start Activity" }).click();
  await expect(activity).toHaveAttribute("data-variant", "attempt-active");

  await page
    .getByLabel("What happened")
    .fill("Completed the composition-variant activity attempt.");
  await page
    .getByLabel("Provenance / source")
    .fill("Composition-variant prototype observation");
  await page.getByRole("button", { name: "Submit completed attempt" }).click();
  await expect(activity).toHaveAttribute("data-variant", "evidence-processing");
});

test("covers Prepare Support request, result, and recovery variants", async ({
  page,
}) => {
  await page.goto("/");
  await compareAndContinueWithBackend(page);

  await page
    .getByRole("button", { name: "Request missing preparation support" })
    .click();

  const prepare = page.locator('[data-view="prepare-support"]');
  await expect(prepare).toHaveAttribute("data-variant", "request-input");
  await page
    .getByRole("button", { name: "Request preparation support" })
    .click();
  await expect(prepare).toHaveAttribute(
    "data-variant",
    "continuation-recovery",
  );

  await page.getByRole("button", { name: "Return to Target" }).click();
  await page.getByRole("button", { name: "Establish Target" }).click();
  await page.getByRole("button", { name: "Current position" }).click();
  await page.getByRole("radio", { name: /Behavioral communication/ }).check();
  await page.getByRole("button", { name: "Set Next focus" }).click();
  await page.getByRole("button", { name: "Prepare missing support" }).click();

  const acceptedPrepare = page.locator('[data-view="prepare-support"]');
  await expect(acceptedPrepare).toHaveAttribute(
    "data-variant",
    "request-input",
  );
  await page
    .getByRole("button", { name: "Request preparation support" })
    .click();
  await expect(acceptedPrepare).toHaveAttribute(
    "data-variant",
    "result-review",
  );
});
