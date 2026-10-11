# Open semantic questions and order of closure

**Checkpoint:** 2026-10-12. **Status:** RESEARCH QUEUE, NOT canonical Core Questions, Authority decisions, or an authorized implementation backlog.
This file records *what to examine next*. The actual Core Questions and decision governance are those of the current task branch and the routed Harness.

## 0. Already confirmed vs still open

**Owner-confirmed (NOT automatically Harness-admitted):**
- IDENTITY = INSTANCE;
- STRUCTURE = DISTINCT-CONCEPTS;
- RELATION-IDENTITY = INSTANCE;
- D1 = SELECTIVE-ADMISSIBILITY;
- primary MVP entry = Goal-first preparation (Product Requirements input).

**Additional owner decision (conversation 2026-10-11, Product Requirements input, NOT Harness-accepted):** GF-01 option A — organize Goal-first preparation primarily through CapabilityDescriptions while allowing a Goal to start incomplete with zero listed Capabilities. This does not select requires/targets/focus or any C–C composition relation.

**Additional owner hypothesis/question (conversation 2026-10-11, NOT a formal relation approval):** allow optional progressively disclosed, recursively structured Capabilities without assuming completeness. Does a composite Capability define the order of executing child abilities, or would this constitute an instruction/Procedure? Research required before deciding order, predicate or MVP scope.

**No owner choice:** Goal-relation predicate, Capability composition predicate, whether composition enters MVP, direction/multiplicity per relation, endpoint rules/self-links, global vs Goal-specific decomposition, deletion integrity and reintroduction, automatic inferences (not proposed as MVP), target/focus distinction.

**Research pass update (2026-10-12):** [Iteration 01](iteration-01-goal-capability-predicates.md) evaluates GD-00, GD-01 and GD-02 with four concrete Goals and a cheap A/B acceptance experiment. **Analysis complete for this pass; owner decisions remain OPEN.** A universal `requires` is analytically falsified; R/T may overlap for an ability-as-outcome Goal; interview preparation can justify a user-chosen F even when R is unknown. No GD-03/04/05 decision is made. See the iteration's three owner decision cards before advancing the catalog.

**Research pass update (2026-10-12, Iteration 02):** [Conditional GD-03/04/05 investigation](iteration-02-conditional-relation-catalogue-and-mutation-tests.md) produces concrete relation-kind admission tests, multiplicity/direction counterexamples, and endpoint/bulk/delete mutation fixtures. This is **analysis, not a decision**. New explicit blockers: material 'intended for practice' lacks a decided intentional actor (designer vs learner); deletion of a preparation endpoint must not silently determine fate of DS-02 recorded activity/results. **All GD-00..05 owner gates stay OPEN**. Flat experiment with no G–C edge is not proof a relationless MVP meets accepted relationship-exploration obligations.

**GitHub state distinction:** base mvp-vertical-slice Core has only a legacy Product Requirements Question at checkpoint; the three Tactical blocking Questions below exist in the Draft PR #101 candidate Core, not yet in the mvp base:
- Q-PREP-PREPARATION-IDENTITY-STRUCTURE;
- Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS;
- Q-PREP-PREPARATION-REMOVAL-INTEGRITY.
Their published/candidate statuses must be freshly checked before action.

**EX-GF-01 research result (2026-10-12):** [Executed S1–S4 stress test](experiment-01-goal-first-model-stress-test.md) found both flat and optional-composed models can represent a human-driven Goal-first cycle *under explicit DS-02 subject and selection assumptions*. The flat model cannot represent a **typed C–C structural assertion**; this is not a failure of its ability to support the minimum user loop. Shared Capability C2 linked to two Goals exposes a P0 context loss when Activity records only C2: composition cannot disambiguate historical Goal. Ordered child abilities fail as a representation of conditional repeated procedure steps. All Owner/Authority decisions remain OPEN.

## 1. P0 — semantic decisions needed for the first Goal-first vertical slice

