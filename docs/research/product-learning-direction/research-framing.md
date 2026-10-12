# Product learning direction — current research framing

**Classification:** Noncanonical, Owner-supplied **research framing**, not an approved product strategy, Product Requirements change, Domain model, experiment outcome or Harness currentness statement.

**Source of this framing:** the Owner's narrower product hypothesis, originally developed in [Iteration 03](iteration-03-goal-capability-knowledge-external-retrieval-loop.md), clarified in [Iteration 05](iteration-05-owner-knowledge-scope-to-study-material-boundary.md), and reiterated in the 2026-10-12 research-review conversation. Earlier broad investigations are preserved as dated evidence and **cannot override this current research boundary**. Amend this framing only when the Owner intentionally changes the **research question**, not whenever a study recommends a different product. Research framing approval is **not** engineering acceptance.

## Current question to investigate

**Does Prep create distinctive user value by helping a person orient within a reusable space of subject Knowledge, view its relevant breadth, relations and intended study depth through Goal and Capability Description scopes, select the portion worth studying, and prepare useful material for theoretical learning/retrieval in external tools?**

Anki is an illustrative external training system, **not** a required implementation choice. Orientation in Knowledge can be useful even before the user exports or studies material.

## What is inside the proposed study

- **Knowledge is central:** meanings, conceptual coverage, boundaries, related and partially overlapping subjects, levels of detail, principles, procedures, strategies and *theoretical knowledge of how several concepts can be used together*. A knowledge-space view is not necessarily a fixed tree or a 2D geometry.
- **Goal is a preparation context:** e.g., a vacancy, desired knowledge or field of study. It may have incomplete/uncertain scope; a listing in Prep is not proof of necessary/sufficient coverage.
- **Capability Description is a reusable semantic lens/scope**, such as "design a payment API". It can organize possibly relevant Knowledge and intended learning objectives. It is **not** the concrete learner's measured ability, and the meaning/necessity of C–K relations remains open.
- **Depth for study** refers to *what content/objective should be investigated, explained, recalled or reasoned about* for this goal and capability. Do **not** conflate the depth/detail of subject content, required learning objective, or actual person attainment. A universal ordinal scale has not been selected.
- **Training materials** may include definitions, explanation questions, relational distinctions, "why/how" prompts and *theoretical* application scenarios. They can be selected/prepared for suitable external systems. Question generation, item validity and learning-outcome claims remain unproven.
- **Optional integration idea:** external review history/statistics might improve navigation. No assumption that statistics are available automatically, that absence of imported data means no learning, or that repeated items prove a subject mastered.

## What the current hypothesis does NOT ask Prep to prove or provide

- Do **not** define success as getting hired, passing a performance-based exam, deploying a service, independently building professional software or executing real-world tasks.
- Do **not** require integrated task coaching, project/lab execution, grading of professional performance, learner mastery/readiness inference, or evaluation of *actual Capability*.
- A practical project/lab/mentor need may be a **genuine competing learning job**. It is useful as a limitation of this focused concept, **not by itself a falsification** of a product whose promise stops at knowledge orientation and preparation of study content.
- Practising **theoretical knowledge** through external retrieval, explanation, and bounded scenario questions **is inside** the hypothesis. "No applied professional practice assessment" must **not** be shortened to "no learning" or "only memorizing terms".
- No obligation to infer "studied all cards => knows all Knowledge", "knows Knowledge => has Capability", or "a vacancy establishes a complete universal syllabus".
- Do not assume an exhaustive knowledge ontology, mandatory C traversal, chosen DDD bounded contexts, graph UI, particular Anki API, or a final MVP reduction.

## Current research success / falsification criteria

Examine independently:
1. **Orientation:** can a person use the shared Knowledge structure to identify and explain a plausible, explicitly incomplete subject scope and its relations, compared with existing sources/tools?
2. **Goal and Capability perspectives:** do contextual scopes and target learning objectives help them make *better selections of subject knowledge* than a flat topic list or a generic roadmap?
3. **Study-material fit:** can a selected set be turned into correct, reviewable, appropriately deep **theoretical** questions/material and exported without disproportionate authoring or checking burden?
4. **Competitive counterfactual:** does the combined capability offer value beyond existing tools (e.g., RemNote, NotebookLM, ChatGPT, Anki, curated roadmaps) using the same underlying information?
5. **Boundaries:** explicitly mark unknown requirements, unsupported content claims, unsuitable questions and unmeasured user competence.

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
