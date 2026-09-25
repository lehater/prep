import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import { mockTargets } from "./mockFixtures";

export type MockTargetMode = "success" | "unavailable" | "failure";

export class MockTargetAdapter implements TargetQueryPort {
  constructor(private readonly mode: MockTargetMode = "success") {}

  async list(query: { readonly search?: string }) {
    const problem = this.problem<{ items: readonly LearningTargetModel[]; totalCount: number }>();
    if (problem) {
      return problem;
    }

    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = mockTargets.filter(
      (target) =>
        search.length === 0 ||
        target.name.toLocaleLowerCase().includes(search) ||
        target.definition.toLocaleLowerCase().includes(search),
    );
    return { status: "success" as const, value: { items, totalCount: items.length } };
  }

  async get(targetId: string): Promise<LearningOutcome<LearningTargetModel>> {
    const problem = this.problem<LearningTargetModel>();
    if (problem) {
      return problem;
    }
    const target = mockTargets.find((candidate) => candidate.id === targetId);
    return target
      ? { status: "success", value: target }
      : { status: "not_found", message: "Learning target not found." };
  }

  private problem<T>(): LearningOutcome<T> | null {
    if (this.mode === "unavailable") {
      return {
        status: "unavailable",
        message: "Learning targets are temporarily unavailable.",
      };
    }
    if (this.mode === "failure") {
      return {
        status: "failure",
        message: "Learning targets could not be loaded. Retry the operation.",
      };
    }
    return null;
  }
}
