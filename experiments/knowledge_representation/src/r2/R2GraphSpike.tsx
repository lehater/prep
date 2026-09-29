import { Component, useCallback, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react'
import ForceGraph3D, { type ForceGraphMethods, type NodeObject } from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import * as THREE from 'three'
import { Box, Button, Checkbox, Chip, Divider, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Slider, Stack, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { areaColors as provisionalAreaColors, relationColors as provisionalRelationColors, type PaymentGraphLink, type PaymentGraphNode, type RelationType } from './paymentGraphFixture'
import { knowledgeGraphSnapshotFixture } from './knowledgeGraphSnapshotFixture'
import { KnowledgeCardDetail } from './KnowledgeCardDetail'
import { createPaymentGraphDensityFixture, type R2DensityTier } from './r2DensityFixture'
import { createDefaultR2GraphConfig, type R2GraphTuningConfig } from './r2GraphConfig'
import { createR2InstancedNodeLayer, type R2InstancedNodeLayer } from './r2InstancedNodeRenderer'
import { createR2InstancedInteractionLayer, type R2InstancedInteractionLayer, type R2InstancedInteractionVisual } from './r2InstancedInteractionLayer'
import { createR2BatchedLinkLayer, type R2BatchedLinkLayer } from './r2BatchedLinkRenderer'
import '../knowledge/knowledge-workspace.css'
import './r2-spike.css'

export type R2SpikeScenario = 'initial' | 'search-focus' | 'hover-neighbors' | 'orbit-depth' | 'relation-filter' | 'reset'
export type R2NodeRendererMode = 'standard' | 'instanced'
export type R2LinkRendererMode = 'standard' | 'batched'
export type R2DataSource = 'provisional' | 'knowledge-graph' | 'knowledge-graph-payments'
type R2PerformanceExperiments = {
  renderParticles: boolean
  renderArrows: boolean
  lowPolyNodes: boolean
  thinLineLinks: boolean
  renderLinks: boolean
  physicsSimulation: boolean
}
const defaultPerformanceExperiments: R2PerformanceExperiments = {
  renderParticles: true,
  renderArrows: true,
  lowPolyNodes: false,
  thinLineLinks: false,
  renderLinks: true,
  physicsSimulation: true,
}
export interface R2GraphSpikeProps {
  scenario: R2SpikeScenario
  enableStorybookTuning?: boolean
  densityTier?: R2DensityTier
  dataSource?: R2DataSource
  initialNodeRendererMode?: R2NodeRendererMode
  initialLinkRendererMode?: R2LinkRendererMode
}

const r2DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#78b7ff' },
    background: { default: '#0b1220', paper: '#121d2e' },
    text: {
      primary: '#e7f0fa',
      secondary: '#aebed0',
      disabled: '#7f91a8',
    },
    divider: 'rgba(174, 185, 200, .28)',
    action: {
      hover: 'rgba(120, 183, 255, .10)',
      selected: 'rgba(120, 183, 255, .16)',
      disabled: 'rgba(196, 211, 226, .46)',
      disabledBackground: 'rgba(118, 137, 158, .16)',
    },
  },
})

const nodeId = (node: string | PaymentGraphNode | NodeObject<PaymentGraphNode> | undefined) => typeof node === 'object' && node ? String(node.id) : String(node)
const interpolate = (from: number, to: number, progress: number) => from + (to - from) * progress
const rendererRevision = (() => {
  if (!import.meta.hot) return 'production'
  const hotData = import.meta.hot.data as { rendererRevision?: number }
  hotData.rendererRevision = (hotData.rendererRevision ?? 0) + 1
  return `storybook-hmr-${hotData.rendererRevision}`
})()

type AdjustableForce = { strength: (value: number) => unknown; distance?: (value: number) => unknown }
type DraggableNode = PaymentGraphNode & { fx?: number; fy?: number; fz?: number }
type NavigationControls = {
  enabled?: boolean
  target?: THREE.Vector3
  update?: () => void
  staticMoving?: boolean
  dynamicDampingFactor?: number
  zoomSpeed?: number
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}
type EmphasisTransition = { from: number; to: 0 | 1; startedAt: number; duration: number }

