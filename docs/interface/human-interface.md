# Human Interface Design

## Scope

Define implementation-independent human interaction for current Prep journeys. This contract does not choose a frontend framework, component library, database, file format or Anki protocol.

## Information architecture

Primary conceptual areas:

- **Knowledge** — reusable KnowledgeNodes and their semantic relationships.
- **Requirements** — Requirements, RequirementSets and Requirement-to-Knowledge alignments.
- **Questions** — question corpus and Question-to-Knowledge alignments.
- **Targets** — LearningTargets and selected Requirements/RequirementSets.
- **Study** — target-derived Study Sets and external-study actions.
- **Statistics** — recorded Question-level review observations/statistics.
- **Import** — bulk prepared-data intake for supported canonical data.

These areas are task/information boundaries, not deployable modules.

## Navigation and views

### Knowledge catalogue

Purpose: find and inspect KnowledgeNodes.

Required capabilities: browse/search the collection when collection size warrants it; open a node; start creation; access bulk import.

A Knowledge detail/editor context exposes semantic kind, content, stable identity, outgoing/incoming accepted KnowledgeRelations, edit action, and relation-management actions.

Graph visualization may be offered as an alternate exploration/projection, but is not the sole way to access or maintain knowledge.

### Requirements catalogue

Purpose: find reusable Requirements and RequirementSets.

Detail/editor contexts expose the accepted definition, RequirementSet composition where applicable, and knowledge alignments. Composition must make cycle rejection visible and recoverable.

### Questions catalogue

Purpose: find questions and identify alignment state.

Question detail/editor exposes question text, direct answer and aligned KnowledgeNodes. Unaligned Questions must be visibly distinguishable and filterable so corpus preparation can be completed.

### Targets catalogue

Purpose: manage LearningTargets.

Target detail/editor exposes target definition and assigned Requirements/RequirementSets. From a sufficiently prepared target, the user can initiate Study Set construction.

### Study Set view

Purpose: inspect the target-derived set of Questions before external study.

Shows target context and selected Questions. It may expose export to a supported runtime. It must not imply statistics-based priority/order that the current domain/application model does not define.

### Statistics view

Purpose: inspect recorded facts.

Shows Question-attributable review history/statistics. Presentation must not label recorded statistics as mastery, proficiency, readiness or retention.

### Import workspace

Purpose: bulk-load prepared canonical data through supported machine representations.

The workspace identifies the data kind being imported, accepts supported input, shows validation/application outcome, and distinguishes complete success from rejected input or partial-result semantics when those are later authorized by the machine-interface contract.

## Common interaction states

Applicable server-/application-backed views distinguish:

- loading;
- loaded;
- empty;
- editing/submitting;
- validation rejection;
- successful completion;
- recoverable failure;
- unavailable/degraded where externally dependent.

Creation/editing preserves entered data on recoverable validation failure.

Destructive relationship/removal operations require an explicit action and visible consequence. Exact confirmation policy is downstream presentation/screen design unless data loss risk makes confirmation semantically mandatory.

## Cross-reference interaction

Whenever an operation needs an existing canonical object (for example Question-to-Knowledge alignment or Target-to-Requirement assignment), the interface provides identity-preserving selection/search rather than requiring raw IDs.

Relationships and alignments are navigable in both directions when useful to the task, while ownership remains with their accepted domain model.

## Bulk vs manual authoring

Manual authoring and bulk import are peers. Bulk import is not the only maintenance path, and manual UI does not bypass application use cases.

The interface never presents direct database/storage editing as a product operation.

## Accessibility/usability baseline

- all core maintenance and learning-preparation actions must be operable without relying on graph manipulation;
- semantic state is not communicated by color alone;
- keyboard/focus order follows task order for forms, collections and relationship selection;
- validation identifies the affected field/object and preserves recoverable user input;
- loading/empty/error states remain distinguishable from valid empty domain data.

Measurable conformance targets are not invented here; if later required they belong to the appropriate quality/obligation contracts.

## Deliberately unconstrained

- frontend framework and component library;
- exact visual style, colors, typography and spacing;
- exact route URLs;
- modal versus dedicated-page editing where either preserves accepted semantics;
- graph rendering technology;
- responsive breakpoints;
- transport status codes and DTO shapes.
