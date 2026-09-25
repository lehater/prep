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
      relationType: "realizes",
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

  test("ignores unknown semantic filter values instead of inventing semantics", () => {
    const parsed = parseExplorerRouteState(
      new URLSearchParams("kind=unknown&relation=related_to"),
    );

    expect(parsed.semanticKind).toBeUndefined();
    expect(parsed.relationType).toBeUndefined();
  });
});
