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
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Access Control Matrix",
    summary:
      "Формальная модель прав доступа: строки представляют subjects, столбцы — objects, а ячейки содержат access rights subject к object.",
  },
  {
    id: "01a0737a-ac0d-7c3c-af10-033e1398119e",
    sourcePath: "graph/access-control-list.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Access Control List",
    summary:
      "Object-centric структура доступа, связанная с resource и перечисляющая principals вместе с разрешёнными для них access rights или modes.",
  },
  {
    id: "01a0737a-b9d3-74a7-85ed-83619afc457f",
    sourcePath: "graph/capability-list.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Capability List",
    summary:
      "Subject-centric представление прав: для subject хранится набор capabilities, каждая из которых указывает object и разрешённые operations.",
  },
  {
    id: "01a0737a-c4aa-704e-b0c7-56d0665fc842",
    sourcePath: "graph/role-based-access-control.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Role-Based Access Control",
    summary:
      "Модель авторизации, где permissions назначаются roles, а users или subjects получают permissions через назначение этим roles.",
  },
  {
    id: "01a0737a-cf99-7b59-97ff-d678a694b1c0",
    sourcePath: "graph/attribute-based-access-control.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Attribute-Based Access Control",
    summary:
      "Методология авторизации, где решение определяется evaluation attributes subject, resource, action и environment against policies or rules.",
  },
  {
    id: "01a06c89-a98d-7e86-b884-27348617f46e",
    sourcePath: "graph/future.md",
    sourceKind: "construct",
    semanticKind: "concept",
    title: "Future",
    summary:
      "Асинхронная абстракция вычисления, завершения или результата, который может стать доступен позже.",
  },
  {
    id: "01a06c89-a98d-7bfe-bf7b-9da8338e37a1",
    sourcePath: "graph/concurrency.md",
    sourceKind: "property",
    semanticKind: "concept",
    title: "Concurrency",
    summary:
      "Организация нескольких незавершённых работ так, чтобы их прогресс перекрывался во времени даже без одновременного физического выполнения.",
  },
  {
    id: "01a06c89-a98d-717b-9e3f-d24a9567040c",
    sourcePath: "graph/parallelism.md",
    sourceKind: "property",
    semanticKind: "concept",
    title: "Parallelism",
    summary:
      "Фактическое одновременное выполнение нескольких работ на нескольких execution resources, например CPU cores или worker threads.",
  },
  {
    id: "01a06c89-a98d-715a-bd05-0d62b2ec422a",
    sourcePath: "graph/i-o-bound-operation.md",
    sourceKind: "construct",
    semanticKind: "concept",
    title: "I/O-bound operation",
    summary:
      "Операция, существенную часть времени ожидающая внешнего ввода-вывода, а не вычисления CPU.",
  },
  {
    id: "01a06c89-a98d-7066-9993-614c9c97ee24",
    sourcePath: "graph/structured-concurrency.md",
    sourceKind: "practice",
    semanticKind: "strategy",
    title: "Structured Concurrency",
    summary:
      "Принцип организации concurrent tasks в иерархию scopes с предсказуемыми границами lifetime, failure и cancellation.",
  },
  {
    id: "01a0737a-db09-7af8-900b-842650784c56",
    sourcePath: "graph/relationship-based-access-control.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Relationship-Based Access Control",
    summary:
      "Модель авторизации, в которой permissions выводятся из relationships между principals, resources и другими entities.",
  },
  {
    id: "01a0737d-09d3-7dde-bb51-1436dfc85306",
    sourcePath: "graph/lattice-based-access-control.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Lattice-Based Access Control",
    summary:
      "Формальная access-control модель, где security classes образуют lattice, а доступ определяется dominance и правилами информационного потока.",
  },
  {
    id: "01a0737b-6847-7b6a-a45b-cce7ac6c4167",
    sourcePath: "graph/zanzibar.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Zanzibar",
    summary:
      "Google global authorization system для хранения и evaluation relationship-oriented fine-grained permissions в больших distributed services.",
  },
  {
    id: "01a0737b-446a-7ce5-aa39-921ad81e1201",
    sourcePath: "graph/open-policy-agent.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Open Policy Agent",
    summary:
      "General-purpose policy engine, который отделяет policy decision logic от application code и evaluates declarative Rego policies.",
  },
  {
    id: "01a0737b-5beb-772c-9a59-ed54477fd5b1",
    sourcePath: "graph/cedar.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Cedar",
    summary:
      "Authorization policy language и engine для expressive, fast, safe и analyzable fine-grained permissions.",
  },
  {
    id: "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    sourcePath: "graph/policy-decision-point.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Policy Decision Point",
    summary:
      "Функциональная точка authorization architecture, которая выбирает применимые policies и вычисляет итоговое authorization decision.",
  },
  {
    id: "01a07395-1c59-753d-b295-1c418b25eff1",
    sourcePath: "graph/policy-enforcement-point.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Policy Enforcement Point",
    summary:
      "Функциональная точка на пути доступа к resource, которая получает authorization decision и фактически применяет его.",
  },
  {
    id: "01a07396-0cd4-7515-8504-248a54b77db5",
    sourcePath: "graph/policy-information-point.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Policy Information Point",
    summary:
      "Функциональная точка, предоставляющая attribute values и другие данные, необходимые для policy evaluation.",
  },
  {
    id: "01a075a7-efe1-7c2e-982d-94af2d46f794",
    sourcePath: "graph/policy-administration-point.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Policy Administration Point",
    summary:
      "Функциональная роль XACML authorization architecture, отвечающая за создание и административное управление policies и policy sets.",
  },
  {
    id: "01a0737b-3804-755e-b8df-1d039c2b14b7",
    sourcePath: "graph/xacml.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "XACML",
    summary:
      "OASIS standard policy language и authorization architecture для attribute-oriented access-control rules, policy sets и decision semantics.",
  },
  {
    id: "01a075a8-cc16-7a21-b555-dbb628329a1f",
    sourcePath: "graph/policy-set.md",
    sourceKind: "unspecified",
    semanticKind: "concept",
    title: "Policy Set",
    summary:
      "Агрегирующая XACML policy-структура, объединяющая policies и другие policy sets и задающая combining algorithm.",
  },
  {
    id: "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    sourcePath: "graph/policy-combining-algorithm.md",
    sourceKind: "unspecified",
    semanticKind: "mechanism",
    title: "Policy Combining Algorithm",
    summary:
      "XACML-алгоритм, определяющий, как результаты evaluation нескольких policies или policy sets сводятся к одному результату.",
  },
  {
    id: "01a075ad-9bcd-7ce3-bc93-39fb3f1d44c0",
    sourcePath: "graph/deny-overrides.md",
    sourceKind: "unspecified",
    semanticKind: "mechanism",
    title: "Deny-overrides",
    summary:
      "XACML combining algorithm, в котором deny-oriented результат получает приоритет при объединении policy results.",
  },
  {
    id: "01a075ae-6d66-7c40-90e3-43951b3ef2cf",
    sourcePath: "graph/permit-overrides.md",
    sourceKind: "unspecified",
    semanticKind: "mechanism",
    title: "Permit-overrides",
    summary:
      "XACML combining algorithm, в котором permit-oriented результат получает приоритет при объединении policy results.",
  },
  {
    id: "01a075af-0464-713d-8aab-68f6c263b3a2",
    sourcePath: "graph/first-applicable.md",
    sourceKind: "unspecified",
    semanticKind: "mechanism",
    title: "First-applicable",
    summary:
      "Order-sensitive XACML combining algorithm, возвращающий результат первого policy или rule, чья evaluation не дала NotApplicable.",
  },
  {
    id: "01a075ba-b692-7554-bc5b-86bd70bc58fb",
    sourcePath: "graph/only-one-applicable.md",
    sourceKind: "unspecified",
    semanticKind: "mechanism",
    title: "Only-one-applicable",
    summary:
      "XACML combining algorithm, требующий, чтобы применимым оказался ровно один policy или policy set.",
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
  relation(
    "async-programming-concurrency",
    "01a06c89-a98d-78a5-97e0-949effb4475a",
    "01a06c89-a98d-7bfe-bf7b-9da8338e37a1",
    "realizes",
  ),
  relation(
    "structured-concurrency-task",
    "01a06c89-a98d-7066-9993-614c9c97ee24",
    "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    "uses",
  ),
  relation(
    "structured-concurrency-cancellation",
    "01a06c89-a98d-7066-9993-614c9c97ee24",
    "01a06c89-a98d-7dc9-b125-00391eb1855e",
    "uses",
  ),
  relation(
    "async-await-future",
    "01a06c89-a98d-7144-955e-bad081641a0b",
    "01a06c89-a98d-7e86-b884-27348617f46e",
    "uses",
  ),
  relation(
    "task-future",
    "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    "01a06c89-a98d-7e86-b884-27348617f46e",
    "uses",
  ),
  relation(
    "task-async-runtime",
    "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "depends_on",
  ),
  relation(
    "async-runtime-task",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "01a06c89-a98d-73aa-810e-6934a89f1f1c",
    "uses",
  ),
  relation(
    "async-runtime-future",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "01a06c89-a98d-7e86-b884-27348617f46e",
    "uses",
  ),
  relation(
    "async-runtime-coroutine",
    "01a06c89-a98d-7d01-9421-7245e031f828",
    "01a06c89-a98d-739e-b348-7aaad3e0f65c",
    "uses",
  ),
  relation(
    "rebac-access-control-policy",
    "01a0737a-db09-7af8-900b-842650784c56",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "realizes",
  ),
  relation(
    "lattice-access-control-policy",
    "01a0737d-09d3-7dde-bb51-1436dfc85306",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "realizes",
  ),
  relation(
    "zanzibar-rebac",
    "01a0737b-6847-7b6a-a45b-cce7ac6c4167",
    "01a0737a-db09-7af8-900b-842650784c56",
    "realizes",
  ),
  relation(
    "opa-access-control-policy",
    "01a0737b-446a-7ce5-aa39-921ad81e1201",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "uses",
  ),
  relation(
    "opa-pdp",
    "01a0737b-446a-7ce5-aa39-921ad81e1201",
    "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    "realizes",
  ),
  relation(
    "cedar-access-control-policy",
    "01a0737b-5beb-772c-9a59-ed54477fd5b1",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "uses",
  ),
  relation(
    "pdp-access-control-policy",
    "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    "01a06d2f-309f-7f2c-bb7a-98263185e0f8",
    "uses",
  ),
  relation(
    "pep-pdp",
    "01a07395-1c59-753d-b295-1c418b25eff1",
    "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    "depends_on",
  ),
  relation(
    "pip-pdp",
    "01a07396-0cd4-7515-8504-248a54b77db5",
    "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    "enables",
  ),
  relation(
    "abac-pip",
    "01a0737a-cf99-7b59-97ff-d678a694b1c0",
    "01a07396-0cd4-7515-8504-248a54b77db5",
    "depends_on",
  ),
  relation(
    "pap-policy-set",
    "01a075a7-efe1-7c2e-982d-94af2d46f794",
    "01a075a8-cc16-7a21-b555-dbb628329a1f",
    "produces",
  ),
  relation(
    "xacml-abac",
    "01a0737b-3804-755e-b8df-1d039c2b14b7",
    "01a0737a-cf99-7b59-97ff-d678a694b1c0",
    "realizes",
  ),
  relation(
    "policy-set-combining-algorithm",
    "01a075a8-cc16-7a21-b555-dbb628329a1f",
    "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    "depends_on",
  ),
  relation(
    "pdp-policy-set",
    "01a07394-110d-7a20-9ae4-5e07c60c18cb",
    "01a075a8-cc16-7a21-b555-dbb628329a1f",
    "uses",
  ),
  relation(
    "deny-overrides-combining",
    "01a075ad-9bcd-7ce3-bc93-39fb3f1d44c0",
    "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    "specializes",
  ),
  relation(
    "permit-overrides-combining",
    "01a075ae-6d66-7c40-90e3-43951b3ef2cf",
    "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    "specializes",
  ),
  relation(
    "first-applicable-combining",
    "01a075af-0464-713d-8aab-68f6c263b3a2",
    "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    "specializes",
  ),
  relation(
    "only-one-applicable-combining",
    "01a075ba-b692-7554-bc5b-86bd70bc58fb",
    "01a075a9-8ff2-7c13-87c4-458f2ce89c0f",
    "specializes",
  ),
];
