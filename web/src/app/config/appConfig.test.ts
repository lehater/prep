import { describe, expect, it } from "vitest";

import { appConfig } from "./appConfig";

describe("frontend foundation", () => {
  it("provides deterministic application configuration", () => {
    expect(appConfig).toEqual({
      name: "Prep",
      documentTitle: "Prep",
      dataProvider: "mock",
      apiBaseUrl: "/api",
    });
  });
});
