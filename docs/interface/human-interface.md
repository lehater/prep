# Human Interface Design

## Scope

Define implementation-independent human interaction for current Prep journeys. This contract does not choose a frontend framework, component library, database, file format or Anki protocol.

## Primary interaction model

Prep uses a **target-centric workflow with a global reusable Library**.

A LearningTarget is the primary context for the end-to-end preparation flow: define the intended outcome, select reusable requirements, inspect the knowledge and questions that currently support those requirements, build a Study Set, export it to the external study runtime and inspect returned review facts.

Target context does not change domain ownership. KnowledgeNodes, Requirements, RequirementSets and Questions remain reusable canonical objects that may be shared by many targets.

The Library provides target-independent maintenance of those reusable objects.

## Information architecture

### Global locations

The primary application locations are:

- **Targets** — select, create and resume LearningTargets;
- **Library** — maintain reusable Knowledge, Requirements/RequirementSets and Questions.

External-runtime status/configuration is a secondary application concern rather than a peer learning workspace.

Study, Statistics and Import are not required as peer top-level destinations:

- Study and target-relevant statistics are reached through the selected Target context;
- Import is a contextual Library action for supported prepared-data kinds.

### Target workspace

Opening a target establishes a persistent target context. The workspace exposes these semantic sections:

- **Overview** — target identity/definition and factual preparation diagnostics;
- **Scope** — selected Requirements and RequirementSets;
- **Knowledge** — KnowledgeNodes currently reached from the selected target requirements;
- **Questions** — Questions currently reached through those KnowledgeNodes;
- **Study** — Study Set construction/inspection and external-study action;
- **Statistics** — factual ReviewObservations/statistics for Questions currently relevant to the target.

These sections define interaction responsibilities, not mandatory routes, tabs or separate pages.

### Global Library

The Library exposes reusable collections for:

- KnowledgeNodes and KnowledgeRelations;
- Requirements and RequirementSets;
- Questions.

Library work is valid without a selected target. Objects created from a Target workspace still become global reusable canonical objects; the target context only supplies the intended assignment/alignment after creation.

## End-to-end target workflow

For a concrete target such as **Python Backend Interview**, the interaction flow is:

1. User creates or opens the LearningTarget.
2. User defines its scope by selecting existing Requirements/RequirementSets, with an option to create missing reusable requirements without losing target context.
3. Prep shows factual preparation diagnostics, including missing Requirement-to-Knowledge alignments and target-relevant KnowledgeNodes for which no aligned Questions are available.
4. User inspects or edits target-relevant Knowledge. Missing reusable KnowledgeNodes may be created and then aligned to the relevant Requirement.
5. User inspects target-relevant Questions. Missing Questions may be created as reusable Library objects and aligned to the relevant KnowledgeNodes.
6. User requests Study Set construction according to accepted Application Design semantics and inspects the resulting Questions plus any missing-preparation diagnostics.
7. User exports the Study Set through the supported external-runtime integration. Prep reports runtime availability and per-Question export/reconciliation outcomes.
8. Learning occurs in the external runtime.
9. Prep imports supported review facts and exposes them in the target context without inferring mastery, readiness, retention or priority.

The exact condition that makes a target sufficiently prepared to construct a Study Set, including whether incomplete preparation disables construction or permits construction with diagnostics, is an unresolved Application Design decision.

## Target workspace semantics

### Overview

Overview answers: **what am I preparing for, and what preparation facts need attention?**

It may show factual counts or lists derived from current canonical relations, such as:

- selected Requirements/RequirementSets;
- selected Requirements lacking Knowledge alignment;
- KnowledgeNodes resolved from the target;
- resolved KnowledgeNodes with no aligned Questions;
- Questions currently resolved for the target;
- recorded ReviewObservations attributable to those currently relevant Questions.

These are preparation/coverage facts. They are not learner mastery, readiness, retention or automatically computed priority.

### Scope

Scope lets the user inspect, add and remove reusable Requirements/RequirementSets selected by the LearningTarget.

Selection uses searchable canonical-object selection rather than raw IDs. Creating a Requirement from this context creates a reusable Library object and then returns to the target assignment flow.

### Knowledge

The target Knowledge section projects reusable KnowledgeNodes reached through current Requirement-to-Knowledge alignments.

The user can open the same canonical Knowledge detail used by the Library, inspect relations, maintain allowed fields/relations, and return to the target context.

Missing Requirement-to-Knowledge alignment is represented explicitly rather than filled automatically.

### Questions

The target Questions section projects reusable Questions reached through the target's resolved KnowledgeNodes.

The user can open the same canonical Question detail used by the Library and create a new reusable Question without making it target-owned.

Knowledge with no aligned Questions is shown as a preparation fact. Prep does not invent Questions or semantic mappings automatically in the current scope.

### Study

The Study section owns inspection of the target-derived Study Set and the transition to the configured external runtime.

It preserves target context, shows the selected canonical Questions and reports missing preparation or per-Question export/reconciliation failure without silently dropping Questions.

No statistics-derived ordering or recommendation is shown because the current application/domain model does not define it.

### Statistics

The target Statistics section shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

This is a current projection through reusable Question identities. It must not be presented as historical proof that an observation occurred for this target when target composition may have changed later.

Question detail may also expose its own review history independently of a target.

## Library interaction

Reusable corpus maintenance remains a first-class task:

- search/browse canonical objects;
- create/edit them;
- inspect identity and relationships/alignments;
- find incomplete alignment where the accepted model supports it;
- perform contextual bulk import for supported data kinds.

Large-corpus navigation must not require selecting a LearningTarget.

Exact server-backed search/filter fields remain constrained by the accepted application/machine query contracts rather than being invented by presentation code.

## Knowledge Graph

Graph visualization is an optional Knowledge projection for relationship exploration.

It may be entered from:

- the global Knowledge Library, for broader corpus exploration;
- a Target Knowledge context, for a target-scoped projection of currently relevant KnowledgeNodes.

Selecting a graph node opens the same canonical Knowledge detail as list/search selection. Graph movement, layout and camera manipulation do not mutate domain semantics.

Every core Knowledge task remains available without graph manipulation. Whether the useful projection is 2D, 3D or omitted is downstream of demonstrated task value; 3D is not a product invariant.

## Common interaction states

Applicable server/application-backed contexts distinguish:

- loading;
- loaded;
- valid empty state;
- editing/submitting;
- validation rejection;
- successful completion;
- recoverable failure;
- unavailable/degraded external runtime.

Recoverable editing failures preserve entered data.

Relationship and composition changes expose rejected invariant/validation outcomes in the working context.

## Cross-context navigation

- target-derived Knowledge/Requirement/Question references navigate to canonical detail rather than duplicate target-owned copies;
- navigation preserves a return path to the active target context;
- creation from a target context makes global reusable objects explicit and applies target assignment/alignment only as a separate accepted operation;
- Library navigation does not require a current target.

## Accessibility/usability baseline

- core maintenance and preparation tasks are operable without graph manipulation;
- semantic state is not communicated by color alone;
- keyboard/focus order follows task order;
- validation identifies affected fields/objects and preserves recoverable input;
- loading/empty/error states remain distinct from valid empty canonical data.

## Deliberately unconstrained

- frontend framework and component library;
- exact visual style, colors, typography and spacing;
- exact route URLs;
- whether Target sections are tabs, nested routes or another accessible workspace composition;
- modal, drawer or dedicated-page detail/edit realization where semantics are preserved;
- graph rendering technology and dimensionality;
- responsive breakpoints;
- transport status codes and DTO shapes.
