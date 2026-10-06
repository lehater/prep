import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BootstrapShell } from "./BootstrapShell";

const rootElement = document.getElementById("root");

if (!(rootElement instanceof HTMLElement)) {
  throw new Error("Prep frontend root element is missing");
}

createRoot(rootElement).render(
  <StrictMode>
    <BootstrapShell />
  </StrictMode>,
);
