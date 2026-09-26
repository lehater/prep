import { expect, test } from "@playwright/test";

test("renders accepted server-backed states through the HTTP provider", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const target = {
      id: "linux-backend-interview",
      name: "Linux backend interview",
      definition: "Prepared target context for backend interview knowledge.",
      scope_summary: "Prepared Linux scope.",
      scope_items: [],
    };
    const state = {
      delayNextList: false,
      failNextList: false,
      runtimeReachable: false,
    };
    const testWindow = window as Window & {
      __prepHttpTestState?: typeof state;
    };
    testWindow.__prepHttpTestState = state;

    window.fetch = async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url =
        input instanceof Request ? input.url : String(input);
      const operation = decodeURIComponent(
        new URL(url, window.location.origin).pathname.split("/").at(-1) ?? "",
      );
      const body =
        typeof init?.body === "string"
          ? (JSON.parse(init.body) as { readonly text_query?: string })
          : {};

      if (operation === "integration.external_runtime.status.get") {
        return new Response(
          JSON.stringify(
            state.runtimeReachable
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
          {
            status: state.runtimeReachable ? 200 : 503,
            headers: { "content-type": "application/json" },
          },
        );
      }

      if (operation === "learning.targets.list") {
        if (state.delayNextList) {
          state.delayNextList = false;
          await new Promise((resolve) => setTimeout(resolve, 750));
        }

        if (state.failNextList) {
          state.failNextList = false;
          return new Response(
            JSON.stringify({
              outcome: "operational_failure",
              message: "Temporary target service failure.",
            }),
            {
              status: 503,
              headers: { "content-type": "application/json" },
            },
          );
        }

        const items = body.text_query === "missing" ? [] : [target];
        return new Response(
          JSON.stringify({
            outcome: "success",
            result: {
              items,
              next_cursor: null,
              total_count: items.length,
            },
          }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          },
        );
      }

      return new Response(
        JSON.stringify({
          outcome: "operational_failure",
          message: `Unexpected test operation: ${operation}`,
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        },
      );
    };
  });

  const setTransportState = async (
    patch: Partial<{
      delayNextList: boolean;
      failNextList: boolean;
      runtimeReachable: boolean;
    }>,
  ) => {
    await page.evaluate((next) => {
      const testWindow = window as Window & {
        __prepHttpTestState?: {
          delayNextList: boolean;
          failNextList: boolean;
          runtimeReachable: boolean;
        };
      };
      Object.assign(testWindow.__prepHttpTestState ?? {}, next);
    }, patch);
  };

  await page.goto("/learning");

  const targetHeading = page.getByRole("heading", {
    name: "Linux backend interview",
  });
  await expect(targetHeading).toBeVisible();

  const runtime = page.getByRole("button", {
    name: "Refresh Anki runtime status",
  });
  await expect(runtime).toContainText("Anki: unavailable");
  await setTransportState({ runtimeReachable: true });
  await runtime.click();
  await expect(runtime).toContainText("Anki: reachable");

  const search = page.getByRole("textbox", { name: "Search targets" });

  await setTransportState({ delayNextList: true });
  await search.fill("Linux");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByText("Loading learning targets")).toBeVisible();
  await expect(targetHeading).toBeVisible();

  await setTransportState({ failNextList: true });
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
