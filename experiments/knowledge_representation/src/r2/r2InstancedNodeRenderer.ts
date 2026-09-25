import * as THREE from 'three'
import type { PaymentGraphNode } from './paymentGraphFixture'

export interface R2InstancedNodeLayer {
  mesh: THREE.InstancedMesh
  syncPositions: (nodes: PaymentGraphNode[]) => void
  syncColors: (nodes: PaymentGraphNode[], colorForNode: (node: PaymentGraphNode) => string) => void
  pick: (camera: THREE.Camera, canvas: HTMLCanvasElement, clientX: number, clientY: number) => PaymentGraphNode | null
  dispose: () => void
}

export function createR2InstancedNodeLayer(nodeCount: number, radius: number, resolution: number): R2InstancedNodeLayer {
  const widthSegments = Math.max(6, resolution)
  const heightSegments = Math.max(4, Math.floor(resolution * .75))
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: .75,
  })
  const mesh = new THREE.InstancedMesh(geometry, material, nodeCount)
  mesh.name = 'r2-instanced-nodes'
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1_000_000)

  const matrix = new THREE.Matrix4()
  const color = new THREE.Color()
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let liveNodes: PaymentGraphNode[] = []

  const syncPositions = (nodes: PaymentGraphNode[]) => {
    liveNodes = nodes
    nodes.forEach((node, index) => {
      matrix.makeTranslation(node.x ?? 0, node.y ?? 0, node.z ?? 0)
      mesh.setMatrixAt(index, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  const syncColors = (nodes: PaymentGraphNode[], colorForNode: (node: PaymentGraphNode) => string) => {
    liveNodes = nodes
    nodes.forEach((node, index) => mesh.setColorAt(index, color.set(colorForNode(node))))
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  const pick = (camera: THREE.Camera, canvas: HTMLCanvasElement, clientX: number, clientY: number) => {
    const bounds = canvas.getBoundingClientRect()
    pointer.x = ((clientX - bounds.left) / bounds.width) * 2 - 1
    pointer.y = -((clientY - bounds.top) / bounds.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObject(mesh, false)[0]
    const instanceId = hit?.instanceId
    return instanceId === undefined ? null : liveNodes[instanceId] ?? null
  }

  const dispose = () => {
    geometry.dispose()
    material.dispose()
  }

  return { mesh, syncPositions, syncColors, pick, dispose }
}
