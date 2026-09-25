# Screen / View Design

## Purpose
Define the minimum view inventory and responsibilities required to realize accepted journeys, Human Interface and Presentation System. Routes, framework components and visual styling remain downstream.

## Application shell
Persistent navigation exposes Knowledge, Requirements, Questions, Targets, Study, Statistics and Import. The shell owns navigation and global external-runtime/configuration status only; it does not own canonical domain state.

## Knowledge
**Knowledge catalogue** browses/searches KnowledgeNodes, creates/opens nodes, starts bulk import, and may switch to graph exploration.

**Knowledge detail/editor** inspects/edits semantic kind/content and manages typed incoming/outgoing relations through canonical-object selection.

**Knowledge graph projection** explores accepted nodes/relations spatially. Selecting a node opens the same canonical detail context as catalogue selection. Dragging/navigation changes presentation state only unless a future contract explicitly makes layout durable. All Knowledge maintenance remains possible without the graph.

## Requirements
**Requirements catalogue** browses/searches Requirements and RequirementSets and creates/opens either.

**Requirement detail/editor** edits accepted content and Knowledge alignments.

**RequirementSet detail/editor** edits accepted content and membership. Cycle rejection is shown in context and preserves editing state.

## Questions
**Questions catalogue** browses/searches Questions and filters at least by aligned/unaligned state; it supports create/open and bulk import.

**Question detail/editor** edits question/direct answer and KnowledgeNode alignments.

## Targets
**Targets catalogue** browses/creates/opens LearningTargets.

**Target detail/editor** edits target definition, manages selected Requirements/RequirementSets, and initiates Study Set construction when preparation is sufficient.

## Study
**Study Set** shows selected target and resolved Questions, reports missing alignment/preparation, and exposes the external-study action when Anki integration is available. Per-question export/reconciliation failures remain in this context. No statistics-derived priority/order is displayed.

## Statistics
**Review statistics** shows Question-attributable ReviewObservations and factual aggregates with navigation to the corresponding Question. It does not label data as mastery, readiness, proficiency or retention.

## Import
**Import workspace** chooses supported data kind, accepts the supported document, submits it, and shows total/applied/rejected outcomes plus per-item rejection reasons.

## Integration/configuration
A small settings/status surface may expose configured external-runtime endpoint/status for the single-user deployment. Secrets are not echoed after entry. Infrastructure-specific diagnostics remain downstream.

## Common states and navigation invariants
Server-backed views distinguish loading, empty, loaded, validation-rejected, recoverable-failure and unavailable states. Editors preserve recoverable input.

Collection -> detail is the primary drill-down. Relationship endpoints navigate to canonical detail. Graph selection opens canonical Knowledge detail. External-study failures return to Study context. No core operation requires raw IDs or graph manipulation.

## Deferred view decisions
Exact routes, modal versus page editors, responsive layouts, table columns, graph library/physics, component library, typography, colors and animation remain downstream.
