# User Journeys

## Purpose

Define the bounded user-goal journeys that realize the accepted Task Model through accepted Application Design behavior.

These journeys describe meaningful user actions, visible system responses, recovery and completion. They do not define screens, routes, navigation containers, layout, components, transport or frontend technology.

## Shared semantics

- Actor is the learner unless explicitly stated otherwise.
- `demonstrated`, `challenged` and `unknown` are evidence-backed target-relative projections, not mutable mastery states.
- Missing evidence remains uncertainty; activity completion alone does not prove capability.
- Subject Knowledge remains distinct from required Capability and from learner state.
- A semantic basis may become stale when material target/evidence/focus inputs change; stale continuation refreshes rather than silently applying to changed meaning.
- `SUCCESS`, `UNRESOLVED`, `REJECTED`, `DEPENDENCY_UNAVAILABLE` and `STALE_BASIS` remain distinguishable where applicable.
- No journey requires a graph, 2D/3D representation, page, modal, route or specific navigation pattern.

## J-TARGET-SETUP — Establish and understand the preparation target

**Actor:** learner

**Goal:** establish a sufficiently concrete active target and understand what performance it currently requires, including uncertainty.

**Trigger:** the learner begins preparation for a new purpose or receives target information that may refine the active target.

**Entry condition:** the learner has either a prepared target to select or some target/source context to provide.

**Preconditions:** none beyond available target/source context; a complete prepared corpus is not required.

### Meaningful interactions

1. The learner selects an existing target or provides/refines target information and purpose.
2. The system performs `APP-ESTABLISH-TARGET`, preserving purpose, provenance and unresolved target information.
3. If a usable target cannot yet be established, the system exposes the missing preparation need and offers continuation through **J-PREPARE-SUPPORT** without forcing corpus/schema work.
4. Once an active target exists, the learner asks what the target actually requires.
5. The system performs `APP-UNDERSTAND-REQUIREMENTS` and exposes the RequirementExpression in terms of required Capability performance, material conditions/constraints and acceptable quality, preserving `all_of` / `any_of` meaning.
6. The learner confirms that the currently known target is specific enough to prepare against or supplies additional target information.

**Completion:** an active target exists and the learner can distinguish known required performance from supporting Subject Knowledge and from unresolved target expectations.

**Visible side effects:** accepted target/refinement semantics may change through their owner; earlier provenance and unresolved information remain inspectable.

### Alternate / recovery paths

- **UNRESOLVED:** incomplete or ambiguous target meaning remains explicit; preparation may continue only against the established portion.
- **Missing reusable support:** continue through **J-PREPARE-SUPPORT** and return with the motivating target context preserved.
- **STALE_BASIS:** if target meaning changes while requirements are being used, refresh the requirement materialization before a dependent decision.
- Target refinement never becomes learner-state evidence.

**Upstream:** `TASK-U-ESTABLISH-TARGET`, `TASK-U-UNDERSTAND-REQUIREMENTS`, `APP-ESTABLISH-TARGET`, `APP-UNDERSTAND-REQUIREMENTS`, `AD-WRITE-OWNERSHIP`, `AD-OUTCOME-MODEL`, `AD-CURRENTNESS-BASIS`.

---

## J-PREPARATION-DIRECTION — Understand current position and choose the next focus

**Actor:** learner

**Goal:** understand the evidence-backed difference between current demonstrated/challenged/unknown capability and the active target, then choose the next useful preparation focus.

**Trigger:** an active target exists and the learner needs to decide what to do next.

**Entry condition:** **J-TARGET-SETUP** has produced an active target with usable requirement meaning.

**Preconditions:** learner evidence may be complete, partial, conflicting or absent; absence is valid and remains unknown.

### Meaningful interactions

1. The learner asks what is currently established about their capability relative to the target.
2. The system performs `APP-REVIEW-CURRENT-STATE`, exposing applicable claims, evidence arguments, supporting/challenging observations, provenance, time/condition scope and transfer/dependence limitations.
3. The learner inspects why relevant capability is currently demonstrated, challenged or unknown.
4. The system performs `APP-REVIEW-GAPS`, preserving target requirement structure and exposing satisfied, challenged and unresolved fragments with their basis.
5. The learner considers target relevance, uncertainty/gaps, available time/attention and available support.
6. The system provides the inputs to `APP-CHOOSE-NEXT-FOCUS`; the learner chooses or confirms a PreparationIntent such as acquisition, practice, diagnosis, transfer or retention support.
7. The system records the selected focus through its semantic owner with its rationale.

**Completion:** the learner understands current target-relative gaps/uncertainty and has an explicit next PreparationIntent.

**Visible side effects:** the current PreparationIntent/priority may change; historical evidence does not change merely because focus changes.

### Alternate / recovery paths

