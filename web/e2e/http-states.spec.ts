import { expect, test } from "@playwright/test";

const targetPath = "/learning/linux-backend-interview/knowledge";

const target = {
  id: "linux-backend-interview",
  name: "Linux backend interview",
  definition: "Prepared target context for backend interview knowledge.",
  scope_summary: "Prepared Linux scope.",
  scope_items: [],
};

const nodes = [
  {
    id: "linux-cgroups",
    semantic_kind: "concept",
    display_content: "Linux cgroups",
    content:
      "A Linux mechanism family for organizing processes and controlling resource usage.",
  },
  {
    id: "resource-isolation",
    semantic_kind: "concept",
    display_content: "Resource isolation",
    content: "A system property that separates resource consumption between workloads.",
  },
];

const graph = {
  nodes,
  relations: [
    {
      id: "relation-cgroups-realizes-isolation",
      source_id: "linux-cgroups",
      target_id: "resource-isolation",
      relation_type: "realizes",
    },
  ],
};

function operationId(url: string): string {
  return decodeURIComponent(new URL(url).pathname.split("/").at(-1) ?? "");
}

test("renders accepted server-backed states through the HTTP provider", async ({
  page,
}) => {
  let delayInitialList = true;
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

    if (operation === "learning.targets.get") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ outcome: "success", result: target }),
      });
      return;
    }

    if (operation === "learning.target.knowledge.graph") {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ outcome: "success", result: graph }),
      });
      return;
    }

    if (operation === "learning.target.knowledge.list") {
      if (delayInitialList) {
        delayInitialList = false;
        await new Promise((resolve) => setTimeout(resolve, 750));
      }

      if (failNextList) {
        failNextList = false;
        await route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            outcome: "operational_failure",
            message: "Temporary Knowledge service failure.",
          }),
        });
        return;
      }

      const items = input.text_query === "missing" ? [] : [nodes[0]];
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

  await page.goto(targetPath);

  await expect(page.getByText("Loading Knowledge list")).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Knowledge list" })
      .getByRole("button", { name: /Linux cgroups/ }),
  ).toBeVisible();

  const runtime = page.getByRole("button", {
    name: "Refresh Anki runtime status",
  });
  await expect(runtime).toContainText("Anki: unavailable");
  runtimeReachable = true;
  await runtime.click();
  await expect(runtime).toContainText("Anki: reachable");

  const search = page.getByRole("textbox", { name: "Search Knowledge" });
  failNextList = true;
  await search.fill("cgroups");
  await page.getByRole("button", { name: "Search", exact: true }).click();

  await expect(page.getByText("Knowledge could not be loaded")).toBeVisible();
  await expect(page).toHaveURL(/q=cgroups/);
  await page.getByRole("button", { name: "Retry" }).click();

  await expect(search).toHaveValue("cgroups");
  await expect(
    page
      .getByRole("region", { name: "Knowledge list" })
      .getByRole("button", { name: /Linux cgroups/ }),
  ).toBeVisible();

  await search.fill("missing");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("No Knowledge found")).toBeVisible();
});
