import { describe, expect, test } from "vitest";

import { knowledgeFocusPath, targetSectionPath } from "./learningRoutes";

describe("Learning routes", () => {
  test("preserves target context across user-centered sections", () => {
    expect(targetSectionPath("python-backend-fintech", "progress")).toBe(
      "/learning/python-backend-fintech/progress",
    );
  });

  test("Knowledge navigation carries every focused Knowledge id", () => {
    const path = knowledgeFocusPath("python-backend-fintech", [
      "demo-payment-idempotency-key",
      "demo-payment-retry-policy",
    ]);
    const url = new URL(path, "https://prep.local");

    expect(url.pathname).toBe("/learning/python-backend-fintech/knowledge");
    expect(url.searchParams.get("focus")).toBe(
      "demo-payment-idempotency-key,demo-payment-retry-policy",
    );
  });
});
