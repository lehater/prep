# Tactical preparation model: proposed decisions for Authority approval

> NONCANONICAL / NOT SELECTED / NOT ACCEPTED.
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

## User decision recorded — semantic identity only

**USER APPROVED: IDENTITY = INSTANCE (2026-10-10).** Each preparation
information instance has an independent identity, including two records
with identical text or externally supplied contents. Ordinary content
edits preserve the same instance identity. Equal content is not a
mandated merge, duplicate check, or semantic equality test. This
approval **does not** decide explicit merge operations, automatic import
matching, concept STRUCTURE, relationship identity, validity,
directionality, multiplicity, admissibility, lifecycle, or removal.

The decision is recorded as user authority input, **not** a Harness
semantic acceptance, lifecycle assertion, or a resolved Core Question.
`Q-PREP-PREPARATION-IDENTITY-STRUCTURE` remains unresolved because its
STRUCTURE portion has not been approved. Keep `CONSERVATIVE` autonomy,
five upstream CURRENT and the BLOCKED publication unchanged.

## Q-PREP-PREPARATION-IDENTITY-STRUCTURE

**Approved IDENTITY: INSTANCE.** An item has an independent identity
through description edits. Two items with the same text may remain
different because they serve different user contexts. Bulk loading does
not silently collapse equal descriptions. Import matching, explicit
merge, synchronization and deduplication are not required product
operations and must not be invented here.

**Suggested STRUCTURE: DISTINCT-CONCEPTS, but no internal Knowledge
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

**Unresolved for Authority:** whether overlapping descriptions should
ever share one instance identity, and whether this categorical
distinction must be separate conceptual identities rather than roles.
An approval must not imply a new global taxonomy or canonicalization
rule.

## Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS

**Suggested RELATION-IDENTITY: INSTANCE.** Explicit relation instances
can be individually created, read, edited, removed and bulk loaded,
consistent with accepted all-kind CRUD. A pair/meaning compound
identity risks accidental replacement when links are edited.

**Suggested MULTIPLICITY: PARALLEL.** Equal endpoints and descriptions
alone do not prove two externally supplied records are the same
instance. A distinct relation may be retained until the user removes
it. No mandatory automatic deduplication.

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
