import type {
  RuntimeStatusPort,
  RuntimeStatusOutcome,
} from "../../app/shell/RuntimeStatusPort";

export type MockRuntimeStatusMode = "reachable" | "unavailable" | "failure";

export class MockRuntimeStatusAdapter implements RuntimeStatusPort {
  constructor(
    private readonly mode: MockRuntimeStatusMode = "reachable",
  ) {}

  async get(): Promise<RuntimeStatusOutcome> {
    if (this.mode === "unavailable") {
      return {
        status: "unavailable",
        message: "Mock external runtime is unavailable.",
      };
    }
    if (this.mode === "failure") {
      return {
        status: "failure",
        message: "Mock runtime status could not be loaded.",
      };
    }
    return {
      status: "success",
      value: {
        reachable: true,
        compatible: true,
        profileSummary: "Mock Anki runtime",
      },
    };
  }
}
