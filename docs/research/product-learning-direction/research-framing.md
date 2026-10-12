# Product learning direction — current research framing

**Classification:** Noncanonical, Owner-supplied **research framing**, not an approved product strategy, Product Requirements change, Domain model, experiment outcome or Harness currentness statement.

**Source of this framing:** the Owner's narrower product hypothesis, originally developed in [Iteration 03](iteration-03-goal-capability-knowledge-external-retrieval-loop.md), clarified in [Iteration 05](iteration-05-owner-knowledge-scope-to-study-material-boundary.md), and refined by the Owner in the 2026-10-12 research-review conversation, including the explicit **user-owned content / tool-utility distinction**. Earlier broad investigations are preserved as dated evidence and **cannot override this current research boundary**. Amend this framing only when the Owner intentionally changes the **research question**, not whenever a study recommends a different product. Research framing approval is **not** engineering acceptance.

## Current question to investigate

**Given a sufficiently coherent, task-appropriate dataset provided to Prep by its user, does Prep create distinctive value by helping the user orient in reusable subject Knowledge, navigate Goal and Capability Description scopes, select material, and prepare/export a useful subset for theoretical study in external tools, compared with existing workflows using the same data?**

Anki is an illustrative external training system, **not** a required implementation choice. Orientation in Knowledge can be useful even before the user exports or studies material. **The test isolates tool utility from corpus creation and truth verification**: fixture adequacy is an experimental input assumption, not an observed quality property of Prep or a product guarantee.

## Owner clarification — data responsibility and research isolation (2026-10-12)

**Owner-confirmed research input, not Harness-accepted architecture:** Prep is a user-populated container/tool for storing and working with Knowledge, Capability/Goal perspectives, relations and study materials. The user can create/edit items individually or load them in bulk; the user determines content and how much scope to develop. In this research hypothesis, Prep does **not** warrant completeness, factual accuracy, authoritative provenance, a professionally sufficient syllabus, or fitness for an external hiring criterion. Its responsibility is to **faithfully represent, navigate, relate, filter, select and transfer the data it receives**, without silently converting stored claims into guaranteed facts or demonstrated learner ability.

**Source separation:** a vacancy is one possible *Goal context or constraint hint*, not the definitive source of the domain's required Knowledge or Capabilities. An editor/user may consult technical standards, documentation, textbooks, professional frameworks and other reputable sources and may revise or disagree with a vacancy's loose wording. Those sources can improve the user's corpus, but no individual source automatically establishes exhaustive or employer-specific scope. Source collection, independent expert vetting and content-maintenance economics are **separate potential investigations**, not entry gates for validating the basic interaction concept.

**Controlled condition for the next value experiment:** hold one sufficiently coherent, task-appropriate supplied dataset constant across Prep-like and existing-tool alternatives. This **assumes** the test data are usable for the task; it does **not** verify every subject claim or imply that ordinary user content is always trustworthy. Validate only test-fixture internal consistency, operation fidelity, task success and the honesty of product representation. Poor source data and misleading overconfident software claims remain separate risks to record.

## What is inside the proposed study

- **Knowledge is central:** meanings, conceptual coverage, boundaries, related and partially overlapping subjects, levels of detail, principles, procedures, strategies and *theoretical knowledge of how several concepts can be used together*. A knowledge-space view is not necessarily a fixed tree or a 2D geometry.
- **Goal is a user-defined preparation context:** e.g., desired knowledge, field of study or a vacancy. It may have incomplete/uncertain scope; a listing in Prep is not proof of necessary/sufficient coverage or of employer-specific interview requirements.
- **Capability Description is a reusable semantic lens/scope**, such as "design a payment API". It can organize possibly relevant Knowledge and intended learning objectives. It is **not** the concrete learner's measured ability, and the meaning/necessity of C–K relations remains open.
- **Depth for study** refers to *what content/objective should be investigated, explained, recalled or reasoned about* for this goal and capability. Do **not** conflate the depth/detail of subject content, required learning objective, or actual person attainment. A universal ordinal scale has not been selected.
- **Training materials** are user-supplied or otherwise available items (definitions, explanation questions, relational distinctions, "why/how" prompts and *theoretical* scenarios) that can be selected, organized and prepared for suitable external systems. Automated question generation, item truth verification and learning-outcome claims are separate unproven features, not prerequisites to testing selection/export.
- **Optional integration idea:** external review history/statistics might improve navigation. No assumption that statistics are available automatically, that absence of imported data means no learning, or that repeated items prove a subject mastered.

