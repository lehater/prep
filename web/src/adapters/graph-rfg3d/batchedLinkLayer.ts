import * as THREE from "three";

import type { Rfg3dLink, Rfg3dNode } from "./rendererGraphData";

function endpointId(endpoint: Rfg3dLink["source"]): string {
  return typeof endpoint === "string" ? endpoint : endpoint.id;
}

export interface BatchedLinkLayer {
  readonly object: THREE.LineSegments;
  sync(
    nodes: readonly Rfg3dNode[],
    links: readonly Rfg3dLink[],
    colorFor: (link: Rfg3dLink) => string,
  ): void;
  dispose(): void;
}

export function createBatchedLinkLayer(
  links: readonly Rfg3dLink[],
): BatchedLinkLayer {
  const positions = new Float32Array(Math.max(1, links.length) * 6);
  const colors = new Float32Array(Math.max(1, links.length) * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setDrawRange(0, links.length * 2);
  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
  });
  const object = new THREE.LineSegments(geometry, material);
  object.frustumCulled = false;
  const color = new THREE.Color();

  return {
    object,
    sync(nodes, activeLinks, colorFor) {
      const nodesById = new Map(nodes.map((node) => [node.id, node]));
      const position = geometry.getAttribute("position") as THREE.BufferAttribute;
      const colorAttribute = geometry.getAttribute("color") as THREE.BufferAttribute;
      const maxLinks = Math.min(activeLinks.length, Math.floor(position.count / 2));

      activeLinks.slice(0, maxLinks).forEach((link, index) => {
        const source = nodesById.get(endpointId(link.source));
        const target = nodesById.get(endpointId(link.target));
        const offset = index * 2;
        position.setXYZ(offset, source?.x ?? 0, source?.y ?? 0, source?.z ?? 0);
        position.setXYZ(
          offset + 1,
          target?.x ?? 0,
          target?.y ?? 0,
          target?.z ?? 0,
        );
        color.set(colorFor(link));
        colorAttribute.setXYZ(offset, color.r, color.g, color.b);
        colorAttribute.setXYZ(offset + 1, color.r, color.g, color.b);
      });

      geometry.setDrawRange(0, maxLinks * 2);
      position.needsUpdate = true;
      colorAttribute.needsUpdate = true;
      geometry.computeBoundingSphere();
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
