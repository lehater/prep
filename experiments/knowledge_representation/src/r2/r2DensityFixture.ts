import { paymentGraphData, relationColors, type PaymentGraphLink, type PaymentGraphNode, type PaymentRelationType } from './paymentGraphFixture'

export type R2DensityTier = 60 | 250 | 1000

const relationTypes = Object.keys(relationColors) as PaymentRelationType[]
const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function stressNode(base: PaymentGraphNode, index: number, nodeCount: number): PaymentGraphNode {
  if (index < paymentGraphData.nodes.length) return { ...base }

  const copyIndex = Math.floor(index / paymentGraphData.nodes.length)
  const normalizedZ = 1 - 2 * ((index + .5) / nodeCount)
  const radial = 180 * Math.sqrt(Math.max(0, 1 - normalizedZ * normalizedZ))
  const angle = index * goldenAngle

  return {
    ...base,
    id: `${base.id}-stress-${copyIndex}`,
    title: `${base.title} · stress ${copyIndex}`,
    description: `Synthetic renderer-stress copy of provisional concept: ${base.title}.`,
    x: Math.cos(angle) * radial,
    y: Math.sin(angle) * radial,
    z: normalizedZ * 180,
  }
}

export function createPaymentGraphDensityFixture(nodeCount: R2DensityTier) {
  if (nodeCount === paymentGraphData.nodes.length) {
    return {
      nodes: paymentGraphData.nodes.map((node) => ({ ...node })),
      links: paymentGraphData.links.map((link) => ({ ...link })),
    }
  }

  const nodes: PaymentGraphNode[] = Array.from({ length: nodeCount }, (_, index) => {
    const base = paymentGraphData.nodes[index % paymentGraphData.nodes.length]
    return stressNode(base, index, nodeCount)
  })

  const links: PaymentGraphLink[] = nodes.flatMap((node, index) => {
    const ringTarget = nodes[(index + 1) % nodes.length]
    const linksForNode: PaymentGraphLink[] = [{
      id: `stress-ring-${index}`,
      source: node.id,
      target: ringTarget.id,
      type: relationTypes[index % relationTypes.length],
    }]

    if (index % 2 === 0) {
      const stride = Math.max(11, Math.floor(nodeCount / 17))
      const crossTarget = nodes[(index + stride) % nodes.length]
      linksForNode.push({
        id: `stress-cross-${index}`,
        source: node.id,
        target: crossTarget.id,
        type: relationTypes[(index + 2) % relationTypes.length],
      })
    }

    return linksForNode
  })

  return { nodes, links }
}
