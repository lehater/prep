import type { CurationOutcome } from "../../features/curation/model/curationModels";
import type { KnowledgeQueryOutcome } from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import type { StudyExportOutcome } from "../../features/learning/model/study";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import type {
  RuntimeStatusOutcome,
} from "../../app/shell/RuntimeStatusPort";
import type { MachineEnvelopeDto } from "./dto";

type Mapper<T> = (value: unknown) => T;

function message(envelope: MachineEnvelopeDto, fallback: string): string {
  return envelope.message?.trim() || fallback;
}

function mapped<T>(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<T>,
):
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly message: string } {
  try {
    return { ok: true, value: mapper(envelope.result) };
  } catch {
    return {
      ok: false,
      message: "Backend response did not match the accepted machine contract.",
    };
  }
}

export function toLearningOutcome<T>(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<T>,
): LearningOutcome<T> {
  if (envelope.outcome === "success") {
    const result = mapped(envelope, mapper);
    return result.ok
      ? { status: "success", value: result.value }
      : { status: "failure", message: result.message };
  }
  if (envelope.outcome === "not_found") {
    return {
      status: "not_found",
      message: message(envelope, "Requested item was not found."),
    };
  }
  if (envelope.outcome === "external_runtime_unavailable") {
    return {
      status: "unavailable",
      message: message(envelope, "External runtime is unavailable."),
    };
  }
  return {
    status: "failure",
    message: message(envelope, "The operation could not be completed."),
  };
}

export function toKnowledgeOutcome<T>(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<T>,
): KnowledgeQueryOutcome<T> {
  if (envelope.outcome === "success") {
    const result = mapped(envelope, mapper);
    return result.ok
      ? { status: "success", value: result.value }
      : { status: "failure", message: result.message };
  }
  if (envelope.outcome === "external_runtime_unavailable") {
    return {
      status: "unavailable",
      message: message(envelope, "Knowledge data is unavailable."),
    };
  }
  return {
    status: "failure",
    message: message(envelope, "Knowledge data could not be loaded."),
  };
}

export function toCurationOutcome<T>(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<T>,
): CurationOutcome<T> {
  if (envelope.outcome === "success") {
    const result = mapped(envelope, mapper);
    return result.ok
      ? { status: "success", value: result.value }
      : { status: "failure", message: result.message };
  }
  switch (envelope.outcome) {
    case "not_found":
      return {
        status: "not_found",
        message: message(envelope, "Requested item was not found."),
      };
    case "validation_rejected":
      return {
        status: "validation_rejected",
        message: message(envelope, "Submitted data was rejected."),
      };
    case "conflict":
      return {
        status: "conflict",
        message: message(envelope, "Current canonical state conflicts with the request."),
      };
    case "external_runtime_unavailable":
      return {
        status: "unavailable",
        message: message(envelope, "External runtime is unavailable."),
      };
    default:
      return {
        status: "failure",
        message: message(envelope, "The operation could not be completed."),
      };
  }
}

export function toStudyExportOutcome(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<StudyExportOutcome extends { value: infer T } ? T : never>,
): StudyExportOutcome {
  if (
    envelope.outcome === "success" ||
    envelope.outcome === "partial_external_failure"
  ) {
    const result = mapped(envelope, mapper);
    if (!result.ok) {
      return { status: "failure", message: result.message };
    }
    return {
      status: envelope.outcome === "success" ? "success" : "partial",
      value: result.value,
    };
  }
  if (envelope.outcome === "conflict") {
    return {
      status: "conflict",
      message: message(envelope, "The inspected Study Set is stale."),
    };
  }
  if (envelope.outcome === "external_runtime_unavailable") {
    return {
      status: "unavailable",
      message: message(envelope, "External runtime is unavailable."),
    };
  }
  return {
    status: "failure",
    message: message(envelope, "Study material export failed."),
  };
}

export function toRuntimeStatusOutcome(
  envelope: MachineEnvelopeDto,
  mapper: Mapper<RuntimeStatusOutcome extends { value: infer T } ? T : never>,
): RuntimeStatusOutcome {
  if (envelope.outcome === "success") {
    const result = mapped(envelope, mapper);
    return result.ok
      ? { status: "success", value: result.value }
      : { status: "failure", message: result.message };
  }
  if (envelope.outcome === "external_runtime_unavailable") {
    return {
      status: "unavailable",
      message: message(envelope, "External runtime is unavailable."),
    };
  }
  return {
    status: "failure",
    message: message(envelope, "Runtime status could not be loaded."),
  };
}
