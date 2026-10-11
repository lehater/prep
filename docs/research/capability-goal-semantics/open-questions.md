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

**No owner choice:** Goal-relation predicate, Capability composition predicate, whether composition enters MVP, direction/multiplicity per relation, endpoint rules/self-links, global vs Goal-specific decomposition, deletion integrity and reintroduction, automatic inferences (not proposed as MVP), target/focus distinction.

**GitHub state distinction:** base mvp-vertical-slice Core has only a legacy Product Requirements Question at checkpoint; the three Tactical blocking Questions below exist in the Draft PR #101 candidate Core, not yet in the mvp base:
- Q-PREP-PREPARATION-IDENTITY-STRUCTURE;
- Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS;
- Q-PREP-PREPARATION-REMOVAL-INTEGRITY.
Their published/candidate statuses must be freshly checked before action.

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
Question: Which *specific* relation kinds are justified by the smallest Goal-first E2E? Candidate relationships include Goal requires C; Goal targets C; material intended-to-practice C; material covers Knowledge; Capability uses Knowledge. The only owner-approved choice so far is D1 SELECTIVE-ADMISSIBILITY, not these kinds.
Closure: semantic meaning, valid endpoint roles, counterexample, necessity for E2E, no accidental source verification/mastery implication, and full CRUD/bulk cost for every admitted kind.
Priority: begin with G–C; then examine knowledge/material link *only if the walkthrough demonstrably needs it*.

### GD-04 — Relation direction and multiplicity (TACTICAL, P0)
Question: Does a specific admitted predicate use asymmetric roles? Are duplicate endpoint+predicate instances meaningful?
Constraints: relation identity is instance-based; this does **not** imply multiple equivalent propositions. Direction and multiplicity must be decided per admitted semantic kind, not generically.
Closure: two semantically identical records tested for an additional domain fact; explicit valid endpoint and self-link policies; user-edit continuity and import implications considered only after semantic meaning.

### GD-05 — Removal and endpoint integrity (TACTICAL, P0)
Question: On deletion/edit of an item, what happens to its incident preparation relations? Does re-introduction denote the same instance? How is dangling information prevented or explicitly represented?
Alternatives recorded in PR #101: remove affected relations coherently, or represent unavailable endpoint; no blanket owner choice yet.
Constraints: preserve unconditional user-facing CRUD and bulk; do not invent immutable history, tombstone/provenance retention, forbidden delete or mastery. Recorded Activity/Result integrity belongs to its separate tactical capability.
Closure: complete mutation examples for linked Goal, Capability, Knowledge and PracticeMaterial plus bulk-load/remove; pass separate owner-governance/Harness requirements.

## 2. P1 — capability structure only if needed for useful preparation

### CD-01 — Capability description meaning and internal attributes
Candidate: ability class (Action, Object, Outcome; optional Context/Criteria), not observed execution or proof of attainment; no compulsory five-column schema.
Closure: examples across three domains and a demonstrated failure of a weaker definition.

### CD-02 — Does composition enter the first MVP?
Alternatives: (A) no composition, flat Goal–Capability can already reach next practice; (B) optional semantic composition included with all-kind CRUD/bulk; (C) fuller nested/context-based structures.
Recommendation: compare A/B on identical activity results and materials; favor B only on observed decision-making/navigation benefit. **No user test completed**.

### CD-03 — What exactly counts as a constitutive child?
Candidate: child is a specific aspect of performing the parent's ability; NOT merely useful, prerequisite, procedural step or specialization. CTDL-ASN comprisedOf is a precedent, not a ready-made implementation contract.
Closure: examples/counterexamples (peak load, distributed-systems specialization, Git, active listening, protocol operations).

### CD-04 — Recursion, cycles, reachability and reuse
Question: multiple parents? self-links? strict acyclicity vs weaker inclusion? does path entail transitive domain assertion?
Candidate: reuse permitted; no mandatory complete tree/order; prohibit self and cycles if selecting strict structural decomposition; graph reachability does not automatically write inferred relation instances.
Closure: choose relation semantics first, then valid-state invariants and mutation tests.

### CD-05 — Global meaning vs Goal-specific composition
Default hypothesis: compose capabilities in the meaning of their own descriptions; Goal-specific navigation/filtering does not alter the truth of C–C. Need context-qualified relation only upon concrete counterexample.
Closure: a real case where same pair is properly included for one Goal but not for another *without changing the parent capability's meaning*; otherwise defer.

## 3. P2 — defer until triggered by user evidence

- PR-01: prerequisites/ordered learning paths separate from capability composition and execution procedures.
- PR-02: standalone Procedure/Task model only if existing Knowledge/PracticeMaterial/Activity distinction proves insufficient.
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

Analyze GD-01 and GD-02 **together** using three short counterexample-driven walkthroughs:
1. «Learn to argue architecture decisions» — target developmental outcome.
2. «Pass a system design interview» — partial, uncertain alleged requirements.
3. «Personally perform protocol X» vs «receive a valid certificate» — necessary skill versus alternative external path.

For each: exact Goal wording, candidate Capability, whether R/T/F is true/false/unknown, what the user must record to make the next preparation decision, whether one relation suffices, and what would make the answer different. Conclude with an owner decision card, not an unapproved model change. Only after owner choice examine GD-03 relation catalogue and GD-04/GD-05 operational invariants. Recheck GD-00 upstream whenever a new user-visible promise is proposed.

**Research checkpoint closure is not Harness closure.** Update this file's status after actual owner input, and make the canonical transition only via routed Harness. Do not mark a Core Question resolved because a researcher selected a recommendation.
