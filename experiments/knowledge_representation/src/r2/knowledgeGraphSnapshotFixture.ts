import type { PaymentGraphLink, PaymentGraphNode } from './paymentGraphFixture'
import { knowledgeGraphSnapshot } from './generated/knowledgeGraphSnapshot'
import type { KnowledgeGraphSnapshotCard } from './knowledgeGraphSnapshotModel'

const palette = [
  '#4f8df7', '#22a06b', '#8b6bd9', '#d19a3d', '#29a3b4', '#e06c75',
  '#6aa9ff', '#64c28a', '#a88be0', '#e3b04b', '#56b8c7', '#e879a7',
]

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function visualGroup(card: KnowledgeGraphSnapshotCard) {
  if (card.areas.length > 0) return `area:${card.areas[0]}`
  if (card.kind) return `kind:${card.kind}`
  return 'unclassified'
}

function groupColors(cards: KnowledgeGraphSnapshotCard[]) {
  const groups = [...new Set(cards.map(visualGroup))].sort((a, b) => a.localeCompare(b))
  return Object.fromEntries(groups.map((group, index) => [group, palette[index % palette.length]])) as Record<string, string>
}

const cards = knowledgeGraphSnapshot.cards
const bySlug = new Map(cards.map((card) => [card.slug, card]))
const areaColors = groupColors(cards)
const relationColors = { wikilink: '#9aadc2' } as const
const authoredLinkCount = cards.reduce((total, card) => total + card.outgoing.length, 0)
const radius = Math.max(150, Math.min(360, 120 + Math.sqrt(Math.max(1, cards.length)) * 7))

const nodes: PaymentGraphNode[] = cards.map((card, index) => {
  const normalizedZ = 1 - 2 * ((index + .5) / cards.length)
  const radial = radius * Math.sqrt(Math.max(0, 1 - normalizedZ * normalizedZ))
  const angle = index * goldenAngle
  return {
    id: card.id,
    title: card.name,
    kind: card.kind ?? 'Concept Card',
    area: visualGroup(card),
    description: card.description,
    sourcePath: card.sourcePath,
    x: Math.cos(angle) * radial,
    y: Math.sin(angle) * radial,
    z: normalizedZ * radius,
  }
})

const nodeIdBySlug = new Map(cards.map((card) => [card.slug, card.id]))
const seen = new Set<string>()
let unresolvedLinkCount = 0

const links: PaymentGraphLink[] = cards.flatMap((card) => card.outgoing.flatMap((targetSlug) => {
  const source = card.id
  const target = nodeIdBySlug.get(targetSlug)
  if (!target) {
    unresolvedLinkCount += 1
    return []
  }

  const key = `${source}->${target}`
  if (seen.has(key)) return []
  seen.add(key)
  return [{
    id: `kg-wikilink-${card.slug}-${targetSlug}`,
    source,
    target,
    type: 'wikilink' as const,
  }]
}))

export const knowledgeGraphSnapshotFixture = {
  title: 'Knowledge Graph · Snapshot',
  fixtureLabel: `${knowledgeGraphSnapshot.sourceMode === 'local' ? 'Local Knowledge Graph' : 'Fallback snapshot'} · ${nodes.length} cards · ${links.length}/${authoredLinkCount} materialized wikilinks · ${unresolvedLinkCount} unresolved · ${knowledgeGraphSnapshot.contentHash}`,
  nodes,
  links,
  areaColors,
  relationColors,
  documentsById: new Map(cards.map((card) => [card.id, card])),
  documentsBySlug: bySlug,
  source: {
    repository: knowledgeGraphSnapshot.repository,
    revision: knowledgeGraphSnapshot.revision,
    sourceMode: knowledgeGraphSnapshot.sourceMode,
    contentHash: knowledgeGraphSnapshot.contentHash,
  },
} as const
