# Presentation System Design

## Purpose

Define shared presentation and interaction conventions for the accepted target-centric workflow plus global reusable Library without choosing frontend framework mechanics or encoding domain semantics in styling.

## Interaction principles

- **Task context first.** The selected LearningTarget remains visible while the user moves through scope, knowledge, questions, study and statistics.
- **Reuse is explicit.** Target views project and link reusable canonical objects; they do not visually imply that Knowledge, Requirements or Questions are owned by the target.
- **Library maintenance is collection-first.** Large reusable corpora are found through search/browse controls and opened into canonical detail/edit contexts.
- **One canonical detail.** The same object identity/detail is reached from Target, Library, graph or cross-reference navigation.
- **Preparation facts before inferred status.** Missing alignments, coverage counts and external-runtime outcomes are shown as facts rather than invented readiness/mastery labels.
- **Graph is optional.** Spatial exploration supplements list/search/detail interaction and never becomes the only way to complete a core task.
- **Recoverability is visible.** Validation and external-integration failures retain context/input and expose a retry or correction path.

## Shared application composition

The application shell provides persistent access to:

- **Targets**;
- **Library**.

A compact global integration/status/settings surface may expose external-runtime connectivity/configuration.

Study, Statistics and Import are contextual capabilities, not default peer destinations in the primary navigation.

### Target context pattern

When a target is open, the presentation preserves:

- target identity and concise target definition;
- local navigation or disclosure for Overview, Scope, Knowledge, Questions, Study and Statistics;
- factual preparation diagnostics relevant to the current section;
- a stable way back to Targets and into the global Library.

The exact tab/route/sidebar mechanics are downstream choices.

### Library pattern

Library exposes Knowledge, Requirements/RequirementSets and Questions as reusable collections.

Each collection may provide supported search/filter controls, creation, canonical detail/edit access and contextual Import.

## Canonical object pattern

Knowledge, Requirement/RequirementSet and Question detail contexts share:

- stable object identity and primary content;
- editable canonical fields;
- related-object/alignment sections;
- searchable canonical-object selectors where assignment/alignment is allowed;
- explicit completion/cancel behavior;
- inline validation while preserving recoverable input.

When detail is opened from a Target context, the UI preserves the target return context without creating a second target-owned copy of the object.

## Contextual creation pattern

Creating reusable data from inside a Target flow communicates two effects separately:

1. create the global reusable canonical object;
2. perform the target assignment/alignment requested by the user.

Failure of the second operation must not be disguised as failure to create the canonical object when the first operation already succeeded.

## Preparation diagnostics

Target preparation uses factual labels and actionable navigation.

Examples include:

- Requirement has no Knowledge alignment;
- KnowledgeNode has no aligned Questions;
- Study Set contains N Questions;
- Question export succeeded/failed;
- external runtime unavailable.

The presentation does not collapse these into mastery/readiness/priority semantics absent from accepted upstream models.

## Knowledge exploration

Knowledge collections may switch between list/search and graph projection when the graph improves relationship exploration.

A Target Knowledge context may request a target-scoped graph projection; the global Library may request broader Knowledge exploration.

Node selection opens canonical Knowledge detail. Graph layout/camera state remains presentation state unless a future accepted contract says otherwise.

2D versus 3D is deliberately unconstrained until comparative task evidence justifies a choice.

## Study and external runtime

Study Set presentation keeps the LearningTarget identity and selected Questions visible.

External-study actions show runtime availability and per-Question outcome. An unavailable runtime is distinct from an empty Study Set or missing preparation.

The exact enable/disable rule for Study Set construction remains blocked on the Application Design decision about sufficient preparation.

## Statistics

Statistics use factual ReviewObservation language and factual aggregates.

Target-context statistics are presented as observations for Questions currently relevant to the target, not as historical target-level mastery/readiness.

## Import

Import is presented from the relevant Library data kind rather than as a required global workspace.

Bulk import reports total/applied/rejected outcomes plus rejected-item identity and reason without representing partial success as total failure.

## Accessibility baseline

Core navigation/actions are keyboard accessible; focus is visible; labels do not depend on placeholders; semantic state does not depend on color alone; every graph task needed for core operation has a non-graph equivalent.

## Deliberately unconstrained

Color palette, typography family, spacing scale, icon set, component library, animation language, exact responsive breakpoints, exact visual density, route structure and exact Target workspace navigation widget remain downstream choices.
