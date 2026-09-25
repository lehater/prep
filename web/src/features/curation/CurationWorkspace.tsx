import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import { KnowledgeExplorer } from "../knowledge-explorer/ui/KnowledgeExplorer";

interface CurationWorkspaceProps {
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
}

export function CurationWorkspace({
  knowledgeQueryPort,
  Renderer,
}: CurationWorkspaceProps) {
  return (
    <Stack spacing={2}>
      <header>
        <Typography component="p" color="text.secondary">
          Curation
        </Typography>
        <Typography component="h2" variant="h5">
          Curation Knowledge
        </Typography>
        <Typography color="text.secondary">
          Reusable Library context with global canonical Knowledge identity.
        </Typography>
      </header>
      <KnowledgeExplorer
        scope={{ kind: "global" }}
        queryPort={knowledgeQueryPort}
        Renderer={Renderer}
      />
    </Stack>
  );
}
