import { QueryClient } from "@tanstack/react-query";

import type { MachineEnvelopeDto, MachineOutcomeDto } from "./dto";

export type MachineOperationInput = Readonly<Record<string, unknown>>;

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

const MUTATING_OUTCOMES = new Set<MachineOutcomeDto>([
  "success",
  "partial_external_failure",
]);

export class HttpOperationClient {
  private readonly baseUrl: string;
  private readonly queryClient: QueryClient;
  private readonly fetchFn: FetchLike;

  constructor(
    baseUrl: string,
    options: {
      readonly fetchFn?: FetchLike;
      readonly queryClient?: QueryClient;
    } = {},
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.fetchFn = options.fetchFn ?? fetch;
    this.queryClient =
      options.queryClient ??
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            staleTime: 30_000,
          },
        },
      });
  }

  async query(
    operationId: string,
    input: MachineOperationInput = {},
  ): Promise<MachineEnvelopeDto> {
    const queryKey = ["prep-machine", operationId, input] as const;
    const envelope = await this.queryClient.fetchQuery({
      queryKey,
      queryFn: () => this.send(operationId, input),
    });

    if (envelope.outcome !== "success") {
      this.queryClient.removeQueries({ queryKey, exact: true });
    }
    return envelope;
  }

  async mutate(
    operationId: string,
    input: MachineOperationInput = {},
  ): Promise<MachineEnvelopeDto> {
    const envelope = await this.send(operationId, input);
    if (MUTATING_OUTCOMES.has(envelope.outcome)) {
      await this.queryClient.invalidateQueries({
        queryKey: ["prep-machine"],
      });
    }
    return envelope;
  }

  clearCache(): void {
    this.queryClient.clear();
  }

  private async send(
    operationId: string,
    input: MachineOperationInput,
  ): Promise<MachineEnvelopeDto> {
    try {
      const response = await this.fetchFn(
        `${this.baseUrl}/v1/operations/${encodeURIComponent(operationId)}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(input),
        },
      );

      let body: unknown;
      try {
        body = await response.json();
      } catch {
        return {
          outcome: "operational_failure",
          message: `HTTP ${response.status} returned no valid machine response for ${operationId}.`,
        };
      }

      if (isMachineEnvelope(body)) {
        return body;
      }
      return {
        outcome: "operational_failure",
        message: response.ok
          ? `Invalid machine response for ${operationId}.`
          : `HTTP ${response.status} while executing ${operationId}.`,
      };
    } catch {
      return {
        outcome: "operational_failure",
        message: `Transport failure while executing ${operationId}.`,
      };
    }
  }
}

function isMachineEnvelope(value: unknown): value is MachineEnvelopeDto {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.outcome === "string" &&
    [
      "success",
      "not_found",
      "validation_rejected",
      "conflict",
      "external_runtime_unavailable",
      "partial_external_failure",
      "operational_failure",
    ].includes(record.outcome)
  );
}
