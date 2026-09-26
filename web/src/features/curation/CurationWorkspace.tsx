import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
  QuestionCurationPort,
  RequirementCurationPort,
  TargetCurationPort,
} from "./ports/CurationPorts";
import { ImportCurationView } from "./ui/ImportCurationView";
import { KnowledgeCurationView } from "./ui/KnowledgeCurationView";
import { QuestionsCurationView } from "./ui/QuestionsCurationView";
import { RequirementsCurationView } from "./ui/RequirementsCurationView";
import { TargetsCurationView } from "./ui/TargetsCurationView";

export type CurationSection =
  | "targets"
  | "knowledge"
  | "requirements"
  | "questions"
  | "import";

interface CurationWorkspaceProps {
  readonly section: CurationSection;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly targetPort: TargetCurationPort;
  readonly knowledgePort: KnowledgeCurationPort;
  readonly requirementPort: RequirementCurationPort;
  readonly questionPort: QuestionCurationPort;
  readonly importPort: CurationImportPort;
  readonly Renderer: GraphRenderer;
}

const LABELS: Readonly<Record<CurationSection, string>> = {
  targets: "Targets",
  knowledge: "Knowledge",
  requirements: "Requirements",
  questions: "Questions",
  import: "Import",
};

export function CurationWorkspace({
  section,
  knowledgeQueryPort,
  targetPort,
  knowledgePort,
  requirementPort,
  questionPort,
  importPort,
  Renderer,
}: CurationWorkspaceProps) {
  return (
    <Stack spacing={{ xs: 1.25, md: 1.5 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <header>
          <Typography component="p" variant="overline" color="text.secondary">
            Curation
          </Typography>
          <Typography component="h2" variant="h5">
            Curation {LABELS[section]}
          </Typography>
          {section === "knowledge" ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
              Maintain reusable canonical Knowledge while keeping graph exploration primary.
            </Typography>
          ) : null}
        </header>

      </Stack>

      {section === "targets" ? (
        <TargetsCurationView
          targetPort={targetPort}
          requirementPort={requirementPort}
        />
      ) : section === "knowledge" ? (
        <KnowledgeCurationView
          queryPort={knowledgeQueryPort}
          curationPort={knowledgePort}
          Renderer={Renderer}
        />
      ) : section === "requirements" ? (
        <RequirementsCurationView
          requirementPort={requirementPort}
          knowledgeQueryPort={knowledgeQueryPort}
        />
      ) : section === "questions" ? (
        <QuestionsCurationView
          questionPort={questionPort}
          knowledgeQueryPort={knowledgeQueryPort}
        />
      ) : (
        <ImportCurationView importPort={importPort} />
      )}
    </Stack>
  );
}
