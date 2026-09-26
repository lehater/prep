import type {
  StudyExportOutcome,
  StudySetPreviewModel,
} from "../model/study";

export type StudyFlowState = {
  readonly preview?: StudySetPreviewModel;
  readonly buildStatus: "idle" | "loading" | "failure";
  readonly buildMessage?: string;
  readonly exportStatus:
    | "idle"
    | "loading"
    | "success"
    | "partial"
    | "conflict"
    | "unavailable"
    | "failure";
  readonly exportOutcome?: StudyExportOutcome;
};

export type StudyFlowAction =
  | { readonly type: "build-start" }
  | { readonly type: "build-success"; readonly preview: StudySetPreviewModel }
  | { readonly type: "build-failure"; readonly message: string }
  | { readonly type: "export-start" }
  | { readonly type: "export-result"; readonly outcome: StudyExportOutcome };

export const initialStudyFlowState: StudyFlowState = {
  buildStatus: "idle",
  exportStatus: "idle",
};

export function studyFlowReducer(
  state: StudyFlowState,
  action: StudyFlowAction,
): StudyFlowState {
  switch (action.type) {
    case "build-start":
      return {
        ...state,
        buildStatus: "loading",
        buildMessage: undefined,
        exportStatus: "idle",
        exportOutcome: undefined,
      };
    case "build-success":
      return {
        ...state,
        preview: action.preview,
        buildStatus: "idle",
        buildMessage: undefined,
        exportStatus: "idle",
        exportOutcome: undefined,
      };
    case "build-failure":
      return {
        ...state,
        buildStatus: "failure",
        buildMessage: action.message,
      };
    case "export-start":
      return {
        ...state,
        exportStatus: "loading",
        exportOutcome: undefined,
      };
    case "export-result":
      return {
        ...state,
        exportStatus: action.outcome.status,
        exportOutcome: action.outcome,
      };
  }
}
