# Knowledge Graph Admission Policy

## Responsibility

Protect canonical graph quality. Imports, agents and user feedback may propose semantic changes; only the admission process can create, merge or alter accepted KnowledgeNodes, KnowledgeAssertions and Relations.

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

## Responsibilities

### Source/import

Provides material and provenance. It does not decide graph identity.

### Agent/semantic analyzer

May extract candidate entities/assertions/relations, propose aliases/kinds/merges and explain reasoning.

It does not mint accepted NodeIds or bypass admission rules.

### Deterministic validation

Owns structural guarantees: IDs, registry membership, reference integrity, duplicate identifiers, required fields, mutation mechanics and persistence.

### Semantic admission

Accepts only proposals whose referent identity and semantic claims are sufficiently established. Ambiguity becomes review work rather than guessed truth.

The ordinary learner can report an issue or submit material but cannot directly mutate canonical graph truth.

## Node admission invariants

An accepted canonical node must have:

- a system-owned stable NodeId;
- one sufficiently identified semantic referent;
- canonical label plus aliases where useful;
- an admitted `kind`;
- provenance supporting the identity/classification decision;
- no unresolved candidate plausibly representing the same semantic identity.

Identity rules:

- an existing NodeId resolves the canonical representation when the reference is valid;
- identical names do not prove semantic identity;
- embedding/fuzzy/name similarity creates merge candidates only;
- aliases are not independent nodes unless they denote genuinely different referents;
- materially different meanings with the same word remain distinct;
- merge requires semantic equivalence, preserves the survivor and records redirect/provenance.

## Assertion admission invariants

An accepted `KnowledgeAssertion` must:

- belong to one accepted node;
- express one independently reviewable semantic claim rather than an uncontrolled document blob;
- preserve applicability/context needed to interpret the claim;
- retain supporting EvidenceRefs;
- avoid silently replacing an incompatible accepted assertion.

Equivalent assertions are deduplicated/merged at the assertion boundary. Compatible assertions may coexist. Explicit contradiction or insufficient context goes to review.

## Relation admission invariants

An accepted relation must have:

- accepted source and target nodes;
- a registered relation type;
- direction consistent with that type's semantics;
- supporting evidence/context;
- no duplicate equivalent edge under registry symmetry rules.

“These concepts seem related” is insufficient.

## Conflict handling

Conflicting sources/proposals are not collapsed into the answer with the highest model confidence.

```text
candidate conflict
  -> preserve evidence/context
  -> semantic review
  -> accept compatible scoped assertions,
     reject unsupported claim,
     or preserve explicit unresolved conflict
```

Canonical accepted truth changes only through explicit GraphDelta.

## Registry discipline

Unknown node kinds or relation types do not trigger automatic schema extension. Registry extension is a separate semantic decision.

## Mutation vocabulary

Canonical changes are expressed as explicit graph deltas such as:

```text
AddNode
UpdateNodeMetadata
AddAlias
AddAssertion
UpdateAssertionStatus
AddRelation
RemoveRelation
MergeNodes
RetireNode
ReclassifyNode
```

This is a semantic mutation vocabulary, not an API design.

Destructive operations preserve auditability; retirement/merge is preferred over silent identity reuse.

## Automation versus review

The admission pipeline may auto-accept proposals only when the accepted policy can establish the required semantic result without unresolved ambiguity/conflict.

Anything requiring a guess about identity, relation meaning, conflicting claims or registry extension routes to a curation/review surface. This review surface is administrative semantic control, not direct graph editing by the learner.

## Safety preference

When evidence is insufficient, prefer missing knowledge over a confidently wrong canonical assertion. Downstream curricula, generated learning material and analytics depend on graph trustworthiness.
