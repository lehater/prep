# Vision

## Product intent

Prep helps a person move from their current state of knowledge and knowledge-dependent capability toward a chosen target state by making target requirements explicit, establishing an evidence-backed view of current capability, exposing meaningful gaps and uncertainty, and supporting deliberate learning and reassessment. Related target purposes may coexist: the capabilities required to perform a professional role and the performance required to pass a particular selection/interview process must remain distinguishable even when they overlap.

The product is primarily concerned with acquiring, maintaining and demonstrating usable knowledge and the capabilities that materially depend on that knowledge. It does not attempt to become a universal system for teaching every kind of skill.

## Product outcome

A learner should be able to:

1. define or select a concrete target context and distinguish relevant target purposes such as professional-role capability versus company/interview-selection performance;
2. obtain coherent, related target capability profiles from manually curated or prepared structured source data without collapsing interview-specific requirements into role capability;
3. establish an evidence-backed view of their current state relative to that target;
4. see target-relative gaps, uncertainty and priorities;
5. choose the next learning or diagnostic focus;
6. learn and practise relevant knowledge and capability;
7. collect contextual evidence from relevant performance;
8. see how new evidence changes target satisfaction, gaps and priorities over time.

A curator should be able to bootstrap and maintain the reusable data needed by those learner flows, including targets, capabilities, knowledge, learning/practice material and assessment/evidence design.

## Product feedback intent

Before production telemetry exists, product evaluation should already distinguish **user outcome evidence** from implementation activity.

For the primary learner loop, useful observable transitions are:

`target established -> current state inspected -> gap/uncertainty inspected -> focus chosen -> learning/diagnostic activity started -> contextual evidence accepted where appropriate -> progress reviewed -> next action chosen`.

For first-use corpus preparation, useful observable transitions are:

`preparation need recognized -> bulk/manual/mixed path chosen -> validation outcome understood -> rejected items recovered/corrected -> usable target composed -> return to Target Work`.

Evaluation should look for:

- scenario completion / partial completion / abandonment;
- where clarification or procedural help is required;
- wrong turns and backtracking;
- gap-to-focus continuation;
- focus-to-activity continuation;
- activity-to-evidence transition where evidence is actually justified;
- evidence-to-progress review;
- whether the learner can choose a sensible next action;
- recovery from validation, conflict, unavailable and partial-success states;
- effort/time only where it helps explain material friction.

The following are **not** learning-success measures by themselves:

- page/view visits;
- graph interaction count;
- material opened or scrolled;
- practice marked complete;
- number of questions/reviews;
- time spent in the product.

No readiness, mastery or learning-outcome claim may be inferred from interaction analytics without accepted evidence semantics.

Concrete event names, storage, telemetry provider, retention policy and numeric success thresholds remain downstream/non-decisions until representative-user research establishes what outcomes are meaningful enough to instrument.

## Product principles

- **Target before learning activity.** Learning activity is justified by a desired capability profile, not by available content alone.
- **Target purpose remains explicit.** Professional-role capability and selection/interview performance may overlap but are not interchangeable; interview-specific mechanics must not be promoted to intrinsic role requirements.
- **Learning outcome before representation.** The product model should be driven by what the learner needs to know or do, not by a preferred storage or visualization technology.
- **Knowledge and learner state are distinct.** A representation of subject knowledge must not be conflated with evidence or conclusions about one person's current state.
- **Different depths and conditions are meaningful.** Recall, understanding, application and deeper performance are not assumed equivalent, and performance in one condition is not automatically evidence for all conditions.
- **Structure is instrumental.** Information should be structured when doing so improves learning, navigation, comparison, reuse or another justified operation; maximum formalization is not itself a goal.
- **Evidence over exposure.** Reading or encountering material is not sufficient evidence that it will be available or usable when needed.
- **Evidence is contextual.** A success or failure is evidence about observed performance under particular conditions; it is not automatically proof or disproof of a broad capability.
- **Inference is bounded.** Claims about learner state must be supported by accepted evidence semantics and remain scoped to the conditions and time that evidence can justify.
- **Gaps are target-relative.** A capability is not a learner gap by itself; a gap exists only relative to a target and accepted learner state.
- **Retention matters.** Learning is not complete merely because knowledge can be demonstrated immediately after study.
- **Subject differences remain explicit.** Different subjects and outcomes may require different learning, practice and evidence forms rather than one universal exercise model.
- **Existing learning ecosystems are potential collaborators.** External tools may execute parts of the learning process without defining Prep's product semantics.

## Initial product focus

The first practical end-to-end scenario is preparation for a concrete technical role or vacancy.

A representative target context is a Python backend developer role, optionally specialized toward fintech/card payments, plus a related selection/interview target when preparing for a concrete hiring process. The user should be able to understand which expectations belong to the role versus the selection process, establish an initial evidence-backed position, inspect gaps, choose what to work on next, learn/practise, and observe changed evidence while target refinements remain explicit.

The first frontend prototype may use representative mock data for the complete flow. Full ingestion automation, production persistence and backend realization are not prerequisites for validating whether the user-centered interaction is useful.

Bulk data preparation remains part of the product lifecycle: externally prepared structured data can bootstrap targets, capabilities, knowledge and learning/assessment material, while curator/operator-facing curation supports correction and incremental maintenance. A learner may self-curate but is not assumed to own reusable corpus maintenance.

## Current non-decisions

This vision does not choose:

- a graph, ontology or other canonical knowledge representation;
- a fixed number of graph projections;
- a graph-first, card-first or other user interface;
- a particular learning-object, task, evidence or question schema;
- Anki or another study runtime;
- a scheduling algorithm;
- a learner-state inference algorithm;
- a concrete learning-plan persistence model;
- a particular structured import file format;
- storage, API, deployment or component technology;
- the eventual bounded-context decomposition.

Those decisions belong to downstream product, domain, interface and architecture design.
