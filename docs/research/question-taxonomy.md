# Research: learning tasks and question taxonomy

## Research question

What minimal taxonomy should the project use to distinguish *what cognitive operation is being tested* from *how a concrete question is presented* during technical interview preparation?

## Findings

### 1. Cognitive task and question format are different dimensions

The revised Bloom taxonomy separates a cognitive-process dimension from a knowledge dimension. Its cognitive processes are `remember`, `understand`, `apply`, `analyze`, `evaluate`, and `create`; the taxonomy also gives lower-level operations such as explaining, comparing, predicting, checking, critiquing, and planning.

For this project, Bloom is useful as a coverage vocabulary, not as a strict mastery ladder. Empirical work warns that action verbs alone do not reliably identify the cognitive process exercised by an assessment item, and the dimensions are not perfectly independent.

Implication: classify a question from its required reasoning and answer evidence, not merely from words such as "explain" or "compare" in the prompt.

Sources:
- University of Waterloo, *Bloom's Taxonomy*: https://uwaterloo.ca/centre-for-teaching-excellence/catalogs/tip-sheets/blooms-taxonomy
- University of Waterloo, revised taxonomy background: https://uwaterloo.ca/centre-for-teaching-excellence/sites/default/files/uploads/files/multiple_choice_and_blooms_taxonomy_august_2015.pdf
- Crowe et al., *Probing Internal Assumptions of the Revised Bloom's Taxonomy*: https://pubmed.ncbi.nlm.nih.gov/36112622/

### 2. Technical interviews require more than recall

Microsoft's current technical interviewing guidance explicitly describes evaluation of technical knowledge together with problem solving, applying skills to scenarios, design, coding, testing, choices, and explanation of the candidate's reasoning.

Implication: a question pool that measures only factual recall is poorly aligned with the target environment. The taxonomy must cover application, analysis, judgment, and synthesis/design in addition to retrieval of concepts.

Source:
- Microsoft Careers, *Technical interviewing*: https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing

### 3. Retrieval practice is a learning mechanism, not a domain task category

Practice testing and distributed practice have strong support as learning techniques. Retrieval practice can also transfer beyond the exact trained item, including to application and inference questions, although transfer is not automatic and depends on conditions such as response congruency and elaboration.

Implication: `retrieval` should describe how questions are practised/scheduled, while `LearningTask` describes what the learner must do with the knowledge.

Sources:
- Dunlosky et al., *Improving Students' Learning With Effective Learning Techniques*: https://pubmed.ncbi.nlm.nih.gov/26173288/
- Pan & Rickard, *Transfer of test-enhanced learning*: https://pubmed.ncbi.nlm.nih.gov/29733621/
- Binks, *Testing enhances learning: A review of the literature*: https://pubmed.ncbi.nlm.nih.gov/29929801/

### 4. Productive response is useful for interview alignment, but selected-response formats are not inherently invalid

Research comparing short-answer and multiple-choice retrieval shows that both can produce testing effects under appropriate conditions. Short-answer/retrieval formats avoid answer cueing and more closely resemble an interview where the learner must construct an answer without seeing alternatives, but retrieval success and feedback matter.

Implication: the initial interview-preparation adapter should prefer constructed responses for baseline and interview-like practice. Multiple-choice may later be useful for discrimination or fast checks, but it should not define mastery of an interview answer.

Sources:
- Smith & Karpicke, *Retrieval practice with short-answer, multiple-choice, and hybrid tests*: https://pubmed.ncbi.nlm.nih.gov/24059563/
- van Wijk et al., *The battle of question formats*: https://pubmed.ncbi.nlm.nih.gov/39734216/
- Binks review: https://pubmed.ncbi.nlm.nih.gov/29929801/

### 5. Comparison deserves explicit diagnostic treatment

In the revised Bloom taxonomy, comparing is a form of understanding. For technical interviews, however, choosing between similar mechanisms and technologies is common. Research on interleaving also suggests benefits when learners must discriminate between similar categories or procedures.

