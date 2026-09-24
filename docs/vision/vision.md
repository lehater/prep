# Vision

## Product intent

Prep helps a person move from their current state of knowledge toward a chosen target state by making the required knowledge understandable and learnable, supporting deliberate learning and practice, and using evidence to guide what needs attention next.

The product is primarily concerned with acquiring and maintaining usable knowledge. It may support abilities that depend on knowledge, but it does not attempt to become a universal system for teaching every kind of skill.

## Product outcome

A learner should be able to:

1. establish what they want to know or be able to do and the relevant depth;
2. obtain a coherent view of the knowledge relevant to that target;
3. learn and revisit that knowledge in forms appropriate to the intended outcome;
4. get useful evidence of what is available from memory, understood or usable;
5. focus effort on meaningful gaps as that evidence changes;
6. keep important knowledge available for later use.

## Product principles

- **Learning outcome before representation.** The product model should be driven by what the learner needs to know or do, not by a preferred storage or visualization technology.
- **Knowledge and learner state are distinct.** A representation of subject knowledge must not be conflated with evidence about one person's current state.
- **Different depths are meaningful.** Recall, understanding, application and deeper performance are not assumed equivalent.
- **Structure is instrumental.** Information should be structured when doing so improves learning, navigation, comparison, reuse or another justified operation; maximum formalization is not itself a goal.
- **Evidence over exposure.** Reading or encountering material is not sufficient evidence that it will be available when needed.
- **Retention matters.** Learning is not complete merely because knowledge can be demonstrated immediately after study.
- **Subject differences remain explicit.** Different subjects and outcomes may require different learning and evidence forms rather than one universal exercise model.
- **Existing learning ecosystems are potential collaborators.** External tools may execute parts of the learning process without defining Prep's product semantics.

## Initial product focus

The first practical focus is building familiarity with a technical subject: acquiring its terminology and concepts, understanding how important concepts relate, and making enough of that knowledge retrievable to discuss the subject coherently.

Technical-interview preparation is an important motivating use case because it provides concrete subject scopes and a need for accessible knowledge, but it does not define the product problem.

Deeper understanding, application, procedural skill and richer assessment are legitimate extensions where required by a learning target; they are not prerequisites for proving the initial product value.

## Current non-decisions

This vision does not choose:

- a graph, ontology or other canonical knowledge representation;
- a graph-first, card-first or other user interface;
- a particular learning-object or question schema;
- Anki or another study runtime;
- a scheduling algorithm;
- storage, API, deployment or component technology;
- the eventual bounded-context decomposition.

Those decisions belong to downstream product, domain and architecture design.
