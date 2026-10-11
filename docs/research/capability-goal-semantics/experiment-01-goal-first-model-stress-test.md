# EX-GF-01 — Goal-first domain model stress test

**Executed:** 2026-10-12. **Classification:** NONCANONICAL RESEARCH EVIDENCE, not an adopted domain model, Owner decision, Harness admission, engineering test pass, UX validation or MVP implementation.

**Reference state observed immediately before evaluation:** research branch `4e95f555ccddb59f594a1163d47ea71e0bf0bc79`; `mvp-vertical-slice` `c5d2dc5067dcb8114f671d85f8c8a8d3ec54c5e2` (same `.harness/core.yaml` blob `0a8b94bf31df4d931ddb633544bc5f71d17f4285` and accepted Product Capabilities blob `58edefe674fa36a1c004a73083c9876c4e14213b` as earlier baseline); Draft PR #101 open/draft/unmerged, head `336b97969e964b30640f2367fcd2cb8488ff6e67`. Read [local research AGENTS](../AGENTS.md), [workflow](../WORKFLOW.md), [handoff](HANDOFF.md), and [EX-GF-01](open-experiments.md) before running this check. No Harness currentness operation or canonical mutation performed.

## 1. Frozen comparison contract

**Decision sought:** Can a minimally defined, initially incomplete, Capability-oriented Goal-first preparation cycle be represented *without* prescribing an ordered procedure or inferring learner mastery? What does optional C–C composition add?

**Common conceptual instances (same IDs/text in A and B):**

| IDs | Descriptions / facts |
| --- | --- |
| Goals `G0`, `GI`, `GL`, `GP` | Unspecified design preparation; pass a system-design interview; prepare a load rehearsal; personally perform measurement protocol X |
| Capabilities `C0`, `C1`, `C2` | Justify backend architecture; evaluate capacity; estimate peak load |
| Capabilities `CP`, `CS`, `CM`, `CV` | Perform protocol X; prepare measurement setup; measure sample; validate measurement |
| Materials `M1`, `MP` | Peak-load exercise; text instruction "calibrate → blank → sample → check; if out of range repeat sample → check" |
| Activities and results | `A0` subjects `{G0,C0}`, result "failure mode missed"; `AI` subjects `{GI,C2}`, result "peak demand underestimated"; `AL` subjects `{GL,C2}`, result "peak demand approximated" |

**Assumption boundaries:** these subject lists are a **hypothetical DS-02 representation**, not an admitted relation type or proof that a Goal link is mandatory on every Activity. Each Activity has a distinct identity, time and Result. `G0` initially has **zero Goal–Capability claims**; `A0` is introduced *after* preparation, and is not a claim that G0 was initially linked to C0. A selected next material is a human action, not a recommendation engine. No `requires`, `targets`, `focus` or material-purpose kind is thereby approved.

**Models:**
- **A — flat:** all four Goals, seven individually identified Capabilities, two Materials and three Activities/Results, with the above explicit subject references. **No C–C assertions**.
- **B — same base plus hypothetical unordered C–C performance-aspect edges:** `C0→C1`, `C1→C2`, `CP→CS`, `CP→CM`, `CP→CV`. This is *candidate meaning only*; it does not assert "necessary for every performance", learning order, mastery, or that a protocol is an ordered execution specification.
- **B-order — adversarial attempt:** add a unique static execution rank to each child of a composite, and **pretend this is a Procedure**. Test this proposal solely against a strict protocol with repeated/conditional operations and flexible architectural work; not a candidate recommended for admission.

**Fixed falsification questions before the fixture check:** Does either model force a capability onto an incomplete Goal, collapse independent identities because of equal text, confuse two Goal histories using one C, infer a new direct C–C edge through reachability, infer mastery from a result, or assign execution order without a justified procedural proposition? Can B-order faithfully represent repetition/branch conditions?

**Meaning of outcomes:** `REPRESENTABLE` = facts/queries can be expressed *under stated hypothetical subject and relation semantics*, not that Prep already implements them; `COUNTEREXAMPLE` = a precise claimed representation fails; `INCONCLUSIVE` = validity depends on a still-unapproved meaning/product promise or a question outside the fixture. These are semantic desk outcomes, not a pass/fail of released software.

## 2. Per-scenario execution trace and outcome

