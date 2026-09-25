# Human Interface Design

## Scope

Define implementation-independent human interaction for current Prep journeys. This contract does not choose a frontend framework, component library, database, file format or Anki protocol.

## Primary interaction model

Prep uses a **target-centric learner workflow with a global reusable Library for curation**.

A LearningTarget is the primary context for learning: choose or work within the intended outcome, inspect the currently available knowledge/questions for that target, build a Study Set, export it to the external study runtime and inspect returned review facts.

The Library is the primary context for maintaining reusable Knowledge, Requirements/RequirementSets, Questions, alignments and future learning-material quality diagnostics.

These are task contexts, not authentication roles. In the first single-user version the same person may switch between learner and curation work.

## Information architecture

### Global locations

The primary application locations are:

- **Targets** — learner-oriented target selection and learning workflow;
- **Library** — curator-oriented reusable knowledge/material maintenance.

External-runtime status/configuration is a secondary application concern rather than a peer learning workspace.

Study and Statistics are reached through the selected Target context. Import is a contextual Library action for supported prepared-data kinds.

### Target workspace

Opening a target establishes a persistent learner context. The workspace exposes these semantic sections:

- **Overview** — target identity/definition and concise current learning-material availability;
- **Scope** — the target's selected Requirements/RequirementSets;
- **Knowledge** — target-relevant Knowledge projection for reading/exploration;
- **Questions** — currently available target-relevant Questions;
- **Study** — Study Set construction/inspection and external-study action;
- **Statistics** — factual ReviewObservations/statistics for currently relevant Questions.

These sections define interaction responsibilities, not mandatory routes, tabs or separate pages.

The learner workflow does not require repairing reusable corpus quality. If curation is needed, the same v1 user may deliberately switch to Library context; that is a different task, not an implicit step of studying.

### Global Library

The Library exposes reusable collections for:

- KnowledgeNodes and KnowledgeRelations;
- Requirements and RequirementSets;
- Questions.

Library work is valid without a selected target. Canonical objects remain globally reusable even when viewed from a target.

## Learner end-to-end workflow

For a concrete target such as **Python Backend Interview**, the learner flow is:

1. User creates or opens the LearningTarget.
2. User works with the target's selected reusable Requirements/RequirementSets.
3. Prep resolves currently available KnowledgeNodes from accepted alignments.
4. User reads/explores that target-relevant Knowledge, optionally through a graph projection.
5. Prep resolves currently available Questions from that Knowledge.
6. User builds a Study Set from the currently resolvable Questions. Incomplete curation does not block the operation.
7. If no Questions currently resolve, Prep presents a valid empty Study Set/material state rather than a semantic error.
8. User exports the available Study Set through the supported external-runtime integration.
9. Learning occurs in the external runtime.
10. Prep imports supported review facts and exposes them in the target context without inferring mastery, readiness, retention or priority.

The learner is not asked to judge whether the Question set semantically covers each KnowledgeNode completely.

## Curation workflow

Library curation covers:

- authoring/editing reusable Knowledge;
- authoring/editing Requirements/RequirementSets;
- authoring/editing Questions;
- maintaining alignments;
- importing prepared canonical data;
- inspecting structural incompleteness such as missing alignments;
- eventually assessing semantic Question-set coverage adequacy when upstream semantics for that assessment are defined.

The exact future mechanism for Question-set coverage adequacy may be human, automated or hybrid. No current scalar completeness score is canonical.

## Target workspace semantics

### Overview

Overview answers: **what am I preparing for, and what study material is currently available?**

It may show factual information such as:

- target identity/definition;
- selected Requirements/RequirementSets;
- count/list of currently resolved KnowledgeNodes;
- count of currently resolvable Questions;
- whether the current Study Set is empty/non-empty;
- factual ReviewObservation aggregates for currently relevant Questions when available.

Detailed corpus-quality diagnostics belong to Library/curation context, not the learner workflow.

These facts are not learner mastery, readiness, retention or automatically computed priority.

### Scope

