import type { TargetQueryPort } from "../../features/learning/ports/TargetQueryPort";
import type { LearningOutcome } from "../../features/learning/ports/learningOutcome";
import type { LearningTargetModel } from "../../features/learning/model/learningTarget";
import { createMockCurationStore, type MockCurationStore } from "./MockCurationStore";

export type MockTargetMode = "success" | "unavailable" | "failure";

export class MockTargetAdapter implements TargetQueryPort {
  constructor(
    private readonly mode: MockTargetMode = "success",
    private readonly store: MockCurationStore = createMockCurationStore(),
  ) {}

  async list(query: { readonly search?: string }) {
    const problem = this.problem<{ items: readonly LearningTargetModel[]; totalCount: number }>();
    if (problem) {
      return problem;
    }

    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = this.store.targets.filter(
      (target) =>
        search.length === 0 ||
        target.name.toLocaleLowerCase().includes(search) ||
        target.definition.toLocaleLowerCase().includes(search),
    );
    return {
      status: "success" as const,
      value: {
        items: items.map((target) => this.toLearningTarget(target)),
        totalCount: items.length,
      },
    };
  }

  async get(targetId: string): Promise<LearningOutcome<LearningTargetModel>> {
    const problem = this.problem<LearningTargetModel>();
    if (problem) {
      return problem;
    }
    const target = this.store.targets.find((candidate) => candidate.id === targetId);
    return target
      ? { status: "success", value: this.toLearningTarget(target) }
      : { status: "not_found", message: "Learning target not found." };
  }

  private toLearningTarget(target: {
    readonly id: string;
    readonly name: string;
    readonly definition: string;
    readonly scopeItems: readonly {
      readonly id: string;
      readonly kind: "requirement" | "requirement-set";
      readonly title: string;
    }[];
  }): LearningTargetModel {
    return {
      id: target.id,
      name: target.name,
      definition: target.definition,
      scopeSummary: `${target.scopeItems.length} curated scope item(s)`,
      scopeItems: target.scopeItems.map((item) => {
        const source = this.store.requirements.find(
          (candidate) => candidate.id === item.id,
        );
        return {
          ...item,
          summary: source?.definition ?? "Curated scope item",
        };
      }),
    };
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
