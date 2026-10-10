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

## User decision recorded — D1 relation admissibility strategy (separate approval)

**USER APPROVED: D1 = SELECTIVE-ADMISSIBILITY (2026-10-11).**
Initial Prep relationship kinds are **selected individually on justified
domain meaning and explicit endpoint roles**. Start with a small, coherent
set of kinds, extendable through further owner-approved decisions. Do not
admit arbitrary generic links by default and do not build a comprehensive
taxonomy in advance. The user approved the *strategy of determining
admissibility*, **not** a set of admissible relation kinds, fixed cardinalities,
directionality or lifecycle semantics.

This D1 approval is **separate from the three prior owner decisions**:
`IDENTITY = INSTANCE`, `STRUCTURE = DISTINCT-CONCEPTS`, and
`RELATION-IDENTITY = INSTANCE`. It does not select whether
`Goal requires CapabilityDescription`, `Goal targets
CapabilityDescription`, `PracticeMaterial is intended to practice
CapabilityDescription`, or any other particular proposed relation is in
the MVP. Nor does it approve `MULTIPLICITY`, `DIRECTION`,
`REMOVAL / INTEGRITY`, self-links or import conflict policy.

**Evidence status:** explicit user Authority approval, held as
noncanonical decision input pending a routed Harness decision-governance,
semantic admission and CAS publication. The live Core Question
`Q-PREP-PREPARATION-RELATIONSHIP-SEMANTICS` remains **unresolved**
because the actual admissible meanings and remaining relationship
decisions are still open. `CONSERVATIVE` autonomy remains unchanged.
The five upstream CURRENT acceptances, Graph and Publication remain
unchanged. No new Tactical acceptance identity was issued.

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

## Semantic-first inventory of candidate relation meanings (2026-10-10)

**RESEARCH / NOT SELECTED / NOT AN ADMITTED RELATION CATALOGUE.**
This extends the existing Decision Explorer's relationship axis without
selecting `ADMISSIBILITY`, `DIRECTION` or `MULTIPLICITY`. The purpose is to
test semantic necessity *before* choosing topology or import mechanics.

### Grounded user problem, not a predefined schema

Accepted `PROBLEM-EVIDENCE` distinguishes a Capability as something a
person needs to be able to do to achieve a Goal; Knowledge is information
about a subject; PracticeMaterial may be used for study/practice/review.
`USER-NEEDS` requires intelligible relationships, perspective changes
and selecting material for external activity. `PRODUCT-CAPABILITIES`
requires exploration and all-kind CRUD/bulk but expressly does not
admit a fixed relation taxonomy, arbitrary cross-kind connections,
provenance obligations or learner-mastery inference.

No observed-task evidence establishes which relation predicates,
endpoint combinations or cardinalities the user needs. The table is
thus a **candidate semantic hypothesis map**, not an accepted topology.

| Candidate fact between separately identified concepts | User question it could answer | Semantic status / critical counterexample |
| --- | --- | --- |
| Goal G **requires CapabilityDescription C** | What must one be able to do to meet this goal? | Closest to accepted problem-space definition of Capability; still no automatically mandatory G-C link or universal sufficiency inference |
| CapabilityDescription C **uses/depends on Knowledge K** | Which stated subject information matters for performing C? | Plausible in a specific example, not true for every capability or automatically a prerequisite relation |
| PracticeMaterial M **is intended to practice Capability C** | What can be selected to work on C externally? | Intent/purpose of material, not evidence that practice actually happened or mastery followed |
| PracticeMaterial M **covers Knowledge K** | What information does the material address? | Plausible subject coverage; does not imply learner knowledge, completeness or information verification |
| Goal G **concerns Knowledge K** | What information is relevant to this goal? | Potentially meaningful, but 'concerns' and 'requires' are different; might be derivable from G-C-K or be independently asserted |
| Goal G **is decomposed into Goal G2** | Which narrower outcomes belong to a broader goal? | Potentially useful but no accepted hierarchy rule, total order or transitivity requirement |
| Knowledge K1 **is prerequisite to Knowledge K2** | Which information should be understood before another? | Potentially subjective and contextual; not every knowledge relation is a learning prerequisite |
| Capability C1 **precedes/requires Capability C2** | Which abilities must be established before another task? | Needs explicit directional sense, task context and validation; avoid learner-state or sequencing inference |
| Goal G **is supported by PracticeMaterial M** | What material might help reach G? | May be a contextual user choice, derivable via C, or a separate intentional use; do not conflate with a claim of effectiveness |

These candidates exemplify relation **meaning**, not technical
schema types. No entry here is an accepted or required relationship kind.
Recorded activity A **concerns** preparation subject S belongs to the
other Tactical Capability (`prep.recorded-activity-history-model`) and
is an accepted *product outcome* whose internal semantics remain
undecided. Two external practice attempts are two DS-02 occurrences,
not necessarily two DS-01 relation instances.

