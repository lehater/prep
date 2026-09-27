# Vision

## Product intent

Prep helps a person move from their current state of knowledge and knowledge-dependent capability toward a chosen target state by making the required knowledge understandable and learnable, supporting deliberate learning and practice, and using evidence to guide what needs attention next.

The product is primarily concerned with acquiring, maintaining and demonstrating usable knowledge and the capabilities that materially depend on that knowledge. It does not attempt to become a universal system for teaching every kind of skill.

## Product outcome

A learner should be able to:

1. establish what they want to know or be able to do, including material conditions and required depth or standard where those distinctions matter;
2. obtain a coherent view of the knowledge relevant to that target;
3. learn and revisit that knowledge in forms appropriate to the intended outcome;
4. obtain contextual evidence from relevant performance about what is retrievable, understood or usable;
5. see an evidence-backed, appropriately scoped position relative to the target, including material uncertainty, and focus effort on meaningful gaps as that evidence changes;
6. keep important knowledge and knowledge-dependent capability available for later use.

## Product principles

- **Learning outcome before representation.** The product model should be driven by what the learner needs to know or do, not by a preferred storage or visualization technology.
- **Knowledge and learner state are distinct.** A representation of subject knowledge must not be conflated with evidence or conclusions about one person's current state.
- **Different depths and conditions are meaningful.** Recall, understanding, application and deeper performance are not assumed equivalent, and performance in one condition is not automatically evidence for all conditions.
- **Structure is instrumental.** Information should be structured when doing so improves learning, navigation, comparison, reuse or another justified operation; maximum formalization is not itself a goal.
- **Evidence over exposure.** Reading or encountering material is not sufficient evidence that it will be available or usable when needed.
- **Evidence is contextual.** A success or failure is evidence about observed performance under particular conditions; it is not automatically proof or disproof of a broad capability.
- **Inference is bounded.** Claims about learner state must be supported by accepted evidence semantics and remain scoped to the conditions and time that evidence can justify.
- **Retention matters.** Learning is not complete merely because knowledge can be demonstrated immediately after study.
- **Subject differences remain explicit.** Different subjects and outcomes may require different learning, practice and evidence forms rather than one universal exercise model.
- **Existing learning ecosystems are potential collaborators.** External tools may execute parts of the learning process without defining Prep's product semantics.

## Initial product focus

The first practical focus is building familiarity with a technical subject: acquiring its terminology and concepts, understanding how important concepts relate, and making enough of that knowledge retrievable to discuss the subject coherently.

Technical-interview preparation is an important motivating use case because it provides concrete subject scopes and a need for accessible knowledge, but it does not define the product problem.

Deeper understanding, application, procedural skill and richer assessment are legitimate extensions where required by a learning target; they are not prerequisites for proving the initial product value.

## Current non-decisions

This vision does not choose:

- a graph, ontology or other canonical knowledge representation;
- a graph-first, card-first or other user interface;
- a particular learning-object, task, evidence or question schema;
- Anki or another study runtime;
- a scheduling algorithm;
- a learner-state inference algorithm;
- storage, API, deployment or component technology;
- the eventual bounded-context decomposition.

Those decisions belong to downstream product, domain and architecture design.
