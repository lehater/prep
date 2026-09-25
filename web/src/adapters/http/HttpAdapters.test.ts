import { describe, expect, test, vi } from "vitest";

import { MockKnowledgeAdapter } from "../mock/MockKnowledgeAdapter";
import {
  HttpCurationTargetAdapter,
} from "./HttpCurationAdapters";
import {
  HttpKnowledgeAdapter,
  HttpTargetAdapter,
} from "./HttpLearningAdapters";
import { HttpOperationClient } from "./HttpOperationClient";
import { HttpRuntimeStatusAdapter } from "./HttpRuntimeStatusAdapter";

type QueuedResponse =
  | { readonly status?: number; readonly body: unknown }
  | unknown;

function createQueuedFetch(responses: QueuedResponse[]) {
  const fetchFn = vi.fn(async () => {
    const next = responses.shift();
    if (
      next &&
      typeof next === "object" &&
      !Array.isArray(next) &&
      "body" in next
    ) {
      const response = next as { readonly status?: number; readonly body: unknown };
      return new Response(JSON.stringify(response.body), {
        status: response.status ?? 200,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify(next), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
  return fetchFn;
}

describe("FI-06 HTTP adapters", () => {
  test("preserves canonical Knowledge identity and exact total_count while hiding cursor representation", async () => {
    const fetchFn = createQueuedFetch([
      {
        outcome: "success",
        result: {
          items: [
            {
              id: "linux-cgroups",
              semantic_kind: "concept",
              display_content: "Linux cgroups",
              content:
                "A Linux mechanism family for organizing processes and controlling resource usage.",
            },
          ],
          next_cursor: "opaque-next-page-token",
          total_count: 17,
        },
      },
    ]);
    const adapter = new HttpKnowledgeAdapter(
      new HttpOperationClient("/api", { fetchFn }),
    );

    const outcome = await adapter.list(
      { kind: "global" },
      { search: "cgroups", semanticKind: "concept" },
    );

    expect(outcome).toEqual({
      status: "success",
      value: {
        items: [
          {
            id: "linux-cgroups",
            semanticKind: "concept",
            title: "Linux cgroups",
            summary:
              "A Linux mechanism family for organizing processes and controlling resource usage.",
          },
        ],
        totalCount: 17,
      },
    });
    expect(JSON.stringify(outcome)).not.toContain("opaque-next-page-token");
    expect(fetchFn).toHaveBeenCalledOnce();
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe("/api/v1/operations/curation.knowledge.list");
    expect(JSON.parse(String(init?.body))).toEqual({
      text_query: "cgroups",
      semantic_kind: "concept",
    });
  });

  test("returns equivalent Knowledge read models through mock and HTTP providers", async () => {
    const mock = new MockKnowledgeAdapter();
    const expected = await mock.list(
      { kind: "global" },
      { search: "Linux cgroups", semanticKind: "concept" },
    );
    expect(expected.status).toBe("success");
    if (expected.status !== "success") return;

    const fetchFn = createQueuedFetch([
      {
        outcome: "success",
        result: {
          items: expected.value.items.map((item) => ({
            id: item.id,
            semantic_kind: item.semanticKind,
            display_content: item.title,
            content: item.summary,
          })),
          next_cursor: null,
          total_count: expected.value.totalCount,
        },
      },
    ]);
    const http = new HttpKnowledgeAdapter(
      new HttpOperationClient("/api", { fetchFn }),
    );

    await expect(
      http.list(
        { kind: "global" },
        { search: "Linux cgroups", semanticKind: "concept" },
      ),
    ).resolves.toEqual(expected);
  });

  test("maps accepted validation, conflict, unavailable and operational outcomes without transport leakage", async () => {
    const fetchFn = createQueuedFetch([
      {
        outcome: "validation_rejected",
        message: "Target definition is required.",
      },
      {
        outcome: "conflict",
        message: "Target changed since it was opened.",
      },
      {
        outcome: "external_runtime_unavailable",
        message: "Anki is unreachable.",
      },
      {
        status: 503,
        body: { ignored: true },
      },
    ]);
    const client = new HttpOperationClient("/api", { fetchFn });
    const targets = new HttpCurationTargetAdapter(client);
    const runtime = new HttpRuntimeStatusAdapter(client);
    const learningTargets = new HttpTargetAdapter(client);

    await expect(
      targets.create({ name: "Backend interview", definition: "" }),
    ).resolves.toEqual({
      status: "validation_rejected",
      message: "Target definition is required.",
    });
    await expect(
      targets.update("target-1", {
        name: "Backend interview",
        definition: "Updated target.",
      }),
    ).resolves.toEqual({
      status: "conflict",
      message: "Target changed since it was opened.",
    });
    await expect(runtime.get()).resolves.toEqual({
      status: "unavailable",
      message: "Anki is unreachable.",
    });
    await expect(learningTargets.list({})).resolves.toEqual({
      status: "failure",
      message: "HTTP 503 while executing learning.targets.list.",
    });
  });

  test("caches equivalent reads and invalidates them after a successful mutation", async () => {
    const target = {
      id: "target-1",
      name: "Backend interview",
      definition: "Prepared target.",
      scope_items: [],
    };
    const fetchFn = createQueuedFetch([
      {
        outcome: "success",
        result: { items: [target], total_count: 1 },
      },
      {
        outcome: "success",
        result: target,
      },
      {
        outcome: "success",
        result: { items: [target], total_count: 1 },
      },
    ]);
    const client = new HttpOperationClient("/api", { fetchFn });
    const learning = new HttpTargetAdapter(client);
    const curation = new HttpCurationTargetAdapter(client);

    await learning.list({ search: "Backend" });
    await learning.list({ search: "Backend" });
    expect(fetchFn).toHaveBeenCalledTimes(1);

    await curation.update("target-1", {
      name: "Backend interview",
      definition: "Prepared target.",
    });
    await learning.list({ search: "Backend" });

    expect(fetchFn).toHaveBeenCalledTimes(3);
  });

  test("turns incompatible DTO semantics into frontend failure rather than silently coercing them", async () => {
    const fetchFn = createQueuedFetch([
      {
        outcome: "success",
        result: {
          items: [
            {
              id: "invalid-node",
              semantic_kind: "invented-kind",
              content: "Invalid semantic representation.",
            },
          ],
          total_count: 1,
        },
      },
    ]);
    const adapter = new HttpKnowledgeAdapter(
      new HttpOperationClient("/api", { fetchFn }),
    );

    await expect(adapter.list({ kind: "global" }, {})).resolves.toEqual({
      status: "failure",
      message: "Backend response did not match the accepted machine contract.",
    });
  });
});
