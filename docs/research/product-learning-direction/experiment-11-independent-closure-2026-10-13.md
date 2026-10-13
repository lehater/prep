# EX-PLD-11 — independent universal-workspace research conclusion (2026-10-13)

**Evidence class:** completed, bounded **independent presentation-model research**; not a product decision, user study, accepted domain taxonomy, working frontend or engineering contract. This record contains findings; **only** [experiment register](open-experiments.md) and [question register](open-questions.md) own live state.

## Question and decision

**Tested question:** can the same four-pane **read-only** collection / related-records / own-details / optional-graph shell express contrasting sparse, typed, context-qualified and rich-content subjects with one interaction model?

**Qualified finding:** **yes for the tested independent cases, provided pane [2] is a typed, role-aware record inspector and every pane remains a projection; no for an unlimited “any future entity/relationship/behavior with descriptor changes only” claim.** Plain binary source/target rows fail the multi-role counterexample; unknown media and novel behavior require an explicit extension or a new interaction mechanism. One identical shell does not imply one identical domain type, one mandatory graph, one universal editor or universally good UX.

This research answers *presentation expressiveness* at concept/state-invariant level. It does not select production UX or establish that the shell is useful to actual users.

## Independent evidence and scope

- [Original four state sketches and first neutral projection check](experiment-11-neutral-workspace-check-2026-10-13.md): 4 independent neutral cases (connected typed Knowledge, simpler CapabilityDescription, isolated Goal, heterogeneous Materials); **11/11 projection sanity assertions**.
- [Self-contained final neutral interaction check](../../../experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs): **25/25 deterministic assertions** in a new neutral fixture; no other experiment data is used. Assertions were run with a JavaScript assertion-compatible execution environment; the Node .mjs entrypoint is retained for reproduction (`node experiments/universal_entity_workspace/ex-pld-11-interaction-check.mjs`).
- The fixture in this final script uses **G0/G1, C1, K1–K4, M1–M3, X1**, 6 independent binary assertions and 2 synthetic multi-role study-intention-shaped entries. **X** is only an invented extra *view-kind* sentinel proving descriptor extensibility of basic collection/details; it is **not** a proposal for a new Prep domain category.
- Earlier dated provisional cross-source mapping is preserved as historical research evidence; it is **not an input, dependency or exit condition** for this independent conclusion.

All relation predicates and objectives in these small examples are synthetic display assertions; their admissibility/correctness as Prep subject claims is **not** asserted.

## Frozen **view-contract candidate** after falsification

| Responsibility | Minimum input, output or behavior | Proven limit |
| --- | --- | --- |
| Kind descriptor | Stable kind ID, labels, own fields/columns, optional subtype, optional detail extension, explicit graph eligibility policy | New *readable fields* work by descriptor; novel behavior is not descriptor-only |
| Object projection | Stable object ID, declared kind, values with explicit absence, own data and subtype | Equal titles never define identity; an absent relation is not false/complete |
| Related-entry projection | **One record per independent ID**, tagged binary or named-role multi-role; preserve predicate, roles, direction (if binary), context/condition, objective and qualification where authored; expose source record in inspector | A single “other endpoint” column is insufficient for >2 roles; no inferred pairwise relations |
| [1] Collection | Search/filter active kind; selecting row sets the shared selected object | Selected object may exist outside a retained table filter |
| [2] Related records | Query records referencing the selected ID by **role**, group by record kind/relation kind, show full role-qualified record and explicit target-role navigation | “No binary links” must not imply “no contextual records”; relation inspector must be available |
| [3] Own details | Own allowed fields and optional read-only specialized slot | Custom editor/media/action needs an explicit extension; unknown subtype reports unsupported preview, not fabricated generic functionality |
| [4] Optional graph | Explicit bounded node IDs and **actual eligible binary relation IDs** with both endpoints in set, distinct overlapping edges inspected by ID | Multi-role facts do not automatically create binary edges; no graph needed for sparse kinds |
| Shared state | active kind, selected object ID, selected record ID, hover, per-kind table filter, graph working set, focus, explicit context, navigation history, layout kept separately | Selection cannot guarantee visible highlighting in a filtered-away table or graph; use an honest out-of-view indicator |

**Non-negotiable adapter invariant:** only source-provided and policy-eligible relation records enter graph/related projections. The adapter **may transform shape**, not create new subject assertions, change predicate direction or assume personal capability/proficiency. Source and view concerns remain separate.

