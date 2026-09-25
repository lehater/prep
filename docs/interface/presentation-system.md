# Presentation System Design

## Purpose

Define shared presentation and interaction conventions for the accepted two-mode product: target-centric Learning plus reusable-data/target-profile Curation, without choosing frontend framework mechanics or encoding domain semantics in styling.

## Interaction principles

- **Mode is explicit.** Learning and Curation are visibly different task contexts even when the same physical user performs both.
- **Learner context first.** Inside Learning, the selected curated LearningTarget remains visible while the learner moves through Overview, Knowledge, Study and Statistics.
- **Curation is explicit.** Editing target scope, reusable Knowledge/Requirements/Questions and corpus quality belongs to Curation rather than appearing as implicit learner chores.
- **Reuse is explicit.** Target views project reusable canonical objects; they do not imply that Knowledge, Requirements or Questions are owned by the target.
- **Library maintenance is collection-first.** Large reusable corpora are found through search/browse controls and opened into canonical detail/edit contexts.
- **One canonical identity, contextual capabilities.** The same canonical object may be viewed from learner or curation context while edit capabilities remain context-specific.
- **No fake completeness.** The learner sees available material; semantic Question-set coverage quality belongs to curation and has no current numeric score.
- **Graph is first-class but non-exclusive.** The frontend prototype gives spatial Knowledge exploration a prominent role for relational learning, while list/search/detail remain equivalent canonical access paths.
- **Recoverability is visible.** Validation and external-integration failures retain context/input and expose a retry or correction path.

## Shared application composition

The application shell provides an explicit way to enter/switch between:

- **Learning**;
- **Curation**.

The exact switcher/navigation mechanism is downstream.

A compact global integration/status/settings surface may expose external-runtime connectivity/configuration.

Study and Statistics are contextual Learning capabilities. Import is a contextual Curation/Library capability.

## Learning presentation pattern

Learning starts with selection of an existing curated LearningTarget. Learning mode provides no create/edit/recompose actions for target scope.

When a target is open, presentation preserves:

- target identity and concise definition;
- minimal local learner navigation for Overview, Knowledge, Study and Statistics;
- available-material facts relevant to the current section;
- a stable way back to target selection;
- an explicit switch to Curation when the same v1 user chooses to author or repair reusable material/target structure.

Scope is presented inside Overview because it is read-only in Learning. Target Questions are presented inside Study because the current Study Set and currently resolvable Question collection have the same membership.

Detailed structural/semantic curation diagnostics should not dominate learner surfaces.

The exact tab/route/sidebar mechanics are downstream choices.

## Curation presentation pattern

Curation exposes:

- prepared LearningTargets and their Requirement/RequirementSet composition;
- the reusable Library of Knowledge, Requirements/RequirementSets and Questions.

Library collections remain collection-first.

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

## Responsive spatial system

All material views must define how hierarchy survives reduced available width. Exact CSS breakpoints remain implementation details; the semantic transformations are not.

Shared layout classes:

- **wide workspace** — enough width for a dominant primary work surface plus persistent supporting regions;
- **compact workspace** — primary work surface remains dominant while secondary detail/list regions move below, collapse or become drawers;
- **narrow workspace** — one primary reading/interaction column; secondary regions become explicit disclosures/drawers and must not cause horizontal overflow.

Responsive reflow preserves keyboard/focus order and does not hide required actions.

For canvas/map/graph workspaces, the primary interactive surface receives the flexible remainder of available width/height. Supporting list/detail panes must not consume equal visual weight merely because they are sibling regions.

## Knowledge exploration

Knowledge provides coordinated list/search, graph and detail representations over the same canonical identities.

### Spatial priority

The 3D graph is the **primary workspace** whenever graph mode is active. List/search and detail are supporting access/inspection regions.

Wide composition:

- compact workspace header and toolbar;
- optional/collapsible Knowledge list at the left;
- flexible central graph occupying the clear majority of remaining workspace;
- selected Knowledge detail at the right;
- graph workspace uses the available viewport height after shell/header/toolbars rather than a small fixed canvas.

Compact composition:

- list remains narrow/collapsible beside the graph when useful;
- graph remains primary;
- detail moves below the graph or opens as a drawer/overlay;
- no supporting pane may force the graph into a small card.

Narrow composition:

- graph uses full available content width;
- list and detail are explicit drawers/disclosures or ordered supporting sections;
- search/filter/settings remain reachable without horizontal overflow;
- non-graph list/search/detail remains fully usable.

In Curation Knowledge, **New Knowledge** and **Import** are toolbar actions that open focused authoring/import surfaces. They must not permanently occupy a large row above the graph.

### Graph control surface

Primary toolbar:

- Knowledge search;
- semantic-kind filter;
- relation-type filter;
- focus/clear focus;
- **Fit graph**;
- **Reset camera**;
- compact **Graph settings**.

Relation filtering uses a multi-select checklist/legend so several accepted relation types can be visible simultaneously; color may support but never replace the textual relation type.

Graph settings expose the accepted performance profiles and presentation-only controls from `docs/architecture/performance-capacity.md`. Expensive visual effects may be disabled without losing semantic access.


For the frontend prototype:

- a 3D node-link graph is implemented as an experimental first-class Knowledge view;
- Target Knowledge defaults the graph scope to nodes relevant to the selected LearningTarget;
- Curation may expose a broader/global graph;
- relation-type filters control accepted semantic relation types, initially `addresses` and `realizes`;
- semantic-kind filters control Concept / Mechanism / Procedure / Strategy visibility;
- focus mode reduces clutter to a selected node and a bounded neighborhood;
- relation direction and type remain legible without relying on geometry alone;
- node selection opens readable canonical detail without discarding graph state;
- Study Questions can deep-link into the graph focused on their aligned KnowledgeNodes.

Graph layout/camera state and performance-profile state remain presentation state. Geometric proximity and renderer quality settings are not semantic meaning.

The 3D prototype is compared with 2D/list baselines on concrete relational-learning tasks. Research shows potential value of node-link representations and, in some settings, 3D/immersive depth, but also known viewpoint, occlusion and disorientation costs; therefore 3D is not promoted to a product invariant before task evidence.

A future learner-state overlay may use opacity, size or other redundant encodings, but only after accepted learner-state semantics exist. Current review facts must not be converted into pseudo-mastery by visualization code.

## Import presentation

Import is presented from the relevant Library data kind rather than as a required global workspace.

Bulk import reports total/applied/rejected outcomes plus rejected-item identity and reason without representing partial success as total failure.

## Accessibility baseline

Core navigation/actions are keyboard accessible; focus is visible; labels do not depend on placeholders; semantic state does not depend on color alone; every graph task needed for core operation has a non-graph equivalent.

Any future state overlay must use a non-color-only redundant encoding.

## Deliberately unconstrained

Color palette, typography family, concrete spacing values, icon set, concrete component library/provider, animation language, exact responsive breakpoints, exact visual density, route structure, exact Target workspace navigation widget and future learner-state overlay encoding remain downstream choices.

Repeated presentation roles must nevertheless remain coherent across the product. Downstream realization should map reusable semantic presentation roles/patterns through one provider/theme/token boundary rather than allowing each feature to invent an unrelated visual system. This does not require wrapping every provider primitive.
