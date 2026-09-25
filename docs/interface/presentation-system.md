# Presentation System Design

## Purpose

Define shared presentation and interaction conventions for the accepted target-centric learner workflow plus global reusable Library curation without choosing frontend framework mechanics or encoding domain semantics in styling.

## Interaction principles

- **Learner context first in Targets.** The selected LearningTarget remains visible while the learner moves through knowledge, questions, study and statistics.
- **Curation is explicit.** Editing reusable Knowledge/Requirements/Questions and repairing corpus quality belong to Library context rather than appearing as implicit learner chores.
- **Reuse is explicit.** Target views project reusable canonical objects; they do not imply that Knowledge, Requirements or Questions are owned by the target.
- **Library maintenance is collection-first.** Large reusable corpora are found through search/browse controls and opened into canonical detail/edit contexts.
- **One canonical identity, contextual capabilities.** The same canonical object may be viewed from learner or curation context while edit capabilities remain context-specific.
- **No fake completeness.** The learner sees available material; semantic Question-set coverage quality belongs to curation and has no current numeric score.
- **Graph is optional.** Spatial exploration supplements list/search/detail interaction and never becomes the only way to complete a core task.
- **Recoverability is visible.** Validation and external-integration failures retain context/input and expose a retry or correction path.

## Shared application composition

The application shell provides persistent access to:

- **Targets**;
- **Library**.

A compact global integration/status/settings surface may expose external-runtime connectivity/configuration.

Study and Statistics are contextual learner capabilities. Import is a contextual Library capability.

## Targets presentation pattern

When a target is open, presentation preserves:

- target identity and concise definition;
- local learner navigation for Overview, Scope, Knowledge, Questions, Study and Statistics;
- available-material facts relevant to the current section;
- a stable way back to Targets;
- an explicit switch to Library when the same v1 user chooses to curate reusable material.

Detailed structural/semantic curation diagnostics should not dominate learner surfaces.

The exact tab/route/sidebar mechanics are downstream choices.

## Library presentation pattern

Library exposes Knowledge, Requirements/RequirementSets and Questions as reusable collections.

Each collection may provide supported search/filter controls, creation, canonical detail/edit access, alignments and contextual Import.

Future Question-set coverage quality belongs here or in another curation surface derived from accepted semantics. Until those semantics exist, presentation may show structural facts such as "no aligned Questions" but must not fabricate a coverage percentage.

## Canonical object pattern

Canonical Knowledge, Requirement/RequirementSet and Question identity is shared across contexts.

### Learner context

Learner detail emphasizes readable subject/question content and navigation relevant to the selected target.

### Curation context

Curation detail may expose:

- editable canonical fields;
- related-object/alignment sections;
- searchable canonical-object selectors where assignment/alignment is allowed;
- explicit completion/cancel behavior;
- inline validation while preserving recoverable input.

Context switching must preserve object identity and make the change in available actions clear.

## Study presentation

Study Set presentation keeps LearningTarget identity and currently resolved Questions visible.

Construction uses the currently resolvable subset. It may be empty. The presentation does not imply semantic completeness and does not block learning merely because curation is incomplete.

External-study actions show runtime availability and per-Question outcome. An unavailable runtime is distinct from an empty Study Set.

## Statistics presentation

Statistics use factual ReviewObservation language and factual aggregates.

Target-context statistics are observations for Questions currently relevant to the target, not target mastery/readiness.

## Knowledge exploration

Knowledge may switch between list/search and graph projection when graph structure improves exploration.

A Target Knowledge context may request a target-scoped graph; the global Library may request broader Knowledge exploration.

Node selection resolves to canonical Knowledge detail. Graph layout/camera state remains presentation state.

2D versus 3D is deliberately unconstrained until comparative task evidence justifies a choice.

A future learner-state overlay may use visual properties such as opacity, size or other redundant encodings, but only after accepted learner-state semantics exist. Current review facts must not be converted into pseudo-mastery by visualization code.

## Import presentation

Import is presented from the relevant Library data kind rather than as a required global workspace.

Bulk import reports total/applied/rejected outcomes plus rejected-item identity and reason without representing partial success as total failure.

## Accessibility baseline

Core navigation/actions are keyboard accessible; focus is visible; labels do not depend on placeholders; semantic state does not depend on color alone; every graph task needed for core operation has a non-graph equivalent.

Any future state overlay must use a non-color-only redundant encoding.

## Deliberately unconstrained

Color palette, typography family, spacing scale, icon set, component library, animation language, exact responsive breakpoints, exact visual density, route structure, exact Target workspace navigation widget and future learner-state overlay encoding remain downstream choices.