### One coherent worked example (all links hypothetical)

- Goal: solve composite-function differentiation problems.
- CapabilityDescription: apply the chain rule.
- Knowledge: explanation of the chain rule.
- PracticeMaterial: exercises on chain-rule differentiation.

Possible distinct meanings:
`Goal --requires--> CapabilityDescription`;
`CapabilityDescription --uses--> Knowledge`;
`PracticeMaterial --intended-to-practice--> CapabilityDescription`;
`PracticeMaterial --covers--> Knowledge`.

A user can ask which capability is relevant to the goal, what subject
knowledge matters, and which material could be selected for external
use. The graph can also be viewed from the material or knowledge side
*without duplicating domain links for an inverse UI view*.

### Meaning check before counting multiple links

For any proposed relationship use, examine:
1. The practical user question answered and a concrete affirmative
   example **and negative counterexample**.
2. The asserted proposition and its truth/validity conditions:
   endpoints, role direction, material context and temporal scope.
   Prep can hold user-provided assertions without certifying their
   truth or their sources.
3. Whether a second equal-looking link adds **distinct subject
   meaning**, or merely a duplicate, second reference, independent
   justification, alternate label, import occurrence or presentation
   path. Do not turn supporting sources or import events into mandatory
   domain entities.
4. What independent user action/edit would make one link valid and the
   other invalid. If no such domain distinction exists, two IDs do
   not establish two separate domain facts.
5. Deletion/editing behavior compatible with accepted all-kind CRUD,
   without inventing immutable history or learner-state conclusions.
6. Only then choose per-meaning admissibility, direction, relation
   multiplicity and finally bulk import collision behavior and view
   grouping.

Independent relation-instance identity has already been **approved**
by the user, but this does not entail parallel identical propositions.

### Relation strategy alternatives for owner evaluation

- **S1: Small, explicit, semantically justified relation uses — D1 STRATEGY APPROVED.**
  Admit a meaning only after a user question and counterexamples
  establish it; define endpoints/direction per meaning. Avoid a global
  exhaustive catalog. Pros: understandable relationships, testable
  meaning and separation of DS-01 vs DS-02. Cons: initial modeling
  decisions are required and meanings may need explicit extension.
  **Research recommendation, not approval.**
- **S2: User-described generic connections.**
  Let each instance carry a user explanation and avoid a fixed
  predicate vocabulary. Pros: can capture open-ended links. Cons:
  meaningful navigation/filtering, validation and consistent import
  interpretation become hard, and arbitrary cross-kind topology
  could silently revive a retired product obligation. Needs explicit
  product/Authority scoping before adoption.
- **S3: Comprehensive ontology/predicate taxonomy now.**
  Predefine a broad menu of knowledge, goal, material and capability
  relations. Pros: predefined labels and constraints. Cons: no
  evidence of necessity, substantial correctness/reversal cost,
  recreates an unaccepted legacy commitment. Not recommended for the
  MVP at this stage.

### Suggested first decision to bring to the user

Evaluate only the candidate `Goal G --requires--> CapabilityDescription C`
as the first **optional asserted** relation meaning. Its semantic basis
is the accepted problem-space definition of capability, and it answers
the user-visible question "What must one be able to do to achieve G?"
Do not automatically require every Goal to have at least one such
relation, treat links as verified truth, infer learner mastery, or
admit other endpoint combinations.

**Unselected question:** should this meaning be included in the
initial model, rejected, or refined to express a different user
meaning? Further candidate kinds are reviewed one by one or as a
coherent proposed group, but no choice is made in this research note.

External educational semantics (e.g. schema.org LearningResource
`teaches`/`assesses`, W3C SKOS concept relations, 1EdTech CASE
competency associations) demonstrate that meanings are context-
specific; they are *analogies only*, not Prep's accepted input or an
authorization to import a taxonomy.

## D2 candidate semantics: PracticeMaterial to CapabilityDescription (research, 2026-10-11)

**OPEN — NO USER APPROVAL for D2, D3, DIRECTION or MULTIPLICITY.**
This is an application of user-approved `D1 = SELECTIVE-ADMISSIBILITY`,
not admission of a new kind.

### Independent meanings that should not be conflated

| Candidate statement about material M and described capability C | Concrete positive scenario | Distinguishing counterexample / limitation |
| --- | --- | --- |
| **M is intended for practice of C** | A set of SQL JOIN exercises is expressly intended to practise composing JOIN queries | A descriptive SQL article may support understanding without being intended for hands-on practice |
| **M is intended to teach/develop C** | A step-by-step guided tutorial is intended to help learn composing JOIN queries | An assessment-only quiz may measure performance without teaching it |
| **M is intended to assess C** | A task set is prepared to check ability to compose JOIN queries | A worked example with answers may be intended to teach instead of assess |
| **M concerns the subject of C** | An article describes JOIN syntax | Topical overlap alone does not entail practice, teaching, efficacy, prerequisite or assessment intent |
| **M supports preparation related to C** | A broad reference may be useful while studying JOINs | Too weak and subjective to substitute for any one of the three purpose-specific statements |

