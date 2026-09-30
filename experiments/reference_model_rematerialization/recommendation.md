# Recommendation

Решение: **C. PROJECT-SPECIFIC REFINEMENT REQUIRED**.

Reference Engineering Model v0 следует сохранить как reusable skeleton, но не интегрировать
как drop-in replacement текущего PREP Engineering Graph.

Следующий минимальный шаг:

1. добавить research-only `Project Refinement Contract v0`;
2. выразить только пять доказанных counterexamples:
   - Relation Classification specialization;
   - Knowledge -> Learning/Learner project dependencies;
   - Application/Machine/Quality dependency refinements;
   - evidence-backed Security/Operability applicability refinement;
   - concern/template applicability invariant;
3. повторить те же lifecycle mutations и context comparison;
4. принимать refinement подход только если:
   - Knowledge mutation снова дает корректный downstream frontier;
   - Machine Interface mutation восстанавливает ожидаемые consumers;
   - Implementation context существенно уменьшается;
   - NEW target становится COMPLETE без фиктивных canonical artifacts;
   - semantic concern pass не имеет MATERIALIZATION_CONFLICT.

Не переносить experimental branch в `main` и не менять исходную PREP branch до этого rerun.
