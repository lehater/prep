import type { PreparationSupportPort } from "../../features/learning/ports/PreparationSupportPort";
import type {
  PreparationNeedModel,
  PreparationRequestResultModel,
} from "../../features/learning/model/preparationSupport";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import { HttpOperationClient } from "./HttpOperationClient";

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Preparation response must be an object.");
  }
  return value as Record<string, unknown>;
}

function stringValue(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function targetFrom(value: unknown): LearningTargetModel | undefined {
  if (!value) return undefined;
  const dto = record(value);
  const capabilities = Array.isArray(dto.capabilities)
    ? dto.capabilities.flatMap((raw) => {
        const item = record(raw);
        const id = stringValue(item.id);
        const title = stringValue(item.title);
        if (!id || !title) return [];
        return [{ id, title, summary: stringValue(item.summary) }];
      })
    : [];
  const id = stringValue(dto.id);
  const name = stringValue(dto.name);
  if (!id || !name) return undefined;
  return {
    id,
    name,
    definition: stringValue(dto.definition),
    scopeSummary: stringValue(dto.scope_summary, String(capabilities.length) + " required capability(s)"),
    capabilities,
    scopeItems: [],
  };
}

export class HttpPreparationSupportAdapter implements PreparationSupportPort {
  constructor(private readonly client: HttpOperationClient) {}

  async getOptions(input: { readonly targetContext: string; readonly sourceContext?: string }) {
    const envelope = await this.client.query("learning.preparation.options.get", {
      target_context: input.targetContext,
      source_context: input.sourceContext,
    });
    if (envelope.outcome !== "success") {
      return {
        status: envelope.outcome === "not_found" ? "not_found" as const : "unavailable" as const,
        message: stringValue(envelope.message, "Preparation options are unavailable."),
      };
    }
    const dto = record(envelope.result);
    const value: PreparationNeedModel = {
      targetContext: stringValue(dto.target_context, input.targetContext),
      missing: Array.isArray(dto.missing)
        ? dto.missing.filter((item): item is string => typeof item === "string")
        : [],
      options: Array.isArray(dto.options)
        ? dto.options.flatMap((raw) => {
            const item = record(raw);
            const id = item.id;
            if (id !== "delegated" && id !== "self-curation") return [];
            return [{
              id,
              label: stringValue(item.label, id),
              summary: stringValue(item.summary),
            }];
          })
        : [],
    };
    return { status: "success" as const, value };
  }

  async request(input: {
    readonly targetContext: string;
    readonly sourceContext?: string;
    readonly fulfillmentPreference: "delegated" | "self-curation";
  }) {
    const envelope = await this.client.mutate("learning.preparation.request", {
      target_context: input.targetContext,
      source_context: input.sourceContext,
      fulfillment_preference: input.fulfillmentPreference,
    });
    if (envelope.outcome !== "success") {
      return {
        status: envelope.outcome === "not_found" ? "not_found" as const : "unavailable" as const,
        message: stringValue(envelope.message, "Preparation request is unavailable."),
      };
    }
    const dto = record(envelope.result);
    const rawStatus = stringValue(dto.status);
    const status =
      rawStatus === "self-curation-handoff"
        ? "self-curation-handoff"
        : rawStatus === "delegated"
          ? "delegated"
          : "ready-to-review";
    const value: PreparationRequestResultModel = {
      status,
      message: stringValue(dto.message, "Preparation request accepted."),
      preparedTarget: targetFrom(dto.prepared_target),
    };
    return { status: "success" as const, value };
  }
}