Here `PracticeMaterial` includes material usable in study, practice,
review and testing under accepted Discovery; it is *not* restricted
to drill/exercises. Therefore, admitting only "intended for practice"
would not itself express the semantics of other in-scope material.
It can still be a valid **optional first relation**, provided no
claim is made that every material must carry it.

Two purposes can both apply to the same material (e.g., a worked quiz
can be intended for practice **and** checking). If admitted, these
would be distinct predicate meanings, *not* proof that identical
predicate records need to be parallel. Users may disagree about
purpose without Prep verifying effectiveness or source authority.

### Domain tests for "M is intended for practice of C"

1. **Question answered:** "Which available materials were designated
   to practise the ability described by C?"
2. **Assertion made:** a user-represented intended use of M with respect
   to C, *not* that a person used M, improved, demonstrated C or that
   Prep independently endorses the purpose.
3. **Endpoint roles:** PracticeMaterial M and CapabilityDescription C;
   "intended for practice" goes conceptually from material to the
   described capability. Reverse **navigation** requires no reverse
   relation instance.
4. **Optionality:** a resource used only to explain Knowledge may
   have no such relation. A Capability may also have no known
   practice material. The proposed statement makes no existence
   requirement.
5. **Truth/validity:** the purpose may be asserted/edited by the user;
   Prep does not certify instructional efficacy or learner competence.
   Whether intent belongs to a material generally or to a particular
   goal/use/context is **open**; do not silently add a Context entity.
6. **Negative example:** a chemistry reference sheet that discusses
   reactions is not by that fact intended to practise balancing
   chemical equations, although it may be useful in external study.
7. **Multiplicity:** two equal M/C/practice-intent links without
   a material distinction are usually two records of one purpose.
   This is a hypothesis, **not** an approved UNIQUE rule; contextual
   practice purposes may require finer semantics.
8. **CRUD and bulk:** if admitted, full user create/read/edit/delete and
   externally supplied bulk loading apply. Do not equate repeated
   imports with distinct material intentions.
9. **DS-01/DS-02:** purpose of material is preparation information;
   an actual practice occurrence and its result are recorded activity.
   Neither claim supplies a learner-state assessment.
10. **Scope challenge:** "intended for practice" does not identify
    knowledge explained by a material or which goals it serves; those
    are independent semantic choices.

### Options for owner decision D2

- **D2-A — admit only this narrow, optional intended-for-practice
  meaning** as one initial relationship kind between M and C. Other
  material uses remain expressible via material information and future
  independently approved relations, not automatically by this kind.
- **D2-B — defer this relation** until a concrete primary task shows
  that users need to navigate/select materials *by capability*.
  Keeps model smaller but may limit early preparation exploration.
- **D2-C — explore a minimal family of distinct material-purpose
  relations** (practice/teach/assess) before admitting any. May serve
  broader material classes but expands taxonomy and creates more
  decisions; no automatic product approval for the family.
- **D2-D — adopt a broad "supports capability" relation** rather
  than purpose-specific claims. Flexible but too weak for reliable
  interpretation; *not recommended* without a user-meaning test.

**Analytical recommendation, not owner choice:** D2-A is the
most sharply testable optional first candidate. However, D2-B is
appropriate if users do not in fact select or explore materials by
capability, and D2-C may be relevant if the first MVP scenario needs
to distinguish study/practice/assessment resources. Do not select
based solely on a standard library or graph UI.

### Contrast with Goal to CapabilityDescription (D3 still open)

- `Goal G requires C` asserts a **necessary ability for successful
  goal attainment**; it is stronger than "related to" and not
  synonymous with a prerequisite to *starting* preparation.
- `Goal G targets C` asserts that developing/demonstrating C is
  a **desired goal outcome**, not that C is a prerequisite to
  attaining some other outcome.
- A goal "pass SQL exam" may *require* performing JOINs; a goal
  "learn to perform JOINs" primarily *targets* that ability.
  Both predicates might eventually apply to the same G/C pair,
  but each requires an independent meaning and justification.
- No accepted requirement authorizes a mandatory Goal-Capability
  edge, inference of learner proficiency, or an automatic
  `Goal -> Capability -> Knowledge -> Material` chain.

**External analogy, not project authority:** Schema.org `LearningResource`
distinguishes `teaches`, `assesses` and `competencyRequired`
(https://schema.org/LearningResource). 1EdTech CASE similarly models
competency associations rather than asserting all conceivable
connections (https://www.1edtech.org/standards/case/about). These are
comparative examples, not admissible canonical inputs or relation
types selected for Prep.

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
