import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const cwd = process.cwd()
const args = process.argv.slice(2)
const optional = args.includes('--optional')
const sourceArgIndex = args.indexOf('--source')
const outputArgIndex = args.indexOf('--output')

const candidateSources = [
  sourceArgIndex >= 0 ? args[sourceArgIndex + 1] : null,
  process.env.KNOWLEDGE_GRAPH_REPO,
  '../../../knowledge-graph',
  '../../knowledge-graph',
  '../knowledge-graph',
].filter(Boolean).map((value) => resolve(cwd, value))

const sourceRepo = candidateSources.find((candidate) => existsSync(join(candidate, 'graph')) && statSync(join(candidate, 'graph')).isDirectory())
if (!sourceRepo) {
  const message = `Knowledge Graph repo not found. Checked: ${candidateSources.join(', ')}`
  if (optional) {
    console.log(`${message}. Keeping committed fallback snapshot.`)
    process.exit(0)
  }
  throw new Error(message)
}

const outputPath = resolve(cwd, outputArgIndex >= 0 ? args[outputArgIndex + 1] : 'src/r2/generated/knowledgeGraphSnapshot.ts')
const graphDir = join(sourceRepo, 'graph')

function stripQuotes(value) {
  const trimmed = value.trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) throw new Error('Missing frontmatter')
  const lines = match[1].split(/\r?\n/)
  const scalar = {}
  const lists = {}
  let activeList = null

  for (const line of lines) {
    const listItem = line.match(/^\s+-\s+(.+?)\s*$/)
    if (activeList && listItem) {
      lists[activeList].push(stripQuotes(listItem[1]))
      continue
    }

    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/)
    if (!field) continue
    const [, key, rest = ''] = field
    if (rest.trim()) {
      scalar[key] = stripQuotes(rest)
      activeList = null
    } else {
      lists[key] = []
      activeList = key
    }
  }

  return { frontmatterLength: match[0].length, scalar, lists }
}

function parseWikilink(line) {
  const match = line.match(/^\s*-\s+\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]\s+—\s+(.+?)\s*$/)
  if (!match) return null
  return {
    target: match[1].trim(),
    label: (match[2] || match[1]).trim(),
    explanation: match[3].trim(),
  }
}

function allOutgoing(body) {
  const seen = new Set()
  const outgoing = []
  for (const match of body.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)) {
    const target = match[1].trim()
    if (!seen.has(target)) {
      seen.add(target)
      outgoing.push(target)
    }
  }
  return outgoing
}

function parseQuestions(body) {
  const headingMatches = [...body.matchAll(/^##\s+(.+)$/gm)]
  return headingMatches.map((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length
    const end = index + 1 < headingMatches.length ? headingMatches[index + 1].index : body.length
    const section = body.slice(start, end).trim()
    const links = []
    const answerLines = []

    for (const line of section.split(/\r?\n/)) {
      const link = parseWikilink(line)
      if (link) links.push(link)
      else answerLines.push(line)
    }

    return {
      question: heading[1].trim(),
      answer: answerLines.join('\n').trim(),
      links,
    }
  })
}

function parseCard(path) {
  const raw = readFileSync(path, 'utf8')
  const { frontmatterLength, scalar, lists } = parseFrontmatter(raw)
  if (scalar.format !== 'concept-card-v2') return null

  const body = raw.slice(frontmatterLength).trim()
  const h1 = body.match(/^#\s+(.+)$/m)
  const firstQuestion = body.search(/^##\s+/m)
  const beforeQuestions = firstQuestion >= 0 ? body.slice(0, firstQuestion) : body
  const description = beforeQuestions
    .replace(/^#\s+.+$/m, '')
    .trim()

  const slug = path.split(/[\\/]/).pop().replace(/\.md$/, '')
  return {
    id: scalar.id ?? '',
    slug,
    name: scalar.name ?? h1?.[1]?.trim() ?? slug,
    kind: scalar.kind ?? null,
    areas: lists.areas ?? [],
    aliases: lists.aliases ?? [],
    sources: lists.sources ?? [],
    description,
    questions: parseQuestions(body),
    outgoing: allOutgoing(body),
    sourcePath: `graph/${slug}.md`,
  }
}

const cards = readdirSync(graphDir)
  .filter((name) => name.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b))
  .map((name) => parseCard(join(graphDir, name)))
  .filter(Boolean)

if (cards.length === 0) throw new Error(`No concept-card-v2 files found under ${graphDir}`)

let revision = 'local-working-tree'
try {
  const head = execFileSync('git', ['-C', sourceRepo, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  const dirty = execFileSync('git', ['-C', sourceRepo, 'status', '--porcelain', '--', 'graph'], { encoding: 'utf8' }).trim()
  revision = dirty ? `${head}+working-tree` : head
} catch {
  // A copied source directory is still a valid local fixture source.
}

const contentHash = createHash('sha256').update(JSON.stringify(cards)).digest('hex').slice(0, 16)
const authoredLinkCount = cards.reduce((total, card) => total + card.outgoing.length, 0)
const materializedLinkCount = cards.reduce((total, card) => total + card.outgoing.filter((target) => cards.some((candidate) => candidate.slug === target)).length, 0)

const snapshot = {
  repository: 'lehater/knowledge-graph',
  revision,
  sourceMode: 'local',
  contentHash,
  cards,
}

const moduleText = `// Generated by scripts/sync-knowledge-graph.mjs from a local Knowledge Graph checkout.
// Do not hand-edit. Re-run npm run sync-knowledge-graph.
import type { KnowledgeGraphSnapshot } from '../knowledgeGraphSnapshotModel'

export const knowledgeGraphSnapshot: KnowledgeGraphSnapshot = ${JSON.stringify(snapshot, null, 2)}
`

mkdirSync(dirname(outputPath), { recursive: true })
const previous = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : ''
if (previous === moduleText) {
  console.log(`Knowledge Graph snapshot already current: ${cards.length} cards · ${materializedLinkCount}/${authoredLinkCount} materialized wikilinks · ${contentHash} @ ${revision.slice(0, 12)}`)
  process.exit(0)
}

writeFileSync(outputPath, moduleText)
console.log(`Knowledge Graph snapshot updated: ${cards.length} cards · ${materializedLinkCount}/${authoredLinkCount} materialized wikilinks · ${contentHash} @ ${revision.slice(0, 12)} -> ${outputPath}`)
