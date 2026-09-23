# Knowledge Graph Lifecycle and Historical Identity

## Responsibility

Preserve semantic identity and historical interpretability as graph knowledge changes.

## Identity versus revision

A node's canonical ID represents semantic continuity. Metadata/content revisions do not create a new identity merely because wording, evidence or classification changed.

A relation likewise has its own identity as an accepted semantic assertion between endpoints and may evolve in status/evidence without changing its endpoint identities.

## Graph revision

Accepted semantic mutations produce an ordered graph revision history sufficient to identify the graph state used by a curriculum, learning plan or generated learning artifact.

This is a semantic requirement, not a commitment to event sourcing or a particular persistence mechanism.

## Rename

Rename preserves node identity. Former names may remain aliases when supported.

## Merge

Merge is allowed only after semantic equivalence is established.

The surviving canonical ID becomes authoritative, while historical references to merged IDs must remain resolvable through an auditable redirect/mapping. Existing learning evidence must not become orphaned.

## Retirement

A node/relation may become non-current without being physically erased.

Retirement:

- preserves historical identity and evidence;
- prevents silent ID reuse;
- may name a replacement/successor only when separately supported;
- does not imply that the referent never existed or was always wrong.

## Obsolescence and conflict

Keep these distinct:

```text
obsolete   -> was supported in an earlier context, no longer current/applicable
conflict   -> incompatible supported claims in materially equivalent context
error      -> claim is asserted to have been wrong in its original context
successor  -> distinct identity that replaces another for some use
```

Newer evidence alone does not prove obsolescence or supersession.

## Historical consumers

Learning plans, generated exercises and learner evidence may refer to older graph states. They must remain explainable even after the current graph changes.

Current views may resolve redirects/replacements, but historical records keep the original subject/revision references needed for auditability.