### GD-00 — Product meaning of Goal-first (PRODUCT-REQUIREMENTS)
Question: Does the accepted product need an explicit Goal-centred entry/return journey or additional observable support beyond existing exploration, selection, CRUD/bulk and recorded activity/results?
Alternatives: (A) existing product commitments suffice for a minimal human-driven walkthrough; (B) add a narrow observable Goal-first commitment, routed for Product Requirements reassessment; (C) add full planning/progress (not supported by current evidence).
Recommendation to test: smallest human-directed E2E first; do not claim automatic progress tracking. **Owner product direction already exists but is not Harness acceptance.**
Closure evidence: precise user-visible acceptance example and authority routing, without tactical relation taxonomy baked into PR requirements.

### GD-01 — First Goal–Capability semantic statement (TACTICAL, P0)
Question: What kind of fact does the relation encode?
Alternatives:
- R: G requires C for G's stated outcome/conditions (a necessity claim, NOT pre-existing learner mastery);
- T: G targets development/demonstration of C as an outcome;
- F: C is selected as a current preparation focus for G;
- possibly separate R + T if both independently necessary.
Counterexamples: learn a skill vs pass an interview vs personally execute protocol X vs obtain certification through another actor. Unsupported generic supports/relevant link is disfavoured under D1.
Working recommendation: investigate narrow R first, **but validate T** with explicitly educational goals; do not approve R by default or conflate R/T/F. Distinguish predicate from claim provenance/confidence.
Closure: two or three concrete user queries, endpoint typing, falsifying cases, product-visible reason to store the distinction, owner choice before Harness admission.

### GD-02 — Incompleteness and scope of Goal assertion (TACTICAL + PRODUCT, P0)
Question: How can Goal and its supposed requirements exist while uninvestigated, and how do context/conditions affect the claim?
Candidate invariants: a Goal can have zero links; absent G–C means unknown, not false; no completeness guarantee; avoid unconditional requires if alternative routes suffice; the required ability need not be possessed at study start.
Closure: one consistent acceptance walkthrough for learning goal, external outcome and strict protocol; no new task/plan entities merely to support examples.

### GD-03 — Minimal typed relation catalogue (TACTICAL, P0)
**Research note:** Iteration 02 has a provisional semantic/falsification table; no admitted relation catalogue. Decide material intended purpose vs learner designation before proposing M–C.
Question: Which *specific* relation kinds are justified by the smallest Goal-first E2E? Candidate relationships include Goal requires C; Goal targets C; material intended-to-practice C; material covers Knowledge; Capability uses Knowledge. The only owner-approved choice so far is D1 SELECTIVE-ADMISSIBILITY, not these kinds.
Closure: semantic meaning, valid endpoint roles, counterexample, necessity for E2E, no accidental source verification/mastery implication, and full CRUD/bulk cost for every admitted kind.
Priority: begin with G–C; then examine knowledge/material link *only if the walkthrough demonstrably needs it*.

### GD-04 — Relation direction and multiplicity (TACTICAL, P0)
**Research note:** Iteration 02 distinguishes semantic roles, reverse navigation, proposition equality, record identity, and edit retargeting; multiplicity/constraints remain unapproved.
Question: Does a specific admitted predicate use asymmetric roles? Are duplicate endpoint+predicate instances meaningful?
Constraints: relation identity is instance-based; this does **not** imply multiple equivalent propositions. Direction and multiplicity must be decided per admitted semantic kind, not generically.
Closure: two semantically identical records tested for an additional domain fact; explicit valid endpoint and self-link policies; user-edit continuity and import implications considered only after semantic meaning.

### GD-05 — Removal and endpoint integrity (TACTICAL, P0)
**Research note:** Iteration 02 exercises Goal/Capability/Material/Knowledge deletion, recreation and bulk refs; recorded Activity/Result continuity is a separate DS-02 issue requiring coordinated design. No cascade/unavailable-endpoint policy selected.
Question: On deletion/edit of an item, what happens to its incident preparation relations? Does re-introduction denote the same instance? How is dangling information prevented or explicitly represented?
Alternatives recorded in PR #101: remove affected relations coherently, or represent unavailable endpoint; no blanket owner choice yet.
Constraints: preserve unconditional user-facing CRUD and bulk; do not invent immutable history, tombstone/provenance retention, forbidden delete or mastery. Recorded Activity/Result integrity belongs to its separate tactical capability.
Closure: complete mutation examples for linked Goal, Capability, Knowledge and PracticeMaterial plus bulk-load/remove; pass separate owner-governance/Harness requirements.

