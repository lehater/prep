# Prep Harness integration

Prep uses the pinned repository-independent `lehater/harness`.

## Project-owned Harness state

```text
.harness-version
.harness/engineering-graph.yaml
.harness/core.yaml
.harness/authority-assessments.yaml
.harness/semantic-baseline.yaml
.harness/engineering-coverage.yaml
```

`.harness/core.yaml` is the canonical artifact inventory. Project semantics live only in the artifacts registered there. `docs/README.md` is a navigation index, not an additional authority.

## Current consumers

- `CURRENT-REVALIDATION`
- `FRONTEND-PROTOTYPE`
- `FRONTEND-IMPLEMENTATION`

Use the Engineering Graph to determine prerequisites and currentness. Do not infer current design from historical documents or experiments.

## Local validation

```bash
python tools/bootstrap_harness.py
python tools/semantic_baseline.py
python tools/check_harness_integration.py
python tools/validate_docs.py
```
