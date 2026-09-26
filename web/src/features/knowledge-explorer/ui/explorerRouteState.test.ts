import { describe, expect, test } from "vitest";

import {
  parseExplorerRouteState,
  serializeExplorerRouteState,
  type ExplorerRouteState,
} from "./explorerRouteState";

describe("Knowledge explorer route context", () => {
  test("opening and closing detail preserves target-local exploration intent", () => {
    const before: ExplorerRouteState = {
      query: "cgroups",
      semanticKind: "concept",
      relationTypes: ["addresses", "realizes"],
      focusedKnowledgeIds: ["resource-isolation"],
    };

    const opened: ExplorerRouteState = {
      ...before,
      selectedKnowledgeId: "linux-cgroups",
    };
    const roundTrip = parseExplorerRouteState(
      serializeExplorerRouteState(opened),
    );
    const { selectedKnowledgeId: _selected, ...closed } = roundTrip;

    expect(closed).toEqual(before);
  });

  test("ignores unknown filters instead of inventing semantics", () => {
    const parsed = parseExplorerRouteState(
      new URLSearchParams(
        "kind=unknown&relation=related_to,addresses,realizes,related_to",
      ),
    );

    expect(parsed.semanticKind).toBeUndefined();
    expect(parsed.relationTypes).toEqual(["addresses", "realizes"]);
  });

  test("preserves an explicit empty relation selection", () => {
    const parsed = parseExplorerRouteState(
      serializeExplorerRouteState({
        query: "",
        relationTypes: [],
        focusedKnowledgeIds: [],
      }),
    );

    expect(parsed.relationTypes).toEqual([]);
  });

  test("omits the relation parameter when all relation types are visible", () => {
    const params = serializeExplorerRouteState({
      query: "",
      relationTypes: undefined,
      focusedKnowledgeIds: [],
    });

    expect(params.has("relation")).toBe(false);
    expect(parseExplorerRouteState(params).relationTypes).toBeUndefined();
  });

  test("serializes accepted relation multi-selection as one stable route value", () => {
    const parsed = parseExplorerRouteState(
      serializeExplorerRouteState({
        query: "",
        relationTypes: ["realizes", "addresses"],
        focusedKnowledgeIds: [],
      }),
    );

    expect(parsed.relationTypes).toEqual(["addresses", "realizes"]);
  });
});
