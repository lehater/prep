import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Link, useSearchParams } from "react-router-dom";

import type { GraphRenderer } from "../knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../knowledge-explorer/ports/KnowledgeQueryPort";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
} from "./ports/CurationPorts";
import type {
  AssessmentCurationPortV2,
  CapabilityCurationPortV2,
  CorpusQualityPort,
  LearningSupportCurationPortV2,
  TargetProfileCurationPort,
} from "./ports/UserCenteredCurationPorts";
import { ImportCurationView } from "./ui/ImportCurationView";
import { KnowledgeCurationView } from "./ui/KnowledgeCurationView";
import {
  AssessmentCurationViewV2,
  CapabilitiesCurationView,
  CorpusQualityView,
  LearningSupportCurationViewV2,
  TargetProfilesCurationView,
} from "./ui/UserCenteredCurationViews";

export type CurationSection =
  | "targets"
  | "capabilities"
  | "knowledge"
  | "learning-support"
  | "assessment"
  | "import"
  | "quality";

interface CurationWorkspaceProps {
  readonly section: CurationSection;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly knowledgePort: KnowledgeCurationPort;
  readonly targetProfilePort: TargetProfileCurationPort;
  readonly capabilityPort: CapabilityCurationPortV2;
  readonly learningSupportPort: LearningSupportCurationPortV2;
  readonly assessmentPort: AssessmentCurationPortV2;
  readonly qualityPort: CorpusQualityPort;
  readonly importPort: CurationImportPort;
  readonly Renderer: GraphRenderer;
}

const LABELS: Readonly<Record<CurationSection, string>> = {
  targets: "Targets",
  capabilities: "Capabilities",
  knowledge: "Knowledge",
  "learning-support": "Learning Support",
  assessment: "Assessment",
  import: "Import",
  quality: "Quality",
};

export function CurationWorkspace({
  section,
  knowledgeQueryPort,
  knowledgePort,
  targetProfilePort,
  capabilityPort,
  learningSupportPort,
  assessmentPort,
  qualityPort,
  importPort,
  Renderer,
}: CurationWorkspaceProps) {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const intent = searchParams.get("intent");
  const mode = searchParams.get("mode");

  return (
    <Stack spacing={{ xs: 1.25, md: 1.5 }}>
      {returnTo ? (
        <Alert severity="info">
          <Stack spacing={0.75}>
            <Typography>
              {intent
                ? `Preparing reusable data for: ${intent}`
                : "Preparing reusable data before returning to Target Work."}
            </Typography>
            {mode ? (
              <Typography variant="body2">Preparation path: {mode}</Typography>
            ) : null}
            <Button
              component={Link}
              to={returnTo}
              color="inherit"
              sx={{ alignSelf: "flex-start" }}
            >
              Return to Target Work
            </Button>
          </Stack>
        </Alert>
      ) : null}
      <header>
        <Typography component="p" variant="overline" color="text.secondary">
          Curation
        </Typography>
        <Typography component="h2" variant="h5">
          {LABELS[section]}
        </Typography>
        {section === "knowledge" ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Maintain reusable Knowledge while preserving graph exploration as a presentation projection.
          </Typography>
        ) : null}
      </header>

      {section === "targets" ? (
        <TargetProfilesCurationView
          targetPort={targetProfilePort}
          capabilityPort={capabilityPort}
        />
      ) : section === "capabilities" ? (
        <CapabilitiesCurationView
          capabilityPort={capabilityPort}
          knowledgeQueryPort={knowledgeQueryPort}
        />
      ) : section === "knowledge" ? (
        <KnowledgeCurationView
          queryPort={knowledgeQueryPort}
          curationPort={knowledgePort}
          Renderer={Renderer}
        />
      ) : section === "learning-support" ? (
        <LearningSupportCurationViewV2
          supportPort={learningSupportPort}
          capabilityPort={capabilityPort}
          knowledgeQueryPort={knowledgeQueryPort}
        />
      ) : section === "assessment" ? (
        <AssessmentCurationViewV2
          assessmentPort={assessmentPort}
          capabilityPort={capabilityPort}
        />
      ) : section === "quality" ? (
        <CorpusQualityView qualityPort={qualityPort} />
      ) : (
        <ImportCurationView importPort={importPort} />
      )}
    </Stack>
  );
}
