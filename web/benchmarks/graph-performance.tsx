import { StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { Rfg3dGraphRenderer } from "../src/adapters/graph-rfg3d/Rfg3dGraphRenderer";
import type {
  GraphPerformanceProfile,
  GraphRendererCommand,
  GraphRendererDiagnostics,
} from "../src/features/knowledge-explorer/ports/GraphRenderer";
import { graphPreferencesForProfile } from "../src/features/knowledge-explorer/ui/graphPresentation";
import { createGraphStressScene } from "../src/test-support/graphStressScene";

declare global {
  interface Window {
    __prepGraphBenchmark?: {
      readonly nodeCount: number;
      readonly edgeCount: number;
      readonly profile: GraphPerformanceProfile;
      diagnostics?: GraphRendererDiagnostics;
      samples: Array<{
        readonly capturedAtMs: number;
        readonly diagnostics: GraphRendererDiagnostics;
      }>;
    };
  }
}

function positiveInt(value: string | null, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function BenchmarkApp() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const nodeCount = positiveInt(params.get("nodes"), 1_000);
  const edgeCount = positiveInt(params.get("edges"), nodeCount * 5);
  const requestedProfile = params.get("profile");
  const profile: GraphPerformanceProfile =
    requestedProfile === "quality" || requestedProfile === "performance"
      ? requestedProfile
      : "auto";
  const scene = useMemo(
    () => createGraphStressScene(nodeCount, edgeCount),
    [edgeCount, nodeCount],
  );
  const [command, setCommand] = useState<GraphRendererCommand>();
  const sequence = useRef(0);

  useEffect(() => {
    window.__prepGraphBenchmark = {
      nodeCount,
      edgeCount,
      profile,
      samples: [],
    };
    const timer = window.setInterval(() => {
      sequence.current += 1;
      setCommand({ id: sequence.current, type: "diagnostics" });
    }, 250);
    return () => window.clearInterval(timer);
  }, [edgeCount, nodeCount, profile]);

  return (
    <Rfg3dGraphRenderer
      scene={scene}
      performanceProfile={profile}
      renderPreferences={graphPreferencesForProfile(profile)}
      command={command}
      onNodeActivate={() => undefined}
      onDiagnostics={(diagnostics) => {
        const benchmark = window.__prepGraphBenchmark;
        if (!benchmark) return;
        benchmark.diagnostics = diagnostics;
        benchmark.samples.push({
          capturedAtMs: performance.now(),
          diagnostics,
        });
      }}
    />
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Benchmark root is missing.");
}

createRoot(root).render(
  <StrictMode>
    <BenchmarkApp />
  </StrictMode>,
);
