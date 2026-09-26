import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { FrontendApp } from "./app/composition/FrontendApp";
import { appConfig } from "./app/config/appConfig";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error("Frontend root element is missing");
}

document.title = appConfig.documentTitle;

createRoot(rootElement).render(
  <StrictMode>
    <FrontendApp />
  </StrictMode>,
);
