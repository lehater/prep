import { describe, expect, test } from "vitest";

import { knowledgeFocusPath, targetSectionPath } from "./learningRoutes";

describe("Learning routes", () => {
  test("preserves canonical target context across workspace sections", () => {
    expect(targetSectionPath("linux-backend-interview", "statistics")).toBe(
      "/learning/linux-backend-interview/statistics",
    );
  });

  test("Question to Knowledge navigation carries every aligned Knowledge id", () => {
    const path = knowledgeFocusPath("linux-backend-interview", [
      "resource-isolation",
      "linux-cgroups",
    ]);
    const url = new URL(path, "https://prep.local");

    expect(url.pathname).toBe("/learning/linux-backend-interview/knowledge");
    expect(url.searchParams.get("focus")).toBe(
      "resource-isolation,linux-cgroups",
    );
  });
});
