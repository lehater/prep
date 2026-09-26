export type DataProvider = "mock" | "http";

const configuredProvider = import.meta.env.VITE_PREP_DATA_PROVIDER;
const dataProvider: DataProvider =
  configuredProvider === "http" ? "http" : "mock";

export const appConfig = Object.freeze({
  name: "Prep",
  documentTitle: "Prep",
  dataProvider,
  apiBaseUrl: import.meta.env.VITE_PREP_API_BASE_URL?.trim() || "/api",
});
