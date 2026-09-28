import { expect, test, type Locator, type Page } from "@playwright/test";

const targetKnowledgePath = "/learning/python-backend-fintech/knowledge";

async function tabUntilFocused(page: Page, target: Locator) {
  for (let index = 0; index < 30; index += 1) {
    await page.keyboard.press("Tab");
    if (
      await target.evaluate((element) => document.activeElement === element)
    ) {
      await expect(target).toBeFocused();
      expect(
        await target.evaluate((element) => element.matches(":focus-visible")),
      ).toBe(true);
      return;
    }
  }
  throw new Error("Keyboard focus did not reach the expected control.");
}


test("switches explicit Learning and Curation Knowledge contexts", async ({ page }) => {
  await page.goto(targetKnowledgePath);

  await expect(
    page.getByRole("heading", { name: "Middle Python Backend — Fintech / Card Payments" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Curation" }).click();
  await expect(
    page.getByRole("heading", { name: "Knowledge", level: 2 }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Target Work" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a target" }),
  ).toBeVisible();
});

test("preserves target search context while readable detail opens and closes", async ({
  page,
}) => {
  await page.goto(targetKnowledgePath);

  const search = page.getByRole("textbox", { name: "Search Knowledge" });
  await search.fill("idempotency");
  await page.getByRole("button", { name: "Search", exact: true }).click();

  const item = page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Idempotency key/ });
  await expect(item).toBeVisible();
  await item.focus();
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Idempotency key", level: 4 }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close detail" }).click();

  await expect(search).toHaveValue("idempotency");
  await expect(
    page.getByRole("heading", { name: "Middle Python Backend — Fintech / Card Payments" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/q=idempotency/);
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

test("completes core Knowledge access with keyboard interaction only", async ({
  page,
}) => {
  await page.goto(targetKnowledgePath);

  const search = page.getByRole("textbox", { name: "Search Knowledge" });
  await tabUntilFocused(page, search);
  await page.keyboard.type("idempotency");
  await page.keyboard.press("Enter");

  const item = page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Idempotency key/ });
  await expect(item).toBeVisible();
  await tabUntilFocused(page, item);
  await page.keyboard.press("Enter");

  await expect(
    page.getByRole("heading", { name: "Idempotency key", level: 4 }),
  ).toBeVisible();
  await expect(
    page.getByText(/demo-payment-idempotency-key —addresses→ demo-payment-duplicate-payment-processing/),
  ).toBeVisible();

  const close = page.getByRole("button", { name: "Close detail" });
  await tabUntilFocused(page, close);
  await page.keyboard.press("Enter");

  await expect(search).toHaveValue("idempotency");
  await expect(page).toHaveURL(/q=idempotency/);
});

test("graph settings restore keyboard focus to the invoking control", async ({ page }) => {
  await page.goto("/learning/python-backend-fintech/knowledge");

  const settings = page.getByRole("button", { name: "Graph settings" });
  await settings.focus();
  await settings.click();
  await expect(
    page.getByRole("combobox", { name: "Graph performance profile" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(settings).toBeFocused();
});

test("graph toolbar preserves semantic filters and exposes performance degradation controls", async ({
  page,
}) => {
  await page.goto(targetKnowledgePath);

  await expect(page.getByRole("button", { name: "Fit graph" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Reset camera" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Relation filters" }).click();
  const realizes = page.getByRole("checkbox", { name: "realizes" });
  const addresses = page.getByRole("checkbox", { name: "addresses" });
  await expect(realizes).toBeChecked();
  await expect(addresses).toBeChecked();

  await realizes.click();
  await expect(page).toHaveURL(/relation=addresses/);
  await expect(realizes).not.toBeChecked();
  await expect(page.getByText(/relations · auto/).first()).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Graph settings" }).click();
  const profile = page.getByRole("combobox", {
    name: "Graph performance profile",
  });
  await profile.selectOption("performance");
  await expect(profile).toHaveValue("performance");

  const arrowheads = page.getByRole("checkbox", {
    name: "Arrowheads",
  });
  const particles = page.getByRole("checkbox", {
    name: "Particles",
  });
  await expect(arrowheads).not.toBeChecked();
  await expect(particles).not.toBeChecked();
  await expect(
    page.getByRole("combobox", { name: "Graph live physics" }),
  ).toHaveValue("settle-and-pause");
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Relation filters" }).click();
  await page.getByRole("button", { name: "Show all" }).click();
  await expect(page).not.toHaveURL(/relation=/);
});


test("reduced-motion preference disables automatic graph motion without removing semantic access", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/learning/python-backend-fintech/knowledge");

  await page.getByRole("button", { name: "Graph settings" }).click();
  await expect(page.getByText(/Reduced motion is active/)).toBeVisible();

  const particles = page.getByRole("checkbox", { name: "Particles" });
  await expect(particles).not.toBeChecked();
  await expect(particles).toBeDisabled();

  const physics = page.getByRole("combobox", { name: "Graph live physics" });
  await expect(physics).toHaveValue("off");
  await expect(physics).toBeDisabled();

  await expect(
    page.locator('[data-reduced-motion="true"]'),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Graph settings" })).toBeFocused();

  await page.getByRole("textbox", { name: "Search Knowledge" }).fill("idempotency");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("region", { name: "Knowledge list" })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Knowledge list" }).getByText(/Idempotency key/i),
  ).toBeVisible();
});

test("Auto graph remains interactive beyond the former settle-pause threshold", async ({ page }) => {
  await page.goto(targetKnowledgePath);

  await page.getByRole("button", { name: "Graph settings" }).click();
  const profile = page.getByRole("combobox", {
    name: "Graph performance profile",
  });
  await expect(profile).toHaveValue("auto");
  await expect(
    page.getByRole("combobox", { name: "Graph live physics" }),
  ).toHaveValue("on");
  await page.keyboard.press("Escape");

  const graph = page.getByRole("application", {
    name: "Interactive 3D Knowledge graph",
  });
  await expect(graph).toBeVisible();

  await page.waitForTimeout(6500);

  await graph.hover();
  await page.getByRole("button", { name: "Fit graph" }).click();
  await expect(graph).toBeVisible();
});