**Minimum interaction semantics tested:**

1. Table or eligible same-kind graph node selects one object and updates related records/details; table filter, graph scope, context and focus do **not** change implicitly.
2. Selecting a graph edge inspects its **specific record ID**, including parallel edges on the same endpoints, leaving selected object and graph scope intact. Reverse lookup shows the **original** roles/predicate.
3. A user chooses an explicit target **role** of a related record to navigate across kinds; the app keeps source record ID and a return breadcrumb. If the target is filtered out, mark *outside table filter*; show reveal action. Only an explicit reveal adjusts a filter. Back restores original section and selection.
4. Hover/focus changes do not replace selection. Panel collapse/maximize/restore preserves selection, unrelated scopes and previous split/collapsed state; observed here as **pure state transitions**, not a visual resize test.
5. Empty graph and empty related state must say “not recorded/not applicable”, not imply a complete scope. Graph eligibility is view policy, not a source fact.

## Counterexamples and classifications

| Priority | Scenario / falsifier | Outcome class | Conclusion |
| --- | --- | --- | --- |
| P0 | Arbitrary new kind/media/interaction must work solely through metadata | **FALSIFIED (unbounded universality)** | A new kind X with scalar fields works, while unknown M video requires an extension. Never promise unlimited no-code adaptation. |
| P1 | One multi-role record with G, optional C, K and objective should read as two binary links | **FALSIFIED (binary related-row contract)** | Tagged related entry + named roles/explicit target navigation preserves the original one-record meaning; not a derived graph |
| P1 | Two asserted K2→K1 records differ only by context and overlap on screen | **Adapter / inspector** | Preserve both IDs and contexts, inspect exact edge; no deduplication by endpoint pair |
| P1 | Graph-selected K3 is hidden by table filter; selected K1 is outside reduced graph set | **Explicit state / adapter** | Correct result is “selected but outside this view”, not fabricated row/node or silent filter reset |
| P1 | C1→K3 related navigation conflicts with saved Knowledge filter; back should recover previous context | **Adapter / navigation state** | Origin and context survive, reveal remains explicit, back restores selection/filter; browser usability unmeasured |
| P2 | Sparse G0 and new X1 have no authored edges; M1 scenario and M2 link require different content | **Descriptor + detail extension** | Same shell survives a truthful empty state; subtype-specific reader fits into [3] without changing list/related mechanics |
| P2 | A future semantics-specific workflow requires simultaneous multi-object manipulation, a hypergraph or rich editor | **Possible redesign / feature extension** | Outside this bounded read-only shell: preserve exception rather than pretending it is universally supported |

**Coverage:** the 25 assertions exercised table/details/related/graph projections, record identity/direction/parallel context, symmetric predicate metadata, graph eligibility, table↔graph selection and invisible-selection markers, hover/focus separation, inspectable edge, multi-role record without inferred edges, isolated and unknown data, cross-kind navigation/reverse return/filter conflict, optional specialized details, extra kind, homonymous titles and panel state preservation.

**Not tested:** human comprehension, information density/visual legibility, keyboard/screen-reader accessibility, exact focus/reveal copy and buttons, responsive/mobile layouts, graph layout/2D vs 3D, actual specialized reader implementation, performance, edit/delete workflows, persistent state across restart or arbitrary unseen subject structures. These are **limits**, not unperformed criteria of this bounded concept investigation.

## Reviewable conclusion and handoff

1. **Keep the four-pane shell as a candidate**, not an accepted universal product component.
2. **Revise only the candidate projection contract:** a typed, identity-preserving *related-entry* union with named roles and a record inspector; preserve graph as optional bounded binary projection.
3. **Keep interaction coordinates separate** and represent out-of-view selections and navigation origin explicitly. Specialized content/actions remain optional slots.
4. **Stop the independent investigation here.** Four contrasting cases, an additional synthetic extensibility/edge-case fixture, explicit falsifiers, classification by descriptor/adapter/extension/redesign and a reproducible state-invariant check have supplied the protocol's requested research evidence. No further implementation is necessary to answer the independent concept question.

Owner approval of the proposed interface, visual usability and integration decisions are **separate later choices**; they are not evidence of this independent research and cannot be inferred from passing synthetic checks.
