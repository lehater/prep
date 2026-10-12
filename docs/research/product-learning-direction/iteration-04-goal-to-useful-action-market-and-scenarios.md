# Iteration 04 — Is goal-scoped knowledge exploration a valuable preparation product?

**2026-10-12 | NONCANONICAL PRODUCT RESEARCH | DESK-BASED MARKET / STANDARDS / LEARNING EVIDENCE + SCENARIO COMPARISON | NO USER OBSERVATION / NO OWNER DECISION**

Related: [handoff](HANDOFF.md), [questions](open-questions.md), [experiments](open-experiments.md), [Iteration 03](iteration-03-goal-capability-knowledge-external-retrieval-loop.md), [prior landscape](landscape-scan-2026-10-12.md). This iteration expands the **user-value** inquiry, not C–K or Goal–C domain semantics.

## 1. Research proposition and evidence discipline

**Owner-proposed hypothesis:** Prep helps people explore a knowledge space for a concrete Goal, consider an applied Capability as a **scope** (not as a measurement of their competence), select intended study depth/material, and use that material in external tools such as Anki. Optional activity/review data is recorded as history, not proof of readiness.

**Stronger, falsifiable product question:** *For which real preparation job does a person make a materially better next learning decision or reach a useful external learning action with Prep than with tools already available?*

Evidence labels in this note:
- **FACT / external-source feature:** statements about what an official product, standard, empirical study or real vacancy says; vendor features are not independent efficacy evidence.
- **RESEARCH SYNTHESIS:** interpretation that may guide a product decision but does not constitute a user observation.
- **DESK CASE:** constructed learner actions and possible outcomes grounded where applicable in a real source; never a description of an interviewed person.
- **HYPOTHESIS / RECOMMENDATION:** something to test or decide, not accepted scope.
- **OWNER INPUT:** proposed direction in Iteration 03; not a new Product Requirements approval.

**Current canonical boundary checked on `mvp-vertical-slice`:** `.harness/knowledge/product-intent.yaml`, `.harness/knowledge/product-capabilities.yaml`, `docs/discovery/problem-evidence.yaml`, `docs/discovery/user-needs.yaml`. Accepted obligations cover information and relationship exploration, differing perspectives, selected external use, recorded activity/results and intake, all-kind CRUD/bulk within the admitted model. Personal mastery assessment, content verification, source/provenance management, fixed C–K/Goal taxonomies and a specific Anki integration are NOT accepted. In `user-needs.yaml`, `observed_tasks: []`; problem evidence is primarily Owner stakeholder statements. **Research concern:** solution-oriented accepted observable scope currently has weaker direct user evidence than its specificity might suggest; this is not a claim that the requirements are invalid or permission to alter them.

## 2. Actual alternatives exist across the entire proposed chain