Scope exposes the reusable Requirements/RequirementSets selected for the LearningTarget.

Selection/authorship policy for target scope remains unresolved by Q-TARGET-SCOPE-AUTHORSHIP. The interface must not assume whether the learner chooses individual Requirements directly, chooses a curated target/profile, or receives scope from curation/system logic until Application Design resolves that question.

### Knowledge

The target Knowledge section projects reusable KnowledgeNodes reached through current Requirement-to-Knowledge alignments.

The learner can:

- browse/read target-relevant Knowledge;
- open canonical Knowledge detail in learner context;
- navigate accepted KnowledgeRelations;
- optionally switch to a target-scoped graph projection.

Creation, editing, relation maintenance and alignment repair belong to Library curation. The same single-user person may explicitly switch context to perform those tasks.

### Questions

The target Questions section projects currently available reusable Questions reached through the target's resolved KnowledgeNodes.

The learner can inspect/open Questions and their direct answers according to the learning interaction design. Question creation, editing, alignment and coverage-quality work belong to Library curation.

### Study

The Study section builds and displays the currently resolvable Study Set for the selected target.

Study Set construction:

- does not wait for proof of complete Question coverage;
- does not require every target Requirement or KnowledgeNode to have material;
- may yield an explicit valid-empty result;
- does not claim the resulting set is semantically complete.

External-study actions preserve target context and report runtime availability plus per-Question export/reconciliation outcomes.

No statistics-derived ordering or recommendation is shown because the current application/domain model does not define it.

### Statistics

The target Statistics section shows Question-level ReviewObservations and factual aggregates for Questions currently resolved into the target context.

This is a current projection through reusable Question identities. It must not be presented as historical proof that an observation occurred for this target when target composition may have changed later.

Question detail may also expose its own review history independently of a target.

## Library interaction

Reusable corpus maintenance is collection-oriented:

- search/browse canonical objects;
- create/edit them;
- inspect identity and relationships/alignments;
- find structural curation gaps where supported;
- perform contextual bulk import for supported data kinds.

Large-corpus navigation must not require selecting a LearningTarget.

Exact server-backed search/filter fields remain constrained by accepted application/machine query contracts rather than invented by presentation code.

## Knowledge Graph

Graph visualization is an optional Knowledge projection for relationship exploration.

It may be entered from:

- the global Knowledge Library, for broader corpus exploration;
- a Target Knowledge context, for a target-scoped projection of currently relevant KnowledgeNodes.

Selecting a graph node opens the same canonical Knowledge identity/detail as list/search selection. Graph movement, layout and camera manipulation do not mutate domain semantics.

Every core Knowledge task remains available without graph manipulation. Whether the useful projection is 2D, 3D or omitted is downstream of demonstrated task value; 3D is not a product invariant.

### Future learner-state overlay

A target-scoped graph may later overlay inferred learner state so the learner can compare the required knowledge surface with evidence-backed progress.

That overlay is not valid in the current model because Learner Model stores Question-level ReviewObservations only and does not yet infer KnowledgeNode-level mastery/state.

Current UI must not encode review counts/ratings as degrees of learned knowledge. The future overlay remains an evidence-backed hypothesis documented in `docs/research/learner-state-graph-overlay.md`.

## Common interaction states

Applicable server/application-backed contexts distinguish:

- loading;
- loaded;
- valid empty state;
- editing/submitting where editing is allowed;
- validation rejection;
- successful completion;
- recoverable failure;
- unavailable/degraded external runtime.

Recoverable curation failures preserve entered data.

## Cross-context navigation

- target-derived Knowledge/Requirement/Question references preserve canonical identity;
- learner views may navigate to canonical detail in learner context;
- editing/semantic maintenance is entered deliberately through Library curation;
- Library navigation does not require a current target;
- switching to curation must not silently mutate learner target semantics.

## Accessibility/usability baseline

- learner and curation core tasks are operable without graph manipulation;
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
- future learner-state graph overlay encoding;
- responsive breakpoints;
- transport status codes and DTO shapes.
