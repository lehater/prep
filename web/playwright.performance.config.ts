import { defineConfig, devices } from "@playwright/test";

const hardwareBenchmark = process.env.REQUIRE_HARDWARE_WEBGL === "1";

export default defineConfig({
  testDir: "./benchmarks",
  testMatch: /graph-performance\.spec\.ts/,
  timeout: 45_000,
  workers: 1,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4180",
    viewport: { width: 1600, height: 900 },
    headless: !hardwareBenchmark,
    launchOptions: hardwareBenchmark
      ? {
          args: [
            "--enable-gpu",
            "--ignore-gpu-blocklist",
            "--disable-software-rasterizer",
          ],
        }
      : undefined,
  },
  webServer: {
    command: "npm run dev -- --host 0.0.0.0 --port 4180",
    url: "http://127.0.0.1:4180/benchmarks/graph-performance.html",
    reuseExistingServer: !process.env.CI,
  },
});
