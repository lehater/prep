import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import {
  CurationWorkspace,
  type CurationSection,
} from "../../features/curation/CurationWorkspace";
import type {
  CurationImportPort,
  KnowledgeCurationPort,
  QuestionCurationPort,
  RequirementCurationPort,
  TargetCurationPort,
} from "../../features/curation/ports/CurationPorts";
import type { GraphRenderer } from "../../features/knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import { LearningWorkspace } from "../../features/learning/LearningWorkspace";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import type { TargetWorkPort } from "../../features/learning/ports/TargetWorkPort";
import type { LearningSection } from "../../features/learning/ui/learningRoutes";
import { TargetSelectionView } from "../../features/learning/ui/TargetSelectionView";
import { AppShell } from "../shell/AppShell";
import type { RuntimeStatusPort } from "../shell/RuntimeStatusPort";

interface AppRouterProps {
  readonly targetQueryPort: TargetQueryPort;
  readonly targetWorkPort: TargetWorkPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly curationTargetPort: TargetCurationPort;
  readonly curationKnowledgePort: KnowledgeCurationPort;
  readonly curationRequirementPort: RequirementCurationPort;
  readonly curationQuestionPort: QuestionCurationPort;
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
      targetPort={props.curationTargetPort}
      knowledgePort={props.curationKnowledgePort}
      requirementPort={props.curationRequirementPort}
      questionPort={props.curationQuestionPort}
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
            element={<TargetSelectionView targetQueryPort={props.targetQueryPort} />}
          />
          {LEARNING_SECTIONS.map((section) => (
            <Route
              key={section}
              path={`learning/:targetId/${section}`}
              element={<LearningRoute {...props} section={section} />}
            />
          ))}
          {(["targets", "knowledge", "requirements", "questions", "import"] as const).map(
            (section) => (
              <Route
                key={section}
                path={`curation/${section}`}
                element={<CurationRoute {...props} section={section} />}
              />
            ),
          )}
          <Route path="curation" element={<Navigate to="/curation/knowledge" replace />} />
          <Route path="*" element={<Navigate to="/learning" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
