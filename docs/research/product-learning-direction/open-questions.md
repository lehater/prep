# Open questions — product learning direction

**Status: RESEARCH OPEN (2026-10-12).** These are noncanonical product inquiries, not Harness Core Questions and not a roadmap. Priority labels indicate **what should be understood before** choosing product scope; they are not instructions to engineer a feature. Read the [landscape](landscape-scan-2026-10-12.md) and [experiments](open-experiments.md).

## Q-PLD-01 (P0) — What job is the person hiring Prep to do?

When a person says "I want to have competency C," which actual situation are they in: qualify for a credential/interview; solve a practical task; understand a topic; retain factual knowledge; learn a repeatable skill; or manage an externally assigned curriculum? Are there multiple independent users/contexts?

- Competing hypotheses: knowledge-retention bottleneck; goal-to-next-action navigation bottleneck; lack of practice/feedback; assessment/uncertainty bottleneck.
- Counterexample: passing an exam may be an outcome even when task-relevant personal ability is only partially required.
- **Public internet proxy completed 2026-10-12:** [EX-PLD-01 16-episode forum review](experiment-01-public-forum-episode-review.md) codes first-person learning/career/interview/CKA/Anki reports: actual scope/depth confusion exists, but practical feedback, review authoring, time, external interview uncertainty and successful existing solutions compete. This is **self-reported public evidence**, not observed decisions, representative prevalence, measured product value, or Owner segment selection. **Status remains OPEN.**
- Evidence still needed to close for product choice: real matched existing-tool task comparison and ideally later direct learner interaction; **Owner decision** required for target segment/priority.

## Q-PLD-02 (P0) — What *changes* for the learner?

Separate: access to information; comprehension; recall after delay; explanation; execution under task constraints; transfer to new problems; verified performance; subjective confidence. Which transformation is necessary for each proposed Goal? Do not equate "exercise completed" with acquired competence.

- Falsifier: learner passes familiar recall questions but cannot apply principles to a different problem.
- Research closure: observable outcomes and validity limits for at least two materially different goal types.

## Q-PLD-03 (P0) — What is the user's relationship to Knowledge?

Should the user (a) navigate it as external/source material, (b) build reusable concept explanations, (c) actively retrieve/recall it, (d) apply it in practice, (e) connect it to a capability, or combinations? Who identifies missing Knowledge? Can the learner pursue Knowledge without a Capability-first path?

- Contrast cases: remember names/formulas; explain cache invalidation; conduct an interview; physical procedural skill. Knowledge may be central, supportive, or tacit.
- Research closure: identify concrete tasks where removing the Knowledge interaction changes user outcomes rather than merely losing a data table.
- **No approval** of `Capability uses Knowledge`, new knowledge-kind taxonomy, card type, or mastery attribute.

## Q-PLD-04 (P0) — What does Prep itself do, and what stays outside?

Alternatives are **service dimensions, not mutually exclusive architectures**:
- External learning organizer: identify/select information, maintain goal/activity context, support reflection/next choice.
- Active study aid: comprehension, recall, spaced review and knowledge practice *inside* Prep.
- Applied-practice coach: tasks, solution attempts, feedback and guided remediation.
- Competency-assessment aid: evaluate observable demonstrations to a defined criterion.
- Combined/hybrid: choose which subset produces value at justified cost.

Who owns content, practice execution, feedback quality, assessment and scheduling? Must Prep be useful when no content/course exists internally?

## Q-PLD-05 (P0) — What does "show deficiencies" legitimately mean?

Distinguish missing information **in a preparation plan**, an actual failed knowledge retrieval, a flawed task solution, self-reported uncertainty, third-party assessment, and an estimated learner-state construct. The first is a content coverage gap, not proof of inability.

- Risk: claims of "competence gap" or readiness from one recorded Result contradict existing Product Intent boundaries.
- Evidence: can the learner act on an observed error without Prep asserting an unvalidated mastery state?
- Requires explicit Product Requirements and evaluation authority before promising automatic diagnosis.

## Q-PLD-06 (P1) — Who determines learning direction?

Learner selects, expert/curriculum provides path, adaptive system recommends, or mixed? Distinguish a **recommendation** from a mandatory prerequisite and from a personal study preference. What autonomy do learners with different experience need?

## Q-PLD-07 (P1) — Where do content and standards come from?

**Owner clarified (2026-10-12):** the user creates, edits and bulk-loads Knowledge, Capability/Goal structure, relations and study material. Content can originate from standards, authoritative technical documentation, textbooks, notes, AI or other sources. A vacancy can give rough Goal constraints but is not domain authority; reputable external sources can add, refine or contradict its topic hints. Prep does not certify truth, completeness or relevance merely by storing or showing the data. The core user-value test assumes a task-appropriate supplied fixture and isolates the utility of working with it. Who verifies/maintains real-world source quality and whether Prep should eventually offer verification are **separate open questions**, not prerequisites to EX-PLD-06 or automatically accepted product requirements.

## Q-PLD-08 (P1) — How do we compare alternatives fairly?

What is the primary success metric **for one authentic preparation job**: reduced time to choose a next action; accurate delayed retrieval; performance on a novel task; external assessment outcome; a learner's ability to explain what remains unknown? Immediate satisfaction/click count and self-confidence alone are not competence evidence.

## Q-PLD-09 (P1) — Does Goal-first imply all learning must begin with a Capability?

Owner supplied capability-oriented Goal-first input, but is a knowledge-oriented goal ("understand linear algebra") or external outcome ("pass certification") still expressible without fabricating a competence breakdown? Keep the approved owner input distinct from an unapproved universal ontology.

## Q-PLD-10 (boundary) — What would change current Product Requirements?

