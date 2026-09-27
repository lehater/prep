# User Journeys

## Purpose

Define goal-oriented user/application interaction for the rebuilt Prep frontend
knowledge chain. These journeys consume the accepted Task Model and Application
Design and deliberately stop before screen, route, pane, layout, visualization
or frontend-technology decisions.

The same person may move between **Learning** and **Curation** work. They are
task contexts, not authenticated roles.

## Coverage

Every current USER task in `prep.task-model` is covered by at least one
journey below.

| Task | Journey |
|---|---|
| TM-LEARN-SELECT-TARGET | J-L-01 |
| TM-LEARN-PREPARE-STUDY | J-L-01 |
| TM-LEARN-EXPORT-STUDY | J-L-01 |
| TM-LEARN-STUDY-EXTERNALLY | J-L-01 |
| TM-LEARN-INSPECT-EVIDENCE | J-L-02 |
| TM-EXPLORE-FIND-KNOWLEDGE | J-K-01 |
| TM-EXPLORE-RELATIONSHIPS | J-K-01 |
| TM-CURATE-TARGET | J-C-01 |
| TM-CURATE-KNOWLEDGE | J-C-02 |
| TM-CURATE-KNOWLEDGE-RELATIONS | J-C-02 |
| TM-CURATE-REQUIREMENTS | J-C-03 |
| TM-CURATE-REQUIREMENT-ALIGNMENT | J-C-03 |
| TM-CURATE-QUESTIONS | J-C-04 |
| TM-CURATE-QUESTION-ALIGNMENT | J-C-04 |
| TM-CURATE-BULK-LOAD | J-C-05 |
| TM-CURATE-DIAGNOSTICS | J-C-06 |

## [J-L-01] Prepare and perform study

**Actor:** the current single user acting in Learning work.

**Goal:** choose an existing curated LearningTarget, prepare the currently
resolvable Question material, send the reviewed material to the supported
external study runtime, and perform study without changing target scope.

**Task refs:** `TM-LEARN-SELECT-TARGET`,
`TM-LEARN-PREPARE-STUDY`, `TM-LEARN-EXPORT-STUDY`,
`TM-LEARN-STUDY-EXTERNALLY`.

**Trigger:** the user wants to study toward an already prepared target.

**Preconditions:**

- at least one curated LearningTarget may be discoverable;
- Learning work consumes target scope as read-only;
- reusable Knowledge/Requirement/Question material may be incomplete.

**Main interaction:**

1. The user asks for available curated LearningTargets, searches or narrows them
   as needed, and inspects enough outcome/scope information to choose one.
2. The user selects one target. The application establishes it as the active
   learning context and returns its current read-only Requirement/RequirementSet
   scope.
3. The user requests study preparation.
4. The application resolves the target through its current Requirement scope,
   accepted Requirement-to-Knowledge alignments and Question-to-Knowledge
   alignments, and materializes the currently resolvable Question subset.
5. The application presents the Study Set result as a preview and reports
   supported preparation diagnostics separately from the Question subset.
6. The user reviews the material and requests export to the supported external
   study runtime.
7. The application checks whether target/question resolution changed after the
   preview. If it did not change, it materializes the runtime-specific derived
   representation and exports it.
8. The user performs the learning/retrieval activity in the external runtime.
9. Accepted review results may later return to Prep; the application resolves
   them to canonical Questions and records factual Question-level
   ReviewObservations.

**Completion:** the selected previewed Study Set has either been exported for
external study, or the user has received an explicit reason why export could not
proceed. Completion does not imply mastery, readiness, retention or target
coverage.

**Alternate and recovery paths:**

- **No suitable target:** the application reports the absence of an appropriate
  curated target. The user may leave Learning work and perform separate
  Curation work; Learning does not silently become target editing.
- **No resolvable Questions:** preparation succeeds with an explicit empty
  Study Set. Missing material/alignment facts may be shown as curation
  diagnostics.
- **Partially resolvable target:** the resolvable subset remains usable; absence
  of full corpus coverage is not a learner-facing preparation gate.
- **Preview drift:** export is stopped before sending different material. The
  user refreshes/reviews the Study Set and then may export the new preview.
- **External export failure:** failure is surfaced. Prep does not record study
  completion or fabricate review evidence.
- **External interruption:** no canonical ReviewObservation is changed until
  accepted results are received.

**Externally visible side effects:**

- export creates/updates the supported external-runtime representation;
- accepted returned results append factual Question-level review evidence.

## [J-L-02] Inspect review evidence

**Actor:** the current single user acting in Learning work.

**Goal:** understand factual review history in target or Question context
without turning observations into unsupported learner-state claims.

**Task refs:** `TM-LEARN-INSPECT-EVIDENCE`.

**Trigger:** the user wants to review what study evidence exists.

**Preconditions:** a target or Question context can be selected; prior review
observations may or may not exist.

**Main interaction:**

1. The user chooses a target or Question context.
2. The application retrieves attributable Question-level ReviewObservations and
   statistics.
