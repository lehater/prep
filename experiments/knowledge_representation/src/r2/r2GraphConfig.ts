export interface R2GraphTuningConfig {
  visual: {
    nodeDimOpacity: number
    linkDimOpacity: number
    highlightIntensity: number
    hoverTransitionInMs: number
    hoverTransitionOutMs: number
    hoverLeaveDelayMs: number
    nodeSize: number
    linkThickness: number
    particleSize: number
    particleCount: number
    baseLinkWidth: number
    highlightedLinkWidth: number
    dimmedLinkWidth: number
    linkOpacity: number
    selectedRingRadius: number
    selectedRingTube: number
    focusHaloRadius: number
    focusHaloOpacity: number
    labelTextHeight: number
    labelOffset: number
    dragHitRadiusMin: number
    dragHitRadiusMax: number
    dragHitRadiusMultiplier: number
  }
  physics: {
    centerForce: number
    repelForce: number
    linkForce: number
    linkDistance: number
  }
  rendererCamera: {
    antialias: boolean
    maxPixelRatio: number
    nodeResolution: number
    linkResolution: number
    fitViewPadding: number
    fitOrbitSafetyFactor: number
    fitTransitionMs: number
    focusTransitionMs: number
    nodeDragThresholdPx: number
    rotationDampingFactor: number
    zoomSpeed: number
    backgroundColor: string
    initialCamera: { x: number; y: number; z: number }
  }
}

export const defaultR2GraphConfig: R2GraphTuningConfig = {
  visual: {
    nodeDimOpacity: .78,
    linkDimOpacity: .65,
    highlightIntensity: 1.3,
    hoverTransitionInMs: 900,
    hoverTransitionOutMs: 1400,
    hoverLeaveDelayMs: 120,
    nodeSize: 4,
    linkThickness: 1,
    particleSize: .8,
    particleCount: 1,
    baseLinkWidth: 1,
    highlightedLinkWidth: 3,
    dimmedLinkWidth: .7,
    linkOpacity: .78,
    selectedRingRadius: 6.4,
    selectedRingTube: .8,
    focusHaloRadius: 8.5,
    focusHaloOpacity: .18,
    labelTextHeight: 4.5,
    labelOffset: 10,
    dragHitRadiusMin: 10,
    dragHitRadiusMax: 18,
    dragHitRadiusMultiplier: 2.5,
  },
  physics: {
    centerForce: 1,
    repelForce: 90,
    linkForce: 1,
    linkDistance: 38,
  },
  rendererCamera: {
    antialias: true,
    maxPixelRatio: 2,
    nodeResolution: 16,
    linkResolution: 8,
    fitViewPadding: 20,
    fitOrbitSafetyFactor: 1.045,
    fitTransitionMs: 500,
    focusTransitionMs: 3600,
    nodeDragThresholdPx: 5,
    rotationDampingFactor: .12,
    zoomSpeed: .5,
    backgroundColor: '#0b1220',
    initialCamera: { x: 0, y: 0, z: 1000 },
  },
}

export function createDefaultR2GraphConfig(): R2GraphTuningConfig {
  return {
    visual: { ...defaultR2GraphConfig.visual },
    physics: { ...defaultR2GraphConfig.physics },
    rendererCamera: { ...defaultR2GraphConfig.rendererCamera, initialCamera: { ...defaultR2GraphConfig.rendererCamera.initialCamera } },
  }
}
