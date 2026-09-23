# Prep Harness integration

Prep uses the repository-independent `lehater/harness` project rather than maintaining a local engineering-knowledge evaluator.

## Files

```text
.harness-version                 immutable Harness commit
.harness/engineering-graph.yaml Prep Authority/Capability/Consumer policy
.harness/core.yaml              Prep canonical artifact realization
.harness-tool/                  disposable local Harness checkout (ignored)
```

Canonical semantic truth remains in `docs/**`; `.harness/**` describes engineering ownership and realization only.

## Local use

```bash
python tools/bootstrap_harness.py
python tools/check_harness_integration.py
```

The integration currently evaluates `TOP-LEVEL-DESIGN`. It intentionally does not define component, persistence, API, deployment or implementation consumers.

## Agent operation

ADR-006 still defines one-chat-agent operation and context minimization. Universal Harness provides engineering-knowledge routing/coverage; it does not replace the agent interaction model.
