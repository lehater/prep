import type {
  StudyExportOutcome,
  StudySetPreviewModel,
} from "../model/study";
import type { LearningOutcome } from "./learningOutcome";

export interface StudyPort {
  build(targetId: string): Promise<LearningOutcome<StudySetPreviewModel>>;
  export(
    targetId: string,
    materializationToken: string,
  ): Promise<StudyExportOutcome>;
}