| Scenario / query | A — flat | B — optional composition | Evidence and hard boundary |
| --- | --- | --- | --- |
| **S1**: create `G0` alone; later inspect `A0` and choose material for another attempt | **REPRESENTABLE** | **REPRESENTABLE** | `G0` starts with 0 G–C assertions; this is no statement of "zero required skills". Subsequent `A0.subjects={G0,C0}` supports a Goal-context lookup, and `M1` can be manually chosen. Which typed Activity/Goal relation or Goal-specific saved selection exists remains unapproved. |
| **S2**: create `C0` without children, later add `C1,C2` and preserve parent identity while refining its description | **REPRESENTABLE as independent descriptions; COUNTEREXAMPLE to a request for typed C–C structural assertions** | **REPRESENTABLE conditionally** | B has direct `C0→C1` and `C1→C2`, permitting C0→C2 *navigation*. It must not materialize a direct asserted C0→C2 fact or infer learner mastery. Neither model needs child completeness, fixed depth, or ordering. |
| **S3**: reuse *same `C2` ID* for `GI` and `GL`; retrieve the correct historical Result for each Goal | **REPRESENTABLE only if explicit Goal context of each Activity is retained** | **Same conditional outcome** | `AI.subjects={GI,C2}`; `AL.subjects={GL,C2}`. Query Activity subjects by Goal returns separately `AI` and `AL`. Query by `C2` alone returns both and cannot assign one to a particular Goal. C–C composition does not resolve missing Activity→Goal context. |
| **S4**: perform architecture practice with flexible execution order and protocol X with prescribed conditional repeated steps | **REPRESENTABLE as a human-readable external instruction in `MP`; INCONCLUSIVE for structured sequence validation** | **Same; no inherent order in C–C; B-order = COUNTEREXAMPLE** | Unique child ordering cannot represent `sample→check→sample→check` with a conditional repeat while retaining each child as one ability description; `CP` includes abilities, whereas `MP` describes an operation procedure. Flexible architecture exploration should not inherit a normative execution sequence. |

**S1 limitation:** representing a human selection using existing product operations is **not a proof** that a Goal-centric saved-focus return journey exists. This remains GD-00. A flat test fixture with no C–C links is also **not proof** that a relationless *complete MVP* satisfies the accepted relationship-exploration commitment.

**S2 limitation:** whether "performance aspect" is the right C–C predicate and whether it may be recursive, cyclic or multi-parent in the accepted model remain CD-02/03/04 owner gates. "Representable" is conditional on future admission.

**S3 dependency:** A shared CapabilityDescription has stable identity, but **the Goal of a particular Activity cannot generally be inferred from the Capability's memberships**, even if the ability relates to two Goals. DS-02 must determine how explicit subject/Goal context is represented, including deletion consequences; do not backfill it through a C–C or G–C claim.

**S4 limitation:** a human can *read* protocol order in PracticeMaterial or Knowledge without Prep containing an executable Procedure aggregate. If the product someday must automatically validate each operation, conditional repeat or compliance outcome, both A and B require separate product/semantic investigation; EX-GF-01 does not authorize a Procedure entity or engine.

## 3. Mechanical reproducibility checks actually performed

Two small **in-memory deterministic fixture probes** were executed during this research session. The first built the 4 Goal/7 Capability/2 Material/3 Activity shared fixture and 5 hypothetical B C–C edges; the second applied adversarial modifications. No file or runtime code was committed: the data and predicates below fully specify the check, which served only to expose state-transition/logical ambiguity. This was **not** an app, backend, user observation, Harness operation or domain-schema test.

**Primary probe: 12/12 fixture expectations evaluated true**, including:
- `G0` initially has no G–C relation; `A0` later explicitly lists `G0`.
- Flat model contains no C–C edge; composed graph contains indirect C0→C2 reachability but **not** a direct C0→C2 edge.
- Querying Activity subjects for `GI` returns only `AI` and for `GL` only `AL`; by shared `C2`, both appear.
- The stored protocol text includes an explicit conditional repeat; a unique-ranked child-ability list cannot encode that repeated operation as a step occurrence.
- All sampled Activities have two explicitly declared subjects. This is a **fixture fact**, not a product invariant.

**Adversarial probe: eight bounded logical checks evaluated against their own expected conditions**, and are not eight domain approvals:

| Probe | Test / observation | Outcome |
| --- | --- | --- |
| X01 | `C2` and `C2_COPY` have same label, two IDs | No identity collapse; compatible with already owner-approved INSTANCE identity |
| X02 | `C0→C1→C2` with no asserted `C0→C2` | Navigation path exists, direct stored assertion absent |
| X03 | Add `C0→C2` while `C1→C2` exists | Shared child is mechanically representable; semantic validity still conditional |
| X04 | Add `C2→C0` to existing path | Creates a directed cycle: **counterexample only if strict proper-part acyclicity is chosen** |
| X05 | Remove C1→C2 edge | C2 item survives; no implied cascade from an edge-removal operation |
| X06 | Replace `AI,AL` subject sets with `{C2}` only | Both project to the same subject association; **Goal-specific provenance lost** |
| X07 | MP stores step text | Human-readable order exists; **structured execution validation remains INCONCLUSIVE** |
| X08 | Attempt one position per unique child of `CP` for `sample,check,sample,check` | Cannot encode repeated operation/conditional branch as static one-position-per-ability sequence |

