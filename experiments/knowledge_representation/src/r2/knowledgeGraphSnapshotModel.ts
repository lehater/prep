export interface KnowledgeGraphSnapshotLink {
  target: string
  label: string
  explanation: string
}

export interface KnowledgeGraphSnapshotQuestion {
  question: string
  answer: string
  links: KnowledgeGraphSnapshotLink[]
}

export interface KnowledgeGraphSnapshotCard {
  id: string
  slug: string
  name: string
  kind: string | null
  areas: string[]
  aliases: string[]
  sources: string[]
  description: string
  questions: KnowledgeGraphSnapshotQuestion[]
  outgoing: string[]
  sourcePath: string
}

export interface KnowledgeGraphSnapshot {
  repository: string
  revision: string
  sourceMode: 'local' | 'fallback'
  contentHash: string
  cards: KnowledgeGraphSnapshotCard[]
}