## 2. P1 — capability structure only if needed for useful preparation

**Research pass 2026-10-12:** [Iteration 03](iteration-03-capability-description-composition-and-context.md) investigates CD-01..05 on architecture/communication/protocol counterexamples, includes a controlled flat/composed test design and conditional mutation fixtures. **Analysis only; no empirical user test and no Owner selection. CD-01..05 all OPEN.** CTDL-ASN's broad semantic inclusion is *not* guaranteed to be a strict DAG of necessary performance steps.

### CD-01 — Capability description meaning and internal attributes
**Desk result:** repeatable ability/action-object-outcome, optional context/criteria; not mastery or Procedure. Owner confirmation open.
Candidate: ability class (Action, Object, Outcome; optional Context/Criteria), not observed execution or proof of attainment; no compulsory five-column schema.
Closure: examples across three domains and a demonstrated failure of a weaker definition.

### CD-02 — Does composition enter the first MVP?
**Desk result:** flat and composed variants can both logically solve the same next-practice scenario; actual usability advantage remains unmeasured. A/B observation pending.
Alternatives: (A) no composition, flat Goal–Capability can already reach next practice; (B) optional semantic composition included with all-kind CRUD/bulk; (C) fuller nested/context-based structures.
Recommendation: compare A/B on identical activity results and materials; favor B only on observed decision-making/navigation benefit. **No user test completed**.

### CD-03 — What exactly counts as a constitutive child?
**Desk result:** separate weak meaning inclusion, substantive performance aspect and universally necessary subability; none approved. Avoid treating CTDL-ASN comprisedOf as an executable step specification.
Candidate: child is a specific aspect of performing the parent's ability; NOT merely useful, prerequisite, procedural step or specialization. CTDL-ASN comprisedOf is a precedent, not a ready-made implementation contract.
Closure: examples/counterexamples (peak load, distributed-systems specialization, Git, active listening, protocol operations).

### CD-04 — Recursion, cycles, reachability and reuse
**Desk result:** DAG only conditional on strict proper-part meaning; sharing/partial structure/path-vs-assertion, deletion and bulk test fixtures available. Formal invariants open.
Question: multiple parents? self-links? strict acyclicity vs weaker inclusion? does path entail transitive domain assertion?
Candidate: reuse permitted; no mandatory complete tree/order; prohibit self and cycles if selecting strict structural decomposition; graph reachability does not automatically write inferred relation instances.
Closure: choose relation semantics first, then valid-state invariants and mutation tests.

### CD-05 — Global meaning vs Goal-specific composition
**Desk result:** changing Goal emphasis is not proof that C–C structural truth changes. No decisive same-pair/same-meaning context falsifier established; defer qualified relations.
Default hypothesis: compose capabilities in the meaning of their own descriptions; Goal-specific navigation/filtering does not alter the truth of C–C. Need context-qualified relation only upon concrete counterexample.
Closure: a real case where same pair is properly included for one Goal but not for another *without changing the parent capability's meaning*; otherwise defer.

### CD-06 — Composition versus execution order and Procedure (NEW, P1)
**EX-GF-01 research result:** S4 demonstrates strict protocol step occurrences (including conditional repeats) cannot be faithfully modeled by assigning one execution rank to each child Capability; architecture and communication may legitimately reorder and revisit subactivities. This rejects a **universal ordered-C–C-as-Procedure shortcut**, not all future procedural modeling. Product need for machine-readable execution/compliance remains unproven; Owner decision OPEN.
**Owner question:** If a Capability contains smaller Capabilities, must they be performed in an order? Does recording that order turn a description of ability into a Procedure or instruction? Iteration 03 distinguishes composition and Procedure in principle; it does not settle the semantics and representation of order.

