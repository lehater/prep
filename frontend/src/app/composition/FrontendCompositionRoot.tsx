import { MockFrontendAdapter } from "../../adapters/mock/MockFrontendAdapter";
import { mockCandidateTargetOptions } from "../../adapters/mock/scenario";
import { PreparationContextProvider } from "../preparation-context/PreparationContext";
import { PreparationShell } from "../preparation-shell/PreparationShell";

const mockAdapter = new MockFrontendAdapter();

export function FrontendCompositionRoot() {
  return (
    <PreparationContextProvider>
      <PreparationShell
        targetDirectionPort={mockAdapter}
        candidateTargets={mockCandidateTargetOptions}
      />
    </PreparationContextProvider>
  );
}
