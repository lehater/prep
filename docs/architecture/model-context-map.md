# Model Context Strategy

## Purpose and accepted evidence

Decide where independently coherent domain-model languages apply in the Prep
MVP, how those languages relate, and what semantic translation is required
for their consumers. A model context is a **language/applicability boundary**,
not necessarily a code module, service, database, team, API, UI view, or
deployment unit.

**Accepted sources:**

- `prep.product-capabilities` — `PREP-MVP-PRODUCT-CAPABILITIES-1`;
  fifteen accepted, active product capabilities define the observable
  behaviors that any model-context strategy must preserve.
- `prep.domain-strategy` — `PREP-MVP-DOMAIN-STRATEGY-1`;
  `DS-01` and `DS-02` distinguish strategic responsibilities, but neither
  their separate CORE classifications nor their names alone establish
  separate model languages.

This document decides semantic applicability only. It does not revive four
previously `RETIRED` product-capability proposals, assign tactical entities
or invariants, or claim independent historical persistence.

## Model-language boundary decision

**Candidate decision:** use two cooperating model contexts for the current
scope, subject to semantic admission based on independent language evidence:

- `MC-01` — Preparation Information;
- `MC-02` — Recorded Activity and Results.

**Why a distinction may be necessary:** preparation information describes
what the user is preparing with or toward; recorded activity describes
occurrences of activity and their reported results, with temporal context.
Their meanings answer different questions. A preparation goal or piece of
material does not become a recorded activity merely because it is used, and
a recorded result cannot automatically be interpreted as a claim of
knowledge, capability, mastery or readiness.

**Why not split further:** accepted requirements do not establish separate
model languages for Goal, Capability, Knowledge, Practice Material,
individual relation kinds, history versus result, information CRUD, bulk
loading, or external-use selection. Distinguishable information categories
and product operations alone do not require independent semantic contexts.

**Alternative to challenge:** one shared model language could represent
both information and recorded activity while retaining these distinctions.
The proposed two-context choice is justified **only if** separate fact/time
versus preparation-information language provides materially clearer
applicability and consumer boundaries. It is not justified by two CORE
classifications or by technical organization. If independent model-language
evidence is inadequate, Harness review must stop or select the coherent
one-context alternative through the proper Model Context Strategy decision;
it must not mechanically accept two contexts.

## MC-01 — Preparation Information

**Applicability:** interpretations of preparation-related information and
its in-scope relationships, including knowledge, goals, capabilities and
practice material. Consumers use this language to understand the
information being worked with and to examine it from different perspectives.

**Evidence:** `DS-01`; `REQ-CAP-EXPLORE-INFORMATION`,
`REQ-CAP-EXPLORE-RELATIONSHIPS`, and
`REQ-CAP-EXPLORE-PERSPECTIVES`.

**Language boundary:** descriptions of goals, knowledge, capabilities and
material do not by themselves state what the person has learned, achieved
or mastered. Existing in-scope relationships are understood in their
preparation-information meaning; this strategy does not establish a
taxonomy of kinds of Knowledge, mandatory relationship categories, fixed
cardinalities, or universal cross-kind connectivity.

**Consumer value:** tactical modeling of preparation information and
applications that explore, edit, select or make such information available.
Information used as the subject of a recorded activity remains interpretable
in this language rather than being redefined by its use in activity.

**Not decided:** precise domain concepts/identities, valid relationship
types, lifecycle invariants, and rendering or persistence structure.

## MC-02 — Recorded Activity and Results

**Applicability:** interpretations of recorded preparation activity,
recorded results when present, when the reported activity took place,
and which preparation information the activity/result concerns.

**Evidence:** `DS-02`; `REQ-CAP-RECORD-ACTIVITY`,
`REQ-CAP-RELATE-ACTIVITY`, `REQ-CAP-PRESERVE-TIME`,
and `REQ-CAP-EXPLORE-HISTORY`.

**Language boundary:** a recorded occurrence/result describes reported
activity and its reported outcome; it is not the definition of the
underlying preparation material or a conclusion about learner state,
mastery, readiness, competence or possession of a capability. Existing
records must support temporal and subject-context understanding.

**Consumer value:** tactical modeling of recorded activity/results,
applications that accept external activity records, and consumers that
examine those records by time and in relation to the information concerned.

**Editability:** activity/result entries are covered by the accepted
all-kind CRUD and bulk-loading commitments. `MC-02` does not establish
immutable event facts, append-only storage, permanent retention,
snapshots, audit history, or guaranteed intelligibility after their
associated information has been edited or removed.

**Not decided:** recorded-activity identity, time representation,
result structures, the validity of relationships, or historical
consistency and repair rules. These belong to downstream design.

## TR-01 — Cross-context subject interpretation

**Relationship:** an existing record of activity/result in `MC-02`
may concern preparation information whose meaning falls under `MC-01`.
The semantic link permits the user to understand which in-scope
preparation information that record concerns.

**Accepted evidence:** `DS-01`, `DS-02`,
`REQ-CAP-RELATE-ACTIVITY`, and
`REQ-CAP-EXPLORE-RELATIONSHIPS`.