Test four distinct claims: (1) a set of constitutive abilities; (2) prerequisite between abilities; (3) ordered/conditional steps of a performance protocol; (4) sequence chosen for learning or displaying children. Do not conflate these. A procedure step is not automatically a Capability, and needing ability B for A does not automatically prescribe an executable A/B sequence.

Alternatives to compare (not selected): A — composition has no inherent order; B — additional meaning-specific prerequisite/order relation, if independently needed; C — procedure described within suitable existing Knowledge or PracticeMaterial meanings; D — new Procedure/Task domain concept only after a concrete product-use failure of existing distinctions.

Falsifying cases: scalable-system design with iteration/rework, communication (listen/ask/respond with flexible timing), strict measurement/safety protocol where changing step order invalidates the performed task, and learner-selected practice order independent of protocol order. Compare ability meaning, required outcomes/criteria, action execution and learning preference; clarify where a normative external procedure is referenced without incorporating its ordered steps into C–C.

Closure: a matrix of user question, positive case, counterexample, owner Authority, smallest MVP consequence, and user-visible need. Show one composite ability without a required sequence, and one strict procedure for which ordering matters **without** implying that Capability composition orders children. Test consequences for CRUD/bulk if any new admitted kind is proposed. No universal sequence numbers, mastery inference, plan engine or Procedure entity by default. Owner decision remains OPEN.

## 3. P2 — defer until triggered by user evidence

- PR-01: now covered by P1 research CD-06 (prerequisites, procedure order, learning order, presentation order); not an approved MVP feature.
- PR-02: now covered by P1 research CD-06; a standalone Procedure/Task remains an unapproved option only if existing Knowledge/PracticeMaterial/Activity semantics cannot express a required user case.
- PR-03: proficiency levels, detailed capability equivalence engine, automatic dedup/semantic hashing, mastery inference: not in accepted MVP.
- PR-04: metadata such as assertion source, confidence, provenance, versions: no accepted product promise; do not sneak in via relation semantics.
- PR-05: import/export via CASE/CaSS/ESCO/O*NET: interoperability option, not requirement; check licenses and schema fidelity.
- PR-06: context-qualified goal decomposition, AND/OR planning, goal completion score: not accepted requirement.

## 4. Mandatory cross-checks after any major candidate selection

- Does the change contradict Product Capabilities including manual CRUD and bulk-load **of every admitted kind**?
- Would it quietly infer knowledge/mastery or success from a stored statement or a result?
- Are Goal requirements, capability identity/composition, user-selected practice, historical results, and Procedure kept separate?
- Does any link become an asserted truth solely through transitive navigation?
- Is the intended fact global or goal-relative, and why?
- Can edits/removal and bulk loading preserve valid semantics without denying user operations?
- Is the proposal Product Requirements, Tactical Domain, Application, Human Interface, or Data Design responsibility?
- Have exact branch/revision and Harness route been checked before a claim of acceptance/currentness?

## 5. Recommended next research action

**Iterations 01 and 02 performed desk-based GD-00..05 conditional analysis** in [the iteration note](iteration-01-goal-capability-predicates.md), including the following originally requested cases. The next *unperformed* work is obtaining GD-00/01/02 owner decisions, testing the Goal-return acceptance experiment, and performing a real-user or prototype CD-01..05 flat-vs-recursive capability comparison (desk comparison in Iteration 03). The original experiment inputs were:
1. «Learn to argue architecture decisions» — target developmental outcome.
2. «Pass a system design interview» — partial, uncertain alleged requirements.
3. «Personally perform protocol X» vs «receive a valid certificate» — necessary skill versus alternative external path.

Iteration 01 records exact Goal wording and R/T/F counterfactuals; Iteration 02 investigates the relation catalogue and operational rules conditionally; Iteration 03 investigates Capability composition without deciding its inclusion. None of these is an empirical UX test or an Owner decision. These are **research results, not field validation**. Only after owner choice may GD-03/04/05 be governed and canonicalized. Recheck GD-00 upstream whenever a new user-visible promise is proposed.

**Research checkpoint closure is not Harness closure.** Update this file's status after actual owner input, and make the canonical transition only via routed Harness. Do not mark a Core Question resolved because a researcher selected a recommendation.