**Checks are intentionally modest.** Passing self-contained state predicates proves only the fixture's constructed consistency. It does not prove an ontology, human discoverability, persistence transaction rules, universal cycle validity, or any model's suitability for production.

## 4. CD-06: specific order distinctions from S4

| Fact / question | Example | Owns the assertion (candidate boundary) | Minimal MVP consequence |
| --- | --- | --- | --- |
| Which repeatable abilities can contribute to C? | Estimating workload, defending tradeoffs | Tactical C–C **composition only if admitted** | A set/graph of aspects; no inherent execution order |
| Which ability must be possessed/learned before another? | Understanding basic derivatives before advanced calculus work | A **different, context-dependent prerequisite assertion**, if justified | May be deferred; not implied by composition |
| Which operation occurs before which, conditionally or repeatedly? | Calibrate, blank, sample, check and repeat when out-of-range | **Procedure/instruction content**; currently may be represented in a PracticeMaterial description for human use | A reader can follow an external instruction; machine validation is not promised |
| Which ability/exercise does the learner choose to study first? | Practise peak estimation before a mock interview | Learner selection / Application journey, Goal-relative when required | Not an objective structural dependency or procedural order |
| In which order are children displayed? | Alphabetical, recent, user-sorted | Human Interface presentation | Does not modify domain propositions |

**Decisive counterexample:** A strict measurement protocol requires ordering of **operation occurrences**, sometimes conditional and repeated. A set of reusable CapabilityDescriptions describes what operations a subject *can perform*, not each occurrence of executing them. `C–C` alone cannot store a protocol's dynamic control flow; adding numeric child order does not make it a complete Procedure. Conversely, a person's architecture reasoning may revisit load estimates or tradeoffs in varying orders without changing the identity of their Capability.

**Research recommendation (not adopted):** do not give C–C composition an execution-order field in MVP by default; retain optional, unordered progressive decomposition as a candidate and keep procedural sequencing distinct. If actual user needs require machine-readable procedures, route Product Requirements before Tactical entity/schema design.

## 5. Decision packet (Owner/Authority status remains OPEN)

**P0 / GD-00 Product Requirements:** Owner-confirmed GF-01 option A means *Capability-oriented primary preparation through an initially incomplete Goal*. **It is not identical to GD-00 option A about persistent Goal-return/focus behaviour.** Decide separately whether reopening a Goal must restore its saved focus and how acceptance is observed.

**P0 / GD-01/02/03 Tactical:** select one justified Goal–Capability proposition (target, scoped necessity, focus or none required in earliest experimental slice) without requiring an exhaustive G–C set or converting absence into false. EX-GF-01 doesn't choose an admitted link.

**P0 / DS-02 and GD-05 integrity:** determine how a recorded Activity retains **Goal-specific subject context when the same C participates in multiple Goals**, then what happens after related Goal/Capability edit or removal. This is a more fundamental boundary than optional C–C composition; do not delete all history on a DS-01 cascade by default.

**P1 / CD-02/03/04:** optional unordered C–C may encode discoverable constituent aspects; the initial E2E does not require it for logical representability. Need observed EX-GF-02 to justify benefit and Owner choice of the exact predicate before asserting DAG or multiplicity rules.

**P1 / CD-06:** a strict procedural order is a relation among **operations/steps**, not an order of child ability classes. Keep Procedure/readable PracticeMaterial/learning order/presentation order distinct. Standalone Procedure concept remains conditional on a user-visible unmet need, not this fixture alone.

**Explicit unresolved risks:** cross-kind Activity subject semantics, saved Goal-return observable commitment, editing/deleting Goal references in Activity/Result, a possible "Material intended for ability" predicate, and actual user benefit from composition. These are not silently assigned new entities or constraints.

## 6. Stop condition and handoff

**EX-GF-01 COMPLETE AS A BOUNDED SEMANTIC DESK CHECK**, not passed as product acceptance. S1 REPRESENTABLE under manual/DS-02 assumptions; S2 A COUNTEREXAMPLE only to typed C–C structure, B conditionally REPRESENTABLE; S3 conditionally REPRESENTABLE in both and COUNTEREXAMPLE if Activity stores only C; S4 user-readable instructions REPRESENTABLE in both, B-order COUNTEREXAMPLE, structured execution INCONCLUSIVE. Original undecided questions stay open.

**Next research step:** present the small P0/P1 decision packet to Owner; run EX-GF-02 only when its user-observation question is warranted. No UI/code experiment or Harness-controlled change has been made.