3. The user inspects the facts while their observational nature remains
   explicit.

**Completion:** the user can distinguish recorded evidence from absent evidence
and from deferred mastery/readiness/retention interpretation.

**Alternate and recovery paths:**

- when there are no observations, the application reports absence of evidence;
- unsupported mastery, gap, readiness, retention or automatic-priority claims
  are not synthesized to fill the absence.

**Externally visible side effects:** none; this journey is observational.

## [J-K-01] Find and traverse knowledge relationships

**Actor:** the current single user in either a global or target-relevant
knowledge-exploration context.

**Goal:** find a reusable KnowledgeNode, understand its accepted typed
relationships and move attention to related knowledge when useful.

**Task refs:** `TM-EXPLORE-FIND-KNOWLEDGE`,
`TM-EXPLORE-RELATIONSHIPS`.

**Trigger:** the user needs to understand a concept or how accepted concepts are
related.

**Preconditions:** canonical KnowledgeNodes exist; the exploration scope is
either global or derived from an active LearningTarget.

**Main interaction:**

1. The user establishes or retains the intended scope: global or
   target-relevant.
2. The user searches/filters human-readable KnowledgeNode content.
3. The application returns matching KnowledgeNodes without changing semantic
   identity or scope implicitly.
4. The user chooses one KnowledgeNode for focused inspection.
5. The application returns the node together with accepted typed relationships
   and enough neighboring identity/context to interpret them.
6. The user inspects a relation and may shift focus to a connected
   KnowledgeNode.
7. The application preserves scope and relationship identity while the focus
   changes.

**Completion:** the user can identify the relevant concept and understand or
follow one or more accepted relationships.

**Alternate and recovery paths:**

- **No matches:** keep the current scope and allow query/filter refinement.
- **Dense/large relationship set:** keep the semantic scope explorable through
  bounded search/filter/focus rather than requiring every corpus element to be
  simultaneously rendered.
- **No accepted relationship:** show that absence as current canonical state;
  do not infer or invent an edge.

**Externally visible side effects:** none; exploration is observational.

**Interface freedom preserved:** this journey requires findability, focus and
relationship traversal. It does not require a graph, 3D scene, 2D diagram,
tree, list or any other presentation form.

## [J-C-01] Curate a LearningTarget

**Actor:** the current single user acting in Curation work.

**Goal:** establish or revise a reusable LearningTarget and its prepared
Requirement/RequirementSet scope.

**Task refs:** `TM-CURATE-TARGET`.

**Trigger:** a target needs to be created or its reusable scope intentionally
changed.

**Preconditions:** reusable Requirements/RequirementSets may already exist.

**Main interaction:**

1. The user finds an existing LearningTarget or begins a new one.
2. The user supplies/edits the target identity and intended outcome.
3. The user finds reusable Requirements/RequirementSets and chooses additions
   or removals from the target scope.
4. The application validates and applies accepted target changes.
5. The user can inspect the resulting prepared target scope.

**Completion:** the target has an explicit accepted reusable scope suitable for
later Learning work.

**Alternate and recovery paths:**

- invalid target composition is rejected without mutating the accepted scope;
- if required reusable Requirements do not exist, their creation remains a
  separate Requirement curation task rather than implicit target editing.

**Externally visible side effects:** accepted LearningTarget or target-scope
canonical data changes.

## [J-C-02] Curate knowledge and relationships

**Actor:** the current single user acting in Curation work.

**Goal:** maintain reusable KnowledgeNodes and accepted typed relationships.

**Task refs:** `TM-CURATE-KNOWLEDGE`,
`TM-CURATE-KNOWLEDGE-RELATIONS`.

**Trigger:** canonical subject knowledge or an accepted relationship needs
creation, correction or removal.

**Preconditions:** the user can search/inspect existing KnowledgeNodes and
relations.

**Main interaction:**

1. The user searches for the relevant KnowledgeNode or starts creating one.
2. The user supplies or edits its human-readable canonical content.
3. The application validates and either accepts the change or returns explicit
   rejection information.
4. For relationship work, the user identifies source and target KnowledgeNodes,
   inspects existing relations and chooses an applicable accepted relation type.
5. The user creates or removes the typed relation.
6. The application validates and applies the relation mutation.

**Completion:** intended KnowledgeNode content and/or accepted relationships are
canonical and inspectable.

**Alternate and recovery paths:**

- rejected node edits leave accepted canonical data unchanged;
- unsupported/invalid relation assertions are rejected rather than coerced to a
  different relation type;
- uncertainty about whether a relationship is true remains unresolved rather
  than being guessed by the interface.

**Externally visible side effects:** accepted KnowledgeNode or
KnowledgeRelation canonical data changes.

## [J-C-03] Curate requirements and knowledge alignment

**Actor:** the current single user acting in Curation work.

**Goal:** maintain reusable Requirements/RequirementSets and align Requirements
to the KnowledgeNodes they require.

**Task refs:** `TM-CURATE-REQUIREMENTS`,
`TM-CURATE-REQUIREMENT-ALIGNMENT`.

