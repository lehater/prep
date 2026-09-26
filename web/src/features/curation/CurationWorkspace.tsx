import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";

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
  const [showKnowledgeCreate, setShowKnowledgeCreate] = useState(false);

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
        <header aria-label={`Curation ${LABELS[section]} header`}>
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

        {section === "knowledge" ? (
          <Stack
            component="section"
            aria-label="Knowledge authoring actions"
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              flexShrink: 0,
            }}
          >
            <Button
              variant="contained"
              onClick={() => setShowKnowledgeCreate((value) => !value)}
              aria-expanded={showKnowledgeCreate}
            >
              New Knowledge
            </Button>
            <Button
              component={Link}
              to="/curation/import?kind=knowledge"
              variant="outlined"
            >
              Import Knowledge
            </Button>
          </Stack>
        ) : null}
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
          showCreate={showKnowledgeCreate}
          onShowCreateChange={setShowKnowledgeCreate}
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
