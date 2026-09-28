import type { TargetWorkPort } from "../../features/learning/ports/TargetWorkPort";

export class PendingHttpTargetWorkAdapter implements TargetWorkPort {
  private unavailable() {
    return {
      status: "unavailable" as const,
      message: "Target-state/gap backend operations are not implemented yet. Use the mock provider for the frontend-first prototype.",
    };
  }

  async getState() { return this.unavailable(); }
  async getGaps() { return this.unavailable(); }
  async getFocus() { return this.unavailable(); }
  async setFocus() { return this.unavailable(); }
  async listSupport() { return this.unavailable(); }
  async listDiagnostics() { return this.unavailable(); }
  async completeDiagnostic() { return this.unavailable(); }
  async getProgress() { return this.unavailable(); }
}
