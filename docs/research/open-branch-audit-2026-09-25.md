# Open branch audit — 2026-09-25

## Purpose

Audit all non-main branches after the top-level Harness-guided revalidation and preserve only evidence that remains useful without carrying obsolete solution assumptions back into the canonical chain.

## Disposition

| Branch | State relative to audited main | Disposition | Preserved value |
| --- | --- | --- | --- |
| `bootstrap/harness` | 9 commits ahead / 19 behind; pre-current Harness bootstrap and graph/Anki-era product framing | obsolete; safe to retire | none; current Harness realization and product framing supersede it |
| `implementation/platform-skeleton` | 0 ahead / 1 behind | already fully subsumed | none |
| `research/problem-space-revalidation` | 17 ahead / 1 behind; predecessor of the accepted revalidation | superseded by current Problem Space/Product Requirements/Context work | no separate carry-forward; accepted findings are already represented in current canonical/research artifacts |
| `taxonomy/question-types` | 7 ahead / 18 behind; old learning-task/question taxonomy work | domain assumptions are not canonical under the current model; research evidence remains useful | `docs/research/question-taxonomy.md` was already present in main |
| `topic/python-async-programming-blueprint` | 2 ahead / 4 behind; subject-specific candidate blueprint | not current canonical design, but useful future subject-model stress-test evidence | preserved as `docs/research/python-async-programming-topic-blueprint.md` |
| `design/task-centered-ux` | 195 ahead / 1 behind; large graph/3D-centered UX experiment line | implementation/design conclusions are stale solution hypotheses after Problem Space revalidation | preserved the representation evidence review and experiment design; prototype implementation and accepted UX/ADR claims are intentionally not canonicalized |

## Carry-forward decisions

The following evidence is retained because it can inform future work without asserting the old solution as product truth:

- `docs/research/graph-representation-evidence-review.md` — external evidence about graph, non-graph, 2D and 3D representations.
- `docs/research/knowledge-representation-experiment.md` — experiment design and capability observations; explicitly not product-superiority evidence.
- `docs/research/question-taxonomy.md` — already in main; useful input when Learning Design/question semantics are revalidated.
- `docs/research/python-async-programming-topic-blueprint.md` — useful subject-specific stress-test material for the emerging Knowledge Model.

## Explicitly not carried forward

The old 3D/graph prototype, graph-centered UX specifications, old implementation contracts, and old ADR claims are not imported into main. They were built against a solution hypothesis that the current revalidation deliberately removed as a premise. If similar implementation is needed later, it must be justified from the current Knowledge Model, Learning Design and validated UX needs.

The old bootstrap/process/domain files are likewise not imported because the current Harness realization and current canonical artifacts supersede them.

## Retirement criterion

After this audit is merged, each audited branch contains no unique knowledge that must remain authoritative. The branch refs may be deleted. Git history is not a source of current project truth.
