import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import type { GraphRenderer } from "../../features/knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import { CurationWorkspace } from "../../features/curation/CurationWorkspace";
import {
  LearningWorkspace,
  type LearningSection,
} from "../../features/learning/LearningWorkspace";
import type { LearningStatisticsPort } from "../../features/learning/ports/LearningStatisticsPort";
import type { QuestionQueryPort } from "../../features/learning/ports/QuestionQueryPort";
import type { StudyPort } from "../../features/learning/ports/StudyPort";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import { TargetSelectionView } from "../../features/learning/ui/TargetSelectionView";
import { AppShell } from "../shell/AppShell";

interface AppRouterProps {
  readonly targetQueryPort: TargetQueryPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly questionQueryPort: QuestionQueryPort;
  readonly studyPort: StudyPort;
  readonly statisticsPort: LearningStatisticsPort;
  readonly Renderer: GraphRenderer;
}

function LearningRoute({
  section,
  targetQueryPort,
  knowledgeQueryPort,
  questionQueryPort,
  studyPort,
  statisticsPort,
  Renderer,
}: AppRouterProps & { readonly section: LearningSection }) {
  const { targetId } = useParams();
  if (!targetId) {
    return <Navigate to="/learning" replace />;
  }

  return (
    <LearningWorkspace
      targetId={targetId}
      section={section}
      targetQueryPort={targetQueryPort}
      knowledgeQueryPort={knowledgeQueryPort}
      questionQueryPort={questionQueryPort}
      studyPort={studyPort}
      statisticsPort={statisticsPort}
      Renderer={Renderer}
    />
  );
}

export function AppRouter(props: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell learningEntryPath="/learning" />}>
          <Route index element={<Navigate to="/learning" replace />} />
          <Route
            path="learning"
            element={<TargetSelectionView targetQueryPort={props.targetQueryPort} />}
          />
          {(["overview", "knowledge", "study", "statistics"] as const).map(
            (section) => (
              <Route
                key={section}
                path={`learning/:targetId/${section}`}
                element={<LearningRoute {...props} section={section} />}
              />
            ),
          )}
          <Route
            path="curation/knowledge"
            element={
              <CurationWorkspace
                knowledgeQueryPort={props.knowledgeQueryPort}
                Renderer={props.Renderer}
              />
            }
          />
          <Route path="*" element={<Navigate to="/learning" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
