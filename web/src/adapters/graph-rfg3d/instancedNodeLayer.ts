import * as THREE from "three";

import type { Rfg3dNode } from "./rendererGraphData";

export interface InstancedNodeLayer {
  readonly object: THREE.InstancedMesh;
  sync(
    nodes: readonly Rfg3dNode[],
    colorFor: (node: Rfg3dNode) => string,
  ): void;
  dispose(): void;
}

export function createInstancedNodeLayer(
  count: number,
  nodeResolution: number,
): InstancedNodeLayer {
  const geometry = new THREE.SphereGeometry(
    4,
    Math.max(6, nodeResolution),
    Math.max(4, Math.floor(nodeResolution / 2)),
  );
  const material = new THREE.MeshBasicMaterial({ vertexColors: true });
  const object = new THREE.InstancedMesh(geometry, material, Math.max(1, count));
  object.count = count;
  object.frustumCulled = false;
  object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  const transform = new THREE.Object3D();
  const color = new THREE.Color();

  return {
    object,
    sync(nodes, colorFor) {
      object.count = Math.min(nodes.length, object.instanceMatrix.count);
      nodes.slice(0, object.count).forEach((node, index) => {
        transform.position.set(node.x ?? 0, node.y ?? 0, node.z ?? 0);
        transform.updateMatrix();
        object.setMatrixAt(index, transform.matrix);
        object.setColorAt(index, color.set(colorFor(node)));
      });
      object.instanceMatrix.needsUpdate = true;
      if (object.instanceColor) {
        object.instanceColor.needsUpdate = true;
      }
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
