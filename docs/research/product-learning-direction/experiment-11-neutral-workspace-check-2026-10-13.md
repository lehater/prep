# EX-PLD-11 — neutral workspace contract / multi-kind stress check (2026-10-13)

**Evidence class:** bounded independent research observation, using a stipulated synthetic fixture, static textual four-pane wireframes and an executable projection-invariant check. Not real interaction, a user study, canonical UI/domain knowledge, a selected data schema or an approval of any relation predicate. **Live experiment and question states remain in** [open experiments](open-experiments.md) and [open questions](open-questions.md).

## Question, method and stopping boundary

Can the **same** collection / related-objects / own-details / optional-graph mechanics represent a typed dense Knowledge collection, a small CapabilityDescription collection, an incomplete Goal with no asserted links, and mixed StudyMaterials, without inventing relations or discarding direction/context?

The independent subject-model investigation [EX-PLD-10](open-experiments.md#ex-pld-10--unified-conceptual-model-and-adversarial-data-fixture-stress-check) was **not** used as an input. This check instantiates the [existing candidate contract](universal-entity-workspace-hypothesis-2026-10-13.md) and [four-pane layout](../../../experiments/prep_study_loop/prototype/WORKSPACE_LAYOUT_CANDIDATE.md) with provisional authored facts. No frontend was built. The wireframes are *inspectable state sketches*, not executable click targets. The separate [small Node check](../../../experiments/universal_entity_workspace/ex-pld-11-neutral-check.mjs) deterministically asserts projection behavior (run `node experiments/universal_entity_workspace/ex-pld-11-neutral-check.mjs`); it cannot test the readability of a rendered screen.

**Falsification targets:** changes to ordinary kinds must not require different base panel mechanics; relation instances must not merge or reverse; an absent edge remains absent; cross-kind links remain navigable; selection and graph scope remain independent. Attempt adversarial cases rather than supplying only examples that make the hypothesis pass.

## Small *view* contract used for this check (provisional)

| Input / responsibility | Minimum explicit contract | Failure when absent |
| --- | --- | --- |
| Kind descriptor | `kindId`, readable title, allowed columns/own fields, detail capability, whether graph is eligible | A new kind forces hard-coded panel logic |
| Object projection | Stable `objectId`, `kindId`, optional subtype, own display values; missing and unknown are distinguishable where authored | Homonymous objects collapse; absent fact interpreted as zero/false |
| Relation descriptor | `predicateId`, human-readable statement and endpoint roles, directed/symmetric semantics, declared eligibility in each view | Reversal or invented equivalence |
| Relation projection | Stable `relationId`, original source and target, predicate, *authored* condition/context and source provenance where supplied | Two assertions between the same pair deduplicate or lose qualifiers |
| Related row | One record per relation instance with role relative to selection, opposite endpoint and its kind, predicate and context; explicit navigate action | Cross-kind meaning and traceability disappear |
| Graph request | Explicit bounded working-set node IDs and allowed edge predicates; output includes **only** eligible actual relation IDs with both endpoints in that set | Phantom edges or implicit all-entities graph |
| Shared workspace state | Active kind, selected object, selected relation, hover, focus, table filters, graph working-set/filter, visible user context, navigation history, panel state as **separate** coordinates | Selecting an object silently rewrites scopes or resets camera |
| Detail/edge inspection | [3] displays own object content with optional typed slot; [2] or a graph-local inspector displays full relation record | Relation properties pollute own fields or are hidden behind a meaningless arrow |

**Read-only projection boundary:** domain semantics/admissibility belong to the source records and subject adapter; the workspace only renders supplied meaning and owns interaction state. A graph is a projection, not a domain storage model. The same view contract does not promise universal editing, media playback, contextual authorization or a production JSON API. The script uses an executable *test encoding* of this table, not a proposed persistence schema.

## Independent synthetic fixture

All predicates below are **stipulated user-authored test claims**; their use here does not establish them as admissible Prep relation kinds or as correct statements about the subject. The vocabulary is chosen for human-inspectable arrows instead of opaque R1/R2. Instance identity is the first column; subtype is distinct from kind.

| Kind | Objects (id: title [optional subtype]) |
| --- | --- |
| Goal | G01: Target scope not specified [no subtype] |
| CapabilityDescription | C01: Explain caching choices [conceptual]; C02: Investigate cache stampede [diagnostic]; C03: Review operational notes [none] |
| Knowledge | K01: HTTP caching [concept]; K02: TTL [rule]; K03: Conditional requests [procedure]; K04: ETag [artifact]; K05: Cache stampede [risk]; K06: Request coalescing [mitigation]; K07: Invalidation [procedure]; K08: Cache freshness [principle] |
| StudyMaterial | M01: TTL comparison card [card]; M02: Cache incident scenario [scenario]; M03: Independent external notes [external-link] |

| ID | Preserved asserted relation | Context | Graph eligibility in this trial |
| --- | --- | --- | --- |
| R01 | K02 --constrains--> K08 | scope-A | K–K |
| R02 | K02 --constrains--> K08 | scope-B | K–K |
| R03 | K04 --enables--> K03 | — | K–K |
| R04 | K03 --supports--> K08 | — | K–K |
| R05 | K07 --changes--> K08 | — | K–K |
| R06 | K05 --mitigated-by--> K06 | — | K–K |
| R07 | K05 --risk-of--> K01 | — | K–K |
| R08 | K01 --uses--> K02 | — | K–K |
| R09 | K08 --property-of--> K01 | — | K–K |
| R10 | K07 --contrasts-with-- K02 (symmetric meaning) | — | K–K |
| R11 | C01 --references--> K02 | — | Related table only |
| R12 | C02 --references--> K05 | — | Related table only |
| R13 | M01 --covers--> K02 | — | Related table only |
| R14 | M02 --covers--> K01 | — | Related table only |
| R15 | M02 --covers--> K05 | — | Related table only |

**Deliberate omissions:** no G01 edges, no C03 edges, no direct M–C link, and no graph edges inferred from co-occurrence. The meaning of `references` and `covers` is an unapproved placeholder supplied by the *fixture*, not a resolution of the ongoing domain study. The different contexts on R01/R02 represent two authored assertions, not two copies of the same relation instance. No unstated Goal scope or learner knowledge state is inferred from this test fixture.

## Four comparable four-pane wireframe states and action traces

Each state uses the **same shell and same [1]–[4] behavior**. The four lines below are *panel contents*, not four separate UIs. These are deterministic review walkthroughs: action => visible effect => invariant.

### W1 — typed, relatively connected Knowledge (K08 selected)

| Pane | Expected projection |
| --- | --- |
| [1] Collection | 8 K rows; K08 selected. Optional K subtype label/legend. |
| [2] Related | Five rows: R01 and R02 **separately**, both incoming from K02 with scope-A vs scope-B; R04 from K03, R05 from K07, R09 toward K01. |
| [3] Own details | K08 name/subtype and any own description. Relation conditions do **not** masquerade as K08's own fields. |
| [4] Graph | Explicit 8-node/10-edge K-only working set; edge predicates/direction distinguishable, R01/R02 individually inspectable. |

1. Select graph node K02 => [1] selects K02; [2] and [3] update; selection does **not** change filter, visible Goal context or graph camera.
2. Navigate backward from K08 via R01 => K02 opens, but the assertion still reads **K02 constrains K08**, not the reverse. R01 and R02 remain distinct.
3. Exclude K08 from the graph working set while keeping it selected in [1] => graph has **no phantom K08**; surface “selected object outside graph set” rather than silently expanding it. A graph node excluded from the table filter analogously cannot have a highlighted table row; keep selection and expose a “reveal in table” command.

### W2 — small Capability collection, cross-kind relation (C01 selected)

| Pane | Expected projection |
| --- | --- |
| [1] Collection | C01/C02/C03 rows; subtype optional; C01 selected. |
| [2] Related | One K02 row **via R11 references**, identifying C01 as source, K02 as target. C03 has no related rows when selected. |
| [3] Own details | C01's own text and subtype. No invented ability score or “required Knowledge” list. |
| [4] Graph | Not enabled: no admitted C–C graph predicates in this fixture. Show honest non-applicability, not an invented connected graph. |

1. Activate “open related K02 via R11” in [2] => switch to Knowledge [1], select K02, retain a breadcrumb carrying C01/R11 and any explicit scope. **Do not** silently flip the predicate.
2. If an existing Knowledge table filter would hide K02, surface a filter conflict and offer explicit reveal/keep-filter choices rather than claiming selection sync succeeded invisibly. Exact conflict UX remains a candidate.

### W3 — incomplete isolated Goal (G01 selected)

| Pane | Expected projection |
| --- | --- |
| [1] Collection | G01 row. |
| [2] Related | No asserted links. “No recorded relations in this dataset”, **not** “nothing required”. |
| [3] Own details | “Target scope not specified”; visibly incomplete user-supplied context. |
| [4] Graph | Empty/not applicable with explanatory reason; navigation/search/list still usable. |

Selecting G01 does not generate Capability or Knowledge prerequisites; a zero count means no *recorded* link, not true domain completeness.

### W4 — heterogeneous StudyMaterials, no derived cross-kind edge (M02 selected)

| Pane | Expected projection |
| --- | --- |
| [1] Collection | M01 card, M02 scenario, M03 external-link; same collection mechanics. |
| [2] Related | R14 toward K01 and R15 toward K05 as independent associations; **no M02→C02** inferred through K05. |
| [3] Own details | M02 own metadata plus an explicit *scenario-content* read-only slot; M01 card fields and M03 external-link use their respective detail capabilities. |
| [4] Graph | Disabled/empty unless separately justified; not an automatic materials graph. |

Opening K05 from M02 must preserve R15 as navigation origin. Material-specific preview or export action requires a declared extension; the base selection/filter/relationship mechanics do not change.

## Executable invariant check and failures intentionally exposed

The linked script contains the exact 15 object IDs and 15 relation IDs above, one common projection implementation and **11 assertions**, all passed for the stipulated fixture:

| Check | Outcome |
| --- | --- |
| Distinct R01/R02 not collapsed; reverse traversal retains roles/direction | PASS |
| Knowledge graph contains 8 nodes and 10 declared K–K edges; heterogeneous subtypes share same mechanics | PASS |
| C→K references do not produce extra K–K graph edges | PASS |
| Cross-kind navigation finds K02 through R11; no edge invented for G01/C03 | PASS |
| M02 has two actual K targets, no invented Capability target | PASS |
| Excluding K08 from graph set does not create a ghost node | PASS |
| Selection changes do not rewrite focus, filters or explicit context | PASS |

These are **projection sanity checks**, not automated UI tests or a validation of semantic truth. Four wireframes were inspected against the contract; there was **no clickable frontend, participant, timing test, visual-density test or domain-model integration**.

### Adversarial limitations (do not convert to silent “pass”)

| Priority | Counterexample or assumption | Classification / disposition |
| --- | --- | --- |
| P1 | A table filter excludes a graph-selected object, or the graph working set excludes a table-selected object. Exact “highlight everywhere” is impossible without changing filter or inventing a row/node. | **Adapter + explicit out-of-view selection state.** A strict always-visible synchronous selection claim is falsified. Preserve selection separately; reveal only by explicit action. |
| P1 | R01 and R02 share endpoints/predicate but have different contexts. A graph renderer draws both on one apparent line, and clicking that line returns only one undifferentiated link. | **Descriptor/graph inspector.** Preserve both relation IDs and offer a relation-instance chooser/inspector. If a renderer cannot do so, that projection **fails fidelity** even though the in-memory query passes. |
| P1 | User navigates C01→K02 via R11 while the destination has a conflicting filter and an explicit Goal context. | **Adapter/navigation state.** Keep relation-origin/breadcrumb and expose filter conflict; specific merge/override behavior remains untested. |
| P1 | Hypothetical **one** assertion “within context G01, C01 uses K02 for objective O” has three semantic roles. Replacing it by independent G–C and C–K edges changes the original claim. | **Current binary related-row contract cannot encode the whole assertion without a reified record/adapter and richer relation inspection**; potential redesign if truly admitted by EX-PLD-10. Do not assert the hypothetical relation is a Prep fact. |
| P2 | A long scenario, media payload or context-sensitive editorial action exceeds scalar fields. | **Specialized detail/action extension**; generic CRUD/editing is not established. |
| P2 | A Knowledge graph is dense or a graph node cannot be visually found. | Graph may require bounded working sets and accessible nonspatial path; **performance/legibility and 2D/3D benefit remain untested** (separate EX-PLD-08). |

## Result by requested change category

| Category | What the fixture establishes | Remaining issue |
| --- | --- | --- |
| **Descriptor only** | New object subtype and relation predicate labels, table columns, optional graph policy, truthful empty categories can reuse base panes. | Renderer must make meaning readable, not rely on color. |
| **Adapter / explicit state** | Cross-kind related rows, context-aware reverse navigation, deduplication by relation ID, out-of-view selected object, preserving scoped assertions. | Destination-filter conflicts and relation qualifiers need UX review. |
| **Specialized extension** | Scenario/card/link content and future relation detail inspectors can be slots without changing panel layout. | An extension's actual usability and editorial behavior are not tested. |
| **Contract change / possible redesign** | A higher-arity context/objective assertion is a true boundary of a purely binary `from/to` model. | Wait for independently justified EX-PLD-10 facts; do not force its model into binary graph edges. |

**Research conclusion:** four coordinated panes are a **plausible common read-only interaction shell for the four neutral cases**, not a proven universal renderer for *any* admissible semantic structure. The required improvement is a typed, identity-preserving relation projection and explicit selection/navigation state. The *unrestricted universality* reading is not supported; one n-ary counterexample demonstrates a potential representability gap. Neither a production frontend nor graph-first interaction is warranted at this stage.

## Follow-up boundary

- Continue EX-PLD-11 with a review of the **conditional relation inspection**, cross-kind filter conflict, and out-of-view selection sketches if they block understanding. No panel-style/pixel polishing yet.
- **Joint checkpoint (not performed here):** map EX-PLD-10's independent meaningful fixture unchanged through this contract. Per fact classify **descriptor / adapter / extension / redesign-or-loss** and preserve every exception, particularly multi-role/context assertions. Only this checkpoint can license EX-PLD-09's integrated journey check.
- Owner review remains needed to select behaviors and accept/modify any view contract. EX-PLD-06 user-value comparison, 2D/3D choice, Harness and production work are outside this result.