function adjustBrightness(hex: string, factor: number) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16))
  const adjusted = channels.map((channel) => factor <= 1 ? Math.round(channel * factor) : Math.round(channel + (255 - channel) * Math.min(factor - 1, 1)))
  return `#${adjusted.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function canCreateWebGL2Context() {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2', { antialias: false, powerPreference: 'default' })
    if (!context) return false
    context.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}

function WebGLUnavailable({ runtimeFailure = false }: { runtimeFailure?: boolean }) {
  return <Box className="r2-webgl-fallback" role="alert"><Typography component="h3" variant="h6">WebGL2 недоступен</Typography><Typography variant="body2">{runtimeFailure ? 'Браузер сообщил о поддержке WebGL2, но не смог создать renderer context.' : 'Текущий браузер или embedded preview не предоставляет WebGL2 context.'}</Typography><Typography variant="body2">Откройте Storybook во внешнем Chrome/Firefox с включённым аппаратным ускорением и перезагрузите страницу.</Typography><Typography variant="caption">R2 renderer не запущен; shell, поиск, фильтры и Detail остаются доступны.</Typography></Box>
}

class WebGLErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('R2 WebGL renderer failed', error, info) }
  render() { return this.state.failed ? <WebGLUnavailable runtimeFailure /> : this.props.children }
}

export function R2GraphSpike({
  scenario,
  enableStorybookTuning = false,
  densityTier = 60,
  dataSource = 'provisional',
  initialNodeRendererMode = 'standard',
  initialLinkRendererMode = 'standard',
}: R2GraphSpikeProps) {
  const automatedBrowser = typeof navigator !== 'undefined' && navigator.webdriver
  const webGL2Available = useMemo(() => automatedBrowser ? false : canCreateWebGL2Context(), [automatedBrowser])
  const devicePixelRatio = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1
  const [tuning, setTuning] = useState(createDefaultR2GraphConfig)
  const { visual, physics, rendererCamera } = tuning
  const { x: initialCameraX, y: initialCameraY, z: initialCameraZ } = rendererCamera.initialCamera
  const targetPixelRatio = Math.min(devicePixelRatio, rendererCamera.maxPixelRatio)
  const sourceFixture = useMemo(() => {
    if (dataSource === 'knowledge-graph' || dataSource === 'knowledge-graph-payments') {
      return {
        title: knowledgeGraphSnapshotFixture.title,
        fixtureLabel: knowledgeGraphSnapshotFixture.fixtureLabel,
        nodes: knowledgeGraphSnapshotFixture.nodes,
        links: knowledgeGraphSnapshotFixture.links,
        areaColors: knowledgeGraphSnapshotFixture.areaColors as Record<string, string>,
        relationColors: knowledgeGraphSnapshotFixture.relationColors as Record<string, string>,
        documentsById: knowledgeGraphSnapshotFixture.documentsById,
        documentsBySlug: knowledgeGraphSnapshotFixture.documentsBySlug,
        source: knowledgeGraphSnapshotFixture.source,
      }
    }
    const graph = createPaymentGraphDensityFixture(densityTier)
    return {
      title: 'Payment Processing',
      fixtureLabel: `${densityTier === 60 ? 'Provisional fixture' : 'Synthetic stress fixture'} · ${graph.nodes.length} nodes · ${graph.links.length} typed edges`,
      nodes: graph.nodes,
      links: graph.links,
      areaColors: provisionalAreaColors as Record<string, string>,
      relationColors: provisionalRelationColors as Record<string, string>,
      documentsById: new Map(),
      documentsBySlug: new Map(),
      source: null,
    }
  }, [
    dataSource,
    densityTier,
    knowledgeGraphSnapshotFixture.fixtureLabel,
    knowledgeGraphSnapshotFixture.source.contentHash,
  ])
  const sourceGraphData = sourceFixture
  const datasetKey = sourceFixture.source
    ? `${dataSource}:${sourceFixture.source.contentHash}:${sourceFixture.nodes.length}:${sourceFixture.links.length}`
    : `${dataSource}:${densityTier}:${sourceFixture.nodes.length}:${sourceFixture.links.length}`
  const graphAreaColors = sourceFixture.areaColors
  const graphRelationColors = sourceFixture.relationColors
  const allRelationTypes = Object.keys(graphRelationColors) as RelationType[]
  const usingKnowledgeGraph = dataSource === 'knowledge-graph' || dataSource === 'knowledge-graph-payments'
  const scenarioFocusTitle = usingKnowledgeGraph ? 'Payments' : 'Payment Intent'
  const scenarioHoverTitle = usingKnowledgeGraph ? 'Digital Payments' : 'Authorization'
  const initialSelected = scenario === 'search-focus' ? sourceGraphData.nodes.find((node) => node.title === scenarioFocusTitle) ?? null : null
  const initialHovered = scenario === 'hover-neighbors' ? sourceGraphData.nodes.find((node) => node.title === scenarioHoverTitle) ?? null : null
  const graphRef = useRef<ForceGraphMethods<PaymentGraphNode, PaymentGraphLink>>(undefined)
  const instancedNodeLayerRef = useRef<R2InstancedNodeLayer | null>(null)
  const instancedInteractionLayerRef = useRef<R2InstancedInteractionLayer | null>(null)
  const batchedLinkLayerRef = useRef<R2BatchedLinkLayer | null>(null)
  const forceUpdatePending = useRef(true)
  const filterFitPending = useRef(false)
  const simulationStartedAt = useRef<number | null>(null)
  const rendererIdleTimer = useRef<number | null>(null)
  const fpsFrame = useRef<number | null>(null)
  const physicsActiveRef = useRef(true)
  const rendererPausedRef = useRef(false)
  const renderFrameSampleRef = useRef({ frames: 0, startedAt: 0 })
  const emphasisFrame = useRef<number | null>(null)
  const hoverLeaveTimer = useRef<number | null>(null)
  const pointerPositionRef = useRef<{ clientX: number; clientY: number } | null>(null)
  const hoveredNodeRef = useRef<PaymentGraphNode | null>(initialHovered)
  const emphasisLevelsRef = useRef<Map<string, number>>(new Map(initialHovered ? [[initialHovered.id, 1]] : []))
  const emphasisTransitionsRef = useRef<Map<string, EmphasisTransition>>(new Map())
  const activeEmphasisIdRef = useRef<string | null>(initialHovered?.id ?? null)
  const draggedNodeRef = useRef<{ node: DraggableNode; cameraDistance: number; startX: number; startY: number; didDrag: boolean } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 840, height: 665 })
  const [renderDebug, setRenderDebug] = useState({ cssWidth: 0, cssHeight: 0, bufferWidth: 0, bufferHeight: 0, rendererPixelRatio: 0 })
  const [performanceDebug, setPerformanceDebug] = useState<{ rafFps: number; drawCalls: number; triangles: number; settleMs: number | null; lastReheatReason: string; rendererPaused: boolean }>({ rafFps: 0, drawCalls: 0, triangles: 0, settleMs: null, lastReheatReason: 'initial', rendererPaused: false })
  const [query, setQuery] = useState(scenario === 'search-focus' ? scenarioFocusTitle : '')
  const [selected, setSelected] = useState<PaymentGraphNode | null>(initialSelected)
  const [focused, setFocused] = useState<PaymentGraphNode | null>(initialSelected)
  const [hovered, setHovered] = useState<PaymentGraphNode | null>(initialHovered)
  const [pressedNode, setPressedNode] = useState<PaymentGraphNode | null>(null)
  const emphasizedNode = pressedNode ?? hovered
  const [emphasisLevels, setEmphasisLevels] = useState<ReadonlyMap<string, number>>(() => new Map(initialHovered ? [[initialHovered.id, 1]] : []))
  const [visibleRelations, setVisibleRelations] = useState<Set<RelationType>>(() => new Set(scenario === 'relation-filter' ? allRelationTypes.filter((type) => type !== 'similar_to' && type !== 'uses') : allRelationTypes))
  const [activeOverlay, setActiveOverlay] = useState<'settings' | 'legend' | null>(null)
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false)
  const [configCopied, setConfigCopied] = useState(false)
  const [nodeRendererMode, setNodeRendererMode] = useState<R2NodeRendererMode>(initialNodeRendererMode)
  const [linkRendererMode, setLinkRendererMode] = useState<R2LinkRendererMode>(initialLinkRendererMode)
  const [performanceExperiments, setPerformanceExperiments] = useState<R2PerformanceExperiments>(defaultPerformanceExperiments)
  const effectiveNodeResolution = performanceExperiments.lowPolyNodes ? 8 : rendererCamera.nodeResolution
  const effectiveArrowLength = performanceExperiments.renderArrows ? 3 : 0
  const effectiveParticleCount = performanceExperiments.renderParticles ? visual.particleCount : 0
  const effectiveLinkThickness = performanceExperiments.thinLineLinks ? 0 : visual.linkThickness
  const batchedLinkColorRef = useRef<(link: PaymentGraphLink) => string>((link) => graphRelationColors[link.type] ?? '#7f8fa4')
  const instancedInteractionStateRef = useRef({ selectedId: selected?.id ?? null, focusedId: focused?.id ?? null, emphasizedId: emphasizedNode?.id ?? null })
  const instancedInteractionVisualRef = useRef<R2InstancedInteractionVisual>({
    selectedRingRadius: visual.selectedRingRadius,
    selectedRingTube: visual.selectedRingTube,
    focusHaloRadius: visual.focusHaloRadius,
    focusHaloOpacity: visual.focusHaloOpacity,
    labelTextHeight: visual.labelTextHeight,
    labelOffset: visual.labelOffset,
  })
  instancedInteractionStateRef.current = { selectedId: selected?.id ?? null, focusedId: focused?.id ?? null, emphasizedId: emphasizedNode?.id ?? null }
  instancedInteractionVisualRef.current = {
    selectedRingRadius: visual.selectedRingRadius,
    selectedRingTube: visual.selectedRingTube,
    focusHaloRadius: visual.focusHaloRadius,
    focusHaloOpacity: visual.focusHaloOpacity,
    labelTextHeight: visual.labelTextHeight,
    labelOffset: visual.labelOffset,
  }

  const clearRendererIdleTimer = useCallback(() => {
    if (rendererIdleTimer.current !== null) {
      window.clearTimeout(rendererIdleTimer.current)
      rendererIdleTimer.current = null
    }
  }, [])

  const stopDiagnosticsSampler = useCallback(() => {
    if (fpsFrame.current !== null) {
      cancelAnimationFrame(fpsFrame.current)
      fpsFrame.current = null
    }
    renderFrameSampleRef.current = { frames: 0, startedAt: 0 }
  }, [])

  const startDiagnosticsSampler = useCallback(() => {
    if (!enableStorybookTuning || automatedBrowser || fpsFrame.current !== null) return
    renderFrameSampleRef.current = { frames: 0, startedAt: performance.now() }

    const sample = (now: number) => {
      const state = renderFrameSampleRef.current
      state.frames += 1
      const elapsed = now - state.startedAt
      if (elapsed >= 750) {
        const renderInfo = graphRef.current?.renderer().info.render
        const rafFps = Math.round(state.frames * 1000 / elapsed)
        const drawCalls = renderInfo?.calls ?? 0
        const triangles = renderInfo?.triangles ?? 0
        setPerformanceDebug((current) => current.rafFps === rafFps && current.drawCalls === drawCalls && current.triangles === triangles && !current.rendererPaused
          ? current
          : { ...current, rafFps, drawCalls, triangles, rendererPaused: false })
        state.frames = 0
        state.startedAt = now
      }
      fpsFrame.current = requestAnimationFrame(sample)
    }

    fpsFrame.current = requestAnimationFrame(sample)
  }, [automatedBrowser, enableStorybookTuning])

  const pauseRenderer = useCallback(() => {
    clearRendererIdleTimer()
    stopDiagnosticsSampler()
    graphRef.current?.pauseAnimation()
    rendererPausedRef.current = true
    setPerformanceDebug((current) => current.rendererPaused && current.rafFps === 0 ? current : { ...current, rafFps: 0, rendererPaused: true })
  }, [clearRendererIdleTimer, stopDiagnosticsSampler])

  const resumeRenderer = useCallback(() => {
    if (typeof document !== 'undefined' && document.hidden) return
    clearRendererIdleTimer()
    graphRef.current?.resumeAnimation()
    rendererPausedRef.current = false
    startDiagnosticsSampler()
    setPerformanceDebug((current) => current.rendererPaused ? { ...current, rendererPaused: false } : current)
  }, [clearRendererIdleTimer, startDiagnosticsSampler])

  const scheduleRendererIdlePause = useCallback((delayMs = 400) => {
    clearRendererIdleTimer()
    if (physicsActiveRef.current || draggedNodeRef.current) return
    rendererIdleTimer.current = window.setTimeout(() => {
      rendererIdleTimer.current = null
      if (!physicsActiveRef.current && !draggedNodeRef.current) pauseRenderer()
    }, delayMs)
  }, [clearRendererIdleTimer, pauseRenderer])

  const wakeRenderer = useCallback((idleDelayMs = 500) => {
    resumeRenderer()
    if (!physicsActiveRef.current) scheduleRendererIdlePause(idleDelayMs)
  }, [resumeRenderer, scheduleRendererIdlePause])

  const handleNodeHover = useCallback((node: PaymentGraphNode | null) => {
    if (hoverLeaveTimer.current !== null) window.clearTimeout(hoverLeaveTimer.current)
    if (node) {
      hoveredNodeRef.current = node
      setHovered(node)
      return
    }
    const currentNode = hoveredNodeRef.current
    const pointer = pointerPositionRef.current
    const graph = graphRef.current
    const canvas = graph?.renderer().domElement
    if (currentNode && pointer && graph && canvas) {
      const bounds = canvas.getBoundingClientRect()
      const screen = graph.graph2ScreenCoords(currentNode.x ?? 0, currentNode.y ?? 0, currentNode.z ?? 0)
      const pointerX = pointer.clientX - bounds.left
      const pointerY = pointer.clientY - bounds.top
      const hitRadius = Math.max(visual.dragHitRadiusMin, Math.min(visual.dragHitRadiusMax, visual.nodeSize * visual.dragHitRadiusMultiplier))
      if (Math.hypot(screen.x - pointerX, screen.y - pointerY) <= hitRadius) return
    }
    hoverLeaveTimer.current = window.setTimeout(() => {
      hoveredNodeRef.current = null
      setHovered(null)
      hoverLeaveTimer.current = null
    }, visual.hoverLeaveDelayMs)
  }, [visual.dragHitRadiusMax, visual.dragHitRadiusMin, visual.dragHitRadiusMultiplier, visual.hoverLeaveDelayMs, visual.nodeSize])

  const trackPointerPosition = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    wakeRenderer(Math.max(500, visual.hoverTransitionInMs + 200))
    pointerPositionRef.current = { clientX: event.clientX, clientY: event.clientY }
    if (nodeRendererMode !== 'instanced' || draggedNodeRef.current) return
    const graph = graphRef.current
    const canvas = graph?.renderer().domElement
    const layer = instancedNodeLayerRef.current
    if (!graph || !canvas || !layer) return
    handleNodeHover(layer.pick(graph.camera(), canvas, event.clientX, event.clientY))
  }, [handleNodeHover, nodeRendererMode, visual.hoverTransitionInMs, wakeRenderer])

  const clearCanvasHover = useCallback(() => {
    pointerPositionRef.current = null
    if (draggedNodeRef.current) return
    if (hoverLeaveTimer.current !== null) window.clearTimeout(hoverLeaveTimer.current)
    hoveredNodeRef.current = null
    setHovered(null)
  }, [])

  useEffect(() => () => {
    if (hoverLeaveTimer.current !== null) window.clearTimeout(hoverLeaveTimer.current)
  }, [])

  const graphData = useMemo(() => ({ nodes: sourceGraphData.nodes.map((node) => ({ ...node })), links: sourceGraphData.links.map((link) => ({ ...link })) }), [sourceGraphData])
  const syncInstancedNodes = useCallback(() => {
    if (nodeRendererMode !== 'instanced') return
    instancedNodeLayerRef.current?.syncPositions(graphData.nodes)
    instancedInteractionLayerRef.current?.syncPositions()
  }, [graphData.nodes, nodeRendererMode])

  useEffect(() => {
    if (nodeRendererMode !== 'instanced' || automatedBrowser || !webGL2Available) return
    let cancelled = false
    let frame = 0
    const mount = () => {
      if (cancelled) return
      const scene = graphRef.current?.scene()
      if (!scene) {
        frame = requestAnimationFrame(mount)
        return
      }
      const nodeLayer = createR2InstancedNodeLayer(graphData.nodes.length, visual.nodeSize, effectiveNodeResolution)
      nodeLayer.syncPositions(graphData.nodes)
      nodeLayer.syncColors(graphData.nodes, (node) => graphAreaColors[node.area] ?? '#7f8fa4')
      const interactionLayer = createR2InstancedInteractionLayer()
      interactionLayer.configure(graphData.nodes, instancedInteractionStateRef.current, instancedInteractionVisualRef.current)
      scene.add(nodeLayer.mesh)
      scene.add(interactionLayer.root)
      instancedNodeLayerRef.current = nodeLayer
      instancedInteractionLayerRef.current = interactionLayer
    }
    frame = requestAnimationFrame(mount)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      const scene = graphRef.current?.scene()
      const nodeLayer = instancedNodeLayerRef.current
      if (nodeLayer) {
        scene?.remove(nodeLayer.mesh)
        nodeLayer.dispose()
        instancedNodeLayerRef.current = null
      }
      const interactionLayer = instancedInteractionLayerRef.current
      if (interactionLayer) {
        scene?.remove(interactionLayer.root)
        interactionLayer.dispose()
        instancedInteractionLayerRef.current = null
      }
    }
  }, [automatedBrowser, effectiveNodeResolution, graphAreaColors, graphData.nodes, nodeRendererMode, visual.nodeSize, webGL2Available])

  const activeGraphData = useMemo(() => ({ nodes: graphData.nodes, links: graphData.links.filter((link) => visibleRelations.has(link.type)) }), [graphData, visibleRelations])

  useEffect(() => {
    if (linkRendererMode !== 'batched' || automatedBrowser || !webGL2Available || !performanceExperiments.renderLinks) return
    let cancelled = false
    let frame = 0
    const mount = () => {
      if (cancelled) return
      const scene = graphRef.current?.scene()
      if (!scene) {
        frame = requestAnimationFrame(mount)
        return
      }
      const layer = createR2BatchedLinkLayer(graphData.nodes, activeGraphData.links, graphRelationColors, {
        opacity: visual.linkOpacity,
        arrowLength: effectiveArrowLength,
        nodeRadius: visual.nodeSize,
        showArrows: performanceExperiments.renderArrows,
      })
      layer.syncColors(batchedLinkColorRef.current)
      scene.add(layer.root)
      batchedLinkLayerRef.current = layer
    }
    frame = requestAnimationFrame(mount)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      const layer = batchedLinkLayerRef.current
      if (!layer) return
      graphRef.current?.scene().remove(layer.root)
      layer.dispose()
      batchedLinkLayerRef.current = null
    }
  }, [activeGraphData.links, automatedBrowser, effectiveArrowLength, graphData.nodes, graphRelationColors, linkRendererMode, performanceExperiments.renderArrows, performanceExperiments.renderLinks, visual.linkOpacity, visual.nodeSize, webGL2Available])

  const emphasisContext = useMemo(() => {
    const nodeNeighborhoodLevels = new Map<string, number>()
    const linkIncidentLevels = new Map<string, number>()
    let maxLevel = 0
    emphasisLevels.forEach((level, id) => {
      maxLevel = Math.max(maxLevel, level)
      nodeNeighborhoodLevels.set(id, Math.max(nodeNeighborhoodLevels.get(id) ?? 0, level))
    })
    activeGraphData.links.forEach((link) => {
      const source = nodeId(link.source)
      const target = nodeId(link.target)
      const incidentLevel = Math.max(emphasisLevels.get(source) ?? 0, emphasisLevels.get(target) ?? 0)
      if (incidentLevel <= 0) return
      linkIncidentLevels.set(link.id, incidentLevel)
      nodeNeighborhoodLevels.set(source, Math.max(nodeNeighborhoodLevels.get(source) ?? 0, incidentLevel))
      nodeNeighborhoodLevels.set(target, Math.max(nodeNeighborhoodLevels.get(target) ?? 0, incidentLevel))
    })
    return { linkIncidentLevels, maxLevel, nodeNeighborhoodLevels }
  }, [activeGraphData.links, emphasisLevels])

  useEffect(() => {
    if (emphasisFrame.current !== null) cancelAnimationFrame(emphasisFrame.current)
    const transitions = emphasisTransitionsRef.current
    const levels = emphasisLevelsRef.current
    const previousId = activeEmphasisIdRef.current
    const nextId = emphasizedNode?.id ?? null
    const startedAt = performance.now()
    const startTransition = (id: string, to: 0 | 1, duration: number) => {
      const from = levels.get(id) ?? 0
      if (Math.abs(from - to) < .001) {
        transitions.delete(id)
        if (to === 0) levels.delete(id); else levels.set(id, 1)
        return
      }
      transitions.set(id, { from, to, startedAt, duration })
    }
    if (previousId && previousId !== nextId) startTransition(previousId, 0, visual.hoverTransitionOutMs)
    if (nextId && previousId !== nextId) startTransition(nextId, 1, visual.hoverTransitionInMs)
    activeEmphasisIdRef.current = nextId

    const animate = (now: number) => {
      const nextLevels = new Map(emphasisLevelsRef.current)
      transitions.forEach((transition, id) => {
        const elapsed = transition.duration === 0 ? 1 : Math.min((now - transition.startedAt) / transition.duration, 1)
        const eased = elapsed * elapsed * (3 - 2 * elapsed)
        const next = interpolate(transition.from, transition.to, eased)
        if (elapsed < 1) nextLevels.set(id, next)
        else {
          transitions.delete(id)
          if (transition.to === 0) nextLevels.delete(id); else nextLevels.set(id, 1)
        }
      })
      emphasisLevelsRef.current = nextLevels
      setEmphasisLevels(nextLevels)
      emphasisFrame.current = transitions.size > 0 ? requestAnimationFrame(animate) : null
    }
    if (transitions.size > 0) {
      wakeRenderer(Math.max(visual.hoverTransitionInMs, visual.hoverTransitionOutMs) + 250)
      emphasisFrame.current = requestAnimationFrame(animate)
    } else setEmphasisLevels(new Map(levels))
    return () => {
      if (emphasisFrame.current !== null) cancelAnimationFrame(emphasisFrame.current)
    }
  }, [emphasizedNode, visual.hoverTransitionInMs, visual.hoverTransitionOutMs, wakeRenderer])

  const markSimulationStart = useCallback((reason: string) => {
    physicsActiveRef.current = true
    resumeRenderer()
    simulationStartedAt.current = performance.now()
    setPerformanceDebug((current) => ({ ...current, settleMs: null, lastReheatReason: reason }))
  }, [resumeRenderer])

  const applyForceSettings = useCallback(() => {
    const graph = graphRef.current
    if (!graph) return false
    try {
      ;(graph.d3Force('center') as AdjustableForce | undefined)?.strength(physics.centerForce)
      ;(graph.d3Force('charge') as AdjustableForce | undefined)?.strength(-physics.repelForce)
      const linkForce = graph.d3Force('link') as AdjustableForce | undefined
      linkForce?.strength(physics.linkForce)
      linkForce?.distance?.(physics.linkDistance)
      if (performanceExperiments.physicsSimulation) graph.d3ReheatSimulation()
      forceUpdatePending.current = false
      return true
    } catch {
      return false
    }
  }, [performanceExperiments.physicsSimulation, physics.centerForce, physics.linkDistance, physics.linkForce, physics.repelForce])

  const syncRendererQuality = useCallback(() => {
    const graph = graphRef.current
    if (!graph) return
    const renderer = graph.renderer()
    if (renderer.getPixelRatio() !== targetPixelRatio) renderer.setPixelRatio(targetPixelRatio)
    const currentBuffer = renderer.getDrawingBufferSize(new THREE.Vector2())
    const expectedBufferWidth = Math.floor(size.width * targetPixelRatio)
    const expectedBufferHeight = Math.floor(size.height * targetPixelRatio)
    if (currentBuffer.x !== expectedBufferWidth || currentBuffer.y !== expectedBufferHeight) renderer.setSize(size.width, size.height, false)
    const canvas = renderer.domElement
    const drawingBuffer = renderer.getDrawingBufferSize(new THREE.Vector2())
    const next = { cssWidth: canvas.clientWidth, cssHeight: canvas.clientHeight, bufferWidth: drawingBuffer.x, bufferHeight: drawingBuffer.y, rendererPixelRatio: renderer.getPixelRatio() }
    setRenderDebug((current) => Object.entries(next).every(([key, value]) => current[key as keyof typeof current] === value) ? current : next)
  }, [size.height, size.width, targetPixelRatio])

  const applyNavigationSettings = useCallback(() => {
    const controls = graphRef.current?.controls() as NavigationControls | undefined
    if (!controls) return
    controls.staticMoving = false
    controls.dynamicDampingFactor = rendererCamera.rotationDampingFactor
    controls.zoomSpeed = rendererCamera.zoomSpeed
  }, [rendererCamera.rotationDampingFactor, rendererCamera.zoomSpeed])

  const handleEngineTick = useCallback(() => {
    physicsActiveRef.current = true
    if (forceUpdatePending.current) applyForceSettings()
    syncInstancedNodes()
    if (linkRendererMode === 'batched') batchedLinkLayerRef.current?.syncPositions(graphData.nodes)
    syncRendererQuality()
    applyNavigationSettings()
  }, [applyForceSettings, applyNavigationSettings, graphData.nodes, linkRendererMode, syncInstancedNodes, syncRendererQuality])

  useEffect(() => {
    forceUpdatePending.current = true
    if (performanceExperiments.physicsSimulation) markSimulationStart(usingKnowledgeGraph ? 'knowledge-graph-snapshot' : (densityTier === 60 ? 'force/update' : `density-${densityTier}`))
    else setPerformanceDebug((current) => ({ ...current, settleMs: 0, lastReheatReason: 'physics-off' }))
    const frame = requestAnimationFrame(() => applyForceSettings())
    return () => cancelAnimationFrame(frame)
  }, [activeGraphData.links, applyForceSettings, densityTier, markSimulationStart, performanceExperiments.physicsSimulation, usingKnowledgeGraph])

  useEffect(() => {
    if (!performanceExperiments.physicsSimulation) {
      physicsActiveRef.current = false
      simulationStartedAt.current = null
      setPerformanceDebug((current) => ({ ...current, settleMs: 0, lastReheatReason: 'physics-off' }))
      scheduleRendererIdlePause()
      return
    }
    markSimulationStart('physics-on')
    const frame = requestAnimationFrame(() => {
      try { graphRef.current?.d3ReheatSimulation() } catch { /* renderer may not be mounted yet */ }
    })
    return () => cancelAnimationFrame(frame)
  }, [markSimulationStart, performanceExperiments.physicsSimulation, scheduleRendererIdlePause])

  useEffect(() => {
    if (!canvasRef.current) return
    const observer = new ResizeObserver(([entry]) => setSize({ width: Math.max(520, Math.floor(entry.contentRect.width)), height: Math.max(520, Math.floor(entry.contentRect.height)) }))
    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(syncRendererQuality)
    return () => cancelAnimationFrame(frame)
  }, [syncRendererQuality])

  useEffect(() => {
    const frame = requestAnimationFrame(applyNavigationSettings)
    return () => cancelAnimationFrame(frame)
  }, [applyNavigationSettings])


  useEffect(() => {
    if (automatedBrowser || !webGL2Available) return
    let cancelled = false
    let mountFrame = 0
    let controls: NavigationControls | undefined

    const onControlStart = () => resumeRenderer()
    const onControlChange = () => {
      resumeRenderer()
      if (!physicsActiveRef.current) scheduleRendererIdlePause(350)
    }
    const onControlEnd = () => scheduleRendererIdlePause(700)

    const mount = () => {
      if (cancelled) return
      controls = graphRef.current?.controls() as NavigationControls | undefined
      if (!controls?.addEventListener) {
        mountFrame = requestAnimationFrame(mount)
        return
      }
      controls.addEventListener('start', onControlStart)
      controls.addEventListener('change', onControlChange)
      controls.addEventListener('end', onControlEnd)
    }

    mountFrame = requestAnimationFrame(mount)
    return () => {
      cancelled = true
      cancelAnimationFrame(mountFrame)
      controls?.removeEventListener?.('start', onControlStart)
      controls?.removeEventListener?.('change', onControlChange)
      controls?.removeEventListener?.('end', onControlEnd)
    }
  }, [automatedBrowser, resumeRenderer, scheduleRendererIdlePause, webGL2Available])

  useEffect(() => {
    if (automatedBrowser) return
    const onVisibilityChange = () => {
      if (document.hidden) pauseRenderer()
      else wakeRenderer(500)
    }
    const onWindowBlur = () => pauseRenderer()
    const onWindowFocus = () => wakeRenderer(500)

    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', onWindowFocus)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('focus', onWindowFocus)
      clearRendererIdleTimer()
      stopDiagnosticsSampler()
    }
  }, [automatedBrowser, clearRendererIdleTimer, pauseRenderer, stopDiagnosticsSampler, wakeRenderer])

  const setOrbitPivot = useCallback((node: PaymentGraphNode) => {
    const controls = graphRef.current?.controls() as NavigationControls | undefined
    controls?.target?.copy(new THREE.Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0)); controls?.update?.()
  }, [])

  const flyTo = useCallback((node: PaymentGraphNode, duration = rendererCamera.focusTransitionMs) => {
    wakeRenderer(duration + 500)
    const liveNode = graphData.nodes.find((candidate) => candidate.id === node.id) ?? node
    setSelected(liveNode); setFocused(liveNode)
    const distance = 125
    const { x = 0, y = 0, z = 0 } = liveNode
    const length = Math.hypot(x, y, z) || 1
    graphRef.current?.cameraPosition({ x: x + x / length * distance, y: y + y / length * distance, z: z + z / length * distance }, { x, y, z }, duration)
    setTimeout(() => setOrbitPivot(liveNode), duration)
  }, [graphData.nodes, rendererCamera.focusTransitionMs, setOrbitPivot, wakeRenderer])

  const navigateToDocument = useCallback((slug: string) => {
    const document = sourceFixture.documentsBySlug.get(slug)
    if (!document) return
    const node = graphData.nodes.find((candidate) => candidate.id === document.id)
    if (node) flyTo(node)
  }, [flyTo, graphData.nodes, sourceFixture.documentsBySlug])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scenario === 'search-focus' && initialSelected) flyTo(initialSelected)
      else if (scenario === 'orbit-depth') graphRef.current?.cameraPosition({ x: 260, y: 130, z: 330 }, { x: 0, y: 0, z: 0 }, 0)
      else if (scenario === 'reset') graphRef.current?.cameraPosition({ x: -250, y: 170, z: 260 }, { x: 0, y: 0, z: 0 }, 0)
      else graphRef.current?.cameraPosition({ x: initialCameraX, y: initialCameraY, z: initialCameraZ }, { x: 0, y: 0, z: 0 }, 0)
    }, 80)
    return () => clearTimeout(timer)
  }, [flyTo, initialCameraX, initialCameraY, initialCameraZ, initialSelected, scenario])

  const results = useMemo(() => query.trim() ? graphData.nodes.filter((node) => node.title.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [], [graphData.nodes, query])
  const selectedDocument = selected ? sourceFixture.documentsById.get(selected.id) : undefined
  const displayNodeColor = useCallback((node: PaymentGraphNode) => {
    const semanticColor = graphAreaColors[node.area] ?? '#7f8fa4'
    const ownLevel = emphasisLevels.get(node.id) ?? 0
    const neighborhoodLevel = emphasisContext.nodeNeighborhoodLevels.get(node.id) ?? 0
    const dimLevel = Math.max(0, emphasisContext.maxLevel - neighborhoodLevel)
    const dimmedColor = adjustBrightness(semanticColor, interpolate(1, visual.nodeDimOpacity, dimLevel))
    return ownLevel > 0 ? adjustBrightness(dimmedColor, interpolate(1, visual.highlightIntensity, ownLevel)) : dimmedColor
  }, [emphasisContext.maxLevel, emphasisContext.nodeNeighborhoodLevels, emphasisLevels, graphAreaColors, visual.highlightIntensity, visual.nodeDimOpacity])

  useEffect(() => {
    if (nodeRendererMode !== 'instanced') return
    instancedNodeLayerRef.current?.syncColors(graphData.nodes, displayNodeColor)
  }, [displayNodeColor, graphData.nodes, nodeRendererMode])

  useEffect(() => {
    if (nodeRendererMode !== 'instanced') return
    let cancelled = false
    let frame = 0
    const configure = () => {
      if (cancelled) return
      const layer = instancedInteractionLayerRef.current
      if (!layer) {
        frame = requestAnimationFrame(configure)
        return
      }
      layer.configure(graphData.nodes, instancedInteractionStateRef.current, instancedInteractionVisualRef.current)
    }
    frame = requestAnimationFrame(configure)
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [
    emphasizedNode?.id,
    focused?.id,
    graphData.nodes,
    nodeRendererMode,
    selected?.id,
    visual.focusHaloOpacity,
    visual.focusHaloRadius,
    visual.labelOffset,
    visual.labelTextHeight,
    visual.selectedRingRadius,
    visual.selectedRingTube,
  ])
  const displayLinkColor = useCallback((link: PaymentGraphLink) => {
    const semanticColor = graphRelationColors[link.type] ?? '#7f8fa4'
    const incidentLevel = emphasisContext.linkIncidentLevels.get(link.id) ?? 0
    const dimLevel = Math.max(0, emphasisContext.maxLevel - incidentLevel)
    const dimmedColor = adjustBrightness(semanticColor, interpolate(1, visual.linkDimOpacity, dimLevel))
    return incidentLevel > 0 ? adjustBrightness(dimmedColor, interpolate(1, visual.highlightIntensity, incidentLevel)) : dimmedColor
  }, [emphasisContext.linkIncidentLevels, emphasisContext.maxLevel, graphRelationColors, visual.highlightIntensity, visual.linkDimOpacity])
  batchedLinkColorRef.current = displayLinkColor

  useEffect(() => {
    if (linkRendererMode !== 'batched') return
    batchedLinkLayerRef.current?.syncColors(displayLinkColor)
  }, [displayLinkColor, linkRendererMode])
  const displayLinkWidth = (link: PaymentGraphLink) => {
    const incidentLevel = emphasisContext.linkIncidentLevels.get(link.id) ?? 0
    const dimLevel = Math.max(0, emphasisContext.maxLevel - incidentLevel)
    const dimmedWidth = interpolate(visual.baseLinkWidth, visual.dimmedLinkWidth, dimLevel)
    return interpolate(dimmedWidth, visual.highlightedLinkWidth, incidentLevel)
  }
  const resetCamera = () => {
    if (focused) flyTo(focused, rendererCamera.fitTransitionMs)
    else {
      wakeRenderer(rendererCamera.fitTransitionMs + 500)
      graphRef.current?.cameraPosition({ x: initialCameraX, y: initialCameraY, z: initialCameraZ }, { x: 0, y: 0, z: 0 }, rendererCamera.fitTransitionMs)
    }
  }
  const fitGraphToWindow = useCallback(() => {
    wakeRenderer(rendererCamera.fitTransitionMs + 500)
    const graph = graphRef.current
    const visibleNodes = activeGraphData.nodes.filter((node) => Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z))
    if (!graph || visibleNodes.length === 0) return
    const camera = graph.camera()
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    const min = new THREE.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
    const max = new THREE.Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY)
    visibleNodes.forEach((node) => {
      const radius = Math.max(visual.nodeSize, selected?.id === node.id ? visual.selectedRingRadius + visual.selectedRingTube : 0, focused?.id === node.id ? visual.focusHaloRadius : 0)
      min.min(new THREE.Vector3((node.x ?? 0) - radius, (node.y ?? 0) - radius, (node.z ?? 0) - radius))
      max.max(new THREE.Vector3((node.x ?? 0) + radius, (node.y ?? 0) + radius, (node.z ?? 0) + radius))
    })
    const center = min.clone().add(max).multiplyScalar(.5)
    const viewDirection = camera.getWorldDirection(new THREE.Vector3()).normalize()
    if (viewDirection.lengthSq() === 0) viewDirection.set(0, 0, -1)
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
    if (right.lengthSq() === 0) right.set(1, 0, 0)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()

    const canvasWidth = Math.max(1, size.width)
    const canvasHeight = Math.max(1, size.height)
    const verticalTangent = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)
    const horizontalTangent = verticalTangent * (canvasWidth / canvasHeight)
    const horizontalUsable = Math.max(.1, 1 - 2 * rendererCamera.fitViewPadding / canvasWidth)
    const verticalUsable = Math.max(.1, 1 - 2 * rendererCamera.fitViewPadding / canvasHeight)
    const nodeRadius = (node: PaymentGraphNode) => Math.max(visual.nodeSize, selected?.id === node.id ? visual.selectedRingRadius + visual.selectedRingTube : 0, focused?.id === node.id ? visual.focusHaloRadius : 0)
    const requiredDistance = () => visibleNodes.reduce((distance, node) => {
      const radius = nodeRadius(node)
      const offset = new THREE.Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0).sub(center)
      const forwardOffset = offset.dot(viewDirection)
      return Math.max(
        distance,
        (Math.abs(offset.dot(right)) + radius) / (horizontalTangent * horizontalUsable) - forwardOffset,
        (Math.abs(offset.dot(up)) + radius) / (verticalTangent * verticalUsable) - forwardOffset,
        radius + camera.near * 2 - forwardOffset,
      )
    }, 0)

    for (let iteration = 0; iteration < 3; iteration += 1) {
      const distance = Math.max(requiredDistance() * rendererCamera.fitOrbitSafetyFactor, camera.near * 4)
      let minProjectedX = Number.POSITIVE_INFINITY; let maxProjectedX = Number.NEGATIVE_INFINITY
      let minProjectedY = Number.POSITIVE_INFINITY; let maxProjectedY = Number.NEGATIVE_INFINITY
      visibleNodes.forEach((node) => {
        const radius = nodeRadius(node)
        const offset = new THREE.Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0).sub(center)
        const depth = Math.max(camera.near, distance + offset.dot(viewDirection))
        const projectedX = offset.dot(right) / (depth * horizontalTangent)
        const projectedY = offset.dot(up) / (depth * verticalTangent)
        const projectedRadiusX = radius / (depth * horizontalTangent)
        const projectedRadiusY = radius / (depth * verticalTangent)
        minProjectedX = Math.min(minProjectedX, projectedX - projectedRadiusX); maxProjectedX = Math.max(maxProjectedX, projectedX + projectedRadiusX)
        minProjectedY = Math.min(minProjectedY, projectedY - projectedRadiusY); maxProjectedY = Math.max(maxProjectedY, projectedY + projectedRadiusY)
      })
      center.addScaledVector(right, (minProjectedX + maxProjectedX) / 2 * distance * horizontalTangent)
      center.addScaledVector(up, (minProjectedY + maxProjectedY) / 2 * distance * verticalTangent)
    }

    const safeDistance = Math.max(requiredDistance() * rendererCamera.fitOrbitSafetyFactor, camera.near * 4)
    const position = center.clone().addScaledVector(viewDirection, -safeDistance)
    graph.cameraPosition(position, center, rendererCamera.fitTransitionMs)
  }, [activeGraphData.nodes, focused?.id, rendererCamera.fitOrbitSafetyFactor, rendererCamera.fitTransitionMs, rendererCamera.fitViewPadding, selected?.id, size.height, size.width, visual.focusHaloRadius, visual.nodeSize, visual.selectedRingRadius, visual.selectedRingTube, wakeRenderer])
  const handleEngineStop = useCallback(() => {
    physicsActiveRef.current = false
    if (simulationStartedAt.current !== null) {
      const settleMs = Math.round(performance.now() - simulationStartedAt.current)
      simulationStartedAt.current = null
      setPerformanceDebug((current) => ({ ...current, settleMs }))
    }
    if (filterFitPending.current) {
      filterFitPending.current = false
      fitGraphToWindow()
      return
    }
    scheduleRendererIdlePause(500)
  }, [fitGraphToWindow, scheduleRendererIdlePause])
  const toggleRelation = (type: RelationType) => {
    wakeRenderer(800)
    filterFitPending.current = true
    setVisibleRelations((current) => {
      const next = new Set(current)
      if (next.has(type)) next.delete(type); else next.add(type)
      return next
    })
  }
  const updateTuning = <Domain extends keyof R2GraphTuningConfig>(domain: Domain, key: keyof R2GraphTuningConfig[Domain]) => (_event: Event, value: number | number[]) => {
    wakeRenderer(800)
    setTuning((current) => ({ ...current, [domain]: { ...current[domain], [key]: value as number } }))
    setConfigCopied(false)
  }
  const resetTuning = () => { wakeRenderer(800); setTuning(createDefaultR2GraphConfig()); setConfigCopied(false) }
  const updatePerformanceExperiment = (key: keyof R2PerformanceExperiments) => (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    wakeRenderer(800)
    setPerformanceExperiments((current) => ({ ...current, [key]: checked }))
  }
  const resetPerformanceExperiments = () => {
    wakeRenderer(800)
    setNodeRendererMode('standard')
    setLinkRendererMode('standard')
    setPerformanceExperiments(defaultPerformanceExperiments)
  }
  const copyTuning = async () => {
    await navigator.clipboard.writeText(JSON.stringify(tuning, null, 2))
    setConfigCopied(true)
  }

  const startImmediateNodeDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest('.r2-graph-toolbar, .r2-floating-panel, .r2-explore-hud, .r2-detail-overlay')) return
    wakeRenderer(1200)
    const graph = graphRef.current
    const canvas = graph?.renderer().domElement
    if (!graph || !canvas) return
    let node: DraggableNode | null = null

    if (nodeRendererMode === 'instanced') {
      node = instancedNodeLayerRef.current?.pick(graph.camera(), canvas, event.clientX, event.clientY) as DraggableNode | null
    } else {
      const bounds = canvas.getBoundingClientRect()
      const pointerX = event.clientX - bounds.left
      const pointerY = event.clientY - bounds.top
      const hitRadius = Math.max(visual.dragHitRadiusMin, Math.min(visual.dragHitRadiusMax, visual.nodeSize * visual.dragHitRadiusMultiplier))
      let nearest: { node: DraggableNode; distanceSquared: number } | null = null
      graphData.nodes.forEach((candidate) => {
        const screen = graph.graph2ScreenCoords(candidate.x ?? 0, candidate.y ?? 0, candidate.z ?? 0)
        const distanceSquared = (screen.x - pointerX) ** 2 + (screen.y - pointerY) ** 2
        if (distanceSquared <= hitRadius ** 2 && (!nearest || distanceSquared < nearest.distanceSquared)) nearest = { node: candidate, distanceSquared }
      })
      node = (nearest as { node: DraggableNode; distanceSquared: number } | null)?.node ?? null
    }

    if (!node) return
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    const cameraPosition = graph.camera().position
    const cameraDistance = cameraPosition.distanceTo(new THREE.Vector3(node.x ?? 0, node.y ?? 0, node.z ?? 0))
    draggedNodeRef.current = { node, cameraDistance, startX: event.clientX, startY: event.clientY, didDrag: false }
    const controls = graph.controls() as NavigationControls
    controls.enabled = false
    setPressedNode(node)
  }, [graphData.nodes, nodeRendererMode, visual.dragHitRadiusMax, visual.dragHitRadiusMin, visual.dragHitRadiusMultiplier, visual.nodeSize, wakeRenderer])

  useEffect(() => {
    const moveDraggedNode = (event: PointerEvent) => {
      const drag = draggedNodeRef.current
      const graph = graphRef.current
      const canvas = graph?.renderer().domElement
      if (!drag || !graph || !canvas) return
      if (!drag.didDrag) {
        const movement = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY)
        if (movement < rendererCamera.nodeDragThresholdPx) return
        drag.didDrag = true
        if (performanceExperiments.physicsSimulation) markSimulationStart('node-drag')
        drag.node.fx = drag.node.x ?? 0; drag.node.fy = drag.node.y ?? 0; drag.node.fz = drag.node.z ?? 0
      }
      const bounds = canvas.getBoundingClientRect()
      const point = graph.screen2GraphCoords(event.clientX - bounds.left, event.clientY - bounds.top, drag.cameraDistance)
      drag.node.fx = drag.node.x = point.x
      drag.node.fy = drag.node.y = point.y
      drag.node.fz = drag.node.z = point.z
      syncInstancedNodes()
      if (linkRendererMode === 'batched') batchedLinkLayerRef.current?.syncPositions(graphData.nodes)
      if (performanceExperiments.physicsSimulation) {
        try { graph.d3ReheatSimulation() } catch { /* simulation initialization retries on engine tick */ }
      }
    }
    const releaseDraggedNode = (cancelled = false) => {
      const drag = draggedNodeRef.current
      if (drag) {
        if (drag.didDrag) {
          delete drag.node.fx; delete drag.node.fy; delete drag.node.fz
        } else if (!cancelled) setSelected(drag.node)
        draggedNodeRef.current = null
        const graph = graphRef.current
        const controls = graph?.controls() as NavigationControls | undefined
        if (controls) controls.enabled = true
        if (drag.didDrag && performanceExperiments.physicsSimulation) try { graph?.d3ReheatSimulation() } catch { /* no active simulation */ }
        else scheduleRendererIdlePause(700)
      }
      setPressedNode(null)
    }
    const finishPointerGesture = () => releaseDraggedNode(false)
    const cancelPointerGesture = () => releaseDraggedNode(true)
    window.addEventListener('pointermove', moveDraggedNode)
    window.addEventListener('pointerup', finishPointerGesture)
    window.addEventListener('pointercancel', cancelPointerGesture)
    return () => {
      window.removeEventListener('pointermove', moveDraggedNode)
      window.removeEventListener('pointerup', finishPointerGesture)
      window.removeEventListener('pointercancel', cancelPointerGesture)
    }
  }, [graphData.nodes, linkRendererMode, markSimulationStart, performanceExperiments.physicsSimulation, rendererCamera.nodeDragThresholdPx, scheduleRendererIdlePause, syncInstancedNodes])

  const emptyNodeObject = useCallback(() => new THREE.Object3D(), [])

  const nodeDecoration = useCallback((node: PaymentGraphNode) => {
    const group = new THREE.Group()
    if (selected?.id === node.id) group.add(new THREE.Mesh(new THREE.TorusGeometry(visual.selectedRingRadius, visual.selectedRingTube, 8, 28), new THREE.MeshBasicMaterial({ color: '#ffffff' })))
    if (focused?.id === node.id) group.add(new THREE.Mesh(new THREE.SphereGeometry(visual.focusHaloRadius, 16, 12), new THREE.MeshBasicMaterial({ color: '#78b7ff', transparent: true, opacity: visual.focusHaloOpacity, wireframe: true })))
    if (selected?.id === node.id || focused?.id === node.id || emphasizedNode?.id === node.id) {
      const label = new SpriteText(node.title); label.color = '#ffffff'; label.textHeight = visual.labelTextHeight; label.position.set(0, visual.labelOffset, 0); group.add(label)
    }
    return group
  }, [emphasizedNode?.id, focused?.id, selected?.id, visual.focusHaloOpacity, visual.focusHaloRadius, visual.labelOffset, visual.labelTextHeight, visual.selectedRingRadius, visual.selectedRingTube])

  return <ThemeProvider theme={r2DarkTheme}><Box className="knowledge-workspace r2-workspace">
    <Box className="workspace-body">
      <Stack component="main" aria-labelledby="r2-heading" className="r2-graph-panel">
        <Box ref={canvasRef} className="r2-canvas-shell" onPointerDownCapture={startImmediateNodeDrag} onPointerMoveCapture={trackPointerPosition} onPointerLeave={clearCanvasHover} onWheelCapture={() => wakeRenderer(1200)}>
          <Box className="r2-canvas" role="application" tabIndex={0} aria-label={`Интерактивный трёхмерный граф ${sourceFixture.title}: вращение, масштабирование и перемещение камеры`}>
            {automatedBrowser ? <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: '#dbe9f8' }}><Typography>WebGL renderer отключён только в автоматизированном headless-тесте · {graphData.nodes.length} nodes · {activeGraphData.links.length} active edges</Typography></Box> : !webGL2Available ? <WebGLUnavailable /> : <WebGLErrorBoundary key={`${rendererRevision}:${datasetKey}`}><ForceGraph3D ref={graphRef} width={size.width} height={size.height} graphData={activeGraphData} cooldownTime={performanceExperiments.physicsSimulation ? 15000 : 0} controlType="trackball" rendererConfig={{ antialias: rendererCamera.antialias, alpha: false, powerPreference: 'high-performance' }} enableNavigationControls enableNodeDrag={false} showNavInfo={false} backgroundColor={rendererCamera.backgroundColor} nodeVal={() => 1} nodeRelSize={visual.nodeSize} nodeResolution={effectiveNodeResolution} nodeVisibility={nodeRendererMode === 'standard'} nodeColor={(node) => displayNodeColor(node as PaymentGraphNode)} nodeLabel={(node) => `${(node as PaymentGraphNode).title} · ${(node as PaymentGraphNode).area}`} nodeThreeObject={nodeRendererMode === 'standard' ? nodeDecoration : emptyNodeObject} nodeThreeObjectExtend={nodeRendererMode === 'standard'} linkVisibility={linkRendererMode === 'standard' && performanceExperiments.renderLinks} linkColor={(link) => displayLinkColor(link as PaymentGraphLink)} linkWidth={(link) => linkRendererMode === 'standard' && performanceExperiments.renderLinks ? displayLinkWidth(link as PaymentGraphLink) * effectiveLinkThickness : 0} linkResolution={rendererCamera.linkResolution} linkOpacity={visual.linkOpacity} linkDirectionalArrowLength={linkRendererMode === 'standard' && performanceExperiments.renderLinks ? effectiveArrowLength : 0} linkDirectionalArrowRelPos={1} linkDirectionalParticles={linkRendererMode === 'standard' && performanceExperiments.renderLinks ? effectiveParticleCount : 0} linkDirectionalParticleWidth={visual.particleSize} linkDirectionalParticleColor={(link) => graphRelationColors[(link as PaymentGraphLink).type] ?? '#7f8fa4'} onNodeHover={handleNodeHover} onEngineTick={handleEngineTick} onEngineStop={handleEngineStop} /></WebGLErrorBoundary>}
          </Box>

          <Box className="r2-title-hud">
            <Typography id="r2-heading" component="h1" variant="h6">{sourceFixture.title}</Typography>
            <Typography variant="caption">{sourceFixture.fixtureLabel}</Typography>
          </Box>

          <Box className="r2-explore-hud">
            <TextField label="Поиск концептов" size="small" value={query} onChange={(event) => setQuery(event.target.value)} />
            {results.length > 0 && <Paper className="r2-search-results" aria-label="Результаты поиска"><List dense disablePadding>{results.map((node) => <ListItem key={node.id} disablePadding><ListItemButton onClick={() => flyTo(node)}><ListItemText primary={node.title} secondary={`${node.kind} · ${node.area}`} /></ListItemButton></ListItem>)}</List></Paper>}
            <details className="r2-filter-section" open>
              <summary>Relations · {visibleRelations.size}/{allRelationTypes.length}</summary>
              <Box className="r2-relation-filter-list">{allRelationTypes.map((type) => <FormControlLabel key={type} control={<Checkbox size="small" checked={visibleRelations.has(type)} onChange={() => toggleRelation(type)} />} label={<Box className="r2-relation-filter-label"><span className="r2-relation-swatch" style={{ background: graphRelationColors[type] ?? '#7f8fa4' }} aria-hidden="true" /><Typography component="span" variant="body2">{type}</Typography></Box>} />)}</Box>
            </details>
          </Box>

          <Box className="r2-graph-toolbar" role="toolbar" aria-label="Управление графом">
            {enableStorybookTuning && <Tooltip title="Настройки графа"><IconButton size="small" aria-label="Настройки графа" aria-expanded={activeOverlay === 'settings'} aria-controls="r2-settings-panel" onClick={() => setActiveOverlay('settings')}><span aria-hidden="true">⚙</span></IconButton></Tooltip>}
            <Tooltip title="Легенда"><IconButton size="small" aria-label="Легенда" aria-expanded={activeOverlay === 'legend'} aria-controls="r2-legend-panel" onClick={() => setActiveOverlay('legend')}><svg className="r2-legend-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="6" r="2" fill="#4f8df7"/><circle cx="5" cy="12" r="2" fill="#22a06b"/><circle cx="5" cy="18" r="2" fill="#e06c75"/><path d="M10 6h9M10 12h9M10 18h9"/></svg></IconButton></Tooltip>
            <Tooltip title="Вписать граф"><IconButton size="small" aria-label="Вписать граф" onClick={fitGraphToWindow}><svg className="r2-fit-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4H4v4M16 4h4v4M20 16v4h-4M8 20H4v-4"/></svg></IconButton></Tooltip>
            <Tooltip title="Сбросить камеру"><IconButton size="small" aria-label="Сбросить камеру" onClick={resetCamera}><span aria-hidden="true">↶</span></IconButton></Tooltip>
          </Box>

          {activeOverlay === 'settings' && enableStorybookTuning && <Paper id="r2-settings-panel" className="r2-floating-panel" elevation={8}>
            <Box className="r2-floating-panel-heading"><Typography component="h2" variant="subtitle1">Настройки графа</Typography><Typography variant="caption">Storybook live tuning</Typography></Box>

            <details className="r2-settings-section">
              <summary>Visual</summary>
              <Box className="r2-settings-section-body">{([
                ['nodeDimOpacity', 'Node dim opacity', .2, 1, .05], ['linkDimOpacity', 'Link dim opacity', .2, 1, .05], ['highlightIntensity', 'Highlight intensity', 1, 1.8, .05], ['hoverTransitionInMs', 'Highlight fade-in (ms)', 0, 2000, 50], ['hoverTransitionOutMs', 'Highlight fade-out (ms)', 0, 2500, 50], ['hoverLeaveDelayMs', 'Hover leave delay (ms)', 0, 500, 20], ['nodeSize', 'Node size', 2, 8, .5], ['linkThickness', 'Link thickness', .25, 3, .25], ['particleSize', 'Particle size', 0, 3, .25], ['particleCount', 'Particle count', 0, 4, 1],
              ] as const).map(([key, label, min, max, step]) => <Box key={key}><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">{label}</Typography><Typography variant="caption">{visual[key]}</Typography></Stack><Slider size="small" aria-label={label} value={visual[key]} min={min} max={max} step={step} onChange={updateTuning('visual', key)} /></Box>)}</Box>
            </details>

            <details className="r2-settings-section">
              <summary>Physics</summary>
              <Box className="r2-settings-section-body">{([['centerForce', 'Center force', 0, 2, .1], ['repelForce', 'Repel force', 0, 240, 10], ['linkForce', 'Link force', 0, 2, .1], ['linkDistance', 'Link distance', 10, 120, 5]] as const).map(([key, label, min, max, step]) => <Box key={key}><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">{label}</Typography><Typography variant="caption">{physics[key]}</Typography></Stack><Slider size="small" aria-label={label} value={physics[key]} min={min} max={max} step={step} onChange={updateTuning('physics', key)} /></Box>)}</Box>
            </details>

            <details className="r2-settings-section" open>
              <summary>Performance experiments</summary>
              <Stack spacing={0} className="r2-settings-section-body">
                <FormControlLabel control={<Switch size="small" checked={nodeRendererMode === 'instanced'} onChange={(_event, checked) => setNodeRendererMode(checked ? 'instanced' : 'standard')} />} label="Instanced nodes" />
                <FormControlLabel control={<Switch size="small" checked={linkRendererMode === 'batched'} onChange={(_event, checked) => setLinkRendererMode(checked ? 'batched' : 'standard')} />} label="Batched links" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.renderParticles} disabled={linkRendererMode === 'batched'} onChange={updatePerformanceExperiment('renderParticles')} />} label="Mass particles" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.renderArrows} onChange={updatePerformanceExperiment('renderArrows')} />} label="Arrowheads" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.lowPolyNodes} onChange={updatePerformanceExperiment('lowPolyNodes')} />} label="Low-poly nodes (resolution 8)" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.thinLineLinks} disabled={linkRendererMode === 'batched'} onChange={updatePerformanceExperiment('thinLineLinks')} />} label="Thin-line links (standard renderer)" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.renderLinks} onChange={updatePerformanceExperiment('renderLinks')} />} label="Render links" />
                <FormControlLabel control={<Switch size="small" checked={performanceExperiments.physicsSimulation} onChange={updatePerformanceExperiment('physicsSimulation')} />} label="Physics simulation" />
                <Button size="small" variant="outlined" onClick={resetPerformanceExperiments}>Reset experiments</Button>
              </Stack>
            </details>

            <details className="r2-settings-section">
              <summary>Renderer / camera</summary>
              <Box className="r2-settings-section-body">
                <Box><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">Fit-view padding</Typography><Typography variant="caption">{rendererCamera.fitViewPadding}</Typography></Stack><Slider size="small" aria-label="Fit-view padding" value={rendererCamera.fitViewPadding} min={0} max={64} step={2} onChange={updateTuning('rendererCamera', 'fitViewPadding')} /></Box>
                <Box><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">Focus transition (ms)</Typography><Typography variant="caption">{rendererCamera.focusTransitionMs}</Typography></Stack><Slider size="small" aria-label="Focus transition" value={rendererCamera.focusTransitionMs} min={200} max={4000} step={100} onChange={updateTuning('rendererCamera', 'focusTransitionMs')} /></Box>
                <Box><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">Rotation damping</Typography><Typography variant="caption">{rendererCamera.rotationDampingFactor}</Typography></Stack><Slider size="small" aria-label="Rotation damping" value={rendererCamera.rotationDampingFactor} min={.02} max={.5} step={.01} onChange={updateTuning('rendererCamera', 'rotationDampingFactor')} /></Box>
                <Box><Stack direction="row" sx={{ justifyContent: 'space-between' }}><Typography variant="caption">Zoom speed</Typography><Typography variant="caption">{rendererCamera.zoomSpeed}</Typography></Stack><Slider size="small" aria-label="Zoom speed" value={rendererCamera.zoomSpeed} min={.1} max={2} step={.05} onChange={updateTuning('rendererCamera', 'zoomSpeed')} /></Box>
              </Box>
            </details>

            <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: .5 }}><Button size="small" variant="outlined" onClick={resetTuning}>Reset defaults</Button><Button size="small" variant="outlined" onClick={copyTuning}>{configCopied ? 'Copied' : 'Copy config'}</Button></Stack>
            <Divider />
            <Button className="r2-debug-toggle" size="small" variant="text" aria-expanded={diagnosticsOpen} aria-controls="r2-developer-diagnostics" onClick={() => setDiagnosticsOpen((open) => !open)}>{diagnosticsOpen ? '▾' : '▸'} Developer diagnostics</Button>
            {diagnosticsOpen && <Box id="r2-developer-diagnostics" className="r2-developer-diagnostics"><span>Nodes {graphData.nodes.length}</span><span>Edges {activeGraphData.links.length}/{graphData.links.length}</span>{sourceFixture.source && <><span>Dataset {sourceFixture.source.sourceMode}</span><span>Snapshot {sourceFixture.source.contentHash}</span></>}<span>Node mode {nodeRendererMode}</span><span>Link mode {linkRendererMode}</span><span>Particles {linkRendererMode === 'batched' ? 'off' : (performanceExperiments.renderParticles ? 'on' : 'off')}</span><span>Arrows {performanceExperiments.renderArrows ? 'on' : 'off'}</span><span>Node res {effectiveNodeResolution}</span><span>Links {performanceExperiments.renderLinks ? 'on' : 'off'}</span><span>Physics {performanceExperiments.physicsSimulation ? 'on' : 'off'}</span><span>Renderer {performanceDebug.rendererPaused ? 'paused' : 'running'}</span><span>RAF {performanceDebug.rafFps || '—'} fps</span><span>Draw calls {performanceDebug.drawCalls || '—'}</span><span>Triangles {performanceDebug.triangles || '—'}</span><span>Settle {performanceDebug.settleMs === null ? 'running' : `${performanceDebug.settleMs} ms`}</span><span>Reheat {performanceDebug.lastReheatReason}</span><span>CSS {renderDebug.cssWidth || size.width}×{renderDebug.cssHeight || size.height}</span><span>Buffer {renderDebug.bufferWidth || '—'}×{renderDebug.bufferHeight || '—'}</span><span>DPR {devicePixelRatio.toFixed(2)}</span><span>Renderer {renderDebug.rendererPixelRatio ? renderDebug.rendererPixelRatio.toFixed(2) : targetPixelRatio.toFixed(2)}</span></Box>}
          </Paper>}

          {activeOverlay === 'legend' && <Paper id="r2-legend-panel" className="r2-floating-panel" elevation={8}><Typography component="h2" variant="subtitle1">{usingKnowledgeGraph ? 'Source metadata groups' : 'Area legend'}</Typography><Box className="r2-legend">{Object.entries(graphAreaColors).map(([area, color]) => <Box key={area} sx={{ display: 'contents' }}><span className="r2-swatch" style={{ background: color }} /><Typography variant="caption">{area}</Typography></Box>)}</Box></Paper>}

          {selected && <Paper className={`r2-detail-overlay${activeOverlay ? ' r2-detail-overlay--with-utility' : ''}`} elevation={6}>
            <Box className="r2-detail-heading"><Box><Typography component="h2" variant="subtitle1">{selected.title}</Typography><Typography variant="caption">{selected.kind} · {selected.area}</Typography></Box><IconButton size="small" aria-label="Закрыть детали" onClick={() => setSelected(null)}>×</IconButton></Box>
            {selectedDocument && sourceFixture.source
              ? <KnowledgeCardDetail
                  card={selectedDocument}
                  revision={sourceFixture.source.revision}
                  canNavigateTo={(slug) => sourceFixture.documentsBySlug.has(slug)}
                  onNavigateTo={navigateToDocument}
                />
              : <Typography variant="body2">{selected.description}</Typography>}
            <Button variant="outlined" size="small" onClick={() => flyTo(selected)}>Фокусировать</Button>
          </Paper>}

          <Box className="r2-overlay">{focused && <Chip size="small" label={`Фокус: ${focused.title}`} />}{selected && <Chip size="small" label={`Выбрано: ${selected.title}`} />}{emphasizedNode && <Chip size="small" label={`${pressedNode ? 'Удерживается' : 'Наведено'}: ${emphasizedNode.title}`} />}</Box>
        </Box>
      </Stack>
    </Box>
  </Box></ThemeProvider>
}
