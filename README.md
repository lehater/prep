# prep

Prep is developed from a Harness-controlled engineering-knowledge model.

The repository does not treat README text, Git history, experiments or old solution documents as product/architecture authority.

## Start here

1. `AGENTS.md`
2. `.harness/core.yaml`
3. `.harness/engineering-graph.yaml`
4. `docs/README.md`
5. only the canonical artifacts required by the relevant capability

`.harness/core.yaml` is the inventory of current Prep engineering knowledge. `.harness/engineering-graph.yaml` defines its ownership and dependency topology.

## Validation

```bash
python tools/bootstrap_harness.py
python tools/semantic_baseline.py
python tools/check_harness_integration.py
python tools/full_harness_revalidate.py
python tools/validate_docs.py
python -m unittest discover -s experiments/anki_adapter_reference/tests -v
```

Implementation, tests and experiments may provide evidence, but they do not redefine canonical engineering meaning unless that meaning is admitted through Harness and persisted in a Core artifact.

## Capability dependency diagrams

Two generated top-down diagrams, grouped by **Authority**, are checked in under
`docs/generated/harness-graphs/` together with their DOT sources.

From a checkout of [Harness](https://github.com/lehater/harness), with
Python 3.10+, PyYAML and Graphviz (`dot`) available:

```bash
python -m harness.workspace.capability_graph_export --project /path/to/prep
```

The command deterministically regenerates exactly four DOT/SVG files and
does not rewrite unchanged files. The full diagram includes all direct
Capability `requires`. The reachability-only overview omits redundant-for-
*reachability* arrows, **not** semantically unnecessary direct inputs.
Canonical knowledge remains in `.harness/engineering-graph.yaml`.
For freshness checking without writes, use the same command with `--check`
in a consistent Graphviz/fonts environment.

## Maintained reference implementations

Reusable implementation evidence that is intentionally outside current production architecture lives under `experiments/`.

- `experiments/anki_adapter_reference/` — tested AnkiConnect transport and note/deck reconciliation donor code. It is not backend architecture authority; a future backend may adapt it only behind the accepted ExternalStudyRuntimePort / Machine Interface contracts.
- `experiments/knowledge_representation/` — preserved 3D UI/renderer/performance donor evidence from historical snapshot `45c193ac0a50b6023a29e9a87f404b794a24a955`; it is not product or UX authority.

Reference implementations are evidence and reusable code, not semantic authority.
