import type {
  DiagnosticOpportunityModel,
  GapModel,
  LearningFocusModel,
  LearningSupportModel,
  ProgressComparisonModel,
  TargetStateModel,
} from "../model/targetWork";
import type { LearningOutcome } from "./learningOutcome";

export interface TargetWorkPort {
  getState(targetId: string): Promise<LearningOutcome<TargetStateModel>>;
  getGaps(targetId: string): Promise<LearningOutcome<readonly GapModel[]>>;
  getFocus(targetId: string): Promise<LearningOutcome<LearningFocusModel | null>>;
  setFocus(
    targetId: string,
    input: {
      readonly gapId: string;
      readonly intentKind: "learning" | "diagnostic";
      readonly rationale?: string;
    },
  ): Promise<LearningOutcome<LearningFocusModel>>;
  listSupport(
    targetId: string,
    focusId: string,
  ): Promise<LearningOutcome<readonly LearningSupportModel[]>>;
  listDiagnostics(
    targetId: string,
    gapId?: string,
  ): Promise<LearningOutcome<readonly DiagnosticOpportunityModel[]>>;
  completeDiagnostic(
    targetId: string,
    diagnosticId: string,
  ): Promise<LearningOutcome<TargetStateModel>>;
  getProgress(targetId: string): Promise<LearningOutcome<ProgressComparisonModel>>;
}