- **Insufficient evidence:** capability remains unknown; the learner may choose diagnostic support rather than treating uncertainty as failure.
- **Conflicting/challenging evidence:** the contradiction remains inspectable and may itself drive diagnosis.
- **No suitable support:** preserve the selected priority and continue through **J-PREPARE-SUPPORT**.
- **STALE_BASIS:** if target/evidence changes before focus is committed, refresh current state/gaps and reconsider against the new basis.
- No scalar mastery score is introduced.

**Upstream:** `TASK-U-REVIEW-CURRENT-STATE`, `TASK-U-REVIEW-GAPS`, `TASK-U-CHOOSE-NEXT-FOCUS`, `APP-REVIEW-CURRENT-STATE`, `APP-REVIEW-GAPS`, `APP-CHOOSE-NEXT-FOCUS`, `AD-OUTCOME-MODEL`, `AD-CURRENTNESS-BASIS`.

---

## J-KNOWLEDGE-ORIENTATION — Orient within relevant Subject Knowledge

**Actor:** learner

**Goal:** understand the subject structure relevant to the active target or preparation focus while preserving the distinction between knowing subject meaning and being able to perform.

**Trigger:** the learner needs conceptual orientation, relationship context or deeper subject detail for the target/focus.

**Entry condition:** an active target exists; a current focus may additionally narrow relevance.

**Preconditions:** relevant Subject Knowledge may be broad, sparse or partially prepared.

### Meaningful interactions

1. The learner requests subject orientation for the active target or focus.
2. The system performs `APP-EXPLORE-KNOWLEDGE` over stable KnowledgeObjects, KnowledgePropositions and meaningful relation predicates.
3. The learner narrows or expands semantic scope, moves between overview and deeper detail, selects Knowledge and follows meaningful relationships.
4. The system preserves Knowledge identity and relation meaning across scope/depth changes and keeps target/focus relevance external to reusable Knowledge truth.
5. The learner returns to preparation with enough subject context to understand or perform the next learning/diagnostic work.

**Completion:** the learner has coherent orientation in the relevant subject scope and can inspect the meaning of material relationships.

**Visible side effects:** none to reusable Knowledge merely from exploration; scope/depth are projections.

### Alternate / recovery paths

- Sparse or missing useful Knowledge remains an explicit preparation limitation and may lead to **J-PREPARE-SUPPORT**.
- Changing scope/depth does not mutate or clone Knowledge.
- Representation choice is downstream; the journey does not require graph, list, 2D or 3D.

**Upstream:** `TASK-U-EXPLORE-KNOWLEDGE`, `APP-EXPLORE-KNOWLEDGE`, `AD-WRITE-OWNERSHIP`.

---

## J-ACTIVITY-EVIDENCE — Use support, perform, evaluate evidence and review change

**Actor:** learner

**Goal:** perform suitable learning, practice or diagnostic activity for the current focus and understand what new evidence does or does not establish.

**Trigger:** a PreparationIntent exists and the learner is ready to act on it.

**Entry condition:** the learner has an active target/focus.

**Preconditions:** suitable support may or may not exist; external execution may or may not be available.

**Process contract:** cross-operation occurrence/composition/continuation/completion is owned by `prep.application-process.activity-evidence-cycle`; this journey describes the learner-visible goal path over that accepted process.

### Meaningful interactions

1. The learner asks for support appropriate to the current PreparationIntent.
2. The system performs `APP-SELECT-SUPPORT`, returning applicable LearningMaterial, TaskSpecifications and ObservationSpecifications with their intended capability scope and limitations.
3. The learner selects an opportunity or recognizes that available support is inadequate.
4. For selected support, the system begins `APP-PERFORM-ACTIVITY` locally or through a supported external runtime while preserving target/focus correlation.
5. The learner performs the activity under the actual conditions and provides the resulting actions, work product or reasoning.
6. The system performs `APP-CAPTURE-PERFORMANCE`: attributable facts become historical Performance and provenance-bearing Observations; semantically incomplete external records remain unresolved at the integration boundary.
7. The system performs `APP-EVALUATE-EVIDENCE`: observations are evaluated for capability relevance, conditions, time, coverage/transfer, dependence and attribution; inspectable CapabilityEvidenceArguments support/challenge claims only where justified.
8. The system recomputes the target-relative projection and performs `APP-REVIEW-CHANGE`.
9. The learner reviews what changed, what did not change, why, and whether to keep focus, refocus, gather more diagnostic evidence or refine the target.

**Completion:** the learner has completed meaningful activity and can explain the evidence-backed effect—or valid lack of effect—on current preparation direction.

**Visible side effects:** new Performance/Observations may be recorded; justified evidence arguments/claims may be accepted; current projections/gaps may change. Activity completion itself does not create a capability claim.

### Alternate / recovery paths

