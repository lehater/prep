import type {
  PreparationNeedModel,
  PreparationRequestResultModel,
} from "../model/preparationSupport";
import type { LearningOutcome } from "./learningOutcome";

export interface PreparationSupportPort {
  getOptions(input: {
    readonly targetContext: string;
    readonly sourceContext?: string;
  }): Promise<LearningOutcome<PreparationNeedModel>>;

  request(input: {
    readonly targetContext: string;
    readonly sourceContext?: string;
    readonly fulfillmentPreference: "delegated" | "self-curation";
  }): Promise<LearningOutcome<PreparationRequestResultModel>>;
}
