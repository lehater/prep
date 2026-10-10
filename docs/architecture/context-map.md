# Domain Strategy

## Purpose and evidence boundary

Identify the MVP's strategic domain responsibilities and the areas where their
different meanings justify separate strategic attention. This is a strategic
classification, not a bounded-context map, tactical domain model, service
topology, persistence design, or user-interface design.

**Accepted source:** `prep.product-capabilities`,
`PREP-MVP-PRODUCT-CAPABILITIES-1`. Its 15 active capabilities are the direct
product-behavior input. The prior four `RETIRED` capability proposals are not
accepted requirements and are not admissible justification for this strategy.

The distinction between preparation information and recorded activity/results
is consistent with accepted Problem Evidence: an item used for preparation is
not the same thing as a recorded fact that an activity occurred. That
distinction does not imply uneditable or undeletable history.

## Strategic responsibility landscape

### DS-01 — Preparation Information — CORE

**Responsibility:** the meaning and relationships of the preparation
information the user chooses to work with: knowledge, goals, capabilities,
practice material, and the relevant information relationships in the
accepted MVP scope. It supplies a coherent subject of exploration and
different perspectives without determining a fixed taxonomy, permitted
relationship topology, or representation.

**Accepted product evidence:**
`REQ-CAP-EXPLORE-INFORMATION`,
`REQ-CAP-EXPLORE-RELATIONSHIPS`, and
`REQ-CAP-EXPLORE-PERSPECTIVES`.

**Strategic classification:** CORE for the MVP. Making the user's growing
preparation information and in-scope relationships intelligible from different
perspectives is central to the accepted product promise. This responsibility
deserves explicit domain attention so future model and application work does
not reduce it to generic import, storage, or display machinery. This
classification is an investment/attention judgment, not a declaration of an
independent model language or technical boundary.

**Boundary:** recorded occurrence/result facts are addressed under DS-02;
DS-01 does not infer learning achievement from the presence of knowledge or
capability information. The accepted MVP does **not** mandate distinguishable
subkinds within Knowledge, a relationship-meaning classification, or arbitrary
relationships across all information kinds.

### DS-02 — Recorded Activity and Results — CORE

**Responsibility:** the meaning of recorded preparation activity and its
results as records of what took place, including temporal context and their
relationship to the preparation information concerned. A recorded result is a
recorded fact, not a conclusion about learner mastery, readiness, competence,
or possession of a capability.

**Accepted product evidence:**
`REQ-CAP-RECORD-ACTIVITY`,
`REQ-CAP-RELATE-ACTIVITY`,
`REQ-CAP-PRESERVE-TIME`, and
`REQ-CAP-EXPLORE-HISTORY`.

**Strategic classification:** CORE for the MVP. Understanding activity and
results in temporal and subject context is an independent, explicit product
outcome whose meaning must not be collapsed into the current description of
preparation materials. Distinct strategic attention is justified even if a
later Model Context Strategy finds that one model language is sufficient.

**Boundary:** recorded activity and results remain within the owner's
accepted all-kind CRUD and bulk-load commitments. Their editability and
removability are required, not exceptions. The strategy does not mandate
immutable records, snapshots, audit trails, permanent retention of deleted
facts, or guaranteed historical interpretation after related information has
been changed or removed. Historical continuity and consistency questions
belong to the relevant downstream semantic owner.

## Relationship between the responsibilities

- DS-01 describes preparation information; DS-02 describes recorded facts
  about activity and results. Neither redefines the other's meaning.
- An existing activity/result record must remain understandable in relation
  to the in-scope preparation information it concerns, to the extent required
  by `REQ-CAP-RELATE-ACTIVITY`. This does not prescribe relation identity,
  cardinality, permitted cross-kind links, or a snapshot/version policy.
- Temporal examination of existing records is required by
  `REQ-CAP-PRESERVE-TIME` and `REQ-CAP-EXPLORE-HISTORY`. It does not make
  those records immutable.
