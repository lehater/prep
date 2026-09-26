import { expect, test } from "@playwright/test";

interface Diagnostics {
  nodeCount: number;
  edgeCount: number;
  strategy: "standard" | "optimized";
  animationPaused: boolean;
  drawCalls?: number;
  triangles?: number;
  pixelRatio?: number;
  renderFrame?: number;
  engineSettledMs?: number;
  webglVendor?: string;
  webglRenderer?: string;
}

interface BenchmarkState {
  nodeCount: number;
  edgeCount: number;
  profile: string;
  diagnostics?: Diagnostics;
  samples: Array<{
    capturedAtMs: number;
    diagnostics: Diagnostics;
  }>;
}

function isSoftwareRenderer(renderer?: string): boolean {
  return /swiftshader|llvmpipe|software|softpipe/i.test(renderer ?? "");
}

async function readState(page: import("@playwright/test").Page) {
  return page.evaluate(() => window.__prepGraphBenchmark as BenchmarkState | undefined);
}

for (const nodeCount of [1_000, 2_000, 5_000]) {
  test(`records renderer evidence for ${nodeCount} nodes`, async ({ page }) => {
    const edgeCount = nodeCount * 5;
    await page.goto(
      `/benchmarks/graph-performance.html?nodes=${nodeCount}&edges=${edgeCount}&profile=performance`,
    );

    await expect
      .poll(async () => (await readState(page))?.diagnostics?.webglRenderer, {
        timeout: 15_000,
      })
      .toBeTruthy();

    await page.waitForTimeout(2_000);
    const active = await readState(page);
    expect(active?.diagnostics?.strategy).toBe("optimized");
    expect(active?.nodeCount).toBe(nodeCount);
    expect(active?.edgeCount).toBe(edgeCount);

    await expect
      .poll(
        async () => (await readState(page))?.diagnostics?.animationPaused,
        { timeout: 12_000 },
      )
      .toBe(true);

    const settled = await readState(page);
    const samples = settled?.samples ?? [];
    const activeSamples = samples.filter(
      (sample) =>
        !sample.diagnostics.animationPaused &&
        typeof sample.diagnostics.renderFrame === "number",
    );
    const firstActive = activeSamples[0];
    const lastActive = activeSamples.at(-1);
    const frameDelta =
      firstActive && lastActive
        ? Math.max(
            0,
            (lastActive.diagnostics.renderFrame ?? 0) -
              (firstActive.diagnostics.renderFrame ?? 0),
          )
        : undefined;
    const activeDurationSeconds =
      firstActive && lastActive
        ? Math.max(0.001, (lastActive.capturedAtMs - firstActive.capturedAtMs) / 1_000)
        : undefined;
    const sampledFps =
      frameDelta !== undefined && activeDurationSeconds !== undefined
        ? frameDelta / activeDurationSeconds
        : undefined;

    console.log(
      JSON.stringify({
        nodeCount,
        edgeCount,
        webglVendor: settled?.diagnostics?.webglVendor,
        webglRenderer: settled?.diagnostics?.webglRenderer,
        softwareRenderer: isSoftwareRenderer(
          settled?.diagnostics?.webglRenderer,
        ),
        strategy: settled?.diagnostics?.strategy,
        pixelRatio: settled?.diagnostics?.pixelRatio,
        drawCalls: settled?.diagnostics?.drawCalls,
        triangles: settled?.diagnostics?.triangles,
        engineSettledMs: settled?.diagnostics?.engineSettledMs,
        sampledRenderFrameDelta: frameDelta,
        sampledActiveSeconds: activeDurationSeconds,
        sampledFps,
        idlePaused: settled?.diagnostics?.animationPaused,
      }),
    );

    expect(settled?.diagnostics?.animationPaused).toBe(true);
  });
}
