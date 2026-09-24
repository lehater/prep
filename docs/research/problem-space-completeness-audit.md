# Problem-space completeness audit

## Status

Research evidence for reviewing `PROBLEM-SPACE`. This artifact records findings, not product or architecture decisions.

## Audit question

Does `docs/vision/problem-space.md` cover the learner problem without assuming a particular solution?

## Evidence-backed observations

Learning is not equivalent to exposure or rereading. Retrieval practice is well supported as a mechanism for improving later recall, and spacing/repeated retrieval matter for durable learning. Learners also have to regulate their own learning and can hold inaccurate beliefs about which strategies are effective.

Therefore a complete problem model must distinguish:

- acquiring or reconstructing understanding;
- ability to retrieve knowledge later;
- ability to apply or transfer it;
- durability of learning over time;
- learner confidence from stronger evidence of performance.

## Completeness findings

The current problem chain covers target, required knowledge, current state, gaps, priorities, learning/practice, evidence, progress and adaptation.

Two dimensions were under-specified:

1. **Retention over time.** A learner can demonstrate knowledge now and still fail to retain it until the target event or later use.
2. **Transfer / performance context.** Knowing or recalling material is not necessarily sufficient to apply, explain, reason with or perform it under the conditions of the target task.

These are learner problems, not prescribed mechanisms such as spaced repetition, flashcards, mock interviews or a graph.

## Proposed problem chain

```text
target
  -> required competence
  -> current state
  -> gaps
  -> priorities
  -> learning / practice
  -> evidence
  -> retention / transfer
  -> progress
  -> adaptation
```

## Open evidence gaps

Further product discovery should test:

- how learners determine required scope and depth for a target;
- how accurately learners can diagnose their own gaps;
- which evidence they trust when deciding that a topic is learned;
- how preparation changes under deadlines and limited study time;
- where fragmentation across tools materially increases effort or reduces preparation quality.

## Sources

- Carpenter, Pan & Butler (2022), *Nature Reviews Psychology*, “The science of effective learning with spacing and retrieval practice”, DOI: 10.1038/s44159-022-00089-1.
- McDermott (2021), *Annual Review of Psychology*, “Practicing Retrieval Facilitates Learning”, DOI: 10.1146/annurev-psych-010419-051019.
- Karpicke & Blunt (2011), *Science*, “Retrieval practice produces more learning than elaborative studying with concept mapping”, DOI: 10.1126/science.1199327.
