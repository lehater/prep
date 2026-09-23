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

`TOP-LEVEL-DESIGN` and `LOGICAL-DESIGN` are completed baselines. `TECHNICAL-DESIGN` is the active frontier and intentionally exposes concrete persistence, dependency, interface, presentation, security, quality, topology, component, operability and test-design work as Harness CREATE/WAIT state. Implementation remains out of scope until that frontier closes.

## Agent operation

ADR-006 still defines one-chat-agent operation and context minimization. Universal Harness provides engineering-knowledge routing/coverage; it does not replace the agent interaction model.
