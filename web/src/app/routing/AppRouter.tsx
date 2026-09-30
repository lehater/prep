import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import {
  CurationWorkspace,
  type CurationSection,
} from "../../features/curation/CurationWorkspace";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
} from "../../features/curation/ports/CurationPorts";
import type {
  AssessmentCurationPortV2,
  CapabilityCurationPortV2,
  CorpusQualityPort,
  LearningSupportCurationPortV2,
  TargetProfileCurationPort,
} from "../../features/curation/ports/UserCenteredCurationPorts";
import type { GraphRenderer } from "../../features/knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import { LearningWorkspace } from "../../features/learning/LearningWorkspace";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import type { PreparationSupportPort } from "../../features/learning/ports/PreparationSupportPort";
import type { TargetWorkPort } from "../../features/learning/ports/TargetWorkPort";
import type { LearningSection } from "../../features/learning/ui/learningRoutes";
import { TargetSelectionView } from "../../features/learning/ui/TargetSelectionView";
import { AppShell } from "../shell/AppShell";
import type { RuntimeStatusPort } from "../shell/RuntimeStatusPort";

interface AppRouterProps {
  readonly targetQueryPort: TargetQueryPort;
  readonly preparationSupportPort: PreparationSupportPort;
  readonly targetWorkPort: TargetWorkPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly curationKnowledgePort: KnowledgeCurationPort;
  readonly targetProfilePort: TargetProfileCurationPort;
  readonly capabilityPort: CapabilityCurationPortV2;
  readonly learningSupportPort: LearningSupportCurationPortV2;
  readonly assessmentPort: AssessmentCurationPortV2;
  readonly qualityPort: CorpusQualityPort;
  readonly curationImportPort: CurationImportPort;
  readonly runtimeStatusPort: RuntimeStatusPort;
  readonly Renderer: GraphRenderer;
}

function LearningRoute({
  section,
  targetQueryPort,
  targetWorkPort,
  knowledgeQueryPort,
  Renderer,
}: AppRouterProps & { readonly section: LearningSection }) {
  const { targetId } = useParams();
  if (!targetId) return <Navigate to="/learning" replace />;

  return (
    <LearningWorkspace
      targetId={targetId}
      section={section}
      targetQueryPort={targetQueryPort}
      targetWorkPort={targetWorkPort}
      knowledgeQueryPort={knowledgeQueryPort}
      Renderer={Renderer}
    />
  );
}

function CurationRoute(
  props: AppRouterProps & { readonly section: CurationSection },
) {
  return (
    <CurationWorkspace
      section={props.section}
      knowledgeQueryPort={props.knowledgeQueryPort}
      knowledgePort={props.curationKnowledgePort}
      targetProfilePort={props.targetProfilePort}
      capabilityPort={props.capabilityPort}
      learningSupportPort={props.learningSupportPort}
      assessmentPort={props.assessmentPort}
      qualityPort={props.qualityPort}
      importPort={props.curationImportPort}
      Renderer={props.Renderer}
    />
  );
}

const LEARNING_SECTIONS: readonly LearningSection[] = [
  "overview",
  "state",
  "gaps",
  "learning",
  "diagnostics",
  "knowledge",
  "progress",
];

const CURATION_SECTIONS: readonly CurationSection[] = [
  "targets",
  "capabilities",
  "knowledge",
  "learning-support",
  "assessment",
  "import",
  "quality",
];

export function AppRouter(props: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <AppShell
              learningEntryPath="/learning"
              runtimeStatusPort={props.runtimeStatusPort}
            />
          }
        >
          <Route index element={<Navigate to="/learning" replace />} />
          <Route
            path="learning"
            element={<TargetSelectionView targetQueryPort={props.targetQueryPort} preparationSupportPort={props.preparationSupportPort} />}
          />
          {LEARNING_SECTIONS.map((section) => (
            <Route
              key={section}
              path={`learning/:targetId/${section}`}
              element={<LearningRoute {...props} section={section} />}
            />
          ))}
          {CURATION_SECTIONS.map((section) => (
            <Route
              key={section}
              path={`curation/${section}`}
              element={<CurationRoute {...props} section={section} />}
            />
          ))}
          <Route path="curation/requirements" element={<Navigate to="/curation/capabilities" replace />} />
          <Route path="curation/questions" element={<Navigate to="/curation/learning-support" replace />} />
          <Route path="curation" element={<Navigate to="/curation/knowledge" replace />} />
          <Route path="*" element={<Navigate to="/learning" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
