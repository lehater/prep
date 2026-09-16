# Plan 012 — Learning card information architecture research

## Goal

Determine what information a learner should see on an Interview Preparation card, in what order, and with what visual hierarchy, while keeping machine metadata separate from learner-facing UI.

## Completed work

- researched coherence, signaling/headings, split-attention, response-instruction clarity, and color accessibility;
- distinguished semantic/model fields from learner-facing UI;
- defined a visible-vs-hidden field policy;
- defined explicit learner-facing `Тема:` and `Контекст:` presentation to avoid false parent/child hierarchy;
- recommended hiding raw `LearningTask`, `QuestionType`, `GuidanceLevel`, `StimulusFormat`, `KnowledgeKind`, IDs, and machine `ResponseFormat` values from the normal learner surface;
- defined a response-instruction rule: show a natural-language instruction only when the prompt does not already make the expected action clear;
- defined front/back information priority levels;
- proposed one universal semantic skeleton with task-dependent ordering of stimulus and prompt;
- proposed five layouts: concept recall, scenario, code trace, diagnose, worked example;
- proposed a three-layer feedback hierarchy: fast check, deep feedback, extension/provenance;
- separated evidence-informed principles from project hypotheses that still require real Anki testing.

## Main result

The central rule is:

```text
available card data != visible card UI
```

Recommended front surface:

```text
Тема: <Concept display label>        Контекст: <Context>   # optional

<Stimulus / artifact when needed>

<Prompt>

<Response instruction only when needed>
```

Recommended back hierarchy:

```text
FAST CHECK
  ShortAnswer
  KeyPoints

DEEP FEEDBACK
  Explanation
  ReasoningSteps
  CorrectArtifact

EXTENSION / PROVENANCE
  Pitfall
  Alternatives
  Sources
```

## Validation

GitHub Actions run `35158619207` passed the repository validation workflow.

This task changed research/plan documentation only; it intentionally did not change v1/v2 schemas, templates, CSS, question banks, or Anki data.

## Recommended next experiment

Create a presentation-only `v2.1` over the same 14 prototype learning objects:

```text
v2.0 = metadata-exposing prototype
v2.1 = learner-first information architecture
```

The semantic dataset must remain unchanged so the comparison isolates presentation effects.

## Status

Completed.
