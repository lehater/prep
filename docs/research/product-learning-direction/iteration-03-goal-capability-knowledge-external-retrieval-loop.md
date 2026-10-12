# Iteration 03 — Goal → Capability → Knowledge → external retrieval loop

**2026-10-12 | NONCANONICAL PRODUCT RESEARCH | OWNER-PROPOSED USER JOURNEY / TECHNICAL DESK CHECK | NOT AN OWNER PRODUCT DECISION, EXPERIMENT RESULT OR ADMITTED DOMAIN MODEL**

> **Variant-label clarification (2026-10-12; does not revise this dated analysis):** In this historical iteration, **P-C** meant *B plus return of review statistics*. The current [EX-PLD-06 protocol](open-experiments.md#ex-pld-06--goal--capability--knowledge--external-theoretical-study-loop) instead uses **D** existing tools, **C** material preparation only, **A** orientation, **B** orientation + material. Automatic review-statistics sync is a separate possible follow-up, not one of those four arms. The current [research framing](research-framing.md) and experiment register govern further work.

## 1. Owner-proposed value hypothesis

Prep's **first distinctive user value** might be the combination of:
- a common **space of subject Knowledge** and its interconnections;
- Goal-specific and Capability-description-specific *views/scopes* over that space;
- **required preparation depth** for a particular K in a particular goal/capability context, without asserting the person's depth or competence;
- user selection of relevant Knowledge and associated training material at an appropriate intended learning depth;
- preparation of that material for **external practice**, e.g. recall/interval review in Anki;
- optionally receiving **recorded activity/review outcomes** back for exploration, explicitly **not** diagnosing real applied Capability or declaring K mastered.

This hypothesis builds on [Iteration 01](iteration-01-knowledge-space-and-applied-capability.md) (knowledge space + C as applied performance scope) and [Iteration 02](iteration-02-knowledge-skill-capability-reducibility.md) (teachable assembly knowledge versus observed applied ability). It does **not** make Capability an evaluated property of a concrete person in the MVP. Capability **description** can remain reusable and not person-specific.

## 2. Concrete user scenario, not accepted Product Requirements

An IT newcomer wants to prepare for a particular backend vacancy:

1. **Choose Goal:** compare their target role/vacancy with available descriptions. Requirements might be incomplete, uncertain or context-specific.
2. **Choose Capability description:** e.g. "design payment APIs under retries and provider failures." It acts as a *meaningful semantic scope*, not proof the learner possesses it.
3. **Explore the relevant Knowledge:** APIs, idempotency, transactions, provider behavior and design strategies; inspect relations and understand the overall breadth of the area.
4. **Inspect target depth:** some required level/context per relevant K for that Capability/Goal, **not** a universal actual-competence level.
5. **Select all or some K:** choose what to study/review now and which level/content. A one-way default or filter is a UI hypothesis only.
6. **Select or produce training material:** concept questions, explanation prompts, brief transfer cases, definitions and associated answers; verify quality and fit for the learning objective. *Knowledge entries are not automatically cards*, and merely viewing subject information cannot yield correct pedagogical questions by magic.
7. **Export to Anki or another external trainer:** user trains memory and conceptual recall with active retrieval and spaced repetition. Prep need not host the scheduler.
8. **Optional return:** bring back per-item practice/review activity and outcomes, attach them to exported items / subject Knowledge and chosen Goal/Capability where actually meaningful, and show history. No competence inference. Without optional return, the value hypothesis still has a complete **one-way select-and-study** path.

User benefit to test: "I can find out what I need to understand for this goal, select relevant portions of the information space, and start structured study in a tool I already use, without building an unrelated personal syllabus and all the materials from scratch."

## 3. A critical set of non-equivalences

- `K is listed` != `user knows K`.
- `K is in scope of C` != `K is universally required for C`; some K's matter only for certain strategies, tools, task constraints or Goal contexts.
- `K is required to depth d` != `every card concerning K can test depth d`; an item has a *particular learning objective*.
- `user exported card` != `user studied card`.
- `user clicked Good on a card` != `user can independently explain K in all situations`.
- `user repeatedly retrieves correct flashcard answers` != `user can design and operate a payment API`.
- `no review stats were returned` != `user did no practice`.
- `Goal or Capability has no linked K` != `scope is complete` or `nothing is required`.

Even successful repetition provides at most **bounded, task-specific evidence** of recall for the material tested. A card asking "What is idempotency?" is not interchangeable with a novel design case. Some theoretical *application* can be explored through scenario questions, comparisons or explanation prompts, but the trainer's responses are not proof of real-world professional competence.

## 4. Technical feasibility check for the Anki example (only feasibility, no integration selection)

Authoritative documentation:
- [Anki importing delimited text](https://docs.ankiweb.net/importing/text-files.html): UTF-8 TSV/CSV-style note fields, note types, tags, headers and destination decks. Low-cost possible export: text file with prompt, answer, relevant tags plus a stable first-field marker **if a mapping is later justified**.
- [Anki packaged decks](https://docs.ankiweb.net/exporting.html): `.apkg` deck package includes cards/notes/note types and optional media; do not conflate it with full-collection replacement `.colpkg`. Export can exclude scheduling history. Anki itself supports imports.
- [Anki recall/spaced practice background](https://docs.ankiweb.net/background.html) and [Anki stats](https://docs.ankiweb.net/stats.html): card-review mechanisms and local statistics exist, **not** an automatically supported public Prep↔Anki sync agreement.
- [AnkiConnect project](https://github.com/FooSoft/anki-connect): community desktop add-on provides local programmatic actions, including adding notes; using it would be a later optional integration choice, with installation, local permissions, compatibility and data-consent considerations.
- [AnkiConnect-compatible card review actions](https://github.com/cxjava/anki-connect/blob/master/README.md): examples exist for `cardReviews`/review-history operations; specific support depends on chosen add-on/version and the user's environment.

**Three technical avenues are possible, not requirements:**
- Smallest: export selectable text notes to Anki for one-way use; no automatic sync.
- Richer: construct `.apkg` packages with note/card templates and media.
- Richest: optional local connector / user-authorized exchange and mapping of returned card/review data. **Do not assume plain text or `.apkg` export grants automatic two-way statistics sync**.

Avoid choosing adapter technologies, card identity policies or Anki-only abstractions in Product Requirements before proving user value.

## 5. Product alternatives & consequential unknowns

**P-A — Knowledge exploration alone**: an understandable map/scope and external links, but no prepared review items. Tests whether orientation is valuable independently of card export.

**P-B — Knowledge exploration + one-way targeted practice**: same map/Goal/Capability scopes + a small set of quality-controlled, directly importable study questions. Tests whether this actually reduces the distance from "what should I learn?" to "start learning".

**P-C — P-B + returned practice history**: uses optional item-to-K mapping to show which material was practised/reviewed and when. Tests whether context/history changes subsequent learner choices. No automatic K proficiency scoring or C readiness.

These alternatives are **increments**, not mutually exclusive domain models, and C is optional rather than a prerequisite to using external training.

Unresolved:
1. **Depth meaning:** a global tier for Knowledge subject explanations versus *context-dependent required target* for a Goal/Capability versus learner's observed recall success. Do not make one field do all three.
2. **Relation meaning:** `Goal expresses C`, `C relevant to K`, `K supported by question M` may require different, conditional claims. Accepted Product Capabilities do not prescribe specific cross-kind relations or threshold semantics.
3. **Card/content production:** who writes/curates questions? External set, manually managed notes, templated conversion or AI-generation? Quality, rights and factual accuracy matter; generated items are not automatically trustworthy.
4. **Training suitability:** factual recall cards may be excellent for terminology and decisions; complex architecture reasoning needs tasks with context and feedback. Export format should not distort target learning depth.
5. **Optional return and mapping:** stable ids / cross-system relation, user control over import, duplicated/edited notes, provenance of statistics and honest representation of missing data. Do not claim this is trivial.
6. **Data readiness:** a general Knowledge space is not auto-populated with a validated job-specific syllabus or all necessary exercises. Initial content sourcing is a separate product risk.
7. **Contractual scope:** accepted MVP includes selecting information/material for external use and introducing recorded activity/results, with full CRUD/bulk for admitted kinds. **Specific Anki export, card-generation UI, universal depth requirement profile and automatic stats sync are not already accepted** just because they are plausible means to satisfy existing outcomes.

## 6. Proposed bounded observation — EX-PLD-06, NOT RUN

Use **one vacancy, two Capability descriptions, 8–12 Knowledge concepts and 8–16 real authored/validated review prompts**, including insufficient/misleading cards as negative cases. A small paper/structured/working export prototype is acceptable only if needed to verify the format. No need to build a learning management system.

- Compare P-A / P-B / P-C on **the same subject knowledge**, with P-C receiving illustrative *labeled synthetic* review records unless an actual authorized external session has occurred.
- Test: can a learner correctly articulate (i) what is in the goal/capability scope, (ii) the difference between target depth and personal skill, (iii) which knowledge they chose and why, (iv) what will actually be rehearsed in exported material, and (v) whether returned stats can be interpreted without asserting readiness?
- Falsifiers: scope confuses person assessment; items don't exercise chosen objectives; overlong irrelevant card selection; user can organize material in Anki faster already; imported data cannot be matched back; learner mistakes 'reviewed' for 'can perform C.'
- **Stop:** record observed value/errors and remaining uncertainties. Successful file import = technical feasibility, **not** verified learning or approved product direction. If P-B suffices, optional P-C need not precede useful first validation.

## 7. No scope promotion

This is a **product research hypothesis**, not a decision to build a tutor, graph, Anki converter, depth engine, or two-way sync. Preserve accepted owner inputs and existing Harness authority; Product/Domain/Application/Interface choices come only after explicit decision and the routed process. Anki is an illustrative external trainer, not the universal Prep training format.
