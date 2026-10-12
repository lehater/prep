# Integrated Prep information model + fixture — bounded investigation protocol (2026-10-13)

**Classification:** Noncanonical research/design protocol based on Owner's 2026-10-13 priority clarification. Not a Domain Model, storage schema, Harness decision, approved type taxonomy, UI contract or statement of results. **Question/experiment status lives only in** [open questions](open-questions.md) and [open experiments](open-experiments.md). Do not give this document an independent status ledger.

## Decision being prepared

Before elaborating the full UI, reach an intelligible **logical/conceptual representation** of a user-owned Prep corpus: Goal, CapabilityDescription (description of an ability, not observed ability), reusable Knowledge, and Practice/StudyMaterial, plus only justified links and contextual scopes. The model must be expressive enough for realistic multi-type Knowledge–Knowledge relations, potentially typed Capabilities, and varying material associations. This is **not** a request to name or approve a complete professional ontology.

**Design order is deliberately iterative:** first draw a small candidate concept/association map, then construct counterexample-rich *synthetic fixture(s)*, then refine the model and repeat. Neither a data-free UML diagram nor a fixture designed solely to make a preconceived schema pass is sufficient. The **logical model is distinct** from (i) the eventual persisted JSON/SQL/graph schema, (ii) a graph renderer's nodes/edges and (iii) workspace UI selection/filter state.

## Existing research constraints to reuse, not silently re-decide

1. See [current product-learning research framing](research-framing.md) for user-supplied, potentially incomplete/uncertain content, Goal as context, study preparation/export, no completeness/truth/mastery guarantee.
2. See [Capability–Goal research questions](../capability-goal-semantics/open-questions.md), [baseline](../capability-goal-semantics/research-baseline-2026-10-12.md) and [EX-GF-01](../capability-goal-semantics/experiment-01-goal-first-model-stress-test.md): distinguish entity **instance identities**; different subject concepts; relation-instance identity; **selective admissibility** per relation meaning and endpoint roles. These are Owner research inputs and checks, not automatically Harness-admitted semantic decisions.
3. A Goal may initially have no linked Capabilities. Shared Knowledge and Capability may appear under multiple contexts. Absence of a relation is **unknown / not specified**, not proof of falsehood. C–C composition, Goal–Capability predicate, material-purpose relation, relation direction/multiplicity, deletion and contextual activity/result semantics remain open.
4. Capability decomposition is not automatically a Procedure, a dependency, an execution order, or personal proficiency. Knowledge content depth, a desired learning objective, and measured personal attainment must not be conflated.
5. Accepted product research references include Recorded Activity/Results; acknowledge their relation to chosen Goal/context and selection/export **as a boundary question**, not a fifth mandatory graph family or inferred competence feature. Recheck the relevant Harness branch before canonical claims.

## Candidate conceptual dimensions to inspect (not adopted type definitions)

| Dimension | Minimal modelling question | Illustrative placeholders |
| --- | --- | --- |
| **Goal** | What makes a goal/context an identifiable object? Can a goal be incomplete, and what is selected *within* it? | G1, G2 |
| **CapabilityDescription** | What independent ability/outcome description is reusable across goals? Can it have a **type dimension** without requiring one universal catalogue? | C1:type-1, C2:type-2 |
| **Knowledge** | What knowledge items are independent, reusable, heterogeneous and possibly related by more than one *meaningful* predicate? | K1:type-1, K2:type-2 |
| **StudyMaterial** | What is a separately identifiable item of source content or study prompt? Is its association to K, C, Goal or context direct, indirect or a decision still to be made? | M1, M2 |
| **Relationship / contextual association** | Is this an asserted reusable semantic relation or a Goal/Capability-relative study-selection claim? What are endpoint roles, direction if semantic, identity, permissible type pairings, multiplicity and conditions? | R1, R2; scope S1 |
| **Graph / UI projection** | Which subset of justified entities/relations is worth drawing? What are search, filters, selected object and focus? | Rendered views only; never create domain facts from layout |

Types of nodes and relations are **independent, extensible axes** for modelling checks. Placeholders merely test whether multiple types can coexist; they do not approve arbitrary user-defined predicates or make a typed Capability taxonomy mandatory. A semantic edge is not necessarily a visual graph edge. A material-to-K association is not automatically a direct material-to-C relationship.

## Investigation sequence and deliverables

### 1. P0 — Inventory and conceptual options (no code)

