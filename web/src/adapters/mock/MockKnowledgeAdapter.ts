import type {
  KnowledgeGraphModel,
  KnowledgeNodeModel,
  KnowledgeScope,
} from "../../features/knowledge-explorer/model/knowledge";
import type {
  KnowledgeCollection,
  KnowledgeListQuery,
  KnowledgeQueryOutcome,
  KnowledgeQueryPort,
} from "../../features/knowledge-explorer/ports/KnowledgeQueryPort";
import { createMockCurationStore, type MockCurationStore } from "./MockCurationStore";

export type MockKnowledgeMode = "success" | "unavailable" | "failure";

export class MockKnowledgeAdapter implements KnowledgeQueryPort {
  constructor(
    private readonly mode: MockKnowledgeMode = "success",
    private readonly store: MockCurationStore = createMockCurationStore(),
  ) {}

  async list(
    scope: KnowledgeScope,
    query: KnowledgeListQuery,
  ): Promise<KnowledgeQueryOutcome<KnowledgeCollection>> {
    const problem = this.problem<KnowledgeCollection>();
    if (problem) {
      return problem;
    }

    const search = query.search?.trim().toLocaleLowerCase() ?? "";
    const items = this.nodesForScope(scope).filter(
      (node) =>
        (!query.semanticKind || node.semanticKind === query.semanticKind) &&
        (search.length === 0 ||
          node.title.toLocaleLowerCase().includes(search) ||
          node.summary.toLocaleLowerCase().includes(search)),
    );

    return {
      status: "success",
      value: { items, totalCount: items.length },
    };
  }

  async get(
    scope: KnowledgeScope,
    knowledgeId: string,
  ): Promise<KnowledgeQueryOutcome<KnowledgeNodeModel | null>> {
    const problem = this.problem<KnowledgeNodeModel | null>();
    if (problem) {
      return problem;
    }

    return {
      status: "success",
      value:
        this.nodesForScope(scope).find((node) => node.id === knowledgeId) ?? null,
    };
  }

  async graph(
    scope: KnowledgeScope,
  ): Promise<KnowledgeQueryOutcome<KnowledgeGraphModel>> {
    const problem = this.problem<KnowledgeGraphModel>();
    if (problem) {
      return problem;
    }

    const nodes = this.nodesForScope(scope);
    const nodeIds = new Set(nodes.map((node) => node.id));

    return {
      status: "success",
      value: {
        scope,
        nodes,
        relations: this.store.knowledgeRelations.filter(
          (relation) =>
            nodeIds.has(relation.sourceId) && nodeIds.has(relation.targetId),
        ),
      },
    };
  }

  private nodesForScope(scope: KnowledgeScope): readonly KnowledgeNodeModel[] {
    if (scope.kind === "global") {
      return this.store.knowledgeNodes;
    }

    const targetIds = new Set(this.store.knowledgeIdsForTarget(scope.targetId));
    if (!scope.focusId) {
      return this.store.knowledgeNodes.filter((node) => targetIds.has(node.id));
    }

    const capabilityId = scope.focusId.replace(/^focus-/, "");
    if (!(this.store.targetCapabilityIds.get(scope.targetId) ?? []).includes(capabilityId)) {
      return [];
    }
    const capability = this.store.capabilities.find((item) => item.id === capabilityId);
    const focusIds = new Set(capability?.knowledgeIds ?? []);
    return this.store.knowledgeNodes.filter(
      (node) => targetIds.has(node.id) && focusIds.has(node.id),
    );
  }

  private problem<T>(): KnowledgeQueryOutcome<T> | null {
    if (this.mode === "unavailable") {
      return {
        status: "unavailable",
        message: "Knowledge data is temporarily unavailable.",
      };
    }
    if (this.mode === "failure") {
      return {
        status: "failure",
        message: "Knowledge data could not be loaded. Retry the operation.",
      };
    }
    return null;
  }
}
