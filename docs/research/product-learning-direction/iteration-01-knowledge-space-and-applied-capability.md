# Iteration 01 — Knowledge space and applied Capability

**2026-10-12 | NONCANONICAL / RESEARCH ANALYSIS | NOT A PRODUCT OR DOMAIN DECISION**

**Motivating owner hypothesis:** Preparation may be understood as an expandable **space of Knowledge** with depth and breadth. Job/Goal requirements and a specific person's observed attainment can be considered as distinct *views* on that space. A Capability may be the **coordinated application of multiple reusable pieces of Knowledge** toward a result: for example, a payment API uses knowledge of HTTP APIs, database transactions, idempotency, retries, external-provider failure and business constraints. The owner explicitly expressed uncertainty whether application is a third coordinate, a separate scale or a different kind of relation. This note studies alternatives; it does not approve `Knowledge -> Capability` links, levels, or automated assessments.

## 1. The question: coordinate, relationship or separate performance meaning?

The useful ambiguity is **not** whether a learner needs to know multiple things. It is how to represent the distinct facts:

1. `Knowledge K` is reusable subject matter with identity, granularity, relationships and optional levels of description.
2. `Goal G` (e.g., fill a particular vacancy) can involve some collection of professional performances and knowledge **under contextual assumptions**.
3. `Capability C` is a statement about being able to **do something** under relevant conditions and constraints. It might coordinate several K's. Which K are needed may change with implementation strategy, available tooling or task constraints.
4. `Person P` may have evidence of explaining K individually but **not** evidence of combining it with other K in actual work; another person may carry out a routine without being able to explain all underlying mechanisms.
5. `Activity A / Result R` records an actual attempt, outcome, time and subject; it is **not** automatically an assessment of the person's K-depth or C.

Distinguish:
- **Knowledge composition**: K_B describes a part/aspect of K_A (depending on an approved, precise predicate).
- **Knowledge relationship**: K_A and K_B are adjacent, contrast, influence or depend on one another under stated conditions; not necessarily hierarchical.
- **Capability application**: C uses **several** independent Knowledge concepts in a way that supports some performance goal.
- **Task/Context-relative requirement**: in a particular situation C may call for K at a certain *working depth*; this does not make K universally part of C.
- **Evidence of performance**: the learner showed some result in conditions Q, not that every relevant K is mastered.

The horizontal width of a Knowledge space is **coverage of items**, not necessarily a meaningful geometric axis: an arbitrary left-to-right ordering is a visual arrangement. The depth of a concept's *presented content*, the *depth needed for a goal*, and *personal demonstrated attainment* are three different functions or claims, even if displayed on a common scale. **Ability to coordinate and perform** might not be a scalar at all.

## 2. External models and what they actually support

