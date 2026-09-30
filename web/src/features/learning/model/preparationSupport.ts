import type { LearningTargetModel } from "./learningTarget";

export interface PreparationOptionModel {
  readonly id: "delegated" | "self-curation";
  readonly label: string;
  readonly summary: string;
}

export interface PreparationNeedModel {
  readonly targetContext: string;
  readonly missing: readonly string[];
  readonly options: readonly PreparationOptionModel[];
}

export interface PreparationRequestResultModel {
  readonly status: "delegated" | "ready-to-review" | "self-curation-handoff";
  readonly message: string;
  readonly preparedTarget?: LearningTargetModel;
}
