# Model Context Strategy

## Purpose

Define where Prep's independently modeled domain languages apply and how they relate, without re-owning strategic domain classification or tactical internals.

## Contexts

### Knowledge Model

Applies to reusable subject meaning independent of one learner, target, learning mechanism or presentation.

### Learning Design

Applies to normative and target-relative language about desired learning outcomes, required knowledge-dependent capability, relevant scope/conditions/standard, learning/practice/assessment intent, evidence requirements, gaps, priorities and adaptation.

It does not own actual learner-specific performance, observations or evidential conclusions.

### Learner Model

Applies to learner-specific descriptive and epistemic language: actual performance/observations and evidence-backed interpretation of the learner's state, including material uncertainty and temporal scope.

It does not own reusable subject truth or target-relative learning policy.

## Relationships

- Knowledge Model provides reusable subject semantics to Learning Design.
- Learning Design may provide target context, learning/practice/assessment intent and evidence expectations used to interpret learner activity; these do not become Learner Model-owned definitions.
- Learner Model provides evidence-backed learner-specific state and uncertainty that Learning Design may consume for gap, priority and adaptation decisions.
- Learning Design may define learning/practice/assessment artifacts when their meaning is normative or target-relative; runtime-specific representations do not gain semantic ownership.
- External inputs and learning runtimes may execute work or supply observations but do not own these model languages.

## Boundary invariants

- reusable subject truth and learner-specific state remain distinct;
- desired/required capability and observed/inferred learner state remain distinct;
- observations and learner-state conclusions remain distinguishable;
- target-relative policy cannot redefine reusable subject meaning;
- learner evidence cannot directly mutate Knowledge Model semantics;
- context boundaries describe semantic ownership, not deployable-service boundaries;
- translation/alignment preserves the identities of participating models rather than collapsing them.

## Current boundary decision

Learning Design remains one model context for the current scope.

Target definition, learning/practice design, assessment/evidence requirements, gaps, priorities and adaptation share one normative question: what outcome is sought, what counts as relevant evidence, and what should happen next relative to that target.

Learner Model owns both learner-specific observations and evidence-backed interpretation because both belong to the learner-specific descriptive/epistemic language. The exact inference structures, confidence model and temporal rules are Tactical Domain Design decisions and do not redefine this context boundary.

A concrete artifact such as a question, exercise or externally executed review does not by itself justify another model context. Its ownership depends on semantic meaning, not representation or runtime.

A future split is justified only when learning-material, assessment, observation or inference semantics demonstrate independently changing language, lifecycle or public consumers that cannot be expressed coherently within the current boundaries.

## Deferred questions

- what concrete evidence would justify splitting Learning Design into independently modeled target/planning, learning/practice or assessment contexts;
- what concrete evidence would justify splitting Learner Model into independently modeled observation and learner-state contexts.