- **No suitable support:** preserve current intent and continue through **J-PREPARE-SUPPORT**.
- **DEPENDENCY_UNAVAILABLE:** preserve context and existing canonical data; the learner may retry/choose another supported opportunity without implying failure of capability.
- **UNRESOLVED evidence:** observation remains historical but no broader capability conclusion is fabricated.
- **REJECTED inference:** owner semantics reject an unjustified claim; evidence/reason remains inspectable.
- **No change:** valid outcome; progress is not manufactured.
- **New challenge/increased uncertainty:** valid outcome and may change next focus.
- **STALE_BASIS:** refresh the target/evidence/focus materialization before applying a dependent selection or continuation.
- Asynchronous runtime mechanics are acceptable only when the same semantic order and visible completion outcomes are preserved.

**Upstream:** `TASK-U-SELECT-SUPPORT`, `TASK-U-PERFORM-ACTIVITY`, `TASK-S-CAPTURE-PERFORMANCE`, `TASK-S-EVALUATE-EVIDENCE`, `TASK-U-REVIEW-CHANGE`, `APP-SELECT-SUPPORT`, `APP-PERFORM-ACTIVITY`, `APP-CAPTURE-PERFORMANCE`, `APP-EVALUATE-EVIDENCE`, `APP-REVIEW-CHANGE`, `PROC-ACT-BOUNDARY`, `PROC-ACT-COMPOSITION`, `PROC-ACT-CONTINUATION`, `PROC-ACT-RECOVERY`, `PROC-ACT-COMPLETION`.

---

## J-PREPARE-SUPPORT — Obtain usable preparation support from fragmented sources

**Actor:** learner

**Goal:** obtain usable missing target, Knowledge, learning/practice or diagnostic support without becoming responsible for Prep's reusable corpus/schema maintenance.

**Trigger:** another journey discovers that required preparation support is absent, incomplete or uncertain, or the learner starts with fragmented source material.

**Entry condition:** a motivating target/focus or source context exists.

**Preconditions:** source material may be incomplete, conflicting or unstructured.

**Process contract:** request preservation, owner-scoped partial preparation, continuation/recovery and return-to-origin completion are owned by `prep.application-process.prepare-support`.

### Meaningful interactions

1. The learner identifies the missing preparation need in terms of the motivating target/focus and supplies/selects relevant source material.
2. The system performs `APP-REQUEST-PREPARATION-SUPPORT`, preserving source provenance and motivating context.
3. The system performs `APP-PREPARE-SUPPORT`, deriving only candidate meaning supported by the sources and routing each candidate to its existing semantic owner.
4. Independently valid owner-scoped target/capability/Knowledge/learning/observation-spec results may be accepted while unsupported, conflicting or incomplete candidates remain rejected/unresolved.
5. The system exposes what usable support is now available and what preparation gaps remain.
6. The learner returns to the originating journey using the prepared/refined support.

**Completion:** usable support has been accepted where justified, remaining gaps are explicit, and the motivating preparation context is preserved.

**Visible side effects:** accepted reusable meaning may be added/refined only through its canonical owner; source provenance and unresolved/rejected remainder remain distinguishable.

### Alternate / recovery paths

- **Partial success:** accepted owner-scoped results remain usable; unresolved remainder can be supplemented or retried.
- **UNRESOLVED:** unsupported source meaning stays unresolved rather than becoming invented domain truth.
- **REJECTED:** conflicting/invalid candidate meaning does not mutate accepted truth.
- **DEPENDENCY_UNAVAILABLE:** preserve request/source/motivating context for later continuation.
- Learner self-curation may be a later explicit interface option, but this journey does not require schema-level or item-level corpus maintenance.
- No EvidencePattern, EvidentialWarrant or AssessmentDesign is synthesized as fundamental meaning.

**Upstream:** `TASK-U-REQUEST-PREPARATION-SUPPORT`, `TASK-S-PREPARE-SUPPORT`, `APP-REQUEST-PREPARATION-SUPPORT`, `APP-PREPARE-SUPPORT`, `PROC-SUP-BOUNDARY`, `PROC-SUP-COMPOSITION`, `PROC-SUP-CONTINUATION`, `PROC-SUP-RECOVERY`, `PROC-SUP-COMPLETION`.

## Coverage

All USER Task Model work is covered:

- target establishment / requirement understanding → **J-TARGET-SETUP**;
- current state / gaps / next focus → **J-PREPARATION-DIRECTION**;
- Subject Knowledge exploration → **J-KNOWLEDGE-ORIENTATION**;
- support selection / activity / review change → **J-ACTIVITY-EVIDENCE**;
- missing preparation support request → **J-PREPARE-SUPPORT**.

SYSTEM tasks `TASK-S-CAPTURE-PERFORMANCE`, `TASK-S-EVALUATE-EVIDENCE` and `TASK-S-PREPARE-SUPPORT` appear as system responsibilities inside the journeys whose visible outcomes depend on them.

No screen/view/navigation partition is selected here.
