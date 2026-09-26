import { spawnSync } from "node:child_process";

const executable = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  executable,
  ["playwright", "test", "--config=playwright.performance.config.ts"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      REQUIRE_HARDWARE_WEBGL: "1",
    },
  },
);

process.exit(result.status ?? 1);
