import { expect, test } from "@playwright/test";

test("completely empty corpus can be bootstrapped and returned to Target Work", async ({
  page,
}) => {
  const intent = "Payments role";

  await page.goto(
    `/learning?scenario=empty-corpus&search=${encodeURIComponent(intent)}`,
  );

  await expect(page.getByText("No suitable target found")).toBeVisible();
  await expect(page.getByText(`Target/search context: ${intent}`)).toBeVisible();
  await page.getByRole("link", { name: "Prepare in bulk" }).click();

  await expect(page.getByRole("heading", { name: "Import", level: 2 })).toBeVisible();
  await expect(page.getByText(`Preparing reusable data for: ${intent}`)).toBeVisible();
  await expect(page.getByText("Preparation path: bulk")).toBeVisible();

  const capabilityDocument = JSON.stringify({
    schema_version: "prep-import/v1",
    data_kind: "capabilities",
    items: [
      {
        key: "payment-reliability",
        title: "Reliable payment commands",
        performance_expectation:
          "Design payment commands that remain safe under retries and duplicate delivery.",
        condition_summary: "Transient failures and at-least-once delivery.",
        criterion_summary: "No duplicate logical side effect.",
        knowledge_ids: [],
      },
      {
        key: "broken",
        title: "",
        performance_expectation: "",
      },
    ],
  });

  await page.getByLabel("Prepared-data document").setInputFiles({
    name: "capabilities.json",
    mimeType: "application/json",
    buffer: Buffer.from(capabilityDocument),
  });
  await page.getByRole("button", { name: "Validate import" }).click();

  const validation = page.getByRole("region", { name: "Validation outcomes" });
  await expect(validation).toContainText("valid 1");
  await expect(validation).toContainText("rejected 1");

  await page.getByRole("button", { name: "Apply import" }).click();
  const outcomes = page.getByRole("region", { name: "Import outcomes" });
  await expect(outcomes).toContainText("applied 1");
  await expect(outcomes).toContainText("rejected 1");

  const curationNav = page.getByRole("navigation", { name: "Curation sections" });
  await curationNav
    .getByRole("link", { name: "Learning Support", exact: true })
    .click();

  await page.getByRole("textbox", { name: "Title" }).fill("Retry-safe payment practice");
  await page.getByRole("combobox", { name: "Support kind" }).selectOption("practice");
  await page
    .getByRole("textbox", { name: "Learner-facing content / task summary" })
    .fill("Design a retry-safe payment endpoint using idempotency and bounded retry.");
  await page
    .getByRole("listbox", { name: "Intended capabilities" })
    .selectOption({ label: "Reliable payment commands" });
  await page.getByRole("button", { name: "Save learning support" }).click();
  await expect(page.getByText("Learning support created.")).toBeVisible();

  await curationNav.getByRole("link", { name: "Assessment", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Assessment title" })
    .fill("Payment reliability diagnostic");
  await page
    .getByRole("listbox", { name: "Target capabilities" })
    .selectOption({ label: "Reliable payment commands" });
  await page
    .getByRole("textbox", { name: "Task specification" })
    .fill("Explain how duplicate payment delivery is made safe.");
  await page
    .getByRole("textbox", { name: "Observation specification" })
    .fill("Observe whether the learner identifies stable idempotency and retry boundaries.");
  await page
    .getByRole("textbox", { name: "Evidence warrant / pattern" })
    .fill("Correct reasoning supports the capability only for the represented conditions.");
  await page.getByRole("button", { name: "Save assessment design" }).click();
  await expect(page.getByText("Assessment design created.")).toBeVisible();

  await curationNav.getByRole("link", { name: "Quality", exact: true }).click();
  await expect(page.getByText("No known diagnostics")).toBeVisible();

  await curationNav.getByRole("link", { name: "Targets", exact: true }).click();

  await page
    .getByRole("textbox", { name: "Target name" })
    .first()
    .fill("Payments role — Python backend");
  await page
    .getByRole("textbox", { name: "Target context / definition" })
    .first()
    .fill("Prepare for a Python backend role with payment reliability responsibility.");
  await page.getByRole("button", { name: "Create target" }).click();

  const editor = page.getByRole("region", { name: "Target profile editor" });
  await editor
    .getByRole("listbox", { name: "Required capabilities" })
    .selectOption({ label: "Reliable payment commands" });
  await editor.getByRole("button", { name: "Save target profile" }).click();
  await expect(page.getByText("Target capability profile saved.")).toBeVisible();

  await page.getByRole("link", { name: "Return to Target Work" }).click();

  await expect(page.getByText("Payments role — Python backend")).toBeVisible();
  await page.getByRole("link", { name: "Open target" }).click();

  await expect(
    page.getByRole("heading", { name: "Payments role — Python backend" }),
  ).toBeVisible();
  await expect(
    page.getByText("Reliable payment commands", { exact: true }),
  ).toBeVisible();

  await page
    .getByRole("navigation", { name: "Learning target sections" })
    .getByRole("link", { name: "State", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Target requirement state" }),
  ).toContainText("Unresolved");
});
