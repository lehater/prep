import { expect, test } from "@playwright/test";

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
  await expect(page.getByText("System design", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Behavioral communication")).toBeVisible();
  await expect(page.getByText("Kubernetes operations")).toBeVisible();
  await expect(
    page.getByText("The same learner evidence basis is used for every candidate."),
  ).toBeVisible();

  await page
    .getByRole("radio", { name: "Backend Engineer interview" })
    .check();
  await page
    .getByRole("button", { name: "Continue with selected Target" })
    .click();

  await expect(page.getByRole("heading", { name: "Target" })).toBeVisible();
  await expect(page.getByText("Candidate: Backend Engineer interview")).toBeVisible();
  await expect(page.getByText("Not established")).toBeVisible();
  await expect(
    page.getByText(
      "This candidate has not become the active Target. Establishment is implemented in the next slice.",
    ),
  ).toBeVisible();
});

test("routes Target-dependent navigation to recovery when Target is absent", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Current position" }).click();

  await expect(page.getByRole("heading", { name: "Target" })).toBeVisible();
  await expect(
    page.getByText(
      "Establish a Target before entering Target-dependent preparation work.",
    ),
  ).toBeVisible();

  await page.getByRole("button", { name: "Targets" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose what you are preparing for" }),
  ).toBeVisible();
});