Implication: keep `compare` as a project-level `LearningTask` even though a general educational taxonomy may nest it under `understand`. This gives the gap model useful resolution for questions such as thread vs coroutine, optimistic vs pessimistic locking, or Kafka vs RabbitMQ.

Sources:
- Foster et al., *Why does interleaving improve math learning?*: https://pubmed.ncbi.nlm.nih.gov/30877483/
- Brunmair & Richter, *Similarity matters: A meta-analysis of interleaved learning and its moderators*: https://pubmed.ncbi.nlm.nih.gov/31556629/

### 6. Explanation is useful, but "why" is a prompt pattern rather than a separate mastery dimension

Self-explanation can improve learning, particularly when learners connect information to principles and prior knowledge, but its benefit depends on what the prompt focuses attention on. A question asking for purpose, mechanism, or causality can therefore share one cognitive task (`explain`) while using different prompt variants.

Sources:
- Bisra et al., *Eliciting explanations: Constraints on when self-explanation aids learning*: https://pubmed.ncbi.nlm.nih.gov/27368627/
- O'Reilly et al., *A Comparison of Self-Explanation and Elaborative Interrogation*: https://pubmed.ncbi.nlm.nih.gov/9769186/

## Candidate normalization

The original candidate list mixed several levels:

| Candidate | Better classification |
| --- | --- |
| recall | LearningTask |
| explanation | LearningTask |
| purpose | explanation prompt variant |
| causality | explanation prompt variant |
| comparison | LearningTask |
| selection | evaluation question pattern |
| application | LearningTask |
| prediction | analysis question pattern |
| debugging | analysis question pattern |
| trade-off analysis | evaluation question pattern |
| design | LearningTask |
| verbal explanation | response modality / delivery constraint |

## Proposed LearningTask v0.1

1. `recall` — retrieve relevant knowledge without supplied alternatives.
2. `explain` — construct a coherent meaning, mechanism, purpose, or causal model.
3. `compare` — discriminate related concepts using relevant dimensions and conditions.
4. `apply` — use a concept, rule, or mechanism in a concrete situation.
5. `analyze` — infer behavior, decompose a situation, trace consequences, or diagnose causes from evidence.
6. `evaluate` — judge or choose among alternatives using explicit criteria and trade-offs.
7. `design` — synthesize a solution or structure under stated constraints.

This is intentionally not a claim that the seven tasks form a strict hierarchy. They are diagnostic categories optimized for technical-interview preparation.

## Proposed QuestionType v0.1

| QuestionType | Primary LearningTask | Typical intent |
| --- | --- | --- |
| `direct-recall` | recall | retrieve definition, fact, property, invariant |
| `explain` | explain | explain purpose, mechanism, causality, or rationale |
| `compare` | compare | distinguish two or more related concepts |
| `scenario-apply` | apply | apply a concept/rule to a concrete case |
| `predict` | analyze | infer outcome/state/behavior before execution |
| `diagnose` | analyze | identify cause from symptoms/evidence and propose verification/fix |
| `choose-justify` | evaluate | select an option and justify it against constraints/trade-offs |
| `design` | design | construct a coherent solution from requirements and constraints |

## Deliberately excluded from v0.1

- `verbal explanation` as a LearningTask: oral delivery is a response mode/constraint.
- `coding` as one generic LearningTask: coding exercises may require apply/analyze/design and should later be modeled through response mode and exercise format.
- separate `purpose`, `causality`, and `mechanism` tasks: they are useful question variants but not sufficiently distinct mastery dimensions for the first vertical slice.
- multiple-choice vs short-answer as LearningTasks: they are presentation/response formats.
- a numeric mastery formula: evidence is not yet available from real project attempts.

## Open questions for later slices

- Whether `ResponseMode` should become a first-class entity (`oral`, `text`, `code`, `diagram`).
- Whether `QuestionType` needs variants such as `explain-purpose`, `explain-mechanism`, and `explain-causality` in machine-readable data.
- How assessment rubrics differ by QuestionType.
- Whether some questions should map to more than one LearningTask and how that affects analytics.
