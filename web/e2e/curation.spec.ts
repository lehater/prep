import { expect, test } from "@playwright/test";

test("Curation exposes accepted sections without Learning editing internals", async ({ page }) => {
  await page.goto("/curation/knowledge");

  const nav = page.getByRole("navigation", { name: "Curation sections" });
  await expect(nav.getByRole("link", { name: "Targets" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Knowledge" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Requirements" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Questions" })).toBeVisible();
  await expect(page.getByText(/mastery/i)).toHaveCount(0);
  await expect(page.getByText(/readiness/i)).toHaveCount(0);
});

test("target validation preserves input and successful curation is visible in Learning", async ({
  page,
}) => {
  await page.goto("/curation/targets");

  await page.getByRole("textbox", { name: "Target name" }).first().fill("Python backend interview");
  await page.getByRole("button", { name: "Create target" }).click();

  await expect(page.getByText("Target name and definition are required.")).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Target name" }).first(),
  ).toHaveValue("Python backend interview");

  await page
    .getByRole("textbox", { name: "Target definition" })
    .first()
    .fill("Prepared Python backend interview target.");
  await page.getByRole("button", { name: "Create target" }).click();

  await expect(page.getByText("LearningTarget created.")).toBeVisible();
  await page.getByRole("link", { name: "Preview in Learning" }).click();
  await expect(
    page.getByRole("heading", { name: "Python backend interview" }),
  ).toBeVisible();
});

test("RequirementSet cycle rejection preserves the editor context", async ({ page }) => {
  await page.goto("/curation/requirements");

  await page
    .getByRole("button", { name: /Linux resource management/ })
    .click();
  const memberSelect = page.getByRole("combobox", {
    name: "RequirementSet member candidate",
  });
  await memberSelect.selectOption("linux-resource-management");
  await page.getByRole("button", { name: "Add member" }).click();

  await expect(
    page.getByText("RequirementSet membership would create a cycle."),
  ).toBeVisible();
  await expect(memberSelect).toHaveValue("linux-resource-management");
  await expect(
    page.getByRole("heading", { name: "RequirementSet editor" }),
  ).toBeVisible();
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
    .getByRole("button", { name: /Linux server hardening/ })
    .click();

  await expect(
    page.getByRole("region", { name: "Knowledge editor" }),
  ).toBeVisible();
  expect(await graphHandle!.evaluate((element) => element.isConnected)).toBe(true);
});

test("Knowledge authoring adds an accepted typed relation", async ({ page }) => {
  await page.goto("/curation/knowledge");

  await page.getByRole("button", { name: "Browse" }).click();
  await page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Linux server hardening/ })
    .click();

  const editor = page.getByRole("region", { name: "Knowledge editor" });
  await expect(editor).toBeVisible();
  await editor.getByRole("combobox", { name: "New relation type" }).selectOption("addresses");
  await editor
    .getByRole("combobox", { name: "Relation target" })
    .selectOption("resource-isolation");
  await editor.getByRole("button", { name: "Add relation" }).click();

  await expect(page.getByText("KnowledgeRelation added.")).toBeVisible();
  await expect(
    editor.getByText(/linux-server-hardening → addresses → resource-isolation/),
  ).toBeVisible();
});

test("Question authoring maintains explicit Knowledge alignments", async ({ page }) => {
  await page.goto("/curation/questions");

  await page.getByRole("textbox", { name: "Question text" }).first().fill("What is a cgroup?");
  await page
    .getByRole("textbox", { name: "Direct answer" })
    .first()
    .fill("A Linux process grouping and resource-control mechanism.");
  await page.getByRole("button", { name: "Create Question" }).click();

  const editor = page.getByRole("region", { name: "Question editor" });
  await editor
    .getByRole("combobox", { name: "Question Knowledge candidate" })
    .selectOption("linux-cgroups");
  await editor.getByRole("button", { name: "Align Knowledge" }).click();

  await expect(page.getByText("Question Knowledge alignment updated.")).toBeVisible();
  await expect(editor.getByText("linux-cgroups")).toBeVisible();
});

test("contextual import reports applied and rejected item outcomes", async ({ page }) => {
  await page.goto("/curation/import?kind=questions");

  const document = JSON.stringify({
    schema_version: "1",
    data_kind: "questions",
    items: [
      {
        key: "python-gil",
        question_text: "What is the Python GIL?",
        answer_text: "A CPython interpreter lock governing bytecode execution.",
        knowledge: ["linux-cgroups"],
      },
      {
        key: "broken",
        question_text: "",
        answer_text: "",
      },
    ],
  });

  await page.getByLabel("Prepared-data document").setInputFiles({
    name: "questions.json",
    mimeType: "application/json",
    buffer: Buffer.from(document),
  });
  await page.getByRole("button", { name: "Apply import" }).click();

  const outcomes = page.getByRole("region", { name: "Import outcomes" });
  await expect(outcomes).toContainText("Total 2");
  await expect(outcomes).toContainText("applied 1");
  await expect(outcomes).toContainText("rejected 1");
  await expect(outcomes).toContainText("python-gil: created");
  await expect(outcomes).toContainText("broken: rejected");
});

test("Curation Knowledge keeps authoring actions compact until requested", async ({
  page,
}) => {
  await page.goto("/curation/knowledge");

  await expect(
    page.getByRole("region", { name: "New Knowledge" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "New Knowledge" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Import Knowledge" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "New Knowledge" }).click();
  await expect(
    page.getByRole("region", { name: "New Knowledge" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(
    page.getByRole("region", { name: "New Knowledge" }),
  ).toHaveCount(0);
});


test("Knowledge selection is explicit in bounded results without narrowing graph", async ({ page }) => {
  await page.goto("/curation/knowledge");
  await page.getByRole("button", { name: "Browse" }).click();

  const graphStatus = page.getByText(/nodes · .* relations · auto/).first();
  await expect(graphStatus).toBeVisible();
  const before = await graphStatus.textContent();

  const result = page
    .getByRole("region", { name: "Knowledge list" })
    .getByRole("button", { name: /Linux server hardening/ });
  await result.click();

  await expect(result).toHaveAttribute("aria-current", "true");
  await expect(graphStatus).toHaveText(before ?? "");
  await expect(page).not.toHaveURL(/focus=/);
});
