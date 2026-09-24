# Plan: Re-establish top-level product knowledge

## Goal

Re-establish Prep's canonical knowledge from the top of the Harness without repairing downstream artifacts prematurely.

## Working rule

Validate one upstream artifact at a time. Downstream artifacts may remain stale or invalidated until their turn. Do not preserve lower-level consistency by importing solution assumptions upward.

## Sequence

1. Capture research evidence relevant to the learning problem and knowledge representation.
2. Validate `PROBLEM-SPACE` against that evidence while keeping it solution-neutral.
3. Stop. Review `PRODUCT-VISION` only after `PROBLEM-SPACE` is accepted.
4. Continue downward one Harness artifact at a time.

## Current scope

- `docs/research/learning-and-knowledge-representation-synthesis.md`
- `docs/vision/problem-space.md`

Explicitly out of scope: Product Vision, Product Capabilities, Context Map, domain models, architecture, UI, Anki and implementation contracts.
