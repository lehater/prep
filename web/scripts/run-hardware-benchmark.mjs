import { spawnSync } from "node:child_process";

const nodeMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "", 10);
if (nodeMajor !== 24) {
  console.error(
    `Hardware graph benchmark requires Node 24.x. Current Node: ${process.version}.\n` +
      "Use the repository version first, for example: nvm install 24 && nvm use 24",
  );
  process.exit(2);
}

if (
  process.platform === "linux" &&
  !process.env.DISPLAY &&
  !process.env.WAYLAND_DISPLAY
) {
  console.error(
    "Hardware graph benchmark requires a graphical Linux session. " +
      "Neither DISPLAY nor WAYLAND_DISPLAY is set, so a headed GPU-backed Chromium cannot be launched from this shell.",
  );
  process.exit(2);
}

console.log(
  "Starting headed Chromium hardware benchmark. " +
    "Software rasterization is disabled; the run will fail if real GPU-backed WebGL is unavailable.",
);

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
