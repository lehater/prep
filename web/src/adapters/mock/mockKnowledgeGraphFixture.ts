import type {
  KnowledgeNodeModel,
  KnowledgeRelationModel,
  KnowledgeSemanticKind,
} from "../../features/knowledge-explorer/model/knowledge";

type KnowledgeGraphSeed = {
  readonly id: string;
  readonly sourcePath: `graph/${string}.md`;
  readonly sourceKind: string;
  readonly semanticKind: KnowledgeSemanticKind;
  readonly title: string;
  readonly summary: string;
};

// Real Concept Cards copied from lehater/knowledge-graph@main.
// sourceKind is retained as provenance because Knowledge Graph V2 has a broader
// referent-form vocabulary than Prep's current concept/mechanism/procedure/strategy model.
const KNOWLEDGE_GRAPH_SEEDS: readonly KnowledgeGraphSeed[] = [
  {
    id: "01a06c89-a98d-78a5-97e0-949effb4475a",
    sourcePath: "graph/asynchronous-programming.md",
    sourceKind: "model",
    semanticKind: "concept",
    title: "Asynchronous Programming",
    summary:
      "Модель организации программы, в которой длительная операция может приостановить собственное продолжение, уступить выполнение другой работе и возобновиться после события готовности.",
  },
  {
    id: "01a06c89-a98d-7202-9123-cf733eecd1d7",
    sourcePath: "graph/asyncio.md",
    sourceKind: "technology",
    semanticKind: "concept",
    title: "asyncio",
    summary:
      "Стандартная библиотека Python для concurrent-кода на основе async/await, предоставляющая coroutines, Tasks, Futures, event loop и API для асинхронного I/O.",
  },
  {
    id: "01a06c89-a98d-7d01-9421-7245e031f828",
    sourcePath: "graph/async-runtime.md",
    sourceKind: "mechanism",
    semanticKind: "mechanism",
    title: "Async Runtime",
    summary:
      "Инфраструктура, которая координирует асинхронные операции: хранит готовую работу, запускает её, реагирует на completion/I/O events и возобновляет продолжения.",
  },
  {
    id: "01a06c89-a98d-793f-ac52-ea72eb9aea9c",
    sourcePath: "graph/event-loop.md",
    sourceKind: "mechanism",
    semanticKind: "mechanism",
    title: "Event Loop",
    summary:
      "Runtime-механизм, который выбирает готовую работу, запускает callbacks/tasks и реагирует на таймеры или I/O, продвигая несколько асинхронных операций.",
  },
  {
    id: "01a06c89-a98d-739e-b348-7aaad3e0f65c",
    sourcePath: "graph/coroutine.md",
    sourceKind: "construct",
    semanticKind: "concept",
    title: "Coroutine",
    summary:
      "Приостанавливаемое вычисление, которое сохраняет логическое продолжение и может быть возобновлено позже без блокирования потока на всё время ожидания.",
  },
  {
    id: "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    sourcePath: "graph/task.md",
    sourceKind: "construct",
    semanticKind: "concept",
    title: "Task",
    summary:
      "Запланированная единица асинхронной работы со своим состоянием выполнения и завершением, которую runtime может запускать, приостанавливать и возобновлять.",
  },
  {
    id: "01a06c89-a98d-7144-955e-bad081641a0b",
    sourcePath: "graph/async-await.md",
    sourceKind: "construct",
    semanticKind: "concept",
    title: "async/await",
    summary:
      "Языковая модель для последовательного описания асинхронного вычисления: async задаёт асинхронный контекст, await — точку возможной приостановки.",
  },
  {
    id: "01a06c89-a98d-7dc9-b125-00391eb1855e",
    sourcePath: "graph/cancellation.md",
    sourceKind: "mechanism",
    semanticKind: "mechanism",
    title: "Cancellation",
    summary:
      "Управляемый запрос прекратить незавершённую асинхронную работу, когда её результат больше не нужен или родительский контекст завершён.",
  },
  {
    id: "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    sourcePath: "graph/access-control-policy.md",
    sourceKind: "artifact",
    semanticKind: "concept",
    title: "Access Control Policy",
    summary:
      "Набор high-level rules и requirements, определяющих кто, при каких условиях и к каким protected resources может получить access.",
  },
  {
    id: "01a0737a-9db9-76dc-b251-e95fc992e816",
    sourcePath: "graph/access-control-matrix.md",
    sourceKind: "model",
    semanticKind: "concept",
    title: "Access Control Matrix",
    summary:
      "Формальная модель прав доступа: строки представляют subjects, столбцы — objects, а ячейки содержат access rights subject к object.",
  },
  {
    id: "01a0737a-ac0d-7c3c-af10-033e1398119e",
    sourcePath: "graph/access-control-list.md",
    sourceKind: "representation",
    semanticKind: "concept",
    title: "Access Control List",
    summary:
      "Object-centric структура доступа, связанная с resource и перечисляющая principals вместе с разрешёнными для них access rights или modes.",
  },
  {
    id: "01a0737a-b9d3-74a7-85ed-83619afc457f",
    sourcePath: "graph/capability-list.md",
    sourceKind: "representation",
    semanticKind: "concept",
    title: "Capability List",
    summary:
      "Subject-centric представление прав: для subject хранится набор capabilities, каждая из которых указывает object и разрешённые operations.",
  },
  {
    id: "01a0737a-c4aa-704e-b0c7-56d0665fc842",
    sourcePath: "graph/role-based-access-control.md",
    sourceKind: "model",
    semanticKind: "concept",
    title: "Role-Based Access Control",
    summary:
      "Модель авторизации, где permissions назначаются roles, а users или subjects получают permissions через назначение этим roles.",
  },
  {
    id: "01a0737a-cf99-7b59-97ff-d678a694b1c0",
    sourcePath: "graph/attribute-based-access-control.md",
    sourceKind: "methodology",
    semanticKind: "concept",
    title: "Attribute-Based Access Control",
    summary:
      "Методология авторизации, где решение определяется evaluation attributes subject, resource, action и environment against policies or rules.",
  },
];