| Source/model | Observation | Prep implication / boundary |
| --- | --- | --- |
| [O*NET Content Model](https://www.onetcenter.org/content.html/content.html) / [US DOL](https://www.dol.gov/agencies/eta/onet) | Distinguishes worker Knowledge, Skills, Abilities, and job Tasks/Work Activities; occupations require different mixes | Professional performance can be related to several knowledge/skill aspects, but these are different categories, not a single mastery coordinate |
| [ESCO two-pillar classification](https://esco.ec.europa.eu/en/about-esco/escopedia/escopedia/two-pillar-structure-esco) | Separates occupations and knowledge vs skill/competence concepts, with essential/optional links depending on context | Reusing subject concepts across occupational profiles is plausible; link necessity and Goal/context are not universal |
| [SFIA 9](https://sfia-online.org/en/about-sfia/how-sfia-works) | Professional skills combine with degree of responsibility; autonomy, influence, complexity, business factors and Knowledge matter | Performance level is broader than the depth of any isolated piece of Knowledge |
| [EU JRC DigComp 3.0](https://joint-research-centre.ec.europa.eu/scientific-activities/key-competences-lifelong-learning/digital-competence-framework-digcomp/digcomp-30_en) | 21 competences in 5 thematic areas; proficiency levels and outcomes expressed in knowledge, skills, attitudes | Possible precedent for separate competence area, proficiency and associated knowledge/skill outcomes; no reason to import its fixed taxonomy |
| [Four-Component Instructional Design (4C/ID)](https://www.4cid.org/about/) and [higher-education review](https://onlinelibrary.wiley.com/doi/full/10.1111/ejed.12363) | Complex professional skills may require integration and coordination through whole authentic tasks; uses supportive/procedural information and component practice | Knowing pieces is not enough to validate coordinating them. Whole-task work may be a qualitatively different learning mode, **not** mandatory Prep feature |
| [Evidence-centered assessment design](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1745-3992.2006.00075.x) | Claims about competence must be supported by task/evidence reasoning | Performance observations cannot automatically be promoted to claims of individual K mastery/C readiness |

These sources illustrate **different conceptual cuts**, not a convergent universal model or evidence that Prep should become an evaluator. Job frameworks and pedagogy do not define software architecture.

## 3. Three genuinely distinct candidate interpretations

**H-A: Capability as fixed knowledge bundle + threshold profile.**
- `C` is represented essentially as a set `{K1@depth d1, K2@d2, ...}`; each Goal adds its requirements to the bundle.
- Advantage: simple common-space requirement/learner gap overlay and learning-content navigation.
- Failure risk: the same pieces may be used in incompatible ways; decision-making, integration, operational context, experience and alternative solutions disappear. A bundle alone does not entail successful performance. Threshold necessity is unproven.

**H-B: Capability as action/outcome/conditions, with explicit Knowledge dependencies or support relations.**
- `C` describes the intended applied performance; selected K's can be linked as relevant, used, needed-under-context or alternative ingredients after precisely defining a link kind.
- Advantage: decouples semantics of doing from what is known, allows K reuse across several C's and variant solutions. Does not infer mastery from K-depth.
- Cost/unknown: whether the links should be **global C–K facts**, **Goal-relative assertions**, **task-specific evidence/knowledge usage**, or multiple distinct relations. Could be overcomplicated if MVP's user task needs only navigation.

**H-C: A third scalar application/proficiency coordinate for each K (or K-profile).**
- `K` might have a 'can apply' score orthogonal to recall/understanding; a Goal could specify both minimum content depth and minimum applied depth for K.
- Advantage: simple display and potentially separates theoretical from practical competence.
- Failure risk: coordination is **relational**; it depends on the tuple of K, goal, task, operating constraints and other people/tools. A scalar for individual K cannot assert **which** knowledge is integrated or **what** was accomplished. A score requires valid measurement and evidence before reflecting a person.

**Hybrid is possible** (common Knowledge space for navigation + separate applied Capability statements + possibly display levels) but **not approved or preferred** here. An incidence matrix/table or a many-to-many/hyperedge diagram could visualize these without becoming a required domain schema. A drawn geometric 'axis' is not an automatic semantic dimension.

## 4. Fixed adversarial situations / analytic checks (desk reasoning only)

The following are *constructed cases*, not user observations or executed instrumented tests. Each one targets a specific simplification.

| Case | Frozen facts | What must not be inferred | Most affected hypothesis |
| --- | --- | --- | --- |
| P1 Integrated payment API | HTTP request handling, transaction boundaries, idempotency, retries and partial external-provider failures are **separate** topics. Candidate C: implement safe payment-intent endpoint with retries under defined failure conditions | Having read/explained all K does **not** establish correct coordination, reliability or production capability. A database transaction by itself does not make a remote provider operation atomic | H-A, H-C |
| P2 Context-dependent alternative implementations | The same external result might be produced via different libraries, delegated provider features or transaction/message patterns, depending on requirements | No *one* particular K or technique is automatically necessary for every solution that achieves the outcome | H-A rigid all-of K |
| P3 Nonmatching learner profiles | Person X explains all related theory but fails a new integration task; Person Y operates a narrow library-based solution but cannot explain every mechanism | Neither overall competence nor full K mastery follows from the other. A person's C may be demonstrated only in the tested conditions | H-A, H-C |
| P4 Reuse across Goals | The same API/transaction knowledge can be used for payment operations, order workflows and interview cases, under different failure and quality requirements | Knowledge relevance to several Capabilities is not Knowledge identity change; the same C's Activity record without Goal/task context cannot reliably explain *which* Goal it served | global-only interpretations |
| P5 Incomplete / revisable learning map | Goal starts with unknown requirements; K2 is discovered later; person hasn't attempted K3; one area is merely explored at overview level | Missing item/link/record does not prove K irrelevant, mastery zero, or competence absence | all hypotheses |

**Desk analysis:** H-A is a useful *coverage projection*, but cannot by itself express the application claim for P1/P3 and can overstate universal necessity in P2. H-C can visualize one dimension of individual K practice but cannot by itself encode a task-coordinated Capability for P1/P2. H-B preserves a separable action/outcome meaning and can *potentially* express these cases, but its exact C–K relation kinds, conditions, cardinality, and evaluation are undetermined. This is a logical comparison of interpretations; it is **not** proof H-B gives better UX or deserves MVP inclusion.

## 5. Concrete illustration, NOT model-schema proposal

**Separate Knowledge:** `K-HTTP` request/response; `K-TX` database transaction; `K-IDEMP` idempotency; `K-FAIL` failure/retry handling; `K-PAY` payment provider semantics.

**Goal:** `G` qualify for a backend role with payment features.

**Possible Capability statement:** `C` "Design and implement a payment-intent endpoint that handles retries and partial failures correctly under specified business and provider constraints."

Several K's can matter to C **in this task context**. The person may orient within each K, study them to a depth, then attempt *the integrated problem* (and perhaps repeatedly practise parts) without the task being one of the K's or the full C being just a list of K's.

No fixed use/required-depth predicate, proof of K mastery or process sequence is asserted by this illustration. A PracticeMaterial could contain the whole-task case, while recorded Activity/Result could describe an attempt without inferring proficiency.

## 6. Research implications, choices still open

1. **Ontology vs mapping:** Is Capability *definitionally* a combination of K, or a repeatable applied performance **supported by** K? Distinguish Knowledge-to-Knowledge structural relation from Capability-to-Knowledge use and task-specific demand.
2. **Projection vs competence:** A Goal's needed K breadth/depth may be a useful *preparation profile* even when it cannot establish sufficient Capability performance; a person's K confidence is not validated performance.
3. **Conditionality:** The set of 'needed' K may vary by task, quality bar, implementation option, tools and experience. Avoid unqualified universal `requires`, mandatory all-of bundle and implicit graph closure.
4. **Level semantics:** A content-exposure level, requested performance level and evidence-backed current capability are distinct claims. Third-axis interpretation should be tested against irreducible coordination.
5. **Activity/evidence:** Does the person want to identify needed K, *select what to learn*, practise integration, or validly measure ability? These are different product outcomes.
6. **Scope:** Current accepted [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml) cover information/relationship exploration, selection for external study, Activity/Result context and all-kind CRUD/bulk. **No automatic mastery gap or competence inference is admitted**. This research may inform later explicit Product Requirements review, but is not one.

**Next bounded test proposal:** [EX-PLD-05](open-experiments.md) — compare interpretations with the same 3 Knowledge + 2 Capabilities + 2 Goals, include task change and one unobserved learner K; ask whether a person can distinguish K coverage from proven integrative performance and choose the next action. Freeze the actual fixture and falsifiers *before execution*. Start as a small desk storyboard; user observation only when motivated. Prior [EX-GF-01](../capability-goal-semantics/experiment-01-goal-first-model-stress-test.md) already established a separate issue of Goal-specific activity context; do not rerun it under a new name.

**Result status:** alternatives surveyed, constructed counterexamples articulated; **no model/axis/relation/product decision**, no accepted domain schema, no experiment marked passed or product usefulness established.
