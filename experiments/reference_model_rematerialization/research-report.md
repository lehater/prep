# PREP — Reference Engineering Model rematerialization A/B

## Эксперимент

**PREP baseline:** `ac9d97af3357663207d7c063c415a84327ab71f7`  
**Экспериментальная ветка:** `experiment/reference-model-rematerialization`  
**Frozen Reference Model:** `b172fd1c7519f88454d2135c1435dd0e45dbb403`

Первый materialization выполнен до чтения OLD topology как oracle. Для NEW использовались
только canonical project-owned документы PREP, нормализованные Project Facts, frozen
Reference Model и materializer. OLD `.harness/**` был скопирован в baseline snapshot
только после получения frozen NEW graph.

## Observed facts

1. Frozen materializer завершился `STABLE`, без diagnostics.
2. NEW graph структурно валиден: **20 Authorities / 63 Capabilities**.
3. OLD graph: **17 Authorities / 31 Capabilities**.
4. Для `FRONTEND-IMPLEMENTATION`:
   - OLD closure: **28 capabilities / 28 provider paths**;
   - NEW closure: **63 capabilities / 30 provider paths + 3 capabilities без provider**.
5. Независимый NEW Core удалось собрать для **60/63** capabilities из существующих canonical docs.
6. Без честного project-owned provider остались:
   - `security-architecture`;
   - `security-analysis`;
   - `operability-design`.
7. OLD target state: `COMPLETE`. NEW target state: `READY`:
   - CREATE: Security Architecture, Operability Design;
   - PENDING: Security Analysis, Implementation Plan, Completion Criteria.
8. OLD validation checkpoints проходят все пять проверок.
9. NEW:
   - Engineering Coverage evaluator запускается;
   - strict semantic baseline / integration / full revalidate не проходят из-за трех отсутствующих prerequisites;
   - docs validation обнаруживает `docs/domain/relation-classification-catalog.yaml` вне NEW Core.
10. NEW Coverage автоматически активирует **67 concerns**:
    - 14 COVERED;
    - 48 MISSING;
    - 5 BLOCKED;
    - 53 remaining work items.
11. Повторный frozen semantic pass, в котором эти 67 concerns выведены только из NEW
    topology + reference activation policy, завершается `MATERIALIZATION_CONFLICT`:
    `delivery.migration`, `delivery.rollback`, `transition.revalidation` требуют
    `TRANSITION-CONTRACT`, одновременно признанный N/A project predicates.
12. Ни Reference Model, ни Harness research branch в ходе первого прохода не изменялись.

## Derived comparison

### 1. Responsibility coverage

На уровне названий ответственности результат выглядит сильным: **30 из 31** OLD
capability имеют узнаваемый NEW counterpart или decomposition. Исключение —
`prep.knowledge-relation-classification`.

Эта цифра **не означает ~97% semantic equivalence**. Основное расхождение находится
не в наличии узлов, а в `REQUIRES`, applicability, lifecycle propagation и execution context.

### 2. PREP domain stress case

Canonical PREP knowledge утверждает:

```text
Knowledge Model -> Learning Design
Learning Design <-> learner evidence/context
```

Кроме того, `knowledge-model.md` прямо использует
`relation-classification-catalog.yaml` как canonical predicate vocabulary.

OLD topology сохраняет причинность:

```text
relation-classification
        ↓
knowledge-model
        ↓
learning-design
        ↓
learner-model / downstream engineering
```

Frozen NEW создает три sibling instances:

```text
DOMAIN-MODEL@KNOWLEDGE-MODEL
DOMAIN-MODEL@LEARNING-DESIGN
DOMAIN-MODEL@LEARNER-MODEL
```

Каждый зависит только от generic Product/Domain/Model-Context prerequisites.
Между instances нет project-specific edges, а relation classification не получает
самостоятельного CapabilityId.

Это не cosmetic difference: Lifecycle mutation `Knowledge Model acceptance v1 -> v2`
дает:

- OLD: **24 STALE** downstream capabilities;
- NEW: **2 STALE** — только `implementation-plan` и `completion-criteria`.

Следовательно, current frozen model теряет accepted project causality.

### 3. Revalidation frontier

| Controlled mutation | OLD STALE | NEW STALE | Наблюдение |
|---|---:|---:|---|
| Product intent/acceptance | 29 | 60 | NEW сильно шире |
| Knowledge Model | 24 | 2 | NEW теряет project-specific causality |
| Machine Interface | 15 | 2 | NEW теряет interface-driven downstream causality |
| Presentation System | 8 | 27 | NEW размножает invalidation на 25 screen subjects |
| Data/Consistency | 2 | 3 | близко по масштабу, но иная причинность |

NEW graph поэтому не является просто «более подробным OLD». Он одновременно
**over-invalidates generic roots** и **under-invalidates project-specific relationships**.

### 4. Consumer context minimization

Для одного и того же Implementation Design work:

**OLD**

- direct prerequisites: **3**;
- allowed read paths: **6**;
- status: `READY`.

**NEW**

- direct prerequisites у `implementation-plan`: **52**;
- satisfied: 49;
- design gaps: 3;
- allowed read paths: **28**;
- status: `BLOCKED`.

Даже topology-only simulation с тремя synthetic providers дает 31 read paths.
То есть materialized `IMPLEMENTATION-PLAN` превращается в почти плоский aggregator
всей engineering topology. Это противоречит цели consumer-specific context minimization.

### 5. Applicability

Frozen rules слишком сильны для PREP:

- `network_exposed=true` или `credentials=true` автоматически делают
  Security Architecture REQUIRED;
- `credentials=true` автоматически делает Security Analysis REQUIRED;
- `external_dependencies=true` автоматически делает Operability Design REQUIRED.

