# Project Refinement Contract v0 — result

## Verdict

**Small refinement is viable, but frozen Reference Model v0 is not yet a drop-in replacement for OLD Harness.**

The experiment used **14 declarative refinement rules** against a 63-capability generated graph. It did not recreate the OLD graph manually.

## Measured result

| Metric | OLD | NEW | REFINED |
|---|---:|---:|---:|
| Implementation direct requirements | 3 | 52 | 4 |
| Implementation allowed read paths | 6 | 31 | 5 |
| Knowledge mutation affected provider paths | 24 | 1 | 22 |
| Machine-interface mutation affected provider paths | 15 | 1 | 10 |
| Target state | COMPLETE | READY | COMPLETE |

Semantic concern rematerialization changed from **MATERIALIZATION_CONFLICT** to **STABLE**.

## What remains

- Strict semantic admission still fails at `user-needs`: the current PREP baseline tool emits structured semantic assertions only for Task Model, not for the new Reference Model knowledge kinds.
- `docs/domain/relation-classification-catalog.yaml` still has no independent NEW capability/provider binding.
- Machine-interface propagation is improved but not yet equivalent to OLD.
- Coverage proof remains incomplete; that is a semantic-evidence migration problem, not a topology-refinement problem.

## Conclusion

The experiment rejects the idea that project refinement necessarily becomes a second manually authored Harness. A small refinement layer fixed the largest observed failures:

1. project-specific causal dependencies;
2. excessive Implementation Plan fan-in;
3. Security/Operability over-activation;
4. concern/applicability conflict.

The next work should move the **refinement contract mechanism** into Harness research and separately address Reference Model semantics / strict semantic admission.
