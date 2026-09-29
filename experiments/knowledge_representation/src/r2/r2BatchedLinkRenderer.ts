import * as THREE from 'three'
import type { PaymentGraphLink, PaymentGraphNode, RelationType } from './paymentGraphFixture'

interface RelationBatch {
  links: PaymentGraphLink[]
  lineGeometry: THREE.BufferGeometry
  linePositions: THREE.BufferAttribute
  lineColors: THREE.BufferAttribute
  lineMaterial: THREE.LineBasicMaterial
  lines: THREE.LineSegments
  arrowGeometry: THREE.ConeGeometry
  arrowMaterial: THREE.MeshBasicMaterial
  arrows: THREE.InstancedMesh
}

export interface R2BatchedLinkLayer {
  root: THREE.Group
  syncPositions: (nodes: PaymentGraphNode[]) => void
  syncColors: (colorForLink: (link: PaymentGraphLink) => string) => void
  dispose: () => void
}

export function createR2BatchedLinkLayer(
  nodes: PaymentGraphNode[],
  links: PaymentGraphLink[],
  relationColors: Partial<Record<RelationType, string>>,
  options: { opacity: number; arrowLength: number; nodeRadius: number; showArrows: boolean },
): R2BatchedLinkLayer {
  const root = new THREE.Group()
  root.name = 'r2-batched-links'
  const batches: RelationBatch[] = []
  const relationTypes = Object.keys(relationColors) as RelationType[]
  const yAxis = new THREE.Vector3(0, 1, 0)
  const direction = new THREE.Vector3()
  const sourcePosition = new THREE.Vector3()
  const targetPosition = new THREE.Vector3()
  const arrowPosition = new THREE.Vector3()
  const quaternion = new THREE.Quaternion()
  const matrix = new THREE.Matrix4()
  const scale = new THREE.Vector3(1, 1, 1)
  const color = new THREE.Color()
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  let pendingPositionFrame: number | null = null

  relationTypes.forEach((type) => {
    const relationLinks = links.filter((link) => link.type === type)
    if (relationLinks.length === 0) return

    const linePositions = new THREE.BufferAttribute(new Float32Array(relationLinks.length * 2 * 3), 3)
    linePositions.setUsage(THREE.DynamicDrawUsage)
    const lineColors = new THREE.BufferAttribute(new Float32Array(relationLinks.length * 2 * 3), 3)
    lineColors.setUsage(THREE.DynamicDrawUsage)

    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', linePositions)
    lineGeometry.setAttribute('color', lineColors)
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: options.opacity,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    lines.name = `r2-batched-links-${type}`
    lines.frustumCulled = false

    const arrowGeometry = new THREE.ConeGeometry(Math.max(.8, options.arrowLength * .36), Math.max(1.5, options.arrowLength), 5)
    const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: options.opacity })
    const arrows = new THREE.InstancedMesh(arrowGeometry, arrowMaterial, relationLinks.length)
    arrows.name = `r2-batched-arrows-${type}`
    arrows.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    arrows.frustumCulled = false
    arrows.visible = options.showArrows

    root.add(lines, arrows)
    batches.push({ links: relationLinks, lineGeometry, linePositions, lineColors, lineMaterial, lines, arrowGeometry, arrowMaterial, arrows })
  })

  const resolveNode = (endpoint: string | PaymentGraphNode) => typeof endpoint === 'object' ? endpoint : nodesById.get(endpoint)

  const performPositionSync = () => {
    batches.forEach((batch) => {
      batch.links.forEach((link, index) => {
        const source = resolveNode(link.source)
        const target = resolveNode(link.target)
        if (!source || !target) return

        sourcePosition.set(source.x ?? 0, source.y ?? 0, source.z ?? 0)
        targetPosition.set(target.x ?? 0, target.y ?? 0, target.z ?? 0)
        batch.linePositions.setXYZ(index * 2, sourcePosition.x, sourcePosition.y, sourcePosition.z)
        batch.linePositions.setXYZ(index * 2 + 1, targetPosition.x, targetPosition.y, targetPosition.z)

        if (!options.showArrows) return

        direction.subVectors(targetPosition, sourcePosition)
        const length = direction.length()
        if (length < .001) {
          matrix.makeScale(0, 0, 0)
          batch.arrows.setMatrixAt(index, matrix)
          return
        }

        direction.multiplyScalar(1 / length)
        quaternion.setFromUnitVectors(yAxis, direction)
        const targetClearance = Math.min(options.nodeRadius + options.arrowLength * .55, length * .35)
        arrowPosition.copy(targetPosition).addScaledVector(direction, -targetClearance)
        matrix.compose(arrowPosition, quaternion, scale)
        batch.arrows.setMatrixAt(index, matrix)
      })
      batch.linePositions.needsUpdate = true
      if (options.showArrows) batch.arrows.instanceMatrix.needsUpdate = true
    })
  }

  const syncPositions = (_liveNodes: PaymentGraphNode[]) => {
    if (pendingPositionFrame !== null) return
    pendingPositionFrame = requestAnimationFrame(() => {
      pendingPositionFrame = null
      performPositionSync()
    })
  }

  const syncColors = (colorForLink: (link: PaymentGraphLink) => string) => {
    batches.forEach((batch) => {
      batch.links.forEach((link, index) => {
        color.set(colorForLink(link))
        batch.lineColors.setXYZ(index * 2, color.r, color.g, color.b)
        batch.lineColors.setXYZ(index * 2 + 1, color.r, color.g, color.b)
        batch.arrows.setColorAt(index, color)
      })
      batch.lineColors.needsUpdate = true
      if (batch.arrows.instanceColor) batch.arrows.instanceColor.needsUpdate = true
    })
  }

  const dispose = () => {
    if (pendingPositionFrame !== null) {
      cancelAnimationFrame(pendingPositionFrame)
      pendingPositionFrame = null
    }
    batches.forEach((batch) => {
      batch.lineGeometry.dispose()
      batch.lineMaterial.dispose()
      batch.arrowGeometry.dispose()
      batch.arrowMaterial.dispose()
    })
  }

  performPositionSync()
  syncColors((link) => relationColors[link.type] ?? '#7f8fa4')

  return { root, syncPositions, syncColors, dispose }
}
