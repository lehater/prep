import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import type { GraphRenderer } from "../../features/knowledge-explorer/ports/GraphRenderer";
import type { KnowledgeQueryPort } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import { CurationWorkspace } from "../../features/curation/CurationWorkspace";
import { LearningWorkspace } from "../../features/learning/LearningWorkspace";
import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import { AppShell } from "../shell/AppShell";

interface AppRouterProps {
  readonly defaultTargetId: string;
  readonly targetQueryPort: TargetQueryPort;
  readonly knowledgeQueryPort: KnowledgeQueryPort;
  readonly Renderer: GraphRenderer;
}

function LearningRoute({
  targetQueryPort,
  knowledgeQueryPort,
  Renderer,
}: Omit<AppRouterProps, "defaultTargetId">) {
  const { targetId } = useParams();
  if (!targetId) {
    return <Navigate to="/" replace />;
  }

  return (
    <LearningWorkspace
      targetId={targetId}
      targetQueryPort={targetQueryPort}
      knowledgeQueryPort={knowledgeQueryPort}
      Renderer={Renderer}
    />
  );
}

export function AppRouter({
  defaultTargetId,
  targetQueryPort,
  knowledgeQueryPort,
  Renderer,
}: AppRouterProps) {
  const learningEntryPath = `/learning/${defaultTargetId}/knowledge`;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell learningEntryPath={learningEntryPath} />}>
          <Route index element={<Navigate to={learningEntryPath} replace />} />
          <Route
            path="learning/:targetId/knowledge"
            element={
              <LearningRoute
                targetQueryPort={targetQueryPort}
                knowledgeQueryPort={knowledgeQueryPort}
                Renderer={Renderer}
              />
            }
          />
          <Route
            path="curation/knowledge"
            element={
              <CurationWorkspace
                knowledgeQueryPort={knowledgeQueryPort}
                Renderer={Renderer}
              />
            }
          />
          <Route path="*" element={<Navigate to={learningEntryPath} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
