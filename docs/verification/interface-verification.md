# Interface Verification Strategy

## Purpose

Verify that the rebuilt human-interface knowledge chain preserves accepted user
tasks, interaction semantics and topology reachability before presentation
details or frontend implementation are treated as correct.

This strategy verifies the accepted interface contract. It does not introduce
new product behavior, visual requirements or implementation choices.

## Scope

Accepted inputs:

- `docs/application/task-model.yaml`
- `docs/interface/conceptual-interface-model.yaml`
- `docs/interface/information-architecture.yaml`
- `docs/interface/interaction-design.yaml`
- `docs/interface/interface-topology.yaml`
- `docs/application/application-design.md`

## Verification checks

### IV-01 — USER task closure

**Verifies:** every USER task in the accepted Task Model has either an accepted
interaction context that reaches a topology task view, or an explicit accepted
no-ui disposition.

**Method:** ANALYSIS

**Required evidence:**

- deterministic extraction of USER task ids;
- deterministic extraction of interaction `task_refs` and no-ui dispositions;
- deterministic extraction of topology interaction-context coverage;
- zero `UNCOVERED_USER_TASK`, `UNKNOWN_TASK_REF` and
  `USER_TASK_WITHOUT_VIEW` findings for the rebuilt chain.

A changed task id without corresponding downstream coverage is a regression.

### IV-02 — Interaction context closure

**Verifies:** no accepted interaction context disappears between Interaction
Design and Interface Topology.

**Method:** ANALYSIS

**Required evidence:**

- the complete set of `contexts[].id` from Interaction Design;
- the complete topology `interaction_context_refs`/coverage mapping;
- zero unknown or uncovered interaction-context findings.

The explicit `TM-LEARN-STUDY-EXTERNALLY` no-ui disposition is verified
separately from view coverage and must not be converted into a Prep study view.

### IV-03 — Learning/Curation behavior separation

**Verifies:** Learning consumes target scope and reusable corpus information
without silently enabling canonical mutation, while Curation intentionally
exposes accepted mutation work.

**Method:** DEMONSTRATION

**Required evidence:** task walkthroughs showing:

1. selecting a target in Learning exposes its prepared scope as read-only;
2. Study preparation can proceed without entering target/corpus editing;
3. following a diagnostic into Curation is an explicit context transition;
4. Knowledge exploration preserves canonical identity while Curation context
   changes which mutation actions are available.

Failure includes any path where an ordinary Learning action silently mutates
target scope, Knowledge, Requirements or Questions.

### IV-04 — Study preview/export fidelity and recovery

**Verifies:** the accepted `I-STUDY-PREPARATION` interaction keeps preview and
external export distinguishable and exposes material conflict/failure states.

**Method:** TEST

**Required evidence:** interaction-level tests or behavioral prototype tests
covering:

- build returns a non-empty preview;
- build returns an explicit empty preview;
- export of the inspected current preview succeeds;
- stale preview produces the accepted conflict state and requires rebuild;
- external runtime unavailable preserves the reviewed preview;
- partial external failure keeps per-Question success/failure distinguishable.

Test Design may refine fixtures and mechanics but must preserve these oracles.

### IV-05 — Knowledge scope/focus/traversal independence

**Verifies:** `I-KNOWLEDGE-EXPLORE` and `V-KNOWLEDGE` support the accepted
information need without assuming a graph renderer or requiring all corpus
elements to be simultaneously visible.

**Method:** DEMONSTRATION

**Required evidence:** a representation-neutral behavioral prototype or
equivalent walkthrough demonstrates that the user can:

1. distinguish global from target-relevant scope;
2. search/filter Knowledge;
3. select one canonical Knowledge focus;
4. inspect typed relationship meaning and direction;
5. follow a connected Knowledge identity while preserving explicit scope;
6. perform those actions without pointer-only spatial gestures.

A later graph/3D/2D projection may satisfy this check, but the check does not
require one.

### IV-06 — Navigation continuity and direct identity

**Verifies:** topology preserves canonical task continuity among Learning,
shared Knowledge and Curation without duplicating semantic identity.

**Method:** ANALYSIS

**Required evidence:**

- all `parent` and `exits` references resolve;
- the three root destinations remain reachable;
- target-scoped Knowledge can return to Learning context;
- Curation destinations can reach shared Knowledge in explicit Curation work;
- diagnostic-to-repair exits resolve;
- direct Knowledge/Question/Target identity entry does not create a second
  canonical object identity.

### IV-07 — Visible failure semantics do not fabricate success

**Verifies:** accepted interaction recovery distinguishes validation rejection,
conflict, not-found, operational failure and external-runtime failure from
accepted canonical change.

**Method:** INSPECTION

**Required evidence:** review of every mutation/external-side-effect interaction
context confirms that:

- success is shown only for an accepted operation outcome;
- rejection/conflict preserves prior accepted canonical state;
- retry/reload paths retain enough user intent to recover;
- missing evidence/material is not relabeled as mastery failure or semantic
  quality judgment.

### IV-08 — IA/concept reference integrity

**Verifies:** every topology location and every interaction/concept reference
resolves to the rebuilt accepted IA and Conceptual Interface Model.

**Method:** ANALYSIS

**Required evidence:** deterministic reference validation with zero unknown
location, concept or mode ids.

## Evidence gate

`prep.interface-verification` is satisfied when all eight checks have current
evidence against the same accepted Task Model / Conceptual Interface / IA /
Interaction / Topology baselines.

A historical green result is stale whenever one of those accepted upstream
artifacts changes.

## Out of scope

These belong to later verification capabilities:

- typography, color, density and visual hierarchy quality;
- responsive layout and screen composition;
- chosen Knowledge visualization rendering;
- frontend performance/capacity measurements;
- component/unit/integration/e2e test implementation details;
- backend/domain correctness already owned upstream.

## Unresolved Questions

None introduced by Interface Verification.