| Need / competitor pattern | FACT: publicly described capability (checked 2026-10-12) | RESEARCH SYNTHESIS: competitive test for Prep |
| --- | --- | --- |
| Broad professional overview: [roadmap.sh](https://roadmap.sh/) and [backend roadmap](https://roadmap.sh/backend) | Role-based and skill-based roadmaps, explanations, projects, lesson packs, AI tutor | A generic navigable IT knowledge/skills map is not a sufficient differentiator. Distinguish a *particular real goal* and its constraints. |
| Career-role paths: [LinkedIn Learning](https://www.linkedin.com/learning/) | Career goals/Skill Evaluations, Role Guides and curated learning paths | A role → skill → resource link is not new. Ask whether Prep offers *user-owned, cross-source, vacancy-specific, selectively exportable* context with observable value. |
| Connected notes and practice: [RemNote](https://help.remnote.com/en/articles/8663109-flashcard-basics), [spaced repetition](https://help.remnote.com/en/articles/6022755-getting-started-with-spaced-repetition) | Linked content converted into multiple card types, flashcard scheduling, external import/export | Knowledge → cards → scheduling is already an integrated workflow. Prep's extra hop must earn its cost. |
| External repetition: [Anki text import](https://docs.ankiweb.net/importing/text-files.html), [Anki scheduling background](https://docs.ankiweb.net/background.html) | UTF-8 delimited import, identifiers/matching rules, spaced review | One-way selected card transfer is technically feasible; feasibility does not prove incremental benefit. Anki internal GUID is not a general app ID. |
| AI-assisted studying: [NotebookLM](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-student-features/) and [source-selective flashcards](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-app-quizzes-flashcards/); [ChatGPT Study Mode](https://help.openai.com/en/articles/11780217-study-mode) | Source-grounded questions/cards, selective sources, guided explanations and knowledge checks are described | Merely generating questions is likely a low-defensibility feature. Need high-quality goal-relative selection, task fit and continuity beyond a session, or another proven problem. |
| Occupational classification: [ESCO](https://esco.ec.europa.eu/en/about-esco/what-esco), [O*NET](https://www.onetcenter.org/database.html), [SFIA 9](https://sfia-online.org/en/sfia-9/responsibilities) | Reusable occupations/tasks/skills/knowledge and, in SFIA, levels of responsibility, autonomy and complexity | Raw professional standards can be **inputs for orientation**, not validated requirements of one vacancy, a universal K-bundle, or personal competency evidence. Check licensing/versions separately if implementing. |

**Competitive conclusion (research):** Most primitives already exist. Prep's candidate value is **contextual translation and decision continuity**: from ambiguous desired outcome to a bounded, justified choice of what to learn/practise next, across heterogeneous information and external tools. This distinction remains unvalidated, and generic AI assistance is an important zero/new-product baseline.

## 3. Learning science: what is and is not licensed

1. **FACT:** [Dunlosky et al. (2013)](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html) find high general utility for practice testing and distributed practice relative to many common techniques. **Limit:** benefit from retrieval does not establish that all professional tasks are representable by short card prompts.
2. **FACT:** [4C/ID review](https://doi.org/10.1111/ejed.12363) and [National Academies on transfer](https://www.nationalacademies.org/read/13398/chapter/6) emphasize integrated practice and transfer for complex performance. **Limit:** their evidence does not specify Prep's product boundaries.
3. **FACT:** [SFIA 9](https://sfia-online.org/en/about-sfia/how-sfia-works) characterizes responsibility levels using autonomy, influence, complexity and knowledge; [ESCO skills](https://esco.ec.europa.eu/en/classification/skill-main) distinguishes knowledge from skills. **Interpretation:** one global scalar 'depth of K' cannot serve as content detail, Goal requirement and demonstrated C attainment at once.
4. **FACT:** [OECD report, Helping adults overcome barriers to training (2026)](https://www.oecd.org/en/publications/helping-adults-overcome-barriers-to-training_1d108027-en/full-report.html) reports time constraints, costs and participation motivation as major adult-learning barriers. Only a minority cite inability to find suitable training. **Limit:** population-level findings do not falsify a niche of sophisticated self-directed IT learners; they force a specific segment, frequency and severity test.
5. **FACT:** [Matcha et al. systematic review](https://research.monash.edu/en/publications/a-systematic-review-of-empirical-studies-on-learning-analytics-da) critiques weak theory and evaluation behind many learning analytics dashboards. A [meta-analysis published online 2026-10-07](https://www.sciencedirect.com/science/article/pii/S1096751626000461) reports small student-facing dashboard effects (g ≈ 0.29), with uncertainty and possible bias; recent, higher-education-specific evidence, not a Prep efficacy estimate. **Implication:** looking at a map/history dashboard must not be substituted for actually making a better choice or learning.
6. **FACT:** [Bloom taxonomy overview](https://teaching.cornell.edu/resource/blooms-taxonomy) distinguishes recall, understanding, application, analysis, evaluation/creation objectives. **Implication:** intended *depth* can be a user-visible task-specific objective (e.g., define, explain tradeoff, use in scenario); the labels do not validate a universal linear proficiency scale or suitability of every item for Anki.

**Minimal integrity constraints for research:** (a) topic listed ≠ topic known; (b) relevance ≠ universally required; (c) stated vacancy requirement ≠ precise examination blueprint; (d) intended depth ≠ achieved depth; (e) card import ≠ review; (f) review ≠ durable retention; (g) retention ≠ task performance; (h) activity not returned ≠ activity did not occur.

## 4. Three distinct real-world preparation contexts — desk comparison, not user study

**Freeze / common criteria before desk analysis:** Keep the actual external goal description; for each scenario identify (1) outcome and source of requirements, (2) user's likely decision bottleneck, (3) how C-scope helps or harms, (4) an *appropriate* first study action and evidence of it, (5) baseline solution without Prep, (6) disconfirming case. Only the source goal descriptions are real; hypothetical learner intentions/decisions are **DESK CASE**.

### S1 — Enter a profession: general backend developer

- **Source (FACT):** [roadmap.sh Backend Developer, 2026](https://roadmap.sh/backend) provides a broad learning roadmap, roles/tasks, APIs/databases and projects. Not a universal employer standard.
- **Goal (DESK):** learner starting backend wants to identify a tractable first study step.
- **Candidate C scope:** build a simple HTTP API backed by a relational database; helps connect API, language, SQL and testing as a user-recognizable result. Alternatively, learner may simply need a starter course.
- **Useful action:** choose one beginner project and work it, perhaps create a few SQL/HTTP recall prompts; project execution and feedback are distinct from flashcard success.
- **Baseline:** read roadmap.sh, choose its first project or a structured course; ask an AI tutor for a small initial plan.
- **Likely Prep failure:** extra C selection and K filtering overwhelm the beginner who lacks conceptual vocabulary; no reason to use Prep when a curated sequence already removes ambiguity.
- **Research inference:** C can clarify purpose *if understandable*, but compulsory C navigation is a liability for novices. Value of selective Anki export is conditional.

### S2 — Prepare for a specific job: SQUIRE Backend Engineer, Payments Team

- **Source (FACT):** [SQUIRE's live posted vacancy as checked 2026-10-12](https://jobs.lever.co/getsquire/5bd354f4-9823-4716-a7e5-a747a5aef3c9): Node.js/payment-processing flows, reconciliation, double-entry ledger, idempotency, payment lifecycle, production-domain experience, seniority and collaboration; particular geographic/hybrid conditions. A **job posting is employer-stated requirements**, not a validated score rubric.
- **Goal (DESK):** experienced applicant wants to decide what to review before an interview. This does not imply that knowledge study can replace required years of production experience.
- **Candidate C scopes:** explain/design idempotent payment flows under duplicate requests and failure; reason about reconciliation/ledger integrity. Each draws on multiple K topics; relevance of details depends on employer stack, interview format, own background and expected task. The employer's actual interview focus is **UNKNOWN**.
- **Useful action:** select targeted concepts, compare idempotency strategies, practice explaining tradeoffs with a novel payment scenario; some definitional prompts can be exported to Anki, while an end-to-end failure-handling case requires an applied design task and feedback.
- **Baseline:** manually annotate vacancy, search dedicated interview materials, request a custom AI review plan and use Anki directly.
- **Likely Prep failure:** a confidently asserted “complete coverage of vacancy requirements” masks unknown evaluation criteria, and polished cards foster false readiness; users without production experience are blocked by non-study conditions.
- **Research inference:** goal-conditioned scope has its strongest *theoretical* case here, but source quality, ambiguity and quality of questions are the central product costs.

### S3 — Pass a performance-based exam: CKA

- **Source (FACT):** [Linux Foundation CKA certification](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/) describes a command-line, performance-based Kubernetes exam, published domains, objectives and a simulator. The exam assesses actual command-line task completion under constraints.
- **Goal (DESK):** a learner intends to pass CKA and wants to allocate limited practice time.
- **Candidate C scope:** troubleshoot networking / manage cluster components *under exam conditions*; important to retain objective→task→practice environment rather than only topic→definition.
- **Useful action:** perform one timed lab task in a Kubernetes environment; optionally memorize important primitives with cards. Actual task execution and graded feedback are much stronger exam-proximal evidence than spaced recall counts.
- **Baseline:** official curriculum and simulator, guided labs and notes.
- **Likely Prep failure:** unnecessary duplication of a well-defined external blueprint and mistaken prioritization of flashcards over terminal practice.
- **Research inference:** a universal knowledge export workflow is not the core value where requirements and practice affordances are already authoritative.

### Cross-scenario falsifiers and constraints

| Property | S1 profession | S2 vacancy | S3 certification |
| --- | --- | --- | --- |
| Goal specificity | broad/evolving | specific, partly underspecified | external explicit objectives |
| Trustworthy source of required scope | community curriculum | job posting, interview unknown | credential provider |
| What must be selected next | course/project | bounded concepts **and** design practice | command-line lab/problem |
| C as navigation | optional orientation | possibly helpful semantic scope | often already embedded in exam objectives |
| Anki relevance | selected facts | some concepts, not whole task | supportive, not substitute for lab |
| Strongest competing alternative | roadmap + course + AI | vacancy annotation + AI + own notes | official blueprint + simulator |
| Risk of false capability claim | beginner sees big map as mastery | interview 'readiness' claim unjustified | cards misrepresent performance readiness |

**Disconfirming cases:** user wants to learn one isolated theorem/term without naming C; user must satisfy a credential/legal requirement independent of K; user has a short focused path and prefers to start doing the task; user only needs expert feedback on an existing failed attempt. In these cases, adding C may be extra ceremony or distort the real problem. No participant behavior has been observed in these scenarios.

## 5. The product's possible user job and the opposite hypotheses

**HYPOTHESIS H-JOB:** “For a goal with uncertain/heterogeneous requirements, help me decide *what is relevant now, to what learning objective, and what concrete activity to undertake next*, while retaining context across tools.” Observable benefit is a better next learning action (quality/appropriateness plus time/effort), not the number of nodes viewed or cards exported.

**Alternative actual jobs (must not be folded into H-JOB):**
- H-RETENTION: user knows the scope but fails to remember; Anki/RemNote may solve almost everything.
- H-FEEDBACK: user knows what to practise but needs task-based feedback; applied coach/mentor/lab may win.
- H-CURRICULUM: user needs a validated *prescriptive* path; fixed expert course may win over free exploration.
- H-TRACKING: user has many fragmented actions and only wants temporal/contextual history; exported cards are irrelevant.
- H-TIME: no tool solves a binding time/cost constraint; more planning adds burden.

**Mechanistic value proposition to test (not sales claim):** “turn goal ambiguity into a justified, bounded next action.” H-JOB depends on accurately interpreted requirements, usable relevant content and fit-for-purpose activity; topology/graph polish cannot compensate for missing prerequisites.

## 6. Product alternatives: compare complete user outcomes, not entity catalogues

| Candidate | What the user gets | Incremental benefit to test | Main added liability / failure |
| --- | --- | --- | --- |
| **Z. Existing-tool baseline** | roadmap/vacancy/curriculum + AI/notes + chosen trainer/lab | No Prep switch cost | Inconsistent source/goal context or poor self-curation, if actually experienced |
| **A. Goal-oriented guide / selection** | concise goal scope with uncertainty and explanations, choice of relevant subjects/tasks and external resources | Orientation/decision speed and justification | Thin layer over roadmap/AI; may not trigger actual study |
| **B. A + usable selective external practice packet** | selected *reviewed* prompts/examples/tasks, appropriate to learning objective; export to existing trainer where suited | Shorter path to first genuine study action | High editorial/content cost; card mismatch, noisy choice, double workflow |
| **C. B + external practice-history return** | user can see dated imported occurrences/outcomes with attached context | Better next action after prior sessions | Integration/identity/consent cost; easy to mistake review counts for competence |
| **D. Integrated active tutor/applied coach** | instruction, practice, evaluation inside product | Addresses learning/feedback gap if dominant | Very high curriculum, grading and pedagogical validation cost; competes directly with incumbents |

These are **product service bundles**, not mandated versions or domain architecture. An alternative “curated goal-to-applied-task only” may beat B for CKA or senior engineering design. Goal can be practical, conceptual or credential-oriented; C may be a strong optional lens without a universal mandatory passage. The existing accepted Goal-first Owner input in the adjacent topic remains acknowledged, not silently revoked by research.

**Provisional prioritization for validation, not construction:** compare baseline Z vs A vs B on one *authentic* goal first. Defer C unless a real user needs history to choose what to do next. Do not build D without evidence that lack of feedback, rather than orientation, dominates.

## 7. What to measure and what not to infer

One authentic episode can be tracked as **goal stated → scope choice with explicit unknowns → material/action selected → real external first practice**. Candidate primary measure: **quality-adjusted time/effort to first appropriate learning action**. Separate dimensions:
- *Correctness/relevance:* independent subject reviewer checks selected topics, source uncertainty and whether study items actually target claimed objective.
- *User action:* what was opened/imported/attempted and why; record abandonment and detours, not only button clicks.
- *Comparison:* same goal, facts, resources and opportunity to use AI for baseline and candidate; track extra setup/editing, not just on-screen selection.
- *Study outcome (separate, later):* delayed recall for factual objectives, novel task/work sample with independent feedback for applied objectives; no automatic competence claim.
- *History add-on (later):* whether returned practice facts measurably change the next choice, not number of statistics rendered.

**False signals:** satisfaction, perceived confidence, screen dwell time, graph size, card counts, number of repeats, import success and task-model elegance are not the primary user outcome. A candidate can pass a file-format feasibility check and still fail product validation.

## 8. Critical uncertainties ranked for product research

- **P0 — Distinct job and segment:** is goal→next-action selection a costly, recurring pain *for identifiable people*, or are time, feedback, curriculum and memory the real constraints? `Q-PLD-01/04`, `EX-PLD-01`.
- **P0 — Increment over alternatives:** does Prep outperform actual roadmap/AI/notes/existing trainer for a *matched* task, rather than an unrealistically weak blank-sheet control? `Q-PLD-08/13`, `EX-PLD-06` (see proposed revised comparator).
- **P0 — Trustworthy goal→scope→material chain:** incomplete vacancy requirements, conditional K relevance, missing/outdated or low-quality cards, and a gap between intended task and type of practice. Without a credible seed corpus, map quality is untestable.
- **P1 — Mandatory C and 'depth':** novices or knowledge-first goals may not have a useful C label; depth must be a learning objective tied to material/task, not a scalar claim about the person. `Q-PLD-09/11/12/13`.
- **P1 — First session vs longitudinal history:** whether users return and whether external activity data leads to better choices, not merely more dashboard complexity.
- **P1 — Editorial economics and repeatability:** cost per *new* goal for reliable scope and fit-for-purpose prompts; maintenance under job-market and platform drift.
- **P2 — Transfer channel and visualization:** Anki UTF-8 import vs packages or other systems, graph vs non-graph UX. Only test when a user task reveals material friction.

## 9. Bounded next evidence, without product or implementation approval

**E1: existing `EX-PLD-01` recent episode reconstruction.** Recruit 3–5 contrasting actual learners/preparers (at least one aspiring backend learner, one applicant to a specific vacancy, one exam/lab preparation if accessible). Ask for *recent actual* goal, source, choices, artefacts, what they did next and failure points. Code bottleneck before suggesting Prep features. This tests problem salience; it is **NOT RUN**.

**E2: sharpen existing `EX-PLD-06` to have a credible baseline.** If E1 indicates navigation/selection pain, freeze **one authentic goal + source** and a small reviewed K/material set, then compare: Z existing freely chosen tools (e.g. roadmap/AI/notes/Anki), A guide/selection only, B guide+validated exportable practice packet. Same task/data/content disclosure and roughly similar facilitator assistance. Primary trace: independent review of *appropriateness* and time/steps to a genuine external practice action; track correction effort and abandonment. After the choice record a novice-vs-experienced countercase where possible. C with synthetic stats is an **illustrative comprehension check only**, not evidence of a useful real bidirectional feedback loop. Predefine task, review rubric and failure conditions with the Owner before human testing. **NOT RUN**.

**E3: editorial feasibility gate, smaller than a product.** For S2, two reviewers independently take the job posting and produce 2 applied outcomes, ~10 conditionally relevant Knowledge topics, and ~10 learning items (some definitional cards, some scenario tasks). Compare disagreement, time to produce, unsupported assumptions and whether items match outcome depth. If authoring is very costly or cross-review cannot agree on “necessary” scope, a self-serve product is premature. The constructed example in this note is **not this gate**. **PROPOSED / NOT RUN**.

**Suggested falsifiers:** baseline users already begin an appropriate learning activity faster; candidate increases irrelevant selected content/overconfidence; people cannot explain why a selected K is relevant to *this* goal; C navigation adds cognitive load; cards replace rather than complement task practice; the content is not maintainable economically. Pilot success thresholds (if any) must be pre-registered against baseline, not retroactively chosen; a tiny convenience sample cannot establish market demand.

## 10. Owner decision packet — choices deliberately NOT made

1. **Primary user/job (P0):** applicant to specific IT vacancy vs novice starting an IT profession vs performance-credential candidate vs independent topic learner. Recommendation to *investigate* vacancy-specific scope first (highest plausible differentiation from generalized roadmaps), while keeping the novice/CKA as adversarial cases. **No segment selected.**
2. **First complete value increment (P0):** A orientation only, B orientation + external selective usable practice, or different task-first/feedback-first product. Recommendation: prioritize testing **B versus A and the existing-tool baseline**, not automatically building B. **No product choice made.**
3. **Capability navigation (P1):** universally mandatory Goal→C or optional C lens for goals where a useful action/outcome exists. Recommendation: test mandatory vs skippable with novices and knowledge-first goals, while preserving previously confirmed Goal-first Product Requirements *input*. **No change to Goal-first or C semantics approved.**
4. **Learning depth / evidence promise (P1):** express depth initially as *specific intended learning outcome and suitable practice*, or introduce a common ordinal depth scale; never equate either to proved capability. Recommendation: test task-language first. **No depth taxonomy selected.**
5. **Content stewardship (P0):** curated/reviewed sample supplied for pilot vs user-supplied vs AI-generated and checked. Recommendation: use a tiny human-reviewed fixture first, measure editorial cost separately, do not present unvalidated AI output as authoritative. **No sourcing/verification Product Requirement approved.**
6. **Later activity return (P1):** defer automatic sync; only investigate after observing user demand for history in a return session. **No Anki-first or two-way integration decision.**

**Recommendation for immediate next bounded action:** execute `EX-PLD-01` with real episodes; then authorize a frozen matched-baseline `EX-PLD-06` if and only if the evidence indicates a salient goal-to-next-action problem. Desk research alone is not a go/no-go market signal.

## 11. Source register and limitations

Official current descriptions: [roadmap.sh](https://roadmap.sh/), [LinkedIn Learning](https://www.linkedin.com/learning/), [RemNote Help](https://help.remnote.com/en/articles/8663109-flashcard-basics), [Anki Manual](https://docs.ankiweb.net/importing/text-files.html), [Google NotebookLM](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-student-features/), [ChatGPT Study Mode](https://help.openai.com/en/articles/11780217-study-mode), [ESCO](https://esco.ec.europa.eu/en/about-esco/what-esco), [O*NET Database 31.0](https://www.onetcenter.org/database.html), [SFIA 9](https://sfia-online.org/en/sfia-9/responsibilities), [SQUIRE vacancy](https://jobs.lever.co/getsquire/5bd354f4-9823-4716-a7e5-a747a5aef3c9), [CKA](https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/).

Empirical or theoretical literature: [Dunlosky et al. 2013](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html), [Frerejean et al. 2019 / 4C-ID](https://doi.org/10.1111/ejed.12363), [National Academies 2012](https://www.nationalacademies.org/read/13398/chapter/6), [OECD 2026 adult-training barriers](https://www.oecd.org/en/publications/helping-adults-overcome-barriers-to-training_1d108027-en/full-report.html), [learning dashboards review](https://research.monash.edu/en/publications/a-systematic-review-of-empirical-studies-on-learning-analytics-da), [online 2026 dashboard meta-analysis](https://www.sciencedirect.com/science/article/pii/S1096751626000461), [Cornell Bloom guide](https://teaching.cornell.edu/resource/blooms-taxonomy).

All accessed/reviewed 2026-10-12. Product sites can change; one employer posting is not a representative sample; competency frameworks describe classes of work, not a candidate's actual knowledge; scholarly learning outcomes in formal education do not directly estimate this product's efficacy; no interviews, task observations, editorial timing study, independent fact/answer review, usage telemetry, adoption or price/willingness-to-pay evidence exists here. This iteration neither closes research-list questions nor admits Product Requirements/Harness knowledge.