## What the current hypothesis does NOT ask Prep to prove or provide

- Do **not** define success as getting hired, passing a performance-based exam, deploying a service, independently building professional software or executing real-world tasks.
- Do **not** require integrated task coaching, project/lab execution, grading of professional performance, learner mastery/readiness inference, or evaluation of *actual Capability*.
- A practical project/lab/mentor need may be a **genuine competing learning job**. It is useful as a limitation of this focused concept, **not by itself a falsification** of a product whose promise stops at knowledge orientation and preparation of study content.
- Practising **theoretical knowledge** through external retrieval, explanation, and bounded scenario questions **is inside** the hypothesis. "No applied professional practice assessment" must **not** be shortened to "no learning" or "only memorizing terms".
- No obligation to infer "studied all cards => knows all Knowledge", "knows Knowledge => has Capability", or "a vacancy establishes a complete universal syllabus".
- Do not assume an exhaustive knowledge ontology, mandatory C traversal, chosen DDD bounded contexts, graph UI, particular Anki API, or a final MVP reduction.
- Do not require Prep to source, certify, independently review or continually curate all Knowledge and study materials before testing whether the tool helps users work with an already supplied, controlled dataset.

## Current research success / falsification criteria

Examine independently:
1. **Orientation:** given the same fixture, can a person identify and explain the represented Knowledge scope, relations, selected content and unknowns better than with existing tools? Do not score fidelity to unstated real-world exhaustive coverage.
2. **Goal and Capability perspectives:** do user-supplied contextual scopes and intended objectives help them make *more appropriate selections within the same dataset* than a flat topic list or a generic roadmap?
3. **Material preparation and transfer:** can already provided, task-appropriate **theoretical** prompts/material be selected without irrelevant items, faithfully packaged and made usable in an external trainer with less friction? Measure user effort for selection and transfer; do not charge Prep with editorial verification of the corpus.
4. **Competitive counterfactual:** does the combined capability offer value beyond existing tools (e.g., RemNote, NotebookLM, ChatGPT, Anki, curated roadmaps) using the same underlying information?
5. **Boundaries:** preserve supplied claims and their uncertainty without adding unjustified completeness, correctness, necessity or learner-competence assertions. Track content defects separately from errors introduced by the tool.

**Do not substitute** "time to first *professional practical task*", "ability to perform C", or exam/job success for these outcomes. A well-executed applied-task scenario may still test a *different* product.

## Authority and where changing facts live

| What you need | Single responsible source / interface |
| --- | --- |
| Canonical accepted product obligations | [Product Intent](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-intent.yaml), [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml) and routed Harness acceptance/currentness (recheck on relevant branch) |
| Existing domain responsibility classification | [Domain Strategy](https://github.com/lehater/prep/blob/mvp-vertical-slice/docs/architecture/context-map.md) (strategic responsibilities are not automatically bounded contexts) |
| Current **research** question and Owner-stated boundary | **This file**, with Owner-source links above; **not** README, HANDOFF or an auditor's recommendation |
| Questions and whether they are open | [Open questions](open-questions.md) |
| Experiment hypotheses, criteria and execution status | [Open experiments](open-experiments.md) |
| Evidence, methods, counterexamples, results and dated proposals | The relevant [dated iterations and experiment reports](README.md); results are **not** automatically accepted conclusions or new framing |
| Entry-point navigation / current reading order | [Research AGENTS](../AGENTS.md) and [topic HANDOFF](HANDOFF.md); neither restates the scope or statuses |

**Critical accepted-scope nuance:** The current [Product Intent](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-intent.yaml) includes external selection/use and recorded Activity/Result intake, and [Product Capabilities](https://github.com/lehater/prep/blob/mvp-vertical-slice/.harness/knowledge/product-capabilities.yaml) include examination of history and all-kind CRUD/bulk. Saying that return of automatic Anki *statistics* is optional does **not** revoke the accepted general Activity/Result behaviors. If the intended released-MVP scope changes, the Owner/Product Requirements/Harness process must explicitly handle it.

**Promotion boundary:** dated research or an experiment finding → a packet of alternatives and limitations → explicit Owner product decision → Product Requirements Authority and routed Harness. Audits do not get to promote hypotheses to product truth by editing this file.