export const knowledgeGraphMockNodes: readonly KnowledgeNodeModel[] =
  KNOWLEDGE_GRAPH_SEEDS.map(({ id, semanticKind, title, summary }) => ({
    id,
    semanticKind,
    title,
    summary,
  }));

const relation = (
  id: string,
  sourceId: string,
  targetId: string,
  type: KnowledgeRelationModel["type"],
): KnowledgeRelationModel => ({
  id: `kg-relation-${id}`,
  sourceId,
  targetId,
  type,
});

// Knowledge Graph V2 persists explanatory wikilinks instead of requiring typed edges.
// Prep treats typed relations as an import/read-model concern and emits one only when
// the source prose supports the accepted type and direction without adding meaning.
export const knowledgeGraphMockRelations: readonly KnowledgeRelationModel[] = [
  relation(
    "asyncio-uses-event-loop",
    "01a06c89-a98d-7202-9123-cf733eecd1d7",
    "01a06c89-a98d-793f-ac52-ea72eb9aea9c",
    "uses",
  ),
  relation(
    "task-uses-coroutine",
    "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    "01a06c89-a98d-739e-b348-7aaad3e0f65c",
    "uses",
  ),
  relation(
    "asyncio-asynchronous-programming",
    "01a06c89-a98d-7202-9123-cf733eecd1d7",
    "01a06c89-a98d-78a5-97e0-949effb4475a",
    "realizes",
  ),
  relation(
    "async-runtime-asynchronous-programming",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "01a06c89-a98d-78a5-97e0-949effb4475a",
    "realizes",
  ),
  relation(
    "event-loop-async-runtime",
    "01a06c89-a98d-793f-ac52-ea72eb9aea9c",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "realizes",
  ),
  relation(
    "async-await-asynchronous-programming",
    "01a06c89-a98d-7144-955e-bad081641a0b",
    "01a06c89-a98d-78a5-97e0-949effb4475a",
    "realizes",
  ),
  relation(
    "acl-access-control-matrix",
    "01a0737a-ac0d-7c3c-af10-033e1398119e",
    "01a0737a-9db9-76dc-b251-e95fc992e816",
    "realizes",
  ),
  relation(
    "capability-list-access-control-matrix",
    "01a0737a-b9d3-74a7-85ed-83619afc457f",
    "01a0737a-9db9-76dc-b251-e95fc992e816",
    "realizes",
  ),
  relation(
    "rbac-access-control-policy",
    "01a0737a-c4aa-704e-b0c7-56d0665fc842",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "realizes",
  ),
  relation(
    "abac-access-control-policy",
    "01a0737a-cf99-7b59-97ff-d678a694b1c0",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "realizes",
  ),
];
