import * as THREE from 'three'
import SpriteText from 'three-spritetext'
import type { PaymentGraphNode } from './paymentGraphFixture'

export interface R2InstancedInteractionVisual {
  selectedRingRadius: number
  selectedRingTube: number
  focusHaloRadius: number
  focusHaloOpacity: number
  labelTextHeight: number
  labelOffset: number
}

interface InteractionEntry {
  node: PaymentGraphNode
  group: THREE.Group
}

export interface R2InstancedInteractionLayer {
  root: THREE.Group
  configure: (
    nodes: PaymentGraphNode[],
    state: { selectedId: string | null; focusedId: string | null; emphasizedId: string | null },
    visual: R2InstancedInteractionVisual,
  ) => void
  syncPositions: () => void
  dispose: () => void
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const candidate = child as THREE.Mesh
    candidate.geometry?.dispose?.()
    const material = candidate.material as THREE.Material | THREE.Material[] | undefined
    if (Array.isArray(material)) material.forEach((item) => item.dispose())
    else material?.dispose?.()
  })
}

export function createR2InstancedInteractionLayer(): R2InstancedInteractionLayer {
  const root = new THREE.Group()
  root.name = 'r2-instanced-interaction-layer'
  const entries = new Map<string, InteractionEntry>()

  const clear = () => {
    root.children.slice().forEach((child) => {
      root.remove(child)
      disposeObject(child)
    })
    entries.clear()
  }

  const configure = (
    nodes: PaymentGraphNode[],
    state: { selectedId: string | null; focusedId: string | null; emphasizedId: string | null },
    visual: R2InstancedInteractionVisual,
  ) => {
    clear()
    const nodesById = new Map(nodes.map((node) => [node.id, node]))
    const ids = new Set([state.selectedId, state.focusedId, state.emphasizedId].filter((id): id is string => Boolean(id)))

    ids.forEach((id) => {
      const node = nodesById.get(id)
      if (!node) return

      const group = new THREE.Group()
      group.name = `r2-instanced-interaction-${id}`

      if (state.selectedId === id) {
        group.add(new THREE.Mesh(
          new THREE.TorusGeometry(visual.selectedRingRadius, visual.selectedRingTube, 8, 28),
          new THREE.MeshBasicMaterial({ color: '#ffffff' }),
        ))
      }

      if (state.focusedId === id) {
        group.add(new THREE.Mesh(
          new THREE.SphereGeometry(visual.focusHaloRadius, 16, 12),
          new THREE.MeshBasicMaterial({ color: '#78b7ff', transparent: true, opacity: visual.focusHaloOpacity, wireframe: true }),
        ))
      }

      const label = new SpriteText(node.title)
      label.color = '#ffffff'
      label.textHeight = visual.labelTextHeight
      label.position.set(0, visual.labelOffset, 0)
      group.add(label)

      root.add(group)
      entries.set(id, { node, group })
    })

    syncPositions()
  }

  const syncPositions = () => {
    entries.forEach(({ node, group }) => group.position.set(node.x ?? 0, node.y ?? 0, node.z ?? 0))
  }

  const dispose = () => {
    clear()
  }

  return { root, configure, syncPositions, dispose }
}