**Minimum semantic translation contract for consumers:**

1. When relating an existing activity/result to an existing in-scope
   preparation-information subject, preserve the distinction between
   the **record of an occurrence/result** and the **information it concerns**.
2. Interpret the preparation-information subject according to `MC-01`
   meaning; a recorded result must not redefine that meaning or infer
   learner proficiency.
3. Preserve available temporal context of existing recorded activity
   when presenting it alongside the related preparation information.
4. Allow joint exploration across the languages without conflating their
   distinct meanings or requiring a third model-language owner.

These points are semantic interpretation needs, **not** an obligation to
make two services communicate, to copy/snapshot the subject, or to
translate every possible cross-kind relationship.

**Boundary on change/removal:** accepted product behavior requires CRUD
for all in-scope information, activity/results, and relationships. It does
not guarantee recovery of the former meaning of deleted or changed
information. Whether and how an existing relationship remains meaningful
after changes or removals, and the associated consistency/error rules,
must be resolved in Tactical Domain Design and appropriate downstream
design. This strategy neither imposes immutable history nor weakens the
currently accepted exploration obligations for information that remains
in scope.

## Product behavior applicability without extra contexts

The contexts describe meanings; they do **not** claim exclusive control
of product-level operations.

| Accepted product behavior | Applicability | Model-language consequence |
| --- | --- | --- |
| `REQ-CAP-INTRODUCE-INFORMATION` | Every modeled kind, including activity/results and links | No separate Create model context |
| `REQ-CAP-READ-INFORMATION`, `REQ-CAP-RETAIN-INFORMATION` | Every modeled kind | No separate Read or Retention context |
| `REQ-CAP-CHANGE-INFORMATION`, `REQ-CAP-REMOVE-INFORMATION` | Every modeled kind | Edits/removals must not be prohibited by context boundaries |
| `REQ-CAP-BULK-LOAD-INFORMATION` | Every modeled kind from external information | No Import model context mandated |
| `REQ-CAP-EXPLORE-PERSPECTIVES`, `REQ-CAP-EXPLORE-INFORMATION`, `REQ-CAP-EXPLORE-RELATIONSHIPS` | In-scope preparation information and existing links | No presentation-specific model context |
| `REQ-CAP-RECORD-ACTIVITY`, `REQ-CAP-PRESERVE-TIME`, `REQ-CAP-EXPLORE-HISTORY` | Recorded occurrences/results | Temporal meaning belongs to recorded-activity language |
| `REQ-CAP-RELATE-ACTIVITY` | Existing activity records and subjects they concern | Use `TR-01` when context-crossing interpretation is necessary |
| `REQ-CAP-SELECT-PART`, `REQ-CAP-TRANSFER-SELECTION` | In-scope available information and material | No independent External-Use model context |

These requirements remain binding regardless of whether a behavior touches
one or more semantic contexts. Operational coordination belongs downstream.

## Unsupported splits and retired proposals

The four never-admitted `RETIRED` requirements do not supply a basis for
model-context boundaries:

- `REQ-CAP-KNOWLEDGE-KINDS` — no required subtypes of Knowledge.
- `REQ-CAP-RELATIONSHIP-MEANINGS` — no mandatory taxonomy of meanings.
- `REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS` — no universal cross-kind
  relationship topology.
- `REQ-CAP-PRESERVE-HISTORY-CONTEXT` — no guarantee of historical
  interpretation following changes or deletions.

The fact that these proposals are not currently accepted does not forbid
a future supported decision or a valid downstream domain model.

No independently modeled contexts are currently justified for inferred
learner state, mastery assessments, information provenance/verification,
separate Goal, Capability, Knowledge or Practice Material languages,
source/import machinery, a particular visualization, or an external study
runtime.

## Consumers and authority handoff

- **Tactical Domain Design:** independently assess concepts, identity,
  links, invariants and consistency within the accepted applicability
  boundaries. In particular, resolve edit/delete versus continued
  temporal/subject understanding without inventing an immutable-history
  commitment.
- **Application Design:** coordinate manual CRUD, externally supplied
  bulk loading, selection, outside use, activity intake and exploration,
  including interpretation across `TR-01` where necessary.
- **Interface Design:** let users understand the same in-scope information
  and existing activity/results without choosing context boundaries
  according to screen or visualization layouts.
- **Data and System Architecture:** decide storage and deployment,
  without equating either model context with a database, service or
  distributed integration protocol.

The CORE classification of the two strategic responsibilities remains
owned by Domain Strategy. The exact model concepts and operational
policies are not decided here.

## Reopening conditions

Re-evaluate this choice if:

- a single language demonstrably provides equal consumer clarity with
  fewer independently governed semantic boundaries;
- current preparation information and recorded activity acquire
  incompatible concepts or independently evolving consumers requiring
  a different split;
- new accepted Product Requirements require relationship-meaning
  classifications, subtype taxonomies or additional interpretation rules;
- later decisions about edit/delete and historical meaning reveal an
  unresolved product choice that must be routed upstream; or
- new accepted capabilities create another independently modeled
  semantic language that cannot remain coherent in these contexts.
