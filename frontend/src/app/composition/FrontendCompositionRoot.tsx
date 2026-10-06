import { MockFrontendAdapter } from "../../adapters/mock/MockFrontendAdapter";
import { mockCandidateTargetOptions } from "../../adapters/mock/scenario";
import { KnowledgeExplorerStateProvider } from "../../features/knowledge-explorer/state";
import { PreparationContextProvider } from "../preparation-context/PreparationContext";
import { PreparationShell } from "../preparation-shell/PreparationShell";

const mockAdapter = new MockFrontendAdapter();

export function FrontendCompositionRoot() {
  return (
    <PreparationContextProvider>
      <KnowledgeExplorerStateProvider>
        <PreparationShell
          targetDirectionPort={mockAdapter}
          targetPort={mockAdapter}
          currentPositionPort={mockAdapter}
          knowledgePort={mockAdapter}
          activityPort={mockAdapter}
          candidateTargets={mockCandidateTargetOptions}
        />
      </KnowledgeExplorerStateProvider>
    </PreparationContextProvider>
  );
}
