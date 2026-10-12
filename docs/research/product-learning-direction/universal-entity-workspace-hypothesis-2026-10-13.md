# Universal Entity Workspace — owner-proposed presentation hypothesis (2026-10-13)

**Classification:** Noncanonical **Owner proposal for design research**, not an approved Presentation/System Architecture, Domain schema, Harness acceptance, selected renderer, product commitment or completed experiment. This records the idea and a **candidate presentation contract**, not implementation instructions. Live question/experiment priority and status live **only** in [open questions](open-questions.md) and [open experiments](open-experiments.md).

## Hypothesis and intended leverage

A single **Universal Entity Workspace** can serve Goal, CapabilityDescription, Knowledge, StudyMaterial and potentially other admitted object kinds by presenting one currently chosen category as four coordinated, resizable panes:

1. **[1] Collection** — searchable/filterable main table of objects of the active category.
2. **[2] Related objects** — tabbed/filtered tabular view of valid relations, with explicit source/target roles and meaningful navigation to another category.
3. **[3] Selected-object details** — available own properties and readable content, without repeating all relation rows.
4. **[4] Graph projection, where useful** — an optional visualization of the current meaningful typed-node/typed-link working set, not automatically of the selected row alone.

The minimal desktop shell and behavior are already explored in [WORKSPACE_LAYOUT_CANDIDATE](../../../experiments/prep_study_loop/prototype/WORKSPACE_LAYOUT_CANDIDATE.md). It is **one reused mechanism**, not four separately hard-coded screens; each category gets its own descriptors, data/query adapter and (only if necessary) specialized content view. A category with no meaningful graph should remain usable: table/details/relations work normally, and graph displays a truthful empty state or can be hidden. No false edge should be manufactured to populate panel [4].

**Important distinction:** a conceptually *heterogeneous semantic network* does not make every domain entity **a graph**. A graph is a selectable **projection of object instances and justified relation records**. Nor is the universal presentation model a proposal to collapse Goal, CapabilityDescription, Knowledge and StudyMaterial into a generic domain `Entity` with arbitrary predicates.

## Three boundaries

```text
Owner-supplied conceptual semantics
  Goal / CapabilityDescription / Knowledge / StudyMaterial
  + meaningful, admissible relation assertions and scoped selections
                         |
                         v
       Presentation adapter / query projection
  normalizes IDs, fields, relation roles, view-eligibility
  and translates semantic records to descriptive view data
                         |
                         v
            Universal Entity Workspace
       [1] table       [3] properties/details
       [2] related     [4] optional typed graph
         selection / focus / filters / context / layout
```

- **Domain / semantic side:** owns meaning, whether relation is permitted, endpoint roles, conditions, direction where semantically meaningful, lifecycle and identity; these are **not supplied or invented by the renderer**. Consult [EX-PLD-10](open-experiments.md), [Goal/Capability questions](../capability-goal-semantics/open-questions.md) and [research framing](research-framing.md).
- **Presentation projection:** maps only valid/declared objects and relation records into a universal *read/view contract*. It may derive counts, grouping, labels and available actions, but must not infer new domain relations, truth, competence, necessity, or Goal completeness.
- **Workspace:** owns reusable interaction mechanics (selected object, selected relation, hover, graph camera/view focus, context/filter state, panel sizes, navigation history), not the truth of object relationships. The rendering implementation is replaceable; 2D/3D is still unselected.

## Candidate *conceptual* contract — intentionally not JSON/schema/API yet

| Input or state | Minimum invariant to test | What it must **not** imply |
| --- | --- | --- |
| **Entity kind descriptor** | Stable category ID, human title/label, allowed display fields and detail capabilities | Domain categories are interchangeable in meaning |
| **Object record** | Instance ID, declared kind, optional subtype/type labels, own displayable values | All objects must have subtypes; identical text is one identity |
| **Relation kind descriptor** | Stable kind ID, readable meaning, valid endpoint roles/kinds, whether semantics are directed, optional conditions | Every `R1` is a meaningful approved relationship |
| **Relation record** | Independent instance ID, endpoints/roles, declared kind, any necessary context; reversible navigation from both ends | Reverse navigation reverses the proposition, or any pair of objects may be linked |
| **Detail projection** | Basic own properties + optional specialized read-only content slot; missing values are explicit | Every kind has the same fields or that generic CRUD editors are already adequate |
| **Related-objects projection** | Query by chosen object and relation kind/role; can group source and target by endpoint kind and show direction | C–K and K–K are the same relation or there is always a direct Material–Capability link |
| **Graph projection** | Bounded nodes/edges from **declared admissible** records and explicit selection/filter policy; different shapes/colors/line/arrow modes available | Every relationship must be a graph edge; graph filter is a domain change; types must have a fixed visual palette |
| **Workspace interaction state** | Active section, selected object/relation, hover, focus, context, filters, layout/history are separable | Selecting an object automatically replaces filtered dataset or proves learning attainment |

