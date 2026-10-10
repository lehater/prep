# Model Context Strategy

## Purpose and accepted evidence

Decide how the Prep MVP's accepted domain meanings should be modeled
coherently, where a separately governed semantic language would be justified,
and whether translation between such languages is required. A model context
is a **semantic applicability boundary**, not a code package, service,
database, team, API, screen, UI visualization or deployment unit.

**Accepted prerequisites:**

- `prep.product-capabilities` — `PREP-MVP-PRODUCT-CAPABILITIES-1`
  (15 active product capabilities and four explicitly RETIRED proposals).
- `prep.domain-strategy` — `PREP-MVP-DOMAIN-STRATEGY-1`
  (two strategically distinct CORE responsibilities, `DS-01` and `DS-02`).

Two separate strategic responsibilities do not, by themselves, establish
two model languages. This artifact owns language **applicability**, not
strategic investment classification or tactical entity design.

## Decision MC-01 — One coherent preparation and activity language

**MVP decision:** one coherent model context, `MC-01 Preparation
and Activity`, covers both preparation information (`DS-01`) and recorded
activity/results (`DS-02`). Within this context these are **distinct
meanings**, not interchangeable concepts.

**Why this is currently sufficient:**

1. The accepted requirements ask the user to understand information,
   relationships, recorded occurrences, reported results and temporal
   context; none establishes incompatible interpretations of a shared
   concept that would require independent semantic governance.
2. An activity/result record can refer to the preparation information
   it concerns without changing that information's meaning or requiring
   translation between distinct domain languages.
3. Temporal context, joint exploration, manual CRUD, external bulk
   loading, selection and outside use can all be represented as one
   coherent language. None by itself warrants a new model-language owner.
4. Accepted `DS-01` and `DS-02` remain valuable strategic distinctions
   because preparation meanings and recorded occurrences require separate
   **attention**, not necessarily different vocabularies or contexts.
5. No accepted evidence establishes independently evolving consumers,
   conflicting term meanings, or an interpretation boundary that cannot
   be expressed coherently within this single scope.

**Alternative examined:** separate `MC-01 Preparation Information` and
`MC-02 Recorded Activity and Results` languages, joined by `TR-01`.
That option could become justified by future independently evolving
semantic rules or incompatible terminology. At present it adds separate
language governance and a translation obligation without a demonstrated
need. It is **not** admitted merely because there are two CORE
responsibilities or two different kinds of information.

**Decision limit:** the single-context decision is a Model Context
Strategy judgment about *current evidence*, not a claim that future
accepted tactical modeling cannot discover a material boundary. If
independent language evidence emerges, route reconsideration through
this Authority and revalidate dependent Capabilities.

## MC-01 — Applicability and internal semantic distinctions

### Preparation information

**Meaning:** information the user works with when preparing for goals:
knowledge, goals, capabilities, practice material and their in-scope
relationships. The accepted product requires understanding, exploration,
and multiple perspectives, but not a fixed taxonomy of knowledge
subkinds, relationship meanings, topology, or cardinality.

**Accepted evidence:** `DS-01`,
`REQ-CAP-EXPLORE-INFORMATION`,
`REQ-CAP-EXPLORE-RELATIONSHIPS`, and
`REQ-CAP-EXPLORE-PERSPECTIVES`.

**Interpretation boundary:** describing a capability or knowledge
item does not assert that the user possesses or has mastered it.
The specific identity, vocabulary and validity of relationships
belong to Tactical Domain Design.

### Recorded activity and results

**Meaning:** information that describes a recorded occurrence of
preparation activity and, when present, its recorded result, including
temporal and subject context. A reported result is not an inference
about the user's mastery, competence or readiness.

**Accepted evidence:** `DS-02`,
`REQ-CAP-RECORD-ACTIVITY`,
`REQ-CAP-RELATE-ACTIVITY`,
`REQ-CAP-PRESERVE-TIME`, and
`REQ-CAP-EXPLORE-HISTORY`.

**Interpretation boundary:** a recorded occurrence or result is
not preparation information's definition, and preparation information
does not become an activity record merely because an activity involved
it. Both kinds are represented in the same coherent language without
conflating their meanings.

**Change boundary:** recorded activity and results are subject to the
product owner's all-kind CRUD and bulk-loading commitments. Nothing
in this model-context decision implies immutable events, permanent
audit histories, append-only records, undeletable results or snapshots.

### IR-01 — Internal subject-of-activity interpretation

An existing record of activity/result may concern existing in-scope
preparation information. When a consumer explores this relationship,
the model must permit understanding of **which** preparation
information the record concerns while preserving the distinction
between the occurrence/result and its subject.

**Accepted evidence:** `REQ-CAP-RELATE-ACTIVITY`,
`REQ-CAP-EXPLORE-RELATIONSHIPS`, `DS-01`, and `DS-02`.

- Treat the subject as preparation information; interpreting an
  activity/result does not redefine the subject or infer proficiency.
- Keep enough temporal context to distinguish existing recorded
  activities/results over time.
- Permit consumers to examine related information and recorded
  activity without treating the relation as proof of mastery.
- Do not prescribe a domain entity, link type, identifier scheme,
  relationship cardinality, data duplication, or storage structure.

