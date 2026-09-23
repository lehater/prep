# Knowledge Graph Admission Policy

## Responsibility

Protect canonical graph quality. Imports, agents and user feedback may propose semantic changes; only the admission process can create, merge or alter accepted Knowledge Graph nodes and relations.

## Boundary

```text
source/import/user feedback
        |
        v
candidate space
        |
        v
semantic analysis
        |
        v
proposed GraphDelta
        |
        v
admission checks
        |
        +--> accept -> canonical graph
        +--> review
        +--> reject
```

Canonical graph state never contains half-resolved candidate identity.

## Roles

### Source/import

Provides material and provenance. It does not decide graph identity.

### Agent/semantic analyzer

May extract candidate nodes/relations, propose aliases/kinds/merges and explain reasoning.

It does not mint accepted identity or bypass admission rules.

### Deterministic validation

Owns structural guarantees: IDs, registry membership, reference integrity, duplicate identifiers, required fields, mutation mechanics and persistence.

### Semantic admission

Accepts only proposals whose referent identity and relation meaning are sufficiently established. Ambiguity is preserved as review work instead of guessed away.

The ordinary learner can report an issue or submit material but cannot directly mutate canonical nodes/edges.

## Node admission invariants

An accepted node must have:

- one stable canonical ID generated/owned by the system;
- a clearly identifiable semantic referent;
- canonical label plus aliases where useful;
- an admitted `kind`;
- provenance/evidence sufficient to trace the proposal;
- no unresolved candidate that is plausibly the same referent.

Identity rules:

- exact canonical ID is authoritative;
- identical labels do not prove identity;
- embedding/fuzzy/name similarity creates merge candidates only;
- aliases are not independent nodes unless they denote genuinely different referents;
- materially different meanings with the same word remain separate nodes;
- merge preserves the surviving canonical ID and records enough provenance to explain the consolidation.

## Relation admission invariants

An accepted relation must have:

- accepted source and target nodes;
- a registered relation type;
- direction consistent with that type's semantics;
- supporting evidence/context for the asserted relationship;
- no duplicate equivalent edge under the registry's symmetry rules.

A relation must be semantically useful for traversal/filtering/analysis. “These concepts seem related” is insufficient.

## Conflict handling

Conflicting sources/proposals are not silently collapsed into whichever answer has the highest model confidence.

If conflict affects identity or relation truth:

```text
candidate conflict
  -> preserve evidence
  -> needs semantic review
  -> accept/reject/represent distinct referents
```

Canonical accepted truth changes only through an explicit graph delta.

## Registry discipline

Unknown node kinds or relation types do not trigger automatic schema extension.

A proposed registry extension is a separate semantic decision. Until accepted, affected candidates remain staged/reviewable.

## Mutation model

Canonical changes are expressed as explicit graph deltas such as:

```text
AddNode
UpdateNodeMetadata
AddAlias
AddRelation
RemoveRelation
MergeNodes
RetireNode
ReclassifyNode
```

This is a semantic mutation vocabulary, not an API design.

Destructive operations must preserve auditability; retirement/merge is preferred over silent identity reuse.

## Acceptance priority

When evidence is insufficient, prefer a missing node/relation over a confidently wrong canonical assertion. The graph is intended to be trustworthy enough to generate curricula, learning plans and analytics from its topology.