**Two type axes:** `entityKind` (Goal vs Capability vs Knowledge vs Material) and **optional subtype** within a kind are different. `relationKind` and **direction** are again independent; labels/colors/line styles are configurable semantics of the presentation. Type numbers 1/2 are valid fixture placeholders, **not** a production taxonomy. A relation example still needs a provisional human-understandable meaning to validate correctness.

**Default behavior candidates:** [1] selects one object -> [2]/[3] update, [4] highlights the corresponding node if present; [4] selects a same-kind node -> [1]/[2]/[3] update; selection itself does **not** silently filter/recenter; hover only emphasizes; focus/pan/graph subset are explicit operations. Clicking a different-kind node is an **open cross-section navigation choice**, not a forced default. Link inspection should preserve direction, context and relation identity. Shared Goal context remains visible and removable. These are high-level design candidates, with same-kind synchronization already Owner-confirmed in the workbench exploration.

## Parallel research instead of a waterfall

```text
  EX-PLD-10 / Q-PLD-17                 EX-PLD-11 / Q-PLD-18
  Conceptual subject model            Universal view mechanism
  + challenge fixture                 + neutral typed fixture
  own types and admissible facts      table/related/details/graph
              \                           /
               \                         /
                shared contract review
                    |
                    v
          EX-PLD-09 integrated concept
              four section journeys
                    |
                    v
          usable browser prototype
                    |
                    v
          EX-PLD-06 user comparison
```

**Track A: subject model.** Iterate class/relation semantics with adversarial multi-type fixtures and unresolved questions in [model-fixture investigation protocol](model-fixture-investigation-brief-2026-10-13.md). Its output is **not constrained** to make the existing mockup look nice.

**Track B: universal presentation.** Use intentionally generic objects and relation descriptions to evaluate whether the same screen mechanics accommodate a dense typed K–K network, a simpler C collection, an incomplete Goal with zero links, and Materials with heterogeneity and indirect associations. Keep the same four-pane frame; compare changing descriptors/datasets **without changing UI mechanics**. This is a **concept/wireframe check**, not permission to launch a new framework or product frontend.

**Join / compatibility checkpoint:** take new Track A fixtures and map them via the *same* candidate contract to Track B. Record (a) supported without UI changes, (b) needs descriptor/adapter clarification, (c) requires a specialized detail/action slot, (d) cannot be expressed without interface redesign. A true counterexample is useful; do not redefine semantic facts to make the UI appear universal. Track A and Track B can proceed in parallel, but **EX-PLD-09's end-to-end flows need a coherent shared fixture**.

## Falsifiers and non-goals

- If rich Knowledge relations require a unique graph/interaction mechanism that breaks basic [1]–[4] across categories, document the exception rather than making everything generic.
- If new ordinary valid types or relation kinds force edits to base widget behavior (rather than data/descriptor/adapter changes), the claimed data-driven extensibility fails.
- If the component only supports same-kind K–K and cannot navigate legitimate cross-kind relations via [2], its universality is incomplete.
- If relation direction/context/type is lost by generic projection, the contract is misleading; if a category has zero edges, show that faithfully.
- If a special content format needs custom presentation or editing, allow explicit extension slots instead of promising no code change for arbitrary future semantics.
- Do not claim that changing the domain model *always* requires no code: novel **behavior, editing rules or specialized media** can require a new adapter or component.
- No production application, generic domain persistence hierarchy, full ontology, automatic graph for Materials/Capabilities, guaranteed 3D, user usability evidence or value comparison is established by this note.

## Next agent entrypoint

For the **UI track**, read [research instructions](../AGENTS.md), [WORKFLOW](../WORKFLOW.md), this note, [Q-PLD-18](open-questions.md), [EX-PLD-11](open-experiments.md), [workbench candidate](../../../experiments/prep_study_loop/prototype/WORKSPACE_LAYOUT_CANDIDATE.md) and the [model/fixture protocol](model-fixture-investigation-brief-2026-10-13.md). Begin with **one high-level contract and three contrasting data/view scenarios**, not a frontend implementation. For the **model track**, retain the [EX-PLD-10](open-experiments.md) starting point. Status belongs in the registers; research findings belong in dated result reports.
