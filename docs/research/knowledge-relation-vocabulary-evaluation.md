# Knowledge relation vocabulary evaluation

## Scope

Evaluate the relation semantics previously defined in `lehater/knowledge-graph` as candidates for Prep's canonical KnowledgeRelation vocabulary.

This is research evidence. Canonical Prep semantics remain in `docs/domain/knowledge-model.md`.

## Source state

Knowledge Graph V2 no longer requires typed relations for ordinary Concept Cards. Its active architecture makes explanatory wikilinks plus surrounding prose primary and explicitly treats machine-readable typed relations as an external-consumer/export concern when required.

The pre-V2 Knowledge Graph nevertheless contains a separately researched typed-relation contract. Immediately before the V2 migration, its executable registry admitted:

- `uses`
- `specializes`
- `part_of`
- `depends_on`
- `realizes`
- `produces`
- `derives_from`
- `enables`

The historical relation-policy contract defined direction and admissibility boundaries for all eight. D007 records the evidence-based admission of the first seven (including the existing `uses`), and D012 subsequently admitted the narrow `enables` meaning.

## Decision for Prep

Prep needs typed, directional KnowledgeRelation semantics for filtering, inspection, authoring and machine interfaces. That is exactly the external-consumer boundary allowed by Knowledge Graph V2; adopting typed edges in Prep does not require changing Knowledge Graph V2 persistence.

Prep therefore admits the full eight-type evaluated Knowledge Graph vocabulary. Prep also retains its independently established `addresses` relation for the explicit solution -> problem role.

Canonical Prep vocabulary after this change:

`addresses | uses | specializes | part_of | depends_on | realizes | produces | derives_from | enables`

## Why each imported type is admitted

| type | reason |
|---|---|
| `uses` | separates functional employment from hard prerequisite |
| `specializes` | preserves specific-kind -> general-kind semantics without confusing implementation with taxonomy |
| `part_of` | represents constituent composition/membership |
| `depends_on` | represents explicit necessity/prerequisite and is distinguishable from `uses` |
| `realizes` | already canonical in Prep; matches concrete realization -> abstraction |
| `produces` | distinguishes output creation from use and derivation |
| `derives_from` | preserves lineage/semantic derivation without implying production or dependency |
| `enables` | represents narrow enabler -> achievable capability/state semantics without claiming universal necessity |

All are directional. No transitivity is inferred merely from type unless a future canonical rule explicitly says otherwise.

## Candidates not admitted

The historical Knowledge Graph evaluation also considered meanings including `verifies`, `consumes`, `supersedes`, `instance_of`, `monitors`, `alternative_to` and other domain-specific candidates.

They are not added now because the Knowledge Graph evidence explicitly found one or more of:

- insufficient representative positive evidence;
- ambiguous boundary against an admitted neighbor;
- missing endpoint evidence;
- only a single observation;
- no evidence at all for the candidate;
- conflict/substitutability ambiguity for `alternative_to`.

This is a positive reason not to admit them under Prep's controlled-vocabulary rule, not an arbitrary omission.

Two previously drafted Prep-local relations, `constrains` and `precedes`, are also deferred because they were not part of the independently evaluated Knowledge Graph admission set used for this change. They remain candidates for a separate evidence-backed admission.

## Import rule

Knowledge Graph V2 wikilinks are not mechanically converted into typed edges.

A Prep importer/projection may emit an accepted typed relation only when the card's explanatory prose supports both:

1. the accepted semantic meaning; and
2. the accepted direction.

If classification would add a material assertion, no typed relation is emitted. A generic `related_to` fallback is not introduced.

## Evidence inspected

Current Knowledge Graph:

- `project/ARCHITECTURE-V2.md`
- `specs/node.md`
- `.agents/skills/production-builder/references/exception-cases.md`
- `project/MIGRATION-V2.md`
- `project/evidence/project-internal-node-cleanup.md`

Historical pre-V2 state at parent commit `3cb93d54f84ea67132dd589d0616ed0968c4a601`:

- `agent/runtime/relation-registry.json`
- `specs/relation-policy.md`
- `specs/relations.md`
- `project/decisions/D002-typed-standardized-relations.md`
- `project/decisions/D007-stable-relation-vocabulary-batch.md`
- `project/evidence/TASK-030-relation-evaluation-corpus.md`
- `project/evidence/TASK-030-relation-evaluation.md`

