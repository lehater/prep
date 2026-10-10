# Tactical preparation model: proposed decisions for Authority approval

> NONCANONICAL / PARTIALLY USER-APPROVED / NOT HARNESS ACCEPTED.
> This review responds to the three unresolved Core Questions published in
> PR #101. It is NOT a domain-model/v1 artifact, a Harness Decision Governance
> verdict, an Authority decision or a delegation policy. It must never be
> counted toward CURRENT. No Core or Publication change is authorized by
> this file.

## Evidence and decision ownership

- Accepted requirements: `.harness/knowledge/product-capabilities.yaml`,
  `PREP-MVP-PRODUCT-CAPABILITIES-1`, with 15 ACCEPTED and four RETIRED.
- Accepted strategy: `docs/architecture/context-map.md`,
  `PREP-MVP-DOMAIN-STRATEGY-1`, DS-01 / DS-02.
- Explored alternatives: `.harness/candidates/preparation-information-model-exploration.yaml`
  and accepted option-formation evaluation. These are **pre-choice** records.
- Domain Model Decision Governance
  (`lehater/harness@8a52bb841658a5257c55837634690ef5ab90f4d6`)
  requires MAXIMUM delegation for identity, invariants, lifecycle and
  responsibility boundaries, and BROAD for relationships. The active
  decision policy is CONSERVATIVE. Neither successful exploration nor a
  user instruction to perform *work* authorizes material semantic choices.

The proposals below are a *reviewable coherent package* chosen as a
least-commitment hypothesis. Some remain contingent on user/Authority
judgment and a new strict Decision Governance evaluation.

## User decision recorded — semantic identity (separate approval)

**USER APPROVED: IDENTITY = INSTANCE (2026-10-10).** Each preparation
information instance has an independent identity, including two records
with identical text or externally supplied contents. Ordinary content
edits preserve the same instance identity. Equal content is not a
mandated merge, duplicate check, or semantic equality test. This
**identity-of-information** approval alone did not decide explicit
merge operations, automatic import matching, relationship identity,
validity, directionality, multiplicity, admissibility, lifecycle or removal.
Relationship identity was approved separately later, as recorded below.

The decision is recorded as user authority input, **not** a Harness
semantic acceptance, lifecycle assertion, or a resolved Core Question.
`Q-PREP-PREPARATION-IDENTITY-STRUCTURE` remains formally unresolved
in the published Core until the routed decision-governance,
canonical candidate and semantic-admission procedure integrates both
approved choices. Keep `CONSERVATIVE` autonomy, five upstream CURRENT
and the BLOCKED publication unchanged.

## User decision recorded — concept structure (separate approval)

**USER APPROVED: STRUCTURE = DISTINCT-CONCEPTS (2026-10-10).**
Preparation Knowledge, Goal, CapabilityDescription and PracticeMaterial
are distinguishable domain concepts with their own instances and meanings,
not four mutable roles of one universal information item. This approval
was made **separately** from the previous approval
`IDENTITY = INSTANCE`; together they mean instances are independently
identified *within their applicable concept*. A knowledge concept must
not imply a mandatory taxonomy of knowledge kinds; a capability description
is not proof of learner mastery; practice material is not a recorded
performance/result.

This **STRUCTURE** approval alone did not decide relationship identity,
admissibility, direction or multiplicity; removal/endpoint integrity,
recorded activity semantics, merge, restoration or technical entities.
Relationship identity was approved later as an independent decision,
recorded below.
This choice does not imply one database table, service, screen, API
or separately governed model language.

This is user Authority input for the subsequent governed candidate,
**not** a new acceptance or automatic Core Question resolution. The
question's two substantive alternatives now have user choices, while
the three existing published Questions remain unresolved until a
proper revision-bound Harness transition.

## Q-PREP-PREPARATION-IDENTITY-STRUCTURE

**Approved IDENTITY: INSTANCE.** An item has an independent identity
through description edits. Two items with the same text may remain
different because they serve different user contexts. Bulk loading does
not silently collapse equal descriptions. Import matching, explicit
merge, synchronization and deduplication are not required product
operations and must not be invented here.

**Approved STRUCTURE: DISTINCT-CONCEPTS, but no internal Knowledge
taxonomy.** Knowledge, Goal, CapabilityDescription and PracticeMaterial
are distinguishable semantic responsibilities, already named as
preparation information by accepted scope. A capability *description*
must not assert learner competence. A practice *material* is not a
record of performing that practice. Real-world subjects may overlap,
but semantic identities are not automatically merged. This represents
categories already mentioned in Product Intent, **not** an additional
user-visible subtype classification within Knowledge.

**Counterfactual:** if one task is both a learning goal and an
exercise, the model may represent two distinct responsibilities rather
than forcing one category to change identity. A role-based alternative
might reduce duplication, but risks making read/edit/delete validity
depend on mutable role classification.

**Approved scope:** the four distinguishable preparation concepts are
independently identified instances, rather than interchangeable roles
of one universal item. Overlapping real-world meaning does not force
identity collapse. Mapping/relations among these instances, link
validity, taxonomy *within* Knowledge and any explicit merging are
separate questions, not approved here.

## User decision recorded — relationship identity (separate approval)

**USER APPROVED: RELATION-IDENTITY = INSTANCE (2026-10-10).**
Every admitted relationship is an independently identifiable, editable
instance. Its identity is not computed from the endpoint pair and relation
meaning; changing its description or other permitted contents does not
automatically create a new relation instance. This applies only to
**relationship kinds subsequently admitted by the Tactical Domain Model**,
without requiring any particular relationship kind to exist.

This approval is separate from **IDENTITY = INSTANCE** (preparation
information) and **STRUCTURE = DISTINCT-CONCEPTS** (independent Knowledge,
Goal, CapabilityDescription and PracticeMaterial concepts). It makes
no choice about **MULTIPLICITY** (whether equal endpoint/meaning relation
instances may coexist), **DIRECTION** (ordered vs symmetric),
**ADMISSIBILITY** (valid relationship meanings and endpoint combinations),
self-links, deletion/endpoint integrity, or history. In particular,
independent identity does *not* imply parallel relationships are allowed.

Treat this approval as user Authority decision evidence only. It is not
permission to alter the conservative autonomy policy or issue semantic
acceptance. The published `Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS`
remains unresolved until **all its material choices** have been
decided and the routed Harness transition has been validated.

## Multiplicity review corrected — meaning before storage (2026-10-10)

**ANALYSIS ONLY — NO USER CHOICE OR HARNESS ACCEPTANCE.** The initial
recommendation `MULTIPLICITY = PARALLEL` relied excessively on operational
freedom, independent instance identity and import convenience. These are
secondary engineering effects, not evidence of *two meaningful domain
relationships*. The multiplicity choice is **OPEN / NOT USER-APPROVED**;
neither PARALLEL, UNIQUE nor a per-meaning rule has been selected.

Semantic-first protocol for each prospective relationship use:

1. State a concrete user question answered by the relation in the
   language of Knowledge, Goal, CapabilityDescription and PracticeMaterial.
2. Specify its intended meaning, valid endpoint roles, context/conditions
   and whether the asserted fact persists independently of recorded
   activity/results.
3. Construct two records with the same endpoints and stated meaning.
   Ask what additional *domain truth* the second asserts, excluding merely
   a new ID, duplicated import, separate source, justification, timestamp
   of entry or UI line.
4. If it is the same truth with two supporting sources/reasons, review
   separate source/evidence/justification semantics rather than
   automatically requiring two domain links. Such a source/evidence
   capability is **not** currently accepted or implied.
5. If two relations genuinely differ, identify the discriminating
   semantic condition: meaning, context, independent occurrence or
   qualification. If that difference belongs to a distinct relation type,
   context-qualified fact, or DS-02 recorded activity, model it in its
   proper owner rather than calling identical links parallel.
6. Only after validating the relationship uses, determine which
   multiplicity invariant, if any, is justified per kind; then derive
   mutation collisions, bulk import behavior, provenance and graph
   presentation. Do not choose uniqueness/deduplication rules from
   tooling convenience.

### Nonbinding semantic examples

| Hypothetical claim for the same Knowledge K and Goal G | Classification to investigate |
| --- | --- |
| K is needed to achieve G, asserted twice with no material difference | One proposition with duplicate entry; a second link adds no new meaning |
| Two references independently support "K is needed for G" | One possible proposition with two sources, not automatically two propositions |
| K is a prerequisite for G, and K is the subject of G | Two *different* relation meanings, not equal-meaning parallel links |
| K is applicable to G under condition C1 vs condition C2 | Two conditional claims if the conditions materially change their meaning; requires an authorized context model |
| An external practice activity uses K for G on two dates | Two recorded occurrences under DS-02, not automatically two DS-01 preparation links |
| Two independent explanations connect K and G in the same general way | Determine whether explanations qualify one fact, two independent uses or separate modeled entities before counting relations |

The phrases "needed for", "prerequisite", "subject of" and "applicable
under conditions" above are **illustrative candidates**, not admitted
relation types. The existing RETIRED product proposals remain RETIRED.
Previously approved `RELATION-IDENTITY = INSTANCE` concerns individual
record identity and does not entail multiplicity, provenance tracking,
unbounded duplicate truth or a graph multiedge requirement.

**Working hypothesis, not a decision:** for a relation interpreted as a
simple binary domain proposition with fixed endpoints, predicate and
material conditions, an identical repetition ordinarily adds no new
proposition. If valid distinct occurrences/claims exist, the difference
must first be specified as domain semantics. `UNIQUE` also cannot be
asserted globally before deciding relation meaning and admissibility.

**Next decision stage:** determine concrete admissible relationship
meanings and endpoint scope before returning to DIRECTION and
MULTIPLICITY. This preserves `Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS`
as unresolved; no policy/autonomy increase or Core/Publication change.

## Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS

**Approved RELATION-IDENTITY: INSTANCE.** Explicit relation instances
can be individually created, read, edited, removed and bulk loaded,
consistent with accepted all-kind CRUD. A pair/meaning compound
identity risks accidental replacement when links are edited.

**MULTIPLICITY: UNDECIDED.** The prior PARALLEL recommendation is
withdrawn as insufficiently domain-grounded. Equal endpoint/meaning
links must be tested for genuinely distinct domain assertions before
selecting PARALLEL, UNIQUE or a relationship-specific constraint. The
approved instance identity does not settle this question. Bulk-load
conflict/deduplication policies remain downstream decisions informed
by accepted semantics, not grounds for inventing them.

**Suggested DIRECTION: MEANING-SPECIFIC.** Endpoint roles and whether
reversal changes meaning must be defined by an *admitted relation use*.
Never assume that all relations are symmetric, transitive, causal,
partitive or ordered merely because they can be drawn as graph edges.
This is an explicit per-kind decision boundary, not a global rule
establishing a predicate taxonomy.

**ADMISSIBILITY — meaningful open choice.** The previously explored
alternatives are:
- `NAMED-USES`: only specifically justified relationship uses and
  valid endpoint roles are admitted; requires a concrete initial set,
  not the historical predicate catalogue.
- `DESCRIBED-CONNECTION`: allow the user to state the reason for a
  connection at the instance level; requires explicit rules about
  valid endpoint categories, self-links and interpretation. Without
  those rules it risks silently restoring the retired arbitrary
  cross-kind topology requirement.

**Recommendation:** avoid the old mandatory classification catalogue.
Prefer narrowly justified relation uses as they become supported by
accepted preparation semantics, and include a minimal first set only
when its endpoint scope and user purpose are genuinely evidenced.
Do **not** infer all cross-kind combinations or a universal `related-to`
relation from the simple requirement to explore *existing* relations.

**Remaining product/Authority decision:** specify admissible relationship
uses and endpoint combinations for the first model, or explicitly
delegate such choices. There is no accepted list in current Product
Capabilities or Domain Strategy; pretending there is one would
undermine the previous RETIRED decisions.

## Q-PREP-PREPARATION-REMOVAL-INTEGRITY

**Suggested REMOVAL: WORKING-SET.** User removal ends the item's
presence in the working set. Restoration of that same domain identity,
tombstones and soft-delete controls are not mandatory product
operations. A later manually created/imported similar item is not
automatically the old instance.

**Suggested INTEGRITY: LIVE-ENDPOINTS for ordinary preparation
relationships.** An *existing preparation-information relation*
cannot point to an item absent from the current working set. Removing
a linked preparation item must remain possible and should reconcile
the affected preparation relations, not reject the required removal.
The proposed least-commitment choice is to remove those relations
alongside the item rather than require persistent placeholders.

**Important boundary:** this proposal applies to *preparation
relationships*, not recorded activity/result history. No cascade of
recorded activity/results follows from removing preparation
information. Subject links in recorded activity, missing-subject
presentation, editability, and time/subject context belong to
`prep.recorded-activity-history-model`, and an unresolved product
tradeoff must go back to Product Requirements. This does **not**
promise that old subject meaning survives editing/deletion.

**Counterfactual:** explicit unavailable endpoints would preserve a
visible relation record after one end is removed, but entail a new
meaning for an incomplete relation and possibly user-visible status.
They may be useful later, but are not required by the accepted CRUD
or historical scope.

## Constraints for any approved decision package

1. All modeled entity and relationship kinds, including recorded
   activity/results later, remain subject to manual create/read/edit/
   remove and externally supplied bulk loading. Do not restrict
   deletion as a shortcut to referential integrity.
2. No learner-state, mastery, readiness or target-relative assessment
   is inferred from information or a recorded result.
3. Do not revive `REQ-CAP-KNOWLEDGE-KINDS`,
   `REQ-CAP-RELATIONSHIP-MEANINGS`,
   `REQ-CAP-CROSS-INFORMATION-RELATIONSHIPS`, or
   `REQ-CAP-PRESERVE-HISTORY-CONTEXT` as product requirements.
4. Separate DS-01 and DS-02 responsibilities are not independently
   accepted semantic languages, databases, aggregates or services.
5. Do not import old `docs/domain/*` material as admission evidence.
6. The application and interface layers remain free to select formats,
   screens, renderers, bulk-load protocols and storage after their
   own acceptance.
7. A decision package is valid only after routed Authority approval or
   sufficient explicitly authorized delegation, the proper governance
   classification (DETERMINED/DELEGATED), new canonical
   `domain-model/v1` candidate, strict semantic admission and CAS
   publication. The previously BLOCKED evidence remains historical.

## Decision needed to proceed

Two legitimate routes remain:

- **Approve specific material decisions** (with any changes to the
  recommendations above), including the concrete admissible relation
  meanings and endpoint scope. Record the Authority decision and
  run normal Governance; **or**
- **Delegate domain-model decisions at the necessary axis levels**
  (MAXIMUM for identity/invariants/lifecycle/responsibility and BROAD
  for relationships) with explicit limits preserving all accepted
  Product Requirements and retired dispositions. Then re-run Harness
  governance; do not silently change the conservative policy.

Until then PR #101 correctly remains BLOCKED and draft. The five
upstream CURRENT providers remain untouched.
