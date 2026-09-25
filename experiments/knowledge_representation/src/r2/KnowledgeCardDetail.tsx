import { Box, Button, Chip, Divider, Stack, Typography } from '@mui/material'
import type { KnowledgeGraphSnapshotCard } from './knowledgeGraphSnapshotModel'

export interface KnowledgeCardDetailProps {
  card: KnowledgeGraphSnapshotCard
  revision: string
  canNavigateTo: (slug: string) => boolean
  onNavigateTo: (slug: string) => void
}

export function KnowledgeCardDetail({ card, revision, canNavigateTo, onNavigateTo }: KnowledgeCardDetailProps) {
  return <Stack spacing={1.25} className="r2-document-detail">
    <Stack direction="row" useFlexGap className="r2-document-meta">
      {card.kind && <Chip size="small" label={card.kind} />}
      {card.areas.map((area) => <Chip key={area} size="small" variant="outlined" label={area} />)}
    </Stack>

    <Typography variant="body2" className="r2-document-description">{card.description}</Typography>

    {card.questions.map((section, index) => <Box key={section.question} className="r2-document-question">
      {index > 0 && <Divider />}
      <Typography component="h3" variant="subtitle2">{section.question}</Typography>
      {section.answer && <Typography variant="body2" className="r2-document-answer">{section.answer}</Typography>}
      {section.links.length > 0 && <Stack spacing={.65} className="r2-document-links">
        {section.links.map((link) => <Box key={`${section.question}-${link.target}`} className="r2-document-link">
          <Button
            size="small"
            variant="text"
            disabled={!canNavigateTo(link.target)}
            onClick={() => onNavigateTo(link.target)}
          >
            {link.label}
          </Button>
          <Typography variant="caption">{link.explanation}</Typography>
        </Box>)}
      </Stack>}
    </Box>)}

    {card.questions.length === 0 && <Typography variant="caption" className="r2-document-empty">
      Полный body этой fallback-карточки не сохранён. Запустите sync Knowledge Graph для локального полного snapshot.
    </Typography>}

    <details className="r2-document-sources">
      <summary>Sources · {card.sources.length}</summary>
      {card.sources.length > 0
        ? <Stack spacing={.5}>{card.sources.map((source) => <a key={source} href={source} target="_blank" rel="noreferrer">{source}</a>)}</Stack>
        : <Typography variant="caption">В карточке нет persisted sources.</Typography>}
    </details>

    <Typography variant="caption" className="r2-document-provenance">
      {card.sourcePath} · {revision.slice(0, 12)}
    </Typography>
  </Stack>
}
