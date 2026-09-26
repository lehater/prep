import type { QuestionModel } from "./question";

export interface StudySetPreviewModel {
  readonly targetId: string;
  readonly questions: readonly QuestionModel[];
  readonly materializationToken: string;
}

export interface StudyExportItemModel {
  readonly questionId: string;
  readonly status: "success" | "rejected";
  readonly message?: string;
}

export interface StudyExportResultModel {
  readonly items: readonly StudyExportItemModel[];
}

export type StudyExportOutcome =
  | { readonly status: "success"; readonly value: StudyExportResultModel }
  | { readonly status: "partial"; readonly value: StudyExportResultModel }
  | { readonly status: "conflict"; readonly message: string }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };
