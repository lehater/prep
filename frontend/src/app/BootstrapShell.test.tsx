import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BootstrapShell } from "./BootstrapShell";

describe("BootstrapShell", () => {
  it("exposes a neutral application root without product feature semantics", () => {
    const markup = renderToStaticMarkup(<BootstrapShell />);

    expect(markup).toContain('data-prep-bootstrap="ready"');
    expect(markup).toContain('aria-label="Prep"');
  });
});