This is a **semantic interpretation inside MC-01**, not a cross-context
translation contract. The earlier candidate `TR-01` is **not required**
for the chosen one-language topology. Its useful interpretation
constraints are captured here without inventing a separate language.

**Changes and removal:** accepted CRUD includes editing and removal of
preparation information, recorded activity/results, and relationships.
Current-product interpretation requirements apply to records and
relationships still in scope. A guarantee of historical
intelligibility after their former subject is edited or deleted was
not admitted by Product Requirements. Tactical Domain Design and
later owning Authorities must resolve relation consistency and
lifecycle consequences without silently revoking CRUD or inventing
mandatory historical preservation.

## Complete product capability applicability

All 15 accepted capabilities remain required within this single
language's scope; their application orchestration may span different
meanings without introducing additional model-language owners.

| Accepted capability | Applicable meaning / consumer consequence |
| --- | --- |
| `REQ-CAP-INTRODUCE-INFORMATION` | Manual creation of every in-scope entity and relationship kind, including activity/results |
| `REQ-CAP-RETAIN-INFORMATION` | Existing in-scope information remains inspectable while present in the working set |
| `REQ-CAP-CHANGE-INFORMATION` | Manual edits of every in-scope kind, including activity/results and links |
| `REQ-CAP-REMOVE-INFORMATION` | Removal of every in-scope kind from the working set |
| `REQ-CAP-BULK-LOAD-INFORMATION` | Externally supplied bulk loading for every in-scope kind |
| `REQ-CAP-READ-INFORMATION` | Inspection of every in-scope entity and relationship kind |
| `REQ-CAP-EXPLORE-INFORMATION` | Explore preparation information and recorded activity/results |
| `REQ-CAP-EXPLORE-RELATIONSHIPS` | Examine available in-scope relationships without inferring arbitrary cross-kind links |
| `REQ-CAP-EXPLORE-PERSPECTIVES` | Examine the same information from differing perspectives |
| `REQ-CAP-SELECT-PART` | Select a subset for preparation outside Prep |
| `REQ-CAP-TRANSFER-SELECTION` | Make the selected subset available for external use |
| `REQ-CAP-RECORD-ACTIVITY` | Bring recorded external preparation activity/results into the working set |
| `REQ-CAP-RELATE-ACTIVITY` | Understand existing record-to-subject relationships using IR-01 |
| `REQ-CAP-PRESERVE-TIME` | Retain enough temporal context for existing records |
| `REQ-CAP-EXPLORE-HISTORY` | Explore existing activity and result records over time |

Manual creation/editing must remain available independently of
bulk loading. No modeled kind can be silently exempted from read,
create, update, delete or externally supplied bulk loading.

## No separate contexts or translations currently justified

No additional model-language boundary is established merely for:

- `DS-01` versus `DS-02` as strategic investment categories;
- Goal, Capability, Knowledge, Practice Material or their in-scope
  distinctions;
- recorded occurrence versus recorded result within the same
  preparation and activity language;
- relationship classes, knowledge taxonomies or arbitrary cross-kind
  connection patterns;
- manually creating/editing, deletion, bulk loading, retention or reading;
- selection and external availability of a subset;
- inferred learner state, assessment, source management or verification;
- particular 2D/3D views, APIs, storage, services or integrations.

The accepted Product Capabilities record four `RETIRED`, never-admitted
proposals: `REQ-CAP-KNOWLEDGE-KINDS`,
`REQ-CAP-RELATIONSHIP-MEANINGS`,
`REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS`, and
`REQ-CAP-PRESERVE-HISTORY-CONTEXT`. They cannot be used to
manufacture an independent language or a historical-preservation
invariant, but their retirement does not forbid future justified work.

There is **no cross-language translation contract required by the
current one-context decision**. The internal interpretation of
existing subject-of-activity relationships is captured by `IR-01`.
If future evidence justifies independent model languages, define a
specific translation obligation then, based on actual consumers and
different semantics, not on the mere existence of multiple concepts.

## Consumers and authority handoff

- **Tactical Domain Design** decides domain concepts, invariants,
  identity, valid relationships and lifecycle/consistency behavior
  within the accepted applicability boundary. This is not an
  instruction to put all concepts in one aggregate or schema.
- **Application Design** coordinates product-level CRUD, bulk intake,
  examination, subset selection, external use and activity recording.
- **Interface Design** may offer different views of the same information
  without turning screen/view boundaries into model contexts.
- **Data and System Architecture** chooses implementation, persistence
  and runtime boundaries independently of this language boundary.

This decision does **not** select entities, value objects, aggregates,
repositories, APIs, packages, services, datastores, screen layouts or
deployment topology.

## Reopening conditions

Reconsider one versus multiple model languages through Harness if
accepted evidence demonstrates:

- a shared domain term has materially different meanings for
  preparation information and recorded activity consumers;
- the rules and interpretation of the two strategic responsibilities
  must evolve independently, creating conflict within one language;
- a real consumer requires semantic translation between independently
  governed concepts, beyond using a normal in-scope relationship;
- new accepted product behavior introduces independently coherent
  semantic language requirements; or
- tactical findings establish a material model-language question that
  must be answered at the proper Authority boundary.

Until then, preserve the simpler coherent single-language boundary,
the two distinct strategic responsibilities, and all accepted product
operations.
