# Legacy engineering documents: MVP reconciliation triage

> **Noncanonical research snapshot.** This is a review of 28 unregistered
> `docs/` files on `mvp-vertical-slice` after the coordinated
> `MODEL-CONTEXT-STRATEGY` omission (PR #99). It is **not** an Authority
> Assessment, Core artifact, acceptance, product decision, authorization to
> archive files, or second lifecycle/inventory state. Recheck against the live
> Core, Publication, Engineering Graph and pinned Harness before acting.
> The root cause is old engineering semantics remaining in previously
> materialized-looking documents without current Core realization.

## Authoritative boundary at the time of review

The published Harness frontier has exactly five policy-bound CURRENT
Capabilities: `prep.problem-evidence`, `prep.user-needs`,
`prep.product-intent`, `prep.product-capabilities`, and
`prep.domain-strategy`.

`MODEL-CONTEXT-STRATEGY` is `NOT_APPLICABLE` after one-language
applicability review. The former `MC-01/IR-01` and the sixth acceptance are
retained only in the archived publication and related historical sources
under `.harness/candidates/history/model-context-authority-omission/`.
They are not a current model-context prerequisite or a shortcut to
Tactical Domain Design acceptance.

The currently accepted product scope includes exploration of in-scope
knowledge, goals, capabilities, practice material, recorded activities and
results; inspection of existing relationships and differing perspectives;
selection and availability for external preparation; recording outside
activity/results; temporal/subject-context examination; externally supplied
bulk loading and **complete manual CRUD of every accepted MVP entity and
relationship kind**, including recorded activities/results. Four proposed
capabilities—knowledge-kind taxonomy, distinguishable relationship meanings,
arbitrary cross-kind topology, and immutable historical interpretation
after change/deletion—are RETIRED, not required.

**Meaning of the labels below:** `Review owner` is an *inferred routing
candidate* from the current Engineering Graph and file purpose, not proof
that the file is admitted, applicable or a canonical artifact. All 28 files
are `UNREGISTERED / NOT CURRENT` regardless of any old `canonical`,
`accepted`, `v1` or `required` wording inside them.

## Inventory and suggested review order

| Review owner (candidate) | Unregistered file | Evidence / review concern |
| --- | --- | --- |
| TACTICAL-DOMAIN-DESIGN | `docs/domain/knowledge-model.md` | Prescribes KnowledgeObject/KnowledgeProposition split and identity; accepted MVP does not impose this taxonomy |
| TACTICAL-DOMAIN-DESIGN | `docs/domain/learning-design.md` | Separately models CapabilitySpecification, learner evidence, performance contracts and target-relative support, beyond current product scope |
| TACTICAL-DOMAIN-DESIGN | `docs/domain/learner-model.md` | Explicit LearnerCapabilityClaim, mastery-related evidence and capability-state inference; recorded results are not mastery assessments in the current MVP |
| TACTICAL-DOMAIN-DESIGN | `docs/domain/relation-classification-catalog.yaml` | Declares itself `status: canonical`, relies on `MC-SUBJECT-KNOWLEDGE` and an elaborate predicate taxonomy absent from accepted requirements |
| APPLICATION-DESIGN | `docs/application/task-model.yaml` | Older target-relative tasks, performance/state projections and learning cycles; cannot be taken as accepted user tasks |
| APPLICATION-DESIGN | `docs/application/application-design.md` | Old domain owners, learner-evidence/currentness flows and operations need derivation from newly accepted tactical models |
| APPLICATION-DESIGN | `docs/application/process-activity-evidence-cycle.md` | Assumes an activity-to-evidence evaluation process, not equivalent to intake of recorded facts |
| APPLICATION-DESIGN | `docs/application/process-prepare-support.md` | Encodes missing-support remediation; re-evaluate whether this is an accepted operation |
| APPLICATION-DESIGN | `docs/application/user-journeys.md` | Historic journeys include learner-state/assessment interactions; derive only after application semantics |
| CONCURRENCY-CONSISTENCY-DESIGN | `docs/architecture/import-consistency.md` | Import/retry/consistency semantics may be relevant to bulk loading, but are not accepted merely because a file exists |
| DATA-DESIGN | `docs/architecture/data-design.md` | Physical models depend on prior Knowledge/Learning/Learner separation and must follow new tactical decisions |
| QUALITY-DESIGN | `docs/architecture/performance-capacity.md` | Earlier Knowledge/spatial-workload assumptions are quality candidates, not product/UI mandates |
| SYSTEM-ARCHITECTURE | `docs/architecture/system-architecture.md` | Runtime topology, trust assumptions and services require revalidation from current application contracts |
| SYSTEM-ARCHITECTURE | `docs/architecture/frontend-system-architecture.md` | Frontend module/dependency assumptions may constrain realization before current interaction and view design |
| HUMAN-INTERFACE-DESIGN | `docs/interface/conceptual-interface-model.yaml` | Old target/learner concepts and view vocabulary must be re-derived from accepted tasks |
| HUMAN-INTERFACE-DESIGN | `docs/interface/information-architecture.yaml` | Navigation architecture includes old target-relative learner-state concepts |
| HUMAN-INTERFACE-DESIGN | `docs/interface/interaction-design.yaml` | Interaction roles incorporate old state/assessment semantics |
| HUMAN-INTERFACE-DESIGN | `docs/interface/interface-topology.yaml` | Fixed preparation navigation topology is not an accepted product/UI decision |
| HUMAN-INTERFACE-DESIGN | `docs/interface/presentation-system.md` | Presentation choices and spatial assumptions remain conditional on user utility |
| HUMAN-INTERFACE-DESIGN | `docs/interface/screen-view-design.md` | Concrete screens/views from the prior model need new usability and task evidence |
| MACHINE-INTERFACE-DESIGN | `docs/interface/machine-interface.md` | Old runtime interaction contracts contain learner-state/assessment semantics |
| ENGINEERING-POLICY | `docs/engineering/frontend-engineering-policy.md` | Frontend-specific policy may remain useful but is not a substitute for current interface/architecture ownership |
| COMPONENT-DESIGN | `docs/implementation/frontend-component-design.md` | Components and renderer seams depend on unaccepted old frontend view contracts |
| IMPLEMENTATION-DESIGN | `docs/implementation/frontend-implementation-design.md` | Work slicing depends on obsolete/unaccepted downstream knowledge |
| TEST-DESIGN | `docs/verification/frontend-test-design.yaml` | Executable tests derive from currently accepted public contracts, not obsolete targets |
| VERIFICATION-DESIGN | `docs/verification/frontend-verification.md` | Existing tests still reference prior frontend behavior and must be re-derived |
| VERIFICATION-DESIGN | `docs/verification/interface-verification.md` | Old interface oracles depend on unaccepted task/interaction models |
| VERIFICATION-DESIGN | `docs/verification/presentation-verification.md` | Old presentation assertions are not current usability or rendering obligations |

Total: **28** candidate review entries, **zero** new canonical artifacts.
The validator's inventory failure must remain visible until each file is
individually classified or re-realized under Harness. Do **not** add a
blanket allowlist, mark these files `CURRENT`, or register them en masse.

## Focused domain-content decision boundary

The present two direct Tactical Domain Design productions are:

- `prep.preparation-information-model`;
- `prep.recorded-activity-history-model`.

Both consume the accepted `prep.product-capabilities` and
`prep.domain-strategy`. They cover two subject responsibilities **inside
one coherent language**, not two independently accepted model contexts,
databases, services or technical schemas.

The **first** domain-model candidate must explicitly examine:

1. Minimal meanings and identity for goals, capabilities, knowledge,
   practice material, and allowed in-scope relationships, avoiding
   an inherited KnowledgeObject/KnowledgeProposition dichotomy without
   new evidence.
2. All-kind manual CRUD and externally supplied bulk loading; tactical
   semantics must not override the owner's product-level behavior.
3. How an existing record of activity/result can concern existing
   preparation information, with sufficient temporal context, but
   without inference of proficiency, immutable history, snapshots or
   guaranteed interpretation after deletions.
4. Invariants and relations only when genuinely supported by
   accepted prerequisites or proper Authority decisions. A relation
   classification catalog from the old model does not supply such
   acceptance.
5. Whether two distinct **domain-model artifacts** are justified as
   separately consumable tactical contracts or whether their scopes
   should be revised. Separate artifacts do not imply separate languages.

The legacy domain documents may be used to *form alternatives or questions*
when the routed procedure explicitly permits, but not as accepted
prerequisites. The candidate must be drafted with the pinned
`domain-model` skill, including the required decision-explorer,
registered axes and semantic-admission procedure. If a material domain
decision lacks delegated autonomy or sufficient evidence, create a Core
Question and stop rather than guessing.

## Recommended reconciliation sequence

1. Verify this inventory mechanically against current Core and docs;
   confirm the five-CURRENT policy-bound frontier.
2. Review Tactical Domain Design under the routed procedure and
   establish an actionable `CREATE` expectation. Produce a fresh
   candidate from **accepted** Product Capabilities and Domain Strategy,
   not from old domain model files.
3. Independently evaluate relation types, concept identity, historical
   consistency and CRUD; capture nontrivial alternatives and Questions.
   Accept/materialize **one Capability at a time**. Do not automatically
   accept both tactical models or any downstream consumers.
4. Once the replacement canonical artifact(s) and their dependencies
   are accepted and published, classify affected old files as historical
   or noncanonical and relocate/remove only through a scoped change.
5. Repeat per owner in graph dependency order for Application,
   Human/Machine Interface, architecture, data, verification and
   implementation, keeping outstanding inventory failures explicit.

## Exit criteria for each legacy file

- Either a semantically equivalent or intentionally revised requirement
  has been accepted through its owning Harness Capability and published,
  with its distinct historical source correctly disposed; **or**
- the file is established to be genuinely noncanonical evidence or
  retired material, has no live canonical consumers, and is archived or
  relocated under repository policy.

A passing `docs inventory` with lost semantic ownership is not success.
Likewise, a recovered old document labeled `ACCEPTED` does not constitute
semantic admission. Currentness must come from the published Harness
evidence and accepted prerequisite fingerprints.
