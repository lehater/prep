import { defineConfig, devices } from "@playwright/test";

const mockBaseUrl = "http://127.0.0.1:4173";
const httpBaseUrl = "http://127.0.0.1:4174";

export default defineConfig({
  testDir: "./e2e",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-mock",
      testIgnore: /http-states\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: mockBaseUrl,
      },
    },
    {
      name: "chromium-http",
      testMatch: /http-states\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: httpBaseUrl,
      },
    },
  ],
  webServer: [
    {
      command: "npm run preview -- --host 0.0.0.0 --port 4173",
      url: mockBaseUrl,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev -- --host 0.0.0.0 --port 4174",
      url: httpBaseUrl,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_PREP_DATA_PROVIDER: "http",
        VITE_PREP_API_BASE_URL: "/api",
      },
    },
  ],
});
