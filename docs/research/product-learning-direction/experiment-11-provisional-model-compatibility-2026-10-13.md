# EX-PLD-11 — iteration 02: provisional model-to-view compatibility (2026-10-13)

**Evidence class:** independent desk/wireframe cross-track **compatibility probe**, not an approved domain or UI design, user observation, executable browser interaction, or completed EX-PLD-10/11 join gate. Research only; Harness, canonical artifacts and production code are outside scope. The current [question](open-questions.md) and [experiment](open-experiments.md) registers alone own live state.

## Input, freeze and method

- **View hypothesis:** [Universal Entity Workspace](universal-entity-workspace-hypothesis-2026-10-13.md); [EX-PLD-11 neutral initial check](experiment-11-neutral-workspace-check-2026-10-13.md) and its four-pane layout are carried forward without retelling their details.
- **Independent subject fixture:** [EX-PLD-10 step-2 adversarial fixture](https://github.com/lehater/prep/blob/2b6f85e23771b2bf0ab4c4ec10c8f92675ce3839/docs/research/product-learning-direction/ex-pld-10-adversarial-fixture-2026-10-13.json), source branch `research/ex-pld-10-adversarial-fixture-2026-10-13`, frozen commit `2b6f85e23771b2bf0ab4c4ec10c8f92675ce3839`, **Git blob** `b1a4cb69d59ae75aabc5f7da9b92564c32eb1218`. Related [construction report](https://github.com/lehater/prep/blob/2b6f85e23771b2bf0ab4c4ec10c8f92675ce3839/docs/research/product-learning-direction/iteration-07-ex-pld-10-fixture-construction-2026-10-13.md). **EX-PLD-10 step 3 (subject-model bidirectional stress review) was not complete at input time; this probe does not replace it.**
- **Method:** read the external JSON unchanged, map its four item kinds, 23 binary assertions and 10 separately identified scoped study intentions to neutral read projections, then inspect four four-pane state sketches. Test key invariants through a [small executable standalone probe](../../../experiments/universal_entity_workspace/ex-pld-11-compatibility-check.mjs). The fixture is **not copied into** EX-PLD-11 and no original predicates/roles or IDs are changed. **18/18** deterministic assertions passed in the research JS check; no Node CLI/browser/human usability session was conducted during this iteration.

**Reproduce after fetching both branches:**

```bash
git fetch origin research/ex-pld-10-adversarial-fixture-2026-10-13
git show 2b6f85e23771b2bf0ab4c4ec10c8f92675ce3839:docs/research/product-learning-direction/ex-pld-10-adversarial-fixture-2026-10-13.json > /tmp/ex-pld-10-fixture.json
node experiments/universal_entity_workspace/ex-pld-11-compatibility-check.mjs /tmp/ex-pld-10-fixture.json
```

The checker verifies the *exact Git blob identity* of the input before assertions; changing the subject fixture requires a **new** checkpoint, not quietly adjusting the test.

## Critical test: multi-role study intention is not a binary assertion

The initial contract's universal **binary** `from/to` related-row assumption fails against legitimate *provisional* input:

- **S02**: goal **G02**, capability lens **C02**, subject knowledge **K04**, learning objective “Сопоставить ключ внешнего API с дедупликацией сообщения в обработчике”; qualification explicitly says **no G02–C02 claim**. It cannot be truthfully decomposed into `G02 → C02` and `C02 → K04` assertions.
- **S01**: **G01/C01/K04**, with a *different* objective for the **same** K04. Keying UI rows by just K04 would erase the distinction.
- **S04/S08**: valid Goal–Knowledge study intentions have **no Capability role**. A universal mandatory C pathway would falsely invent data.
- **G02**: **zero** asserted G–C links but **four** study intention records S02/S05/S06/S08. Calling its entire [2] pane “no related objects” is misleading.

**Smallest candidate adjustment (presentation only):** the adapter emits a tagged *related-entry* union:

| Kind of view entry | Identity and roles | Where to display |
| --- | --- | --- |
| `binary-assertion` | `recordId`, `predicateId`, `roles=[subject,object]`, conditions, readable predicate, distinct original endpoints | [2] assertion tabs; [4] graph **only** if explicitly allowed by view policy |
| `scoped-study-intent` | `recordId`, named `goal`, optional `capability`, `knowledge` roles, objective/qualification | [2] separate “Study intentions” tab with named role columns; relation/intent inspector; **not an inferred edge** |
| Optional specialized content | Own object fields/content descriptor, optional read-only slot | [3] as specified by category; not a universal editor |

The same [1] collection, [2] related-record table, [3] own-details and optional [4] graph **mechanics** can remain; this is **a change to the view-record contract and its adapter**, not a finding that every domain relation is a graph/hypergraph edge. Record meaning and allowed endpoints are still subject-model responsibilities. If a future n-ary fact cannot be inspected in this role-row format, reopen the shell hypothesis rather than invent binary links.

## Four state sketches against the frozen fixture

| State / selection | [1] Collection | [2] Related entries | [3] Own details | [4] Graph |
| --- | --- | --- | --- | --- |
| **G02** in Goal | Two Goal rows; G02 selected | **Assertions (0)**, **Study intentions (4)** with G02/S02/S05/S06/S08 and optional C lens. Explicitly not “G02 targets C02” | Goal's supplied scope and context, missing links stay unknown | No authored eligible Goal graph; honest empty/unavailable |
| **K04** in Knowledge | 12 K items; K04 and identically titled K05 are separate IDs/meanings | R-KK-05, R-MK-03, R-MK-15, **S01 and S02 as two distinct contextual intentions**; reverse lookup preserves source roles | Own K04 meaning; no learner mastery; associated objectives stay in [2] | Candidate K-only working set 12 nodes / 6 user-asserted K–K edges |
| **C02** in CapabilityDescription | Four C items; C02 selected | **Assertions (0)**, S02/S05/S06 (context G02); A01/A02 remain external Activity boundary | C02 description only; no derived personal ability | Not enabled for this fixture |
| **M04/M07** in StudyMaterial | Eight materials with heterogeneous types | M04 has exactly four authored M–K coverage records; M07 has zero; neither implies M–C | Own material metadata plus appropriate specialized view; off-goal M07 is still valid | Not enabled for this fixture |

Four frames are static, not clickable or observed participant behavior. The Activity/Result records A01/A02 are *not* folded into the relation tab or represented as competence; if they later become a user-facing concern, they need a separate inspectable projection/extension decision.

## Explicit navigation and state-conflict trace

**Input:** active C02 in the Capability section, visible Goal context G02, a previously retained Knowledge table filter showing only K05, focused item C02, and an independent graph set containing K05. The user inspects S02 and explicitly opens its Knowledge role **K04**.

**State transition candidate:**

1. Resolve target **by role** from S02 (not by drawing a G02–C02 or C02–K04 edge). Set active kind to Knowledge and selected ID to **K04**; retain an origin breadcrumb `{recordId:S02, kind:scoped-study-intent, role:knowledge}`.
2. Preserve Goal context **G02**, pre-existing table filter, graph working set and focus *without silently rewriting them*. Mark selection **outside the current table filter**. If graph omits K04, mark it outside graph too; do not synthesize a visible node.
3. Offer an **explicit reveal / adjust-filter** action, or returning to the origin via breadcrumb. The exact conflict display, automatic focus behavior after explicit reveal, and restoration UX are **not verified** and remain Owner/UX decisions. The reducer-like probe verifies only the preserved coordinates and conflict marker, **not working browser controls**.
4. The record shown on return is still **S02 with G02/C02/K04 roles**, not a new domain assertion. Reverse lookup of R-KK-05 similarly preserves `K04 may_mitigate_under K03` and the condition; reverse navigation never asserts the converse.

## Results of the bounded projection test

The 18 checks cover: exact 2/4/12/8 item counts; 23 binary record IDs with source/target roles; 10 multi-role records with objectives; duplicate-titled K04/K05 distinction; G02 zero assertions/four S; forbidden inferred G02–C02; S01/S02 differing objectives; nullable Capability; a descriptor-policy-driven K graph with **12 actual nodes / 6 declared edges**; preserved predicate and condition on R-KK-05; reverse lookup; M04 four coverage links/M07 no links; no transitive K01→K03 fact; Activity/Result non-inference; navigation filter conflict without silently changing selection context/filter/focus; out-of-graph selection without phantom nodes; and removal of one asserted edge without destroying objects. **All 18 pass as data/projection invariants.**

| Need / observed counterexample | Change category | Preliminary verdict |
| --- | --- | --- |
| Four item kinds, optional subtypes and two K objects with identical labels | **Descriptor only** | Pass on ID-based adapter; UI needs legible disambiguation beyond title |
| Binary typed/directed/conditional R records | **Adapter / descriptor + inspector** | Preserved by ID/roles/conditions; visual recognition and selecting overlapping edges not user-tested |
| Multi-role S (G–[C]–K–objective), including absent optional C | **View-contract amendment + adapter** | **Binary-only reading falsified**. Tagged multi-role row can preserve data without changing four-pane geometry. Subject admissibility not decided |
| Sparse Goal G02 and isolated M07 | **Descriptor / honest empty-state** | Differentiate “no binary assertions” from “no contextual intentions”; absence is not falsehood |
| Cross-kind navigation into retained conflicting filter | **Explicit workspace state / adapter** | Machine state model can preserve meaning; visual conflict/resolution **not observed** |
| Scenario/reference/material preview, future Activity/Result inspection | **Specialized detail/association extension** | Candidate seam only; not tested as rendered behavior |
| Automatic n-ary graph/hypergraph, contextual edge-editing, role-dependent workflows | **Potential redesign if required** | Not expressible by plain binary graph without semantics loss; no justification to require this in present study |
| Source-model mutation X03 or duplicate proposition policy X04 | **Subject integrity boundary** | Explicitly unresolved in EX-PLD-10; no UI-created deletion/deduplication semantics |

**Result:** the *four cooperating panes* remain a plausible reusable **read-only shell** when the related-record contract becomes role-aware. **The binary-only relation contract is falsified by EX-PLD-10's independently authored S records.** The proposed tagged related-entry adapter demonstrates possible lossless read projection for this *particular* frozen fixture, not universal arbitrary n-ary semantics. Hard cases (filter conflict controls, multi-edge selection, edit commands, role-qualified history) are still design choices. This is a **provisional compatibility observation**, not the final shared join: EX-PLD-10 step 3 and Owner review must precede closure and integrated EX-PLD-09.

## Next decisive checkpoint

After EX-PLD-10 completes *its own* step-3 bidirectional stress and versioned corrections (if any), compare that reviewed fixture/semantics against the **same tagged related-entry candidate**, item by item. Classify each fact **descriptor / adapter / extension / redesign-or-loss** and document unresolved fidelity failures. Do not tune visual pixels, implement a browser app, select 2D/3D or infer user value in this iteration.
