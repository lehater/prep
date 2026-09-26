export interface RuntimeStatusModel {
  readonly reachable: boolean;
  readonly compatible: boolean;
  readonly endpointSummary?: string;
  readonly profileSummary?: string;
}

export type RuntimeStatusOutcome =
  | { readonly status: "success"; readonly value: RuntimeStatusModel }
  | { readonly status: "unavailable"; readonly message: string }
  | { readonly status: "failure"; readonly message: string };

export interface RuntimeStatusPort {
  get(): Promise<RuntimeStatusOutcome>;
}
