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
  samples: Diagnostics[];
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
    const frameSamples = samples.filter(
      (sample) => typeof sample.renderFrame === "number",
    );
    const first = frameSamples[0]?.renderFrame;
    const last = frameSamples.at(-1)?.renderFrame;
    const frameDelta =
      typeof first === "number" && typeof last === "number"
        ? Math.max(0, last - first)
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
        idlePaused: settled?.diagnostics?.animationPaused,
      }),
    );

    expect(settled?.diagnostics?.animationPaused).toBe(true);
  });
}
