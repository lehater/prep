# Human Interface Design

## Scope

Define implementation-independent human interaction for current Prep journeys. This contract does not choose a frontend framework, component library, database, file format or Anki protocol.

## Primary interaction model

Prep exposes two explicit task modes:

- **Learning** — target-centric learner workflow over prepared LearningTargets;
- **Curation** — authoring and quality-control workflow for reusable Targets, Knowledge, Requirements/RequirementSets, Questions and alignments.

A LearningTarget is the primary context inside Learning mode. The learner selects an existing curated target/profile, explores its currently available material, builds a Study Set, exports it to the external study runtime and inspects returned review facts.

These are interaction modes, not authentication roles. In the first single-user version the same physical person may switch between them.

## Information architecture

### Global locations

The primary application modes are:

- **Learning** — choose a prepared target/profile and work through its learner workflow;
- **Curation** — manage prepared target profiles and the reusable Library.

Within Curation, the reusable Library includes Knowledge, Requirements/RequirementSets and Questions; curated LearningTargets are maintained alongside that Library because their scope is assembled from reusable requirements.

External-runtime status/configuration is a secondary application concern. Study and Statistics remain inside the selected LearningTarget. Import is contextual to Curation/Library data kinds.

### Target workspace

Opening a target establishes a persistent learner context. The smallest current learner navigation has four semantic sections:

- **Overview** — target identity/definition, read-only curated scope and concise current material availability;
- **Knowledge** — target-relevant Knowledge projection for reading/exploration;
- **Study** — currently resolvable Questions, Study Set inspection and external-study action;
- **Statistics** — factual ReviewObservations/statistics for currently relevant Questions.

Read-only Scope is folded into Overview because the learner has no scope-authoring task. Target Questions are folded into Study because the current v1 Study Set is exactly the currently resolvable target Question set; a separate learner Questions destination would duplicate the same collection without a distinct task.

The learner workflow does not require repairing reusable corpus quality. If curation is needed, the same v1 user may deliberately switch to Library context; that is a different task, not an implicit step of studying.

### Global Library

The Library exposes reusable collections for:

- KnowledgeNodes and KnowledgeRelations;
- Requirements and RequirementSets;
- Questions.

Library work is valid without a selected target. Canonical objects remain globally reusable even when viewed from a target.

## Learner end-to-end workflow

For a concrete target such as **Python Backend Interview**, the learner flow is:

1. Learner browses/searches available prepared LearningTargets and selects one.
2. The selected target's curated Requirements/RequirementSets become read-only scope in Learning mode.
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

Curation covers:

- creating/editing reusable LearningTargets and composing each target from Requirements/RequirementSets;
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

Overview answers: **what am I preparing for, what does this prepared target require, and what study material is currently available?**

It may show factual information such as:

- target identity/definition;
- the curated Requirements/RequirementSets as read-only scope;
- count/list of currently resolved KnowledgeNodes;
- count of currently resolvable Questions;
- whether the current Study Set is empty/non-empty;
- factual ReviewObservation aggregates for currently relevant Questions when available.

The learner may inspect/navigate the scope but cannot add/remove Requirements or edit RequirementSets in Learning mode. Changing target scope requires an explicit switch to Curation mode.

Detailed corpus-quality diagnostics belong to Curation, not the learner workflow.

These facts are not learner mastery, readiness, retention or automatically computed priority.

### Knowledge

The target Knowledge section projects reusable KnowledgeNodes reached through current Requirement-to-Knowledge alignments.

The learner can:

- browse/search target-relevant Knowledge;
- explore a first-class interactive graph projection of the same target-relevant Knowledge set;
- open canonical Knowledge detail in learner context;
- navigate accepted KnowledgeRelations;
- focus a selected node and its local relational neighborhood;
- filter visible accepted relations by relation type and visible nodes by semantic kind;
- enter the Knowledge map from a Study Question focused on that Question's aligned KnowledgeNodes.

The frontend prototype should include a 3D graph implementation so its learning value can be tested directly. This is a prototype commitment, not evidence that 3D is superior to 2D or that graph interaction should become mandatory.

Creation, editing, relation maintenance and alignment repair belong to Library curation. The same single-user person may explicitly switch context to perform those tasks.

### Study

The Study section owns the learner's target-relevant Question collection and the currently resolvable Study Set for the selected target.

Because the current v1 Study Set contains all currently resolvable target Questions, Study provides the learner's browse/inspect Question path as well as build/export actions. Question creation, editing, alignment and coverage-quality work remain Curation tasks.

From a Question, the learner may invoke **Show in Knowledge Map** to open the target-scoped Knowledge graph focused on all KnowledgeNodes aligned to that Question. This is a learning navigation action; it creates no new alignment or semantic relation.

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

## Curation interaction

Curation contains target-profile maintenance plus reusable Library maintenance.

Reusable corpus maintenance is collection-oriented:

- search/browse canonical objects;
- create/edit them;
- inspect identity and relationships/alignments;
- find structural curation gaps where supported;
- perform contextual bulk import for supported data kinds.

Large-corpus navigation must not require selecting a LearningTarget.

Exact server-backed search/filter fields remain constrained by accepted application/machine query contracts rather than invented by presentation code.

## Knowledge Graph

Graph visualization is a first-class **exploration and learning representation** in the frontend prototype, while remaining non-mandatory for core access.

It may be entered from:

- the global Knowledge Library, for broader corpus exploration and curation;
- a Target Knowledge context, for target-scoped relational learning;
- a Study Question, focused on that Question's aligned KnowledgeNodes and nearby accepted relations.

Supported graph tasks include:

- understand which reusable knowledge objects are semantically connected;
- inspect the meaning/direction of visible relation types;
- focus one node and reduce the visible graph to a local neighborhood;
- toggle accepted relation types such as `addresses` and `realizes`;
- filter by semantic kind (Concept, Mechanism, Procedure, Strategy);
- move between graph and canonical readable detail without losing graph context.

Selecting a graph node opens the same canonical Knowledge identity/detail as list/search selection. Graph movement, layout, camera position and apparent geometric distance do not mutate or imply domain semantics.

The prototype specifically includes 3D to test whether depth and spatial manipulation improve these tasks. Current research does not establish a general desktop-3D advantage, so 2D/list alternatives remain comparison baselines and every core task remains possible without 3D manipulation.

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
- editing/semantic maintenance is entered deliberately through Curation mode;
- Curation does not require an active learner target;
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