Review the existing research and current accepted branch constraints; create a compact **candidate class-and-relationship diagram** and short definitions/invariants table:
- distinct Goal, CapabilityDescription, Knowledge, StudyMaterial identities and boundaries;
- which links are represented as first-class *candidate* assertions, which are context-relative claims or view selections, and which remain undecided;
- directional relation semantics vs bidirectional UI navigation; reusability and shared instances;
- how multiple types of Knowledge, possible Capability types and typed K–K relation kinds can be represented *without* listing all actual kinds;
- what the model expressly **cannot infer** (truth, exhaustive scope, necessary skill, readiness, learning/mastery).

For unresolved choices, list **two or three small competing models**, not an arbitrary giant generic graph or an invented full predicate taxonomy. Label every assumption. Reuse GD/CD and Q-PLD questions; only genuinely new unknowns belong in [open questions](open-questions.md).

### 2. P0 — Construct an adversarial but readable data fixture

Based on the current candidate *and designed to challenge it*, write one or two small coherent fictional/user-supplied datasets (JSON/YAML or Markdown tables; serialization is not architectural authority). **Suggested workload, not a product limit:** 2 Goals; 3–5 Capabilities with at least two illustrative type labels; 8–12 Knowledge objects with >=2 type labels; 5–8 Materials with different purposes; at least 2 types of semantically directional K–K relation **if specific meanings can be supplied**; several context-dependent association records.

Include:
- one Knowledge in more than one Capability/Goal context and **different learning objectives** for the same Knowledge;
- two knowledge types participating in both same-type and cross-type candidate K–K links; a link whose direction or meaning matters; optionally the same pair with different independently justified relationship kinds;
- optional C–C representation **as a hypothesis**, not an asserted universal hierarchy; at least one flat and one decomposed case if relevant;
- a Material connected to multiple knowledge items, one off-goal but valid material, one item without a direct Capability association; do not invent M–C links if current relation semantics do not justify them;
- an incomplete Goal, absent/unknown relation, reusable object, ambiguous scope, and a deletion/change thought experiment;
- at least one challenge concerning recorded study activity/context *as a boundary question*; do not assign learning assessment data where none exists.

The **existing** [EX-PLD-06 fixture](../../../experiments/prep_study_loop/fixture.json) is a useful partial donor for G–C–K–M and contextual objectives but **does not contain K–K edges** and must not be passed off as the representative full-model fixture. Synthetic relation meanings should be minimally intelligible; labels `type-1/type-2` are fine for categories but a predicate's test must still describe what it means to the user.

### 3. P0 — Bidirectional stress review and model refinement

For every fixture fact, check that the candidate model faithfully expresses it; then take every proposed object/link kind and ask whether the dataset demonstrates its distinct meaning. Test reverse navigation, shared identity, direction, multiple contexts, incomplete information, update/delete consequences, relation records with potential duplicate endpoints, import/export fidelity, and alternative admissible interpretations.

Record in a dated research finding: **works / fails / requires Owner choice / out of scope**, counterexamples, exact trade-offs and smallest useful revisions. Do not fix problems by silently inventing new entity or relation kinds; bring material alternatives to Owner and leave undecided claims visibly undecided.

**Concept exit gate:** one coherent candidate model and fixture covering all four sections, plus a short unresolved-decision packet. Every example fact is representable or explicitly marked as a gap; every admitted-*candidate* relation has a user-understandable meaning and roles. This is a **research concept gate**, not Harness semantic acceptance and not a complete production schema.

### 4. P1 — UX from the model, then prototype, then comparison

Feed the reviewed model + fixture into [EX-PLD-09](open-experiments.md) for a connected end-to-end UI across the four sections: semantic filtering, table/graph selection, relation traversal, material inspection/selection and restoring context. Fix conceptual UX problems before writing new frontend. Build a browser prototype **after** the interactive concept is coherent. Run comparative **EX-PLD-06** with existing tools only after the prototype passes internal user-task readiness. The separate [EX-PLD-08](open-experiments.md) 2D-vs-3D question is optional; renderer FPS and deep graph visual tuning are not P0.

## Explicit non-goals of the present investigation

No production frontend/backend, storage selection, exact styling, automated corpus sourcing, full type ontology, forced graphs for Capabilities/Materials, professional competence scoring, model-driven mandatory learning sequence, approved proficiency taxonomy, performance/5k-node benchmark, or independent quality certification. These may each require separate later decisions but **must not block a coherent research information model**.

## Handoff for a new chat

Read [AGENTS](../../../AGENTS.md), [research workflow](../WORKFLOW.md), [current framing](research-framing.md), [Q-PLD-17](open-questions.md), [EX-PLD-10](open-experiments.md), the [Capability–Goal register](../capability-goal-semantics/open-questions.md), then **begin at step 1** with a simple neutral conceptual diagram and model alternatives. Do not re-run the entire UI discussion. Question/experiment status is not owned by this protocol; update only the existing registers and a dated result document when evidence warrants.