- Exploring information can bring both responsibilities into the same
  experience. Shared user experience does not create a third strategic owner.
- The accepted universal CRUD and bulk-load product scope applies to every
  entity and relationship kind in the eventually accepted MVP model,
  including records of activity and results, regardless of this strategic
  classification.

## Product behaviors without separate strategic subdomains

The following are **accepted product capabilities**, but current evidence
does not establish independent problem-space semantic ownership for them.
They may work with information from either strategic responsibility:

| Product behavior | Accepted capability | Strategic disposition |
| --- | --- | --- |
| Manual addition | `REQ-CAP-INTRODUCE-INFORMATION` | Cross-cutting user operation |
| Continued availability for inspection | `REQ-CAP-RETAIN-INFORMATION` | Cross-cutting behavior; no immutable retention rule |
| Manual editing | `REQ-CAP-CHANGE-INFORMATION` | Cross-cutting user operation |
| Removal | `REQ-CAP-REMOVE-INFORMATION` | Cross-cutting user operation |
| Bulk loading external information | `REQ-CAP-BULK-LOAD-INFORMATION` | Cross-cutting user operation |
| Reading existing information | `REQ-CAP-READ-INFORMATION` | Cross-cutting user operation |
| Selecting a subset for external use | `REQ-CAP-SELECT-PART` | Cross-cutting product behavior |
| Making a selected subset available outside Prep | `REQ-CAP-TRANSFER-SELECTION` | Cross-cutting product behavior |

These are **not** excluded from the MVP. Their required scope and
observability remain binding Product Requirements. Their orchestration,
formats, interface affordances and technical realization are downstream.

No strategic subdomain for an external study runtime, source verification,
provenance management, inferred learner state, or mastery assessment is
established by the accepted product scope.

## Retired product proposals and unresolved downstream meaning

The accepted Product Capabilities artifact records four `RETIRED`, never-
admitted proposals. They cannot silently become Domain Strategy mandates:

- `REQ-CAP-KNOWLEDGE-KINDS`: no product decision requiring an internal
  taxonomy of kinds of Knowledge.
- `REQ-CAP-RELATIONSHIP-MEANINGS`: no accepted user-facing classification
  of relationship meanings.
- `REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS`: no universally permitted
  cross-kind link topology.
- `REQ-CAP-PRESERVE-HISTORY-CONTEXT`: no accepted invariant guaranteeing
  preservation of historical interpretation after related information is
  edited or deleted.

These retirement dispositions do not prohibit downstream investigation or
later explicit product decisions. In particular, later domain work must
reconcile editable/removable recorded facts with useful temporal and
relational understanding, **without** silently revoking the accepted CRUD
rights or assuming an immutable history.

## Consumers and authority handoff

- **Model Context Strategy:** determine whether distinct semantic languages
  and translation contracts are actually justified. The two strategic
  responsibilities do **not** automatically require two bounded contexts.
- **Tactical Domain Design:** determine valid concepts, relationships,
  identity, invariants, and behavior in whichever model contexts are
  subsequently accepted.
- **Application Design:** determine how cross-cutting CRUD, bulk loading,
  exploration, selection, external use and recorded-activity intake work
  across accepted domain semantics.
- **Interface and Data Design:** realize the approved product operations
  without deciding strategic ownership or changing domain meaning.

This strategy does not assign tactical domain entities, model-language
applicability, APIs, services, packages, databases, UI screens, or
implementation mechanisms.

## Reopening conditions

Reassess the classification or responsibility boundary if accepted evidence
establishes that:

- a particular kind of preparation information has independently changing
  domain meaning and warrants its own strategic attention;
- recorded activity, results, and their interpretation no longer evolve
  coherently as one strategic responsibility;
- selection, exchange, or information lifecycle acquires substantive domain
  semantics rather than merely operating on the accepted responsibilities;
- a product decision adds obligatory relationship classes, cross-kind
  connectivity, provenance, immutable history, or source verification; or
- changed accepted Product Capabilities invalidate the present evidence for
  either classification.