В PREP canonical truth эти признаки существуют внутри local single-user deployment:
external runtime/API key — integration/deployment concern, а не отдельная
identity/session/security lifecycle. Runtime status/failure behavior уже имеет owners
в System Architecture, Machine Interface и Verification.

Результат — materializer создает обязательные capabilities, которым нельзя честно
назначить существующий canonical provider.

## Counterexamples

### CE-01 — scoped Capability does not express scoped dependencies

`CapabilityTemplate + subject` умеет создать несколько Domain Model instances,
но frozen contract не умеет сказать:

```text
DOMAIN-MODEL@LEARNING-DESIGN
  requires DOMAIN-MODEL@KNOWLEDGE-MODEL
```

или выделить `RELATION-CLASSIFICATION` как controlled specialization внутри
Knowledge domain semantics.

### CE-02 — generic downstream edge is too shallow

`MACHINE-INTERFACE-CONTRACT` зависит от Product Intent + System Boundary Rules,
но PREP machine contracts materialize Application/Domain semantics. Поэтому
Application/Domain change не делает Machine Interface stale.

### CE-03 — generic root aggregation destroys context minimization

`IMPLEMENTATION-PLAN` напрямую требует 52 capability instances вместо потребления
небольшого набора already-integrated upstream contracts.

### CE-04 — applicability signal is not the same as independent Authority need

Наличие network boundary, credential или external dependency не доказывает, что
проекту нужен отдельный Security/Operability Authority contract.

### CE-05 — concern activation and template applicability disagree

Reference coverage policy активирует transition concerns, которые proof routing
направляет в `TRANSITION-CONTRACT`, но Reference Model predicates одновременно
делают этот template N/A. Frozen pipeline не имеет согласованного способа разрешить
это противоречие.

## Reference Model gaps

**P0**

1. Нет controlled project-specific dependency refinement между materialized capability instances.
2. Нет controlled specialization для independently-current project semantic units вроде
   `relation-classification`.
3. Applicability Security/Operability использует слишком грубые existence predicates вместо
   критерия independent ownership / independently consumed contract.
4. Нет invariant между concern activation/proof routing и template applicability.

**P1**

5. `IMPLEMENTATION-PLAN` имеет чрезмерно широкий direct dependency fan-in и раздувает agent context.
6. Machine Interface, Data, Quality, Engineering Policy, Component Design, Verification/Test
   требуют project-specific dependency refinements для PREP.
7. Материализация одного Consumer не определяет, как собрать coherent multi-consumer
   Project Engineering Graph.
8. Нужен явный этап independent concern applicability derivation до/внутри reconcile.

**P2**

9. Per-subject Screen/Machine capabilities полезны только если provider/currentness может
   быть subject-granular; иначе cardinality растет без эквивалентной точности lifecycle.

## Old Harness problems

Эксперимент **не доказал** существенных `OLD_LEGACY_OR_REDUNDANT` элементов.

Есть потенциальные места упрощения:

- single `screen-view-design` агрегирует 25 view subjects;
- single `machine-interfaces` агрегирует две machine boundaries;
- Verification/Implementation responsibilities могут быть разложены более стандартно.

Но текущая реализация NEW пока не доказывает, что такое дробление улучшает поведение:
provider/currentness остаются document-granular, а execution context становится шире.
Поэтому эти различия оставлены `UNRESOLVED`, а не помечены как NEW_BETTER.

## Recommended model changes

Рекомендуемая архитектура:

```text
Reference Engineering Model
        ↓
generic materialization
        ↓
Project Refinement Contract
        ↓
Project Engineering Graph
```

### Project Refinement Contract

Должен быть **ограниченным declarative layer**, а не вторым вручную написанным graph.

Разрешить только доказуемые refinements:

1. **specialize capability instance**
   - когда canonical project knowledge имеет независимый lifecycle/consumer;
   - пример: Knowledge relation classification.
2. **add project semantic dependency**
   - между уже materialized instances;
   - пример: Learning Design -> Knowledge Model.
3. **refine applicability**
   - только с evidence + reopening conditions;
   - пример: local external-runtime credential не создает independent Security Architecture.
4. **bind/partition provider by subject**
   - если один document содержит несколько independently accepted subject contracts.
5. **compose Consumers**
   - несколько materialization requests должны собираться в один validated project graph.

Materializer обязан валидировать refinement:

- Authority ownership совместим;
- dependency cycle отсутствует;
- capability/claim surface не расширяется молча;
- override имеет evidence и reopening conditions;
- refinement не может удалить обязательную reference semantics без явного counterevidence.

### Reference-level correction

Отдельно нужно исправить reusable model/policies:

- согласовать concern activation с N/A templates;
- ослабить Security/Operability applicability до признака independently material contract;
- уменьшить fan-in Implementation Plan, заставив его потреблять более интегрированные
  upstream contracts, а не весь graph напрямую.

## Integration decision

# C. PROJECT-SPECIFIC REFINEMENT REQUIRED

Reference Model v0 подтвердил полезность как **generic skeleton**:

- deterministic materialization работает;
- Authority/capability responsibility vocabulary в основном узнает реальный PREP;
- per-subject expansion технически работает;
- standard validators принимают generated graph.

Но он **не может заменить** существующий Project Engineering Graph без потери инженерной
семантики:

- потеряна project-specific causal topology;
- lifecycle propagation существенно неверна;
- context minimization деградирует;
- applicability создает лишние mandatory contracts;
- semantic concern pass конфликтует с собственной template applicability.

Следующий эксперимент должен проверять не «еще больше predicates», а минимальный
`Project Refinement Contract`, который восстанавливает CE-01..CE-05 без возврата к
полностью ручному Engineering Graph.
