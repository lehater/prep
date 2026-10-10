# Prep canonical engineering knowledge

The current engineering meaning of Prep is defined only by the artifacts registered in `.harness/core.yaml` and their dependency topology in `.harness/engineering-graph.yaml`.

This file is an index, not a semantic authority.

## Read order

1. `AGENTS.md` (run `python .harness/harnessw.py sync`, route the task, read instruction contracts)
2. `.harness/engineering-graph.yaml` for declared Authority and Capability dependencies
3. `.harness/core.yaml` for canonical artifacts and Questions
4. `.harness/project-publication.yaml` for published Core, accepted semantics and lifecycle evidence
5. the smallest set of **currently accepted** Core artifacts required by the task

Do not infer current product, domain, interface or architecture semantics from Git history, old branches, experiments, commit messages or removed documentation.

## Canonical rule

Every project-owned engineering-knowledge file under `docs/`, except this index and explicitly classified noncanonical material, must be registered as an artifact in `.harness/core.yaml`.

If durable engineering meaning is needed, either:
- add or update the appropriate Harness capability and canonical artifact; or
- keep the information out of `docs/`.

Explicitly noncanonical material may include research, human-readable projections, and program-control references whose authority lives outside Prep. Such files must be allow-listed by the repository documentation validator and must not duplicate or override canonical Prep engineering meaning.

Unresolved semantic decisions belong in the `questions` section of `.harness/core.yaml`.

## Current dependency topology

The normative dependency graph is machine-readable in:

- `.harness/engineering-graph.yaml`
- `.harness/core.yaml`
- `.harness/project-publication.yaml`

Harness controls ownership, dependencies, currentness and closure. Canonical project artifacts supply the Prep-specific meaning.

## Currentness and legacy material

The checked-in `.harness/semantic-baseline.yaml` is a **legacy review record**,
not the current Harness semantic acceptance or lifecycle authority. The
authoritative acceptance/currentness state is in the published Harness
publication, resolved against the Engineering Graph, Core and the pinned
Harness acceptance policies.

Other repository documents, including older human projections and
unregistered engineering documents under `docs/`, may describe earlier
product and domain assumptions. Some are currently rejected by
`python tools/validate_docs.py` as unclassified. Do **not** use those
documents to replace, extend or reinterpret the accepted MVP requirements.

Do not silence inventory errors with blanket allowlists or declare
previously unaccepted documents current. Reconcile each affected
artifact under its owning Authority, through the routed Harness
procedure and explicit acceptance evidence, or move genuinely
noncanonical material out of `docs/` under appropriate repository
policy. Material with live canonical meaning must remain registered
in Core.