**Trigger:** reusable learning scope or its knowledge mapping needs creation or
correction.

**Preconditions:** relevant Requirements, RequirementSets or KnowledgeNodes may
already exist.

**Main interaction:**

1. The user finds or creates the relevant Requirement/RequirementSet.
2. The user edits Requirement content or RequirementSet composition.
3. The application enforces accepted composition invariants, including
   acyclicity.
4. The user inspects a Requirement and searches candidate KnowledgeNodes.
5. The user deliberately adds or removes Requirement-to-Knowledge alignments.
6. The application applies accepted alignment changes.

**Completion:** reusable requirement semantics/composition are accepted and
known alignments reflect the user's intended mapping.

**Alternate and recovery paths:**

- an invalid RequirementSet composition is rejected without applying a
  prohibited cycle;
- if no accepted alignment is known, the gap stays explicit rather than being
  auto-matched.

**Externally visible side effects:** accepted Requirement,
RequirementSet/composition or Requirement-to-Knowledge alignment data changes.

## [J-C-04] Curate Questions and knowledge alignment

**Actor:** the current single user acting in Curation work.

**Goal:** maintain reusable Questions/direct answers and deliberately align them
to relevant KnowledgeNodes.

**Task refs:** `TM-CURATE-QUESTIONS`,
`TM-CURATE-QUESTION-ALIGNMENT`.

**Trigger:** learning material or its knowledge mapping needs creation or
correction.

**Preconditions:** a Question may validly exist before its knowledge alignment
is known.

**Main interaction:**

1. The user finds an existing Question or begins a new one.
2. The user supplies/edits the Question and direct answer.
3. The application validates and applies accepted Question changes.
4. The user searches/inspects candidate KnowledgeNodes.
5. The user adds or removes Question-to-Knowledge alignments.
6. The application applies accepted alignment changes.

**Completion:** Question material is canonical and any known intended
alignments are explicit.

**Alternate and recovery paths:**

- rejected Question edits leave accepted canonical data unchanged;
- missing or uncertain alignment remains explicit; Question identity is not
  rejected solely because alignment is incomplete.

**Externally visible side effects:** accepted Question or
Question-to-Knowledge alignment data changes.

## [J-C-05] Load prepared canonical data

**Actor:** the current single user acting in Curation work.

**Goal:** load supported prepared canonical data while receiving explicit
validation/rejection outcomes.

**Task refs:** `TM-CURATE-BULK-LOAD`.

**Trigger:** the user has prepared data to load instead of entering it item by
item.

**Preconditions:** the input uses a supported machine representation and may
contain supported Knowledge, Requirement/RequirementSet, Question or optional
target data.

**Main interaction:**

1. The user selects/submits prepared input.
2. The machine-interface layer decodes it into supported application input.
3. Application bulk-load operations validate and apply the accepted canonical
   changes.
4. The user receives explicit validation/rejection information sufficient to
   understand the result.

**Completion:** the accepted portion/outcome is visible according to the
upstream operation semantics; no automatic extraction or semantic repair is
claimed.

**Alternate and recovery paths:**

- malformed or invalid input produces explicit rejection/diagnostics;
- unsupported automatic source extraction, derivation or semantic validation is
  not invented by the journey.

**Externally visible side effects:** accepted bulk operations may mutate
canonical data.

## [J-C-06] Investigate structural curation diagnostics

**Actor:** the current single user acting in Curation work.

**Goal:** find supported structural preparation problems and move into the
appropriate explicit repair task.

**Task refs:** `TM-CURATE-DIAGNOSTICS`.

**Trigger:** the user wants to find reusable-corpus preparation gaps.

**Preconditions:** the application can query supported structural facts such as
unaligned Questions or KnowledgeNodes with no aligned Questions.

**Main interaction:**

1. The user requests supported structural diagnostics.
2. The application returns diagnostic facts and the canonical objects involved.
3. The user selects a diagnostic to investigate.
4. The user chooses whether to continue into the applicable explicit curation
   task, such as Requirement alignment or Question alignment.

**Completion:** the user understands the structural gap and, when desired,
reaches the owning curation work without the diagnostic itself inventing a
repair.

**Alternate and recovery paths:**

- no diagnostic findings is reported as no supported structural finding;
- semantic coverage adequacy is not converted into a fabricated score while its
  model remains deferred.

**Externally visible side effects:** none until the user performs a separate
curation mutation.

## Journey sufficiency review

- Every current USER task from `prep.task-model` has journey coverage.
- Learning and Curation remain distinct work contexts without an authentication
  role split.
- Empty/partial Study Set, preview drift, external failure, invalid canonical
  mutations, missing alignments, no search matches and absent evidence have
  explicit observable handling.
- Knowledge exploration is defined by user information needs and operations;
  no visualization form is selected.
- No journey chooses a screen, route, page, modal, pane, graph, layout,
  component or frontend technology.

## Upstream references

- `docs/application/task-model.yaml`
- `docs/application/application-design.md`

## Unresolved Questions

None introduced at User Journey Design.
