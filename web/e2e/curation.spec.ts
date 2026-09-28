import { expect, test } from "@playwright/test";

test("Curation exposes user-centered semantic areas", async ({ page }) => {
  await page.goto("/curation/knowledge");

  const nav = page.getByRole("navigation", { name: "Curation sections" });
  for (const section of [
    "Targets",
    "Capabilities",
    "Knowledge",
    "Learning Support",
    "Assessment",
    "Import",
    "Quality",
  ]) {
    await expect(nav.getByRole("link", { name: section, exact: true })).toBeVisible();
  }
  await expect(nav.getByRole("link", { name: "Requirements" })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Questions" })).toHaveCount(0);
});

test("target profile is composed from reusable capabilities and becomes visible in Target Work", async ({
  page,
}) => {
  await page.goto("/curation/targets");

  await page.getByRole("textbox", { name: "Target name" }).fill("Python payments interview");
  await page.getByRole("button", { name: "Create target" }).click();

  await expect(page.getByText("Target definition is required.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Target name" })).toHaveValue(
    "Python payments interview",
  );

  await page
    .getByRole("textbox", { name: "Target context / definition" })
    .fill("Middle Python backend interview with payment reliability responsibilities.");
  await page.getByRole("button", { name: "Create target" }).click();

  const editor = page.getByRole("region", { name: "Target profile editor" });
  await editor.getByRole("listbox", { name: "Required capabilities" }).selectOption([
    "cap-python-backend",
    "cap-payment-reliability",
  ]);
  await editor.getByRole("button", { name: "Save target profile" }).click();
  await expect(page.getByText("Target capability profile saved.")).toBeVisible();

  await editor.getByRole("link", { name: "Preview in Target Work" }).click();
  await expect(page.getByRole("heading", { name: "Python payments interview" })).toBeVisible();
  await expect(page.getByText("Python backend engineering")).toBeVisible();
  await expect(page.getByText("Reliable payment commands")).toBeVisible();
});

test("capability editor exposes performance conditions criteria and Knowledge focus", async ({
  page,
}) => {
  await page.goto("/curation/capabilities");

  await page.getByRole("button", { name: "Reliable payment commands" }).click();
  const editor = page.getByRole("region", { name: "Capability editor" });

  await expect(
    editor.getByRole("textbox", { name: "Performance expectation" }),
  ).toHaveValue(/payment commands/i);
  await expect(editor.getByRole("textbox", { name: "Condition scope" })).not.toHaveValue("");
  await expect(editor.getByRole("textbox", { name: "Criteria / standard" })).not.toHaveValue("");
});

test("Learning Support and Assessment are explicit curation responsibilities", async ({
  page,
}) => {
  await page.goto("/curation/learning-support");
  await expect(page.getByRole("heading", { name: "Learning Support", level: 2 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Idempotency and retry safety" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Import support" })).toBeVisible();

  await page.goto("/curation/assessment");
  await expect(page.getByRole("heading", { name: "Assessment", level: 2 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Payment reliability diagnostic" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Import assessment design" })).toBeVisible();
});

test("Quality reports missing reusable support without inventing a completeness score", async ({
  page,
}) => {
  await page.goto("/curation/quality");

  await expect(page.getByText(/No learning\/practice support is prepared for Payment reconciliation/)).toBeVisible();
  await expect(page.getByText(/No assessment\/evidence design is prepared for Payment reconciliation/)).toBeVisible();
  await expect(page.getByText(/coverage percentage/i)).toHaveCount(0);
});

test("modern bulk import validates before partial apply", async ({ page }) => {
  await page.goto("/curation/import?kind=capabilities");

  const document = JSON.stringify({
    schema_version: "prep-import/v1",
    data_kind: "capabilities",
    items: [
      {
        key: "payment-observability",
        title: "Payment observability",
        performance_expectation:
          "Diagnose payment-processing failures using logs, metrics and traces.",
        condition_summary: "Distributed payment-processing runtime.",
        criterion_summary: "Correct localization and evidence-backed diagnosis.",
        knowledge_ids: [],
      },
      {
        key: "broken",
        title: "",
        performance_expectation: "",
      },
    ],
  });

  await expect(page.getByRole("region", { name: "Import contract" })).toContainText(
    "prep-import/v1",
  );
  await page.getByLabel("Prepared-data document").setInputFiles({
    name: "capabilities.json",
    mimeType: "application/json",
    buffer: Buffer.from(document),
  });
  await page.getByRole("button", { name: "Validate import" }).click();

  const validation = page.getByRole("region", { name: "Validation outcomes" });
  await expect(validation).toContainText("valid 1");
  await expect(validation).toContainText("rejected 1");

  await page.getByRole("button", { name: "Apply import" }).click();
  const outcomes = page.getByRole("region", { name: "Import outcomes" });
  await expect(outcomes).toContainText("payment-observability: created");
  await expect(outcomes).toContainText("broken: rejected");

  await page
    .getByRole("navigation", { name: "Curation sections" })
    .getByRole("link", { name: "Capabilities", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Payment observability" })).toBeVisible();
});

test("selecting Knowledge preserves the live graph renderer", async ({ page }) => {
  await page.goto("/curation/knowledge");

  const graph = page.getByRole("application", {
    name: "Interactive 3D Knowledge graph",
  });
  await expect(graph).toBeVisible();

  const graphHandle = await graph.elementHandle();
  expect(graphHandle).not.toBeNull();

  await page.getByRole("button", { name: "Browse" }).click();
  await page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Idempotency key/ })
    .click();

  await expect(page.getByRole("region", { name: "Knowledge editor" })).toBeVisible();
  expect(await graphHandle!.evaluate((element) => element.isConnected)).toBe(true);
});

test("Curation Knowledge keeps authoring actions compact until requested", async ({
  page,
}) => {
  await page.goto("/curation/knowledge");

  await expect(page.getByRole("region", { name: "New Knowledge" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "New Knowledge" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Import Knowledge" })).toBeVisible();

  await page.getByRole("button", { name: "New Knowledge" }).click();
  await expect(page.getByRole("region", { name: "New Knowledge" })).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByRole("region", { name: "New Knowledge" })).toHaveCount(0);
});
