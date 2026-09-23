# Knowledge Graph Lifecycle and Historical Identity

## Responsibility

Preserve semantic identity, accepted claim history and historical interpretability as graph knowledge changes.

## Semantic identity versus canonical representation

A semantic entity can retain identity while labels, assertions, evidence and classification evolve.

Its stable NodeId identifies the canonical graph representation; it is not the philosophical definition of semantic identity.

## Graph revision

Accepted semantic mutations produce an ordered graph revision history sufficient to identify the graph state used by a curriculum, learning plan or generated learning artifact.

This is a semantic requirement, not a commitment to event sourcing.

## Rename

Rename preserves semantic identity and NodeId. Former names may remain aliases when supported.

## Assertion evolution

KnowledgeAssertions can be added, refined in representation, marked non-current/obsolete, or challenged without silently rewriting what was previously accepted.

Historical claim content/evidence required by existing learning artifacts remains interpretable.

## Relation evolution

A Relation has identity as an accepted typed assertion between endpoints. Its lifecycle/evidence may evolve without changing endpoint identities.

If relation meaning/endpoints materially change, treat that as a different relation rather than silently reusing identity.

## Merge

Merge is allowed only after semantic equivalence is established.

The surviving canonical NodeId becomes authoritative. Historical references to merged IDs remain resolvable through auditable redirects/mappings so learning evidence is not orphaned.

## Retirement

A node, assertion or relation may become non-current without physical erasure.

Retirement:

- preserves historical identity/content/evidence;
- prevents silent ID reuse;
- may name a replacement/successor only when separately supported;
- does not imply the historical referent/claim never existed.

## Obsolescence and conflict

Keep distinct:

```text
obsolete   -> was supported in an earlier context, no longer current/applicable
conflict   -> incompatible supported claims in materially equivalent context
error      -> claim is asserted to have been wrong in its original context
successor  -> distinct identity that replaces another for some use
```

Newer evidence alone proves none of these.

## Historical consumers

Learning plans, generated exercises and learner evidence may refer to older graph revisions. They remain explainable after current graph changes.

Current views may resolve redirects/replacements, while historical records retain original subject/revision references.
