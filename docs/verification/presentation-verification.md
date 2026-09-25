# Presentation Verification

## Purpose

Define verification obligations for the accepted Presentation System and Screen/View Design without turning rendered implementation details or a concrete UI provider into semantic authority.

This artifact is a verification strategy. Some checks are executable now from canonical documents; rendered/task evidence becomes available only when the frontend prototype exists.

## Executable structural checks

Every view required by canonical Interface Topology must have a stable subject id in `docs/interface/screen-view-design.md`.

The project integration adapter extracts those ids and the generic Harness topology -> screen subject evaluator compares them with the topology-derived expected set.

This proves material view/frame coverage only. It does not prove usability, accessibility, visual consistency or the value of the 3D graph.

## Presentation-system verification obligations

### PV-PATTERN-CONSISTENCY — reusable presentation roles

**Verifies**

- repeated application-level presentation roles are realized consistently across representative Learning and Curation views;
- loading, empty, recoverable failure and unavailable/degraded states use the same accepted role semantics where those states apply;
- repeated collection/search/filter/detail/form-action patterns do not acquire contradictory behavior merely because different feature modules render them.

**Method:** INSPECTION + DEMONSTRATION.

**Evidence requirement**

Rendered representative views/stories or equivalent deterministic review surfaces covering at least one Learning and one Curation consumer for each shared pattern actually used by the prototype.

The check is about consistent product/presentation roles, not pixel identity.

### PV-PROVIDER-NEUTRALITY — provider does not authorize product behavior

**Verifies**

- selecting a UI component/provider does not introduce search, filtering, sorting, editing, deletion, navigation or other product capabilities absent from accepted Screen/View semantics;
- provider-specific visual affordances do not silently redefine accepted interaction meaning.

**Method:** INSPECTION.

**Evidence requirement**

Trace representative provider-backed controls back to the Screen/View or Presentation System responsibility that authorizes them. Provider/template capability alone is insufficient evidence.

Implementation-level import/dependency isolation of the provider belongs to frontend Verification Design; this check verifies semantic presentation fidelity.

### PV-THEME-COHERENCE — one shared presentation role system

**Verifies**

- repeated semantic presentation roles such as hierarchy, feedback, focus, surface treatment, typography role and spacing role are mapped through one coherent presentation/theme/token system;
- features do not introduce competing global visual systems;
- provider/theme token names remain realization details rather than product/domain semantics.

**Method:** INSPECTION.

**Evidence requirement**

The prototype's theme/token/provider mapping plus rendered representative views sufficient to show that recurring roles are shared rather than independently re-invented.

Exact colors, fonts and spacing values are not canonical unless separately accepted by Presentation System.

### PV-ACCESSIBILITY-BASELINE — non-graph and focus semantics

**Verifies**

- core navigation/actions have keyboard-accessible interaction and visible focus;
- semantic state does not depend on color alone;
- every core Knowledge task exposed through the graph retains a non-graph list/search/detail path.

**Method:** DEMONSTRATION + TEST where automation is practical.

**Evidence requirement**

Keyboard walkthrough/browser evidence for representative Learning/Curation navigation and Knowledge access, plus automated accessibility/focus checks where they provide reliable evidence.

### PV-GRAPH-TASK-VALUE — 3D remains an evidence-backed hypothesis

**Verifies**

- 3D graph interactions are evaluated against the accepted list/search/detail baseline on the concrete tasks named by Screen/View Design;
- geometry is not treated as semantic truth;
- relation type/direction remains inspectable without relying on position alone.

**Method:** DEMONSTRATION + ANALYSIS.

**Evidence requirement**

Task evidence comparing graph and non-graph representations for the same representative Knowledge data, recording correctness, effort/time, navigation errors/disorientation and cases where either representation is simpler.

This check may lead to retaining, narrowing or demoting 3D without changing Knowledge semantics.

## Current evidence state

Available now:

- topology -> Screen/View subject coverage;
- canonical traceability of the verification obligations above to Presentation System and Screen/View Design.

Requires frontend prototype/rendered evidence later:

- reusable-pattern consistency;
- provider-neutral presentation fidelity;
- theme/token coherence;
- accessibility walkthroughs;
- 3D task-value evidence.

Absence of rendered evidence before the prototype exists is implementation/evidence lag, not permission to invent new interface semantics.

## Out of scope

This artifact does not verify:

- source-code dependency direction or provider import isolation — frontend Verification Design owns that structural evidence;
- executable test mechanics/framework choice — Test Design owns those contracts when applicable;
- exact palette, typography family, spacing values or component-library identity unless they become accepted Presentation System decisions;
- semantic learning-material coverage or learner-state inference.