Existing accepted Prep obligations include information/relationship exploration, external selection/use and recorded Activity/Results, plus all-kind CRUD/bulk. Built-in flashcards, automatic remediation, evidence-based mastery estimation and fixed learning paths are **not** automatically part of that acceptance. Only a deliberate Owner/Product Requirements revision and Harness governance may add/reduce them.

## Q-PLD-11 (P0) — Is Capability a set of Knowledge, a knowledge-application relation, or a separate performance claim?

**Owner hypothesis (not approved):** a Capability can integrate several separate Knowledge items to do a meaningful job. The same Knowledge can be relevant to many Capabilities, and some "required" Knowledge is actually context- or implementation-relative.

- Interpretations to compare: H-A fixed K bundle + minimum depths; H-B action/outcome/conditions with task-relative K support/use; H-C scalar application level of K; optional hybrid not automatically preferred.
- Falsifier: a person knows/explains each K in isolation but fails their coordinated application; or an alternative solution achieves the same result without one allegedly universally necessary K.
- Must distinguish K–K composition, C–K use/needed-under-conditions, Goal's expectation, and person's recorded performance. This is **product inquiry**, not admission of `C uses K`.
- Evidence: [bounded desk analysis](iteration-01-knowledge-space-and-applied-capability.md), proposed [EX-PLD-05](open-experiments.md). **Status: OPEN / owner has not chosen.**

## Q-PLD-12 (P1) — Can one width/depth space carry all perspectives without fabricating competence?

Explore whether (a) depth of **presented subject content**, (b) **required preparation depth** for Goal/Capability and (c) **person's evidence-backed attainment** can be treated as comparable levels. Is coordinated *application* an additional scalar coordinate, a relation over K and task/context, or a separate performance representation?

- No automatic implication from K depth to actual capability; missing evidence is unknown, not zero.
- Countercases: profound theory but failed novel task; narrow competent library-based work with limited theoretical explanation; independent K's needed jointly under certain task constraints.
- Closure: an intelligible user comparison across two Goals and a learner, documenting unknowns and non-comparable profiles, **without** making an assessment promise.
- Evidence: [Iteration 01](iteration-01-knowledge-space-and-applied-capability.md). **Status: OPEN.**

## Q-PLD-13 (P0) — Does scope-to-external-study close an independent Prep learning loop?

**Owner-proposed hypothesis, OPEN (2026-10-12), not approved scope.** An IT learner could choose Goal → Capability Description → scoped Knowledge and *target learning depth* → selected review material → Anki or another external training tool. Review history could return optionally, without inferred competence. Does this deliver valuable "orient, choose, start targeted learning" outcome, rather than merely an attractive knowledge map?

- **Active EX-PLD-06 alternatives:** **D** = credible existing-tools baseline; **C** = selection/packaging of supplied material without a Knowledge/Capability navigator; **A** = goal-scoped Knowledge orientation only; **B** = A plus selection/packaging of supplied theoretical study items and one-way export. These letters follow [Iteration 05](iteration-05-owner-knowledge-scope-to-study-material-boundary.md) and are defined in the [experiment register](open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop); earlier reports used conflicting historical labels.
- **Separate optional question:** whether imported, source-authorized review history helps the next selection. This is **not** comparison variant C and not implied by simple Anki export. No lack of external statistics should be interpreted as zero study. Preserve the accepted general Activity/Result commitments independently of optional automatic synchronization.
- Blockers for **user-value evaluation**: a real participant and authentic goal; one controlled, internally coherent task-appropriate user-supplied fixture; comparable access to the same subject information/tools in each arm; predefined selection/transfer tasks and success measures; real user actions, not an illustrative desk walkthrough. Independent subject expert verification and editorial economics are **not** gates: they belong to optional EX-PLD-07 or later real-content research. The comparison must not mistake theoretical retrieval for demonstrated professional ability.
- Evidence / closure: [Iteration 03 historical scenario](iteration-03-goal-capability-knowledge-external-retrieval-loop.md), [Iteration 05 historical alternatives](iteration-05-owner-knowledge-scope-to-study-material-boundary.md), the [current EX-PLD-06 comparison](open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop), and [optional EX-PLD-07 editorial economics](open-experiments.md#ex-pld-07--editorial-feasibility-of-a-trustworthy-goal--knowledge-scope--practice-packet). Demonstrate **observed** orientation and material-selection/transfer value against D/C on the same fixture, not merely a file export.
- Do not infer that card repetition automatically proves Knowledge mastery, that a Capability is person-specific, or that Anki export / automatic stats import is already accepted Product Requirement.

## Evidence pointers for open questions (not status copies)

- [Iteration 02](iteration-02-knowledge-skill-capability-reducibility.md) provides counterexamples for Q-PLD-11/12.
- [Iteration 04](iteration-04-goal-to-useful-action-market-and-scenarios.md) contains a broader, **dated** product/job analysis; assess it against the [current research framing](research-framing.md) rather than importing its old direction.
- [Public-episode proxy](experiment-01-public-forum-episode-review.md) is evidence with sampling limitations; the status of EX-PLD-01 resides in [open experiments](open-experiments.md).
- [Iteration 05](iteration-05-owner-knowledge-scope-to-study-material-boundary.md) records the Owner's narrowed theoretical-Knowledge hypothesis and reinterpretation of previous evidence; the **current research framing** is maintained only in [research-framing.md](research-framing.md).

## Research pause rule (not a product directive)

Do not spend more iterations refining implementation semantics in this topic unless there is a specific question with a falsifiable comparison. Bring a bounded alternatives/impact packet to the Owner rather than letting the research README turn into an implementation decision.
