import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ErrorInfo,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import ForceGraph3D from "react-force-graph-3d";
import type { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";

import type {
  GraphRendererDiagnostics,
  GraphRendererProps,
  GraphViewportSnapshot,
} from "../../features/knowledge-explorer/ports/GraphRenderer";
import type {
  KnowledgeRelationType,
  KnowledgeSemanticKind,
} from "../../features/knowledge-explorer/model/knowledge";
import { createBatchedLinkLayer, type BatchedLinkLayer } from "./batchedLinkLayer";
import {
  DEFAULT_GRAPH_RENDER_PREFERENCES,
  resolveGraphRenderStrategy,
} from "./graphRenderStrategy";
import { createInstancedNodeLayer, type InstancedNodeLayer } from "./instancedNodeLayer";
import {
  advanceNodePointerGesture,
  beginNodePointerGesture,
  completeNodePointerGesture,
  type NodePointerGesture,
} from "./nodeGesture";
import {
  rendererGraphDataKey,
  toRendererGraphData,
  type Rfg3dLink,
  type Rfg3dNode,
} from "./rendererGraphData";

const RENDERER_FAMILY = "rfg3d";
const NODE_DRAG_THRESHOLD_PX = 5;
const NODE_HIT_RADIUS_PX = 18;
const IDLE_PAUSE_DELAY_MS = 700;
const FOCUS_DISTANCE = 125;
const RESET_CAMERA_DISTANCE = 320;

const NODE_COLORS: Readonly<Record<KnowledgeSemanticKind, string>> = {
  concept: "#4f8df7",
  mechanism: "#22a06b",
  procedure: "#d9903d",
  strategy: "#a46de3",
};

const RELATION_COLORS: Readonly<Record<KnowledgeRelationType, string>> = {
  addresses: "#78b7ff",
  realizes: "#7fd3a5",
};

interface RendererControls {
  enabled?: boolean;
  target?: THREE.Vector3;
  update?: () => void;
  staticMoving?: boolean;
  dynamicDampingFactor?: number;
  zoomSpeed?: number;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
}

interface Rfg3dViewportValue {
  readonly camera: readonly [number, number, number];
  readonly target: readonly [number, number, number];
}

interface ActiveNodeDrag {
  readonly node: Rfg3dNode;
  readonly cameraDistance: number;
  gesture: NodePointerGesture;
}

function endpointId(endpoint: Rfg3dLink["source"]): string {
  return typeof endpoint === "string" ? endpoint : endpoint.id;
}

function isViewportValue(value: unknown): value is Rfg3dViewportValue {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value as Partial<Rfg3dViewportValue>;
  return (
    Array.isArray(candidate.camera) &&
    candidate.camera.length === 3 &&
    candidate.camera.every((item) => typeof item === "number") &&
    Array.isArray(candidate.target) &&
    candidate.target.length === 3 &&
    candidate.target.every((item) => typeof item === "number")
  );
}

export function canCreateWebGL2Context(): boolean {
  if (typeof document === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", {
      antialias: false,
      powerPreference: "default",
    });
    if (!context) {
      return false;
    }
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function RendererUnavailable({ message }: { readonly message: string }) {
  return (
    <div role="alert">
      <strong>3D Knowledge graph unavailable</strong>
      <p>{message}</p>
      <p>Knowledge list, search and readable detail remain available.</p>
    </div>
  );
}

class RendererErrorBoundary extends Component<
  {
    readonly children: ReactNode;
    readonly onUnavailable?: (message: string) => void;
  },
  { readonly failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("RFG3D renderer failed", error, info);
    this.props.onUnavailable?.("The browser could not initialize the 3D renderer.");
  }

  render() {
    return this.state.failed ? (
      <RendererUnavailable message="The browser could not initialize the 3D renderer." />
    ) : (
      this.props.children
    );
  }
}

