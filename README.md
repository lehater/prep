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
python tools/validate_docs.py
```

Implementation, tests and experiments may provide evidence, but they do not redefine canonical engineering meaning unless that meaning is admitted through Harness and persisted in a Core artifact.
