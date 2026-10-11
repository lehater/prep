# Iteration 01 — Goal–Capability predicates, incompleteness, and Goal-first test

**Checkpoint:** 2026-10-12. **Classification:** NONCANONICAL RESEARCH. No Owner decision, Core Question closure, accepted relation kind, Product Requirements revision, Harness operation, or currentness assertion is made here.

**Rechecked:** research branch head `b1b08db1ff0d616ce3261c867dcfcaa76bbe0206`; `mvp-vertical-slice` head `781f6aad64f0c98b165ffcdbde3e87f81952920d`; Draft PR #101 remains open, draft and unmerged at the start of this iteration. Its three Tactical blocker Questions belong to the PR candidate, not the MVP base. The base Core still contains the Product Requirements information-lifecycle Question. This investigation uses read-only canonical source inspection; it did **not** run pinned Harness or change canonical files.

## Scope and status

Research pass for GD-00, GD-01 and GD-02, in that order as one semantic unit. GD-03 (catalogue), GD-04 (direction/multiplicity) and GD-05 (deletion) are **not decided** and should be examined after the Owner selects which concrete Goal–Capability fact, if any, merits admission. All four earlier Owner inputs (information identity, distinct concepts, relation identity, selective admissibility) are unchanged.

**Supported existing Product Requirements:** explore Goals, CapabilityDescriptions, Knowledge, PracticeMaterial and their admitted relationships; inspect alternative perspectives; select a subset for external use; bring recorded activity/results back and inspect them with subject/time context; provide CRUD and bulk-load for **every admitted kind**. Current requirements do not promise a Goal-centered saved focus, automated next step, readiness estimate, mandatory G–C relation, or complete list of necessary abilities. See [Product Intent](https://github.com/lehater/prep/blob/781f6aad64f0c98b165ffcdbde3e87f81952920d/.harness/knowledge/product-intent.yaml) and [Product Capabilities](https://github.com/lehater/prep/blob/781f6aad64f0c98b165ffcdbde3e87f81952920d/.harness/knowledge/product-capabilities.yaml) **at the explicitly checked MVP revision**, not implicitly at the research branch revision.

## 1. Semantic separation (GD-01)

Three candidate assertions answer different user questions:

| Candidate | Exact intended fact | User question | Change/invalidity test |
| --- | --- | --- | --- |
| R: `G requires C` | Under the **stated success condition, permitted routes and designated actor**, every valid way to achieve G entails ability C being exercised or available where required. This is a **necessity of outcome**, not learner possession at preparation start. | “Without this ability, is success as defined impossible?” | One valid permitted success route not needing C defeats an unconditional R. |
| T: `G targets C` | Development or demonstration of ability C is **itself part of G's desired outcome**. | “Is being able to do C one of the things the person seeks to achieve?” | If the user can achieve G without gaining/demonstrating C, T is not warranted. |
| F: `G preparation-focus C` | The learner **selects C as a present area of preparation** relative to G, without asserting that C is necessary or is a final outcome. | “What am I choosing to work on for this Goal now?” | Changing one's study focus changes F even if G and C are unchanged. Persistent F implies a user-facing change/removal behavior and a temporal/intentional scope to examine. |

R, T and F are **not mutually exclusive in reality**, but neither is a substitute for the other. In a precise “learn to perform C” Goal, T and an outcome-reading of R can both be true (achievement entails C); storing both may add no practical information. If someone means by “requires” *must already possess C before studying*, that is a **different, incorrect predicate** for this investigation. This overlap must be tested before proposing two separately persisted link kinds.

A fourth generic `G related-to C` does not explain whether the ability is required, targeted or currently selected; using it as the default would undermine Owner-approved selective admissibility (D1).

An asserted R is a user-provided proposition, **not a proof** the necessity is true. No confidence, assertion-source, provenance, mastery, or verification subsystem is implied.

## 2. Counterexample matrix (GD-01 + GD-02)

Legend: **Yes** = proposition follows from exact wording/added stated context; **No** = explicit counterexample defeats it; **?** = insufficient information, not false. F is Yes **only when the learner explicitly selects it**. Values are analytical judgements, not validated truth claims.

| Exact Goal G | CapabilityDescription C | R | T | F | Discriminator |
| --- | --- | --- | --- | --- | --- |
| G1 “Learn to argue backend architecture tradeoffs in a written review without help.” | C1 “Argue architecture tradeoffs against workload and quality constraints.” | Yes, **as an outcome entailment**, not a prerequisite before learning | Yes | ? until selection | T communicates purpose directly; duplicating the logically implied R may add no useful fact. |
| G2 “Pass a Senior Backend system-design interview; its questions and scoring are not yet known.” | C2 “Explain availability versus consistency tradeoffs.” | ? | No under stated interview-only Goal | Yes if selected as current preparation | C2 can be a prudent focus without being a certified necessary condition. |
| G3 “Personally execute protocol X correctly, under its specified conditions, without delegation.” | C3 “Perform protocol X as specified.” | Yes (actor and success criteria explicit) | No, absent an intent to *develop* this ability | ? | Necessity does not entail missing mastery; the ordered procedure is distinct from C3. |
| G4 “Receive a valid calibration certificate from an accredited external laboratory.” | C4 “Personally calibrate the instrument.” | No, given the permitted external-laboratory path | No | ? | A valid route exists without the goal holder performing C4. |

**Precision correction:** Treat G2 R as unknown rather than immediately false. The interview *may* require C2, but nothing given establishes necessity across permitted successful outcomes. Treat a missing R record as unknown, even if a researcher independently knows a counterexample; a false proposition is not represented by “no link.” G4 illustrates a falsified *proposed unconditional assertion*, not a proposed stored negative relation.

### What would change the classifications

- G2: if its exact success criteria explicitly require the candidate **personally to explain tradeoffs**, R for that specified C may become defensible. If the Goal is rewritten as “learn to explain tradeoffs well enough to pass the interview,” T is now also meaningful. No Goal rewrite should happen automatically.
- G3: rewriting G3 as “learn to personally execute X” can make T true; already possessing C3 does not invalidate R for an actual required execution.
- G4: change the Goal to “personally perform calibration and obtain a certificate” and the own-ability R changes. The certificate alone does not require it.
- G1: if learning is redefined merely as “read about architectural tradeoffs,” neither demonstrated C1 nor R's strong necessity is supported without a measurable success condition.

## 3. Incompleteness, scope and scope of truth (GD-02)

**Candidate semantic guardrails for Owner review:**

1. A Goal can exist with **zero** G–C assertions. It may be incomplete, unexplored or not even about acquiring an ability. Zero links must not be interpreted as “no capabilities matter.”
2. Absence of R/T/F means **no such assertion is stored**, not a negation of the proposition. Do not require exhaustive Goal decomposition, closed-world reasoning, or automatic missing-links generation.
3. A necessary C can be required **at Goal attainment**, not necessarily at the beginning of preparation; the user may already have that ability.
4. The strong R predicate needs a bounded reading of “Goal success”: designated actor, permitted alternatives and relevant success constraints. Natural-language Goal text can carry this scope initially; do not force a dedicated schema of required actor/conditions/criteria without task evidence.
5. The same CapabilityDescription can be associated with several Goals without identity cloning. Goal-specific choice of F does not automatically alter C's definition or global C–C composition.
6. Recorded Activity/Result concerns concrete occurrence and subject context (DS-02). It must never automatically prove R, T, C possession or Goal attainment. A practice result can motivate a **human** to change focus.
7. Qualifying a necessity fact with different contexts may ultimately be necessary, but context/provenance metadata and an AND/OR planner are **not** admitted here. If two claims are truthfully different only by context, an unqualified binary R is inadequate: either clarify Goal descriptions or reopen qualified-claim design under its proper owner.

For G3, a capability to follow a protocol and an ordered series of protocol steps answer different questions. The latter is a Procedure or external PracticeMaterial concern. Do not turn a Capability composition relation into executable step ordering.

## 4. Smallest human-directed E2E and gap detection (GD-00)

**Walkthrough W1 (learning outcome):** Input G1; user records C1 as a description (no predeclared decomposition); selects an exercise M; performs it outside Prep; records A with timestamp and outcome “tradeoff justification omitted failure modes,” related to its preparation subjects; returns, reads result and **personally** chooses M2 focusing on failure modes. Observable output: a defensible next user-selected activity in the Goal's context, **without** automatic mastery, scoring, completion, or ordered plan.

**Walkthrough W2 (uncertain external outcome):** Input G2 with no justified R. User chooses C2 as an area to prepare; selects a system-design exercise; records feedback “struggled with availability”; revisits and chooses another exercise. The current accepted selection/activity requirements can describe most of this walkthrough **without persisting any G–C relation**. However, the product does **not yet promise** that opening G2 after a restart surfaces “C2 is my currently chosen focus.” This is a separate observability/persistence question, not proof that “requires” is the right relation.

**Discriminating acceptance experiment (not performed):**
- A: use existing exploration, selected information, and activity/subject-context records to complete W2 with **no persisted G–C predicate**.
- B: repeat the exact data and actions, but enable a visible saved `Goal ↔ current focus` view.
- Ask the user, after leaving and returning to the Goal, to identify (i) why C2 matters for this preparation **without asserting necessity**, (ii) what exercise was done/when/what was observed, and (iii) what to select next.
- Measure task completion/correctness, false “required” interpretations, extra user actions and whether saved focus adds decisive value. This is a proposed **user experiment**, not measured UX evidence. Do not infer that B wins by construction.

**Product authority gate:** if “resume preparation *from the same Goal with saved selected focus*” is a required user-visible promise, route a narrow Product Requirements change (GD-00 option B). If existing exploration/selection/recorded context suffices, GD-00 option A may be enough; neither case alone admits a tactical relation type. Product Journey/UI/Application design must not invent a mandatory persistence contract.

## 5. Decision consequences and recommended order

| Approach | Semantic correctness | First E2E | Cost / principal risk |
| --- | --- | --- | --- |
| One unconditional `Goal requires C` for every Goal | **Fails** G2/G4; falsely upgrades study guesses to necessity | Misleading | Incorrect domain proposition; must reject as universal rule. |
| One `Goal targets C` for every Goal | **Fails** externally measured G2/G4 unless goals are silently rewritten | Useful for G1 | Illegitimate narrowing of what “Goal” can mean. |
| Persist all R+T+F immediately | Can express diverse assertions if carefully defined | More than W1/W2 requires | Every type demands full CRUD/bulk plus own meaning, edit, removal and context rules; no observed benefit yet. |
| **Research preference:** do not require G–C on Goal creation; test user-driven Goal-first with current admitted interactions; assess narrowly typed T for G1, R only for demonstrated necessity, and F persistence only if W2 requires it | Preserves uncertainty and Goal variety | Supports a cheap first test | Saved Goal-focused return may need an explicit product commitment. |

The research preference is **not owner approval of T, R, F or their exclusion**. First establish the product-visible need; then decide the minimum relation meaning. Do **not** claim existing accepted relationships include one of R/T/F.

## 6. Owner decision cards (OPEN)

**GD-00, Product Requirements, P0.** Does the first MVP have to preserve a user-selected preparation focus **under a Goal across sessions** and make the return journey visible?  
- A: not required; prove the human-directed walkthrough with existing exploration/selection/recorded-context behaviors.
- B: yes, a narrow goal-centered persistence/return promise; route Product Requirements first without fixing its tactical realization.
- C: automated planning/readiness/completion (no current evidence; defer).
**Research recommendation:** test A quickly and promote to B only if A fails the useful return task or the Owner explicitly requires it. **Owner decision needed.**

**GD-01, Tactical, P0.** Which **specific user question** must the first stored G–C assertion answer?
- T, ability as desired result; strong fit for G1, no invented necessity.
- R, demonstrably necessary ability under scoped success conditions; strong fit for G3, not a default for G2.
- F, currently selected preparation focus; fit for G2 **if and only if** the selection must persist as a Goal-relative relationship rather than an application selection/view.
- None in the first slice; run W2 without a durable G–C predicate and reconsider if the experiment fails.
**Research recommendation:** reject universal R; **do not choose a new canonical type until GD-00 and the first demonstration Goal are fixed.** Additional types can be separately justified later under D1. **Owner decision needed.**

**GD-02, Tactical/Product, P0.** Approve or amend the open-world guardrails in section 3 before setting cardinality/integrity rules; in particular, no mandatory G–C, absent-link = unknown, and no inferred mastery/success. **Owner decision needed.**

## 7. External precedents and limits of analogy

- [CTDL-ASN terms](https://www.credreg.net/ctdlasn/terms): `ceasn:comprisedOf` expressly refers to **Competency→Competency** inclusion in whole or in part; it does not provide a Prep Goal→Capability necessity or learner-readiness predicate.
- [CTDL Handbook](https://credreg.net/ctdl/handbook): models a credential requiring a competency through a **ConditionProfile**. This confirms that “requires” is context/condition sensitive; its credential-specific property model should **not** be copied onto all Prep Goals.
- [iStar 2.0 Language Guide](https://arxiv.org/abs/1605.07767): distinguishes intentional goals from the means and alternatives used to achieve them; conceptual countercheck for why “a potentially helpful ability” is not automatically a necessary condition.
These references are semantic comparison aids, not normative imports, schema prescriptions, empirically verified UX or sanctioned Prep relationship kinds.

## 8. Next gate

1. Obtain the Owner's GD-00 answer (saved Goal-relative focus/return promise or minimal existing-scope walkthrough).
2. Fix **one** first demonstration Goal, its success criterion, actor and valid alternative routes; confirm what the user must be able to ask about C afterward.
3. Obtain the scoped GD-01 choice and GD-02 guardrails through the owning Authorities.
4. Only then investigate GD-03 admitted link kinds and GD-04/GD-05 rules, with duplicate-assertion, endpoint-deletion and bulk-loading mutation tests.
5. If a decision changes accepted product/canonical semantics, use the task-branch pinned Harness router and governing procedures; do not port these research notes directly to Core/Publication. Preserve PR #101 as blocked until its independent closure.