export function Rfg3dGraphRenderer({
  scene,
  viewport,
  performanceProfile = "auto",
  renderPreferences = DEFAULT_GRAPH_RENDER_PREFERENCES,
  command,
  onNodeActivate,
  onViewportChange,
  onDiagnostics,
  onUnavailable,
}: GraphRendererProps) {
  const graphRef = useRef<ForceGraphMethods<Rfg3dNode, Rfg3dLink>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<ActiveNodeDrag | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const unavailableReportedRef = useRef(false);
  const instancedLayerRef = useRef<InstancedNodeLayer | null>(null);
  const batchedLayerRef = useRef<BatchedLinkLayer | null>(null);
  const animationPausedRef = useRef(false);
  const simulationStartedAtRef = useRef<number>(performance.now());
  const engineSettledMsRef = useRef<number | undefined>(undefined);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [size, setSize] = useState({ width: 960, height: 600 });

  const dataKey = rendererGraphDataKey(scene);
  const graphData = useMemo(() => toRendererGraphData(scene), [dataKey]);
  const presentationById = useMemo(
    () => new Map(scene.nodes.map((node) => [node.knowledgeId, node])),
    [scene.nodes],
  );
  const strategy = useMemo(
    () => resolveGraphRenderStrategy(scene, performanceProfile, renderPreferences),
    [scene, performanceProfile, renderPreferences],
  );

  const nodeColor = useCallback(
    (node: Rfg3dNode) => {
      const presentation = presentationById.get(node.id);
      if (presentation?.selected) {
        return "#ffffff";
      }
      if (presentation?.focused || presentation?.highlighted) {
        return "#78b7ff";
      }
      return NODE_COLORS[node.semanticKind];
    },
    [presentationById],
  );

  const linkColor = useCallback(
    (link: Rfg3dLink) => RELATION_COLORS[link.relationType],
    [],
  );

  const emitDiagnostics = useCallback(
    (animationPaused = animationPausedRef.current) => {
      if (!onDiagnostics) {
        return;
      }
      const renderer = graphRef.current?.renderer();
      const renderInfo = renderer?.info.render;
      const context = renderer?.getContext();
      const debugInfo = context?.getExtension("WEBGL_debug_renderer_info") as
        | { UNMASKED_VENDOR_WEBGL: number; UNMASKED_RENDERER_WEBGL: number }
        | null
        | undefined;
      const webglVendor =
        context && debugInfo
          ? String(context.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
          : undefined;
      const webglRenderer =
        context && debugInfo
          ? String(context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
          : undefined;
      onDiagnostics({
        nodeCount: graphData.nodes.length,
        edgeCount: graphData.links.length,
        strategy: strategy.family,
        animationPaused,
        drawCalls: renderInfo?.calls,
        triangles: renderInfo?.triangles,
        pixelRatio: renderer?.getPixelRatio(),
        renderFrame: renderInfo?.frame,
        engineSettledMs: engineSettledMsRef.current,
        webglVendor,
        webglRenderer,
      } satisfies GraphRendererDiagnostics);
    },
    [
      graphData.links.length,
      graphData.nodes.length,
      onDiagnostics,
      strategy.family,
    ],
  );

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const resumeRenderer = useCallback(() => {
    clearIdleTimer();
    animationPausedRef.current = false;
    graphRef.current?.resumeAnimation();
  }, [clearIdleTimer]);

  const pauseRenderer = useCallback(() => {
    clearIdleTimer();
    animationPausedRef.current = true;
    graphRef.current?.pauseAnimation();
    emitDiagnostics(true);
  }, [clearIdleTimer, emitDiagnostics]);

  const scheduleIdlePause = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = null;
      if (!dragRef.current) {
        animationPausedRef.current = true;
        graphRef.current?.pauseAnimation();
        emitDiagnostics(true);
      }
    }, IDLE_PAUSE_DELAY_MS);
  }, [clearIdleTimer, emitDiagnostics]);

  const reportUnavailable = useCallback(
    (message: string) => {
      if (unavailableReportedRef.current) {
        return;
      }
      unavailableReportedRef.current = true;
      onUnavailable?.(message);
    },
    [onUnavailable],
  );

  useEffect(() => {
    const available = canCreateWebGL2Context();
    setWebglAvailable(available);
    if (!available) {
      reportUnavailable("WebGL2 is not available in this browser.");
    }
  }, [reportUnavailable]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const applySize = (width: number, height: number) => {
      const next = {
        width: Math.max(320, Math.floor(width)),
        height: Math.max(360, Math.floor(height)),
      };
      setSize((current) =>
        current.width === next.width && current.height === next.height
          ? current
          : next,
      );
    };

    const bounds = element.getBoundingClientRect();
    applySize(bounds.width, bounds.height);

    const observer = new ResizeObserver(([entry]) => {
      applySize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [webglAvailable]);

  const syncOptimizedLayers = useCallback(() => {
    instancedLayerRef.current?.sync(graphData.nodes, nodeColor);
    batchedLayerRef.current?.sync(graphData.nodes, graphData.links, linkColor);
  }, [graphData.links, graphData.nodes, linkColor, nodeColor]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }

    let cancelled = false;
    let frame = 0;
    let graphScene: THREE.Scene | undefined;

    const attach = () => {
      if (cancelled) {
        return;
      }
      const graph = graphRef.current;
      if (!graph) {
        frame = requestAnimationFrame(attach);
        return;
      }

      graphScene = graph.scene();
      if (strategy.useInstancedNodes) {
        instancedLayerRef.current = createInstancedNodeLayer(
          graphData.nodes.length,
          strategy.nodeResolution,
        );
        graphScene.add(instancedLayerRef.current.object);
      }
      if (strategy.useBatchedLinks) {
        batchedLayerRef.current = createBatchedLinkLayer(graphData.links);
        graphScene.add(batchedLayerRef.current.object);
      }
      syncOptimizedLayers();
      emitDiagnostics(false);
    };

    frame = requestAnimationFrame(attach);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (graphScene && instancedLayerRef.current) {
        graphScene.remove(instancedLayerRef.current.object);
        instancedLayerRef.current.dispose();
        instancedLayerRef.current = null;
      }
      if (graphScene && batchedLayerRef.current) {
        graphScene.remove(batchedLayerRef.current.object);
        batchedLayerRef.current.dispose();
        batchedLayerRef.current = null;
      }
    };
  }, [
    dataKey,
    emitDiagnostics,
    graphData.links,
    graphData.nodes.length,
    strategy.nodeResolution,
    strategy.useBatchedLinks,
    strategy.useInstancedNodes,
    syncOptimizedLayers,
    webglAvailable,
  ]);

  useEffect(() => {
    syncOptimizedLayers();
  }, [presentationById, syncOptimizedLayers]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }
    let cancelled = false;
    let frame = 0;
    const applyPixelRatio = () => {
      if (cancelled) {
        return;
      }
      const renderer = graphRef.current?.renderer();
      if (!renderer) {
        frame = requestAnimationFrame(applyPixelRatio);
        return;
      }
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, strategy.maxPixelRatio),
      );
      emitDiagnostics(animationPausedRef.current);
    };
    frame = requestAnimationFrame(applyPixelRatio);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [emitDiagnostics, strategy.maxPixelRatio, webglAvailable]);

  const captureViewport = useCallback((): GraphViewportSnapshot | null => {
    const graph = graphRef.current;
    if (!graph) {
      return null;
    }
    const camera = graph.camera();
    const controls = graph.controls() as RendererControls;
    const target = controls.target ?? new THREE.Vector3();

    return {
      rendererFamily: RENDERER_FAMILY,
      value: {
        camera: [camera.position.x, camera.position.y, camera.position.z],
        target: [target.x, target.y, target.z],
      } satisfies Rfg3dViewportValue,
    };
  }, []);

  useEffect(() => {
    if (
      webglAvailable !== true ||
      viewport?.rendererFamily !== RENDERER_FAMILY ||
      !isViewportValue(viewport.value)
    ) {
      return;
    }

    const viewportValue = viewport.value;
    let cancelled = false;
    let frame = 0;
    const restore = () => {
      if (cancelled) {
        return;
      }
      const graph = graphRef.current;
      if (!graph) {
        frame = requestAnimationFrame(restore);
        return;
      }
      const [x, y, z] = viewportValue.camera;
      const [tx, ty, tz] = viewportValue.target;
      graph.cameraPosition({ x, y, z }, { x: tx, y: ty, z: tz }, 0);
    };
    frame = requestAnimationFrame(restore);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [viewport, webglAvailable]);

  useEffect(() => {
    if (webglAvailable !== true || !command) {
      return;
    }
    let cancelled = false;
    let frame = 0;

    const apply = () => {
      if (cancelled) {
        return;
      }
      const graph = graphRef.current;
      if (!graph) {
        frame = requestAnimationFrame(apply);
        return;
      }
      if (command.type === "diagnostics") {
        emitDiagnostics(animationPausedRef.current);
        return;
      }
      resumeRenderer();
      if (command.type === "fit") {
        graph.zoomToFit(450, 48);
      } else {
        graph.cameraPosition(
          { x: 0, y: 0, z: RESET_CAMERA_DISTANCE },
          { x: 0, y: 0, z: 0 },
          450,
        );
      }
      window.setTimeout(() => {
        const snapshot = captureViewport();
        if (snapshot) {
          onViewportChange?.(snapshot);
        }
        scheduleIdlePause();
      }, 500);
    };
    frame = requestAnimationFrame(apply);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [
    captureViewport,
    command,
    emitDiagnostics,
    onViewportChange,
    resumeRenderer,
    scheduleIdlePause,
    webglAvailable,
  ]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }

    let cancelled = false;
    let frame = 0;
    let controls: RendererControls | undefined;

    const onControlStart = () => resumeRenderer();
    const onControlChange = () => resumeRenderer();
    const onControlEnd = () => {
      const snapshot = captureViewport();
      if (snapshot) {
        onViewportChange?.(snapshot);
      }
      scheduleIdlePause();
    };

    const attach = () => {
      if (cancelled) {
        return;
      }
      controls = graphRef.current?.controls() as RendererControls | undefined;
      if (!controls?.addEventListener) {
        frame = requestAnimationFrame(attach);
        return;
      }
      controls.staticMoving = false;
      controls.dynamicDampingFactor = 0.12;
      controls.zoomSpeed = 0.5;
      controls.addEventListener("start", onControlStart);
      controls.addEventListener("change", onControlChange);
      controls.addEventListener("end", onControlEnd);
    };

    frame = requestAnimationFrame(attach);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      controls?.removeEventListener?.("start", onControlStart);
      controls?.removeEventListener?.("change", onControlChange);
      controls?.removeEventListener?.("end", onControlEnd);
    };
  }, [
    captureViewport,
    onViewportChange,
    resumeRenderer,
    scheduleIdlePause,
    webglAvailable,
  ]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        pauseRenderer();
      } else {
        resumeRenderer();
        scheduleIdlePause();
      }
    };
    const onWindowFocus = () => {
      resumeRenderer();
      scheduleIdlePause();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", pauseRenderer);
    window.addEventListener("focus", onWindowFocus);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", pauseRenderer);
      window.removeEventListener("focus", onWindowFocus);
      clearIdleTimer();
    };
  }, [
    clearIdleTimer,
    pauseRenderer,
    resumeRenderer,
    scheduleIdlePause,
    webglAvailable,
  ]);

  useEffect(() => {
    if (webglAvailable !== true) {
      return;
    }
    simulationStartedAtRef.current = performance.now();
    engineSettledMsRef.current = undefined;
    resumeRenderer();

    const settleBudgetMs =
      strategy.physics === "off"
        ? 60
        : strategy.physics === "settle-and-pause"
          ? 5_500
          : 16_000;
    const timer = window.setTimeout(() => {
      if (!dragRef.current) {
        pauseRenderer();
      }
    }, settleBudgetMs);
    return () => window.clearTimeout(timer);
  }, [dataKey, pauseRenderer, resumeRenderer, strategy.physics, webglAvailable]);

  const findNodeAtPointer = useCallback(
    (clientX: number, clientY: number): Rfg3dNode | null => {
      const graph = graphRef.current;
      const canvas = graph?.renderer().domElement;
      if (!graph || !canvas) {
        return null;
      }
      const bounds = canvas.getBoundingClientRect();
      const pointerX = clientX - bounds.left;
      const pointerY = clientY - bounds.top;
      let nearest: { readonly node: Rfg3dNode; readonly distance: number } | null =
        null;

      for (const node of graphData.nodes) {
        if (
          !Number.isFinite(node.x) ||
          !Number.isFinite(node.y) ||
          !Number.isFinite(node.z)
        ) {
          continue;
        }
        const screen = graph.graph2ScreenCoords(
          node.x ?? 0,
          node.y ?? 0,
          node.z ?? 0,
        );
        const distance = Math.hypot(screen.x - pointerX, screen.y - pointerY);
        if (
          distance <= NODE_HIT_RADIUS_PX &&
          (nearest === null || distance < nearest.distance)
        ) {
          nearest = { node, distance };
        }
      }
      return nearest?.node ?? null;
    },
    [graphData.nodes],
  );

  const startNodeGesture = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const node = findNodeAtPointer(event.clientX, event.clientY);
      const graph = graphRef.current;
      if (!node || !graph) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      resumeRenderer();

      const cameraDistance = graph
        .camera()
        .position.distanceTo(
          new THREE.Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0),
        );
      dragRef.current = {
        node,
        cameraDistance,
        gesture: beginNodePointerGesture(node.id, event.clientX, event.clientY),
      };
      const controls = graph.controls() as RendererControls;
      controls.enabled = false;
    },
    [findNodeAtPointer, resumeRenderer],
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      const graph = graphRef.current;
      const canvas = graph?.renderer().domElement;
      if (!drag || !graph || !canvas) {
        return;
      }

      const nextGesture = advanceNodePointerGesture(
        drag.gesture,
        event.clientX,
        event.clientY,
        NODE_DRAG_THRESHOLD_PX,
      );
      drag.gesture = nextGesture;
      if (!nextGesture.didDrag) {
        return;
      }

      if (drag.node.fx === undefined) {
        drag.node.fx = drag.node.x ?? 0;
        drag.node.fy = drag.node.y ?? 0;
        drag.node.fz = drag.node.z ?? 0;
      }

      const bounds = canvas.getBoundingClientRect();
      const point = graph.screen2GraphCoords(
        event.clientX - bounds.left,
        event.clientY - bounds.top,
        drag.cameraDistance,
      );
      drag.node.fx = drag.node.x = point.x;
      drag.node.fy = drag.node.y = point.y;
      drag.node.fz = drag.node.z = point.z;
      syncOptimizedLayers();
      if (strategy.physics !== "off") {
        graph.d3ReheatSimulation();
      }
    };

    const release = (cancelled: boolean) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }

      if (drag.gesture.didDrag) {
        delete drag.node.fx;
        delete drag.node.fy;
        delete drag.node.fz;
        if (strategy.physics !== "off") {
          graphRef.current?.d3ReheatSimulation();
        }
      }

      const activatedId = completeNodePointerGesture(drag.gesture, cancelled);
      dragRef.current = null;
      const controls = graphRef.current?.controls() as
        | RendererControls
        | undefined;
      if (controls) {
        controls.enabled = true;
      }
      if (activatedId) {
        onNodeActivate(activatedId);
      }
      scheduleIdlePause();
    };

    const finish = () => release(false);
    const cancel = () => release(true);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [
    onNodeActivate,
    scheduleIdlePause,
    strategy.physics,
    syncOptimizedLayers,
  ]);

  const focusCamera = useCallback(() => {
    syncOptimizedLayers();
    const graph = graphRef.current;
    const focused = scene.nodes.find((node) => node.focused);
    if (!graph || !focused) {
      scheduleIdlePause();
      return;
    }

    const liveNode = graphData.nodes.find(
      (node) => node.id === focused.knowledgeId,
    );
    if (
      !liveNode ||
      !Number.isFinite(liveNode.x) ||
      !Number.isFinite(liveNode.y) ||
      !Number.isFinite(liveNode.z)
    ) {
      scheduleIdlePause();
      return;
    }

    const x = liveNode.x ?? 0;
    const y = liveNode.y ?? 0;
    const z = liveNode.z ?? 0;
    const length = Math.hypot(x, y, z) || 1;
    graph.cameraPosition(
      {
        x: x + (x / length) * FOCUS_DISTANCE,
        y: y + (y / length) * FOCUS_DISTANCE,
        z: z + (z / length) * FOCUS_DISTANCE,
      },
      { x, y, z },
      500,
    );
    scheduleIdlePause();
  }, [graphData.nodes, scene.nodes, scheduleIdlePause, syncOptimizedLayers]);

  const nodeLabel = useCallback(
    (node: Rfg3dNode) => {
      if (strategy.labels === "off") {
        return "";
      }
      const presentation = presentationById.get(node.id);
      if (
        strategy.labels === "focused-only" &&
        !presentation?.selected &&
        !presentation?.focused &&
        !presentation?.highlighted
      ) {
        return "";
      }
      return `${node.label} · ${node.semanticKind}`;
    },
    [presentationById, strategy.labels],
  );

  const handleEngineTick = useCallback(() => {
    syncOptimizedLayers();
  }, [syncOptimizedLayers]);

  const handleEngineStop = useCallback(() => {
    syncOptimizedLayers();
    engineSettledMsRef.current =
      performance.now() - simulationStartedAtRef.current;
    focusCamera();
    emitDiagnostics(false);
  }, [emitDiagnostics, focusCamera, syncOptimizedLayers]);

  if (webglAvailable === null) {
    return (
      <div role="status" aria-label="3D Knowledge graph">
        Checking 3D renderer availability…
      </div>
    );
  }

  if (!webglAvailable) {
    return (
      <section aria-label="3D Knowledge graph">
        <RendererUnavailable message="WebGL2 is not available in this browser." />
      </section>
    );
  }

  const cooldownTime =
    strategy.physics === "on"
      ? 15_000
      : strategy.physics === "settle-and-pause"
        ? 5_000
        : 0;

  return (
    <section
      aria-label="3D Knowledge graph"
      style={{ height: "100%", minHeight: 360 }}
      data-render-strategy={strategy.family}
      data-performance-profile={performanceProfile}
    >
      <div
        ref={containerRef}
        role="application"
        tabIndex={0}
        aria-label="Interactive 3D Knowledge graph"
        onPointerDownCapture={startNodeGesture}
        onWheelCapture={resumeRenderer}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 360,
          overflow: "hidden",
          borderRadius: 8,
        }}
      >
        <RendererErrorBoundary onUnavailable={reportUnavailable}>
          <ForceGraph3D<Rfg3dNode, Rfg3dLink>
            ref={graphRef}
            width={size.width}
            height={size.height}
            graphData={graphData}
            cooldownTime={cooldownTime}
            controlType="trackball"
            rendererConfig={{
              antialias: strategy.family === "standard",
              alpha: false,
              powerPreference: "high-performance",
            }}
            enableNavigationControls
            enableNodeDrag={false}
            showNavInfo={false}
            backgroundColor="#0b1220"
            nodeRelSize={4}
            nodeResolution={strategy.nodeResolution}
            nodeVisibility={!strategy.useInstancedNodes}
            nodeColor={nodeColor}
            nodeLabel={nodeLabel}
            linkVisibility={!strategy.useBatchedLinks}
            linkColor={linkColor}
            linkWidth={(link) =>
              presentationById.get(endpointId(link.source))?.highlighted ||
              presentationById.get(endpointId(link.target))?.highlighted
                ? 2
                : 1
            }
            linkOpacity={0.8}
            linkDirectionalArrowLength={
              strategy.arrowheads && !strategy.useBatchedLinks ? 3 : 0
            }
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={
              strategy.particles && !strategy.useBatchedLinks ? 1 : 0
            }
            linkDirectionalParticleWidth={1.5}
            linkDirectionalParticleColor={linkColor}
            linkLabel={(link) =>
              `${link.relationType}: ${endpointId(link.source)} → ${endpointId(link.target)}`
            }
            onEngineTick={handleEngineTick}
            onEngineStop={handleEngineStop}
          />
        </RendererErrorBoundary>
      </div>
    </section>
  );
}
