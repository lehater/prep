export type DataProvider = "mock" | "http";
export type MockDataScenario = "prepared" | "empty-corpus";

const configuredProvider = import.meta.env.VITE_PREP_DATA_PROVIDER;
const dataProvider: DataProvider =
  configuredProvider === "http" ? "http" : "mock";

const requestedMockScenario =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("scenario")
    : null;
const mockScenario: MockDataScenario =
  requestedMockScenario === "empty-corpus" ? "empty-corpus" : "prepared";

export const appConfig = Object.freeze({
  name: "Prep",
  documentTitle: "Prep",
  dataProvider,
  mockScenario,
  apiBaseUrl: import.meta.env.VITE_PREP_API_BASE_URL?.trim() || "/api",
});
