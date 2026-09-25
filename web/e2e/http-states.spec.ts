import { expect, test } from "@playwright/test";

const target = {
  id: "linux-backend-interview",
  name: "Linux backend interview",
  definition: "Prepared target context for backend interview knowledge.",
  scope_summary: "Prepared Linux scope.",
  scope_items: [],
};

function operationId(url: string): string {
  return decodeURIComponent(new URL(url).pathname.split("/").at(-1) ?? "");
}

test("renders accepted server-backed states through the HTTP provider", async ({
  page,
}) => {
  let delayNextList = false;
  let failNextList = false;
  let runtimeReachable = false;

  await page.route("**/api/v1/operations/**", async (route) => {
    const operation = operationId(route.request().url());
    const input = JSON.parse(route.request().postData() ?? "{}") as {
      readonly text_query?: string;
    };

    if (operation === "integration.external_runtime.status.get") {
      await route.fulfill({
        status: runtimeReachable ? 200 : 503,
        contentType: "application/json",
        body: JSON.stringify(
          runtimeReachable
            ? {
                outcome: "success",
                result: {
                  reachable: true,
                  compatible: true,
                  profile_summary: "HTTP test runtime",
                },
              }
            : {
                outcome: "external_runtime_unavailable",
                message: "HTTP test runtime is unavailable.",
              },
        ),
      });
      return;
    }

    if (operation === "learning.targets.list") {
      if (delayNextList) {
        delayNextList = false;
        await new Promise((resolve) => setTimeout(resolve, 750));
      }

      if (failNextList) {
        failNextList = false;
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            outcome: "operational_failure",
            message: "Temporary target service failure.",
          }),
        });
        return;
      }

      const items = input.text_query === "missing" ? [] : [target];
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          outcome: "success",
          result: {
            items,
            next_cursor: null,
            total_count: items.length,
          },
        }),
      });
      return;
    }

    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        outcome: "operational_failure",
        message: `Unexpected test operation: ${operation}`,
      }),
    });
  });

  await page.goto("/learning");

  const targetHeading = page.getByRole("heading", {
    name: "Linux backend interview",
  });
  await expect(targetHeading).toBeVisible();

  const runtime = page.getByRole("button", {
    name: "Refresh Anki runtime status",
  });
  await expect(runtime).toContainText("Anki: unavailable");
  runtimeReachable = true;
  await runtime.click();
  await expect(runtime).toContainText("Anki: reachable");

  const search = page.getByRole("textbox", { name: "Search targets" });

  delayNextList = true;
  await search.fill("Linux");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Loading learning targets")).toBeVisible();
  await expect(targetHeading).toBeVisible();

  failNextList = true;
  await search.fill("backend");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByText("Learning targets could not be loaded"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();

  await expect(search).toHaveValue("backend");
  await expect(targetHeading).toBeVisible();

  await search.fill("missing");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No learning targets found")).toBeVisible();
});
