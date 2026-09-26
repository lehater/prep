# Research: learning and assessment coverage

Status: research evidence for Q-LEARNING-COVERAGE-MODEL. This document is not a canonical domain model.

## Research question

What does it mean for a KnowledgeNode, Requirement or LearningTarget to be adequately "covered" for learning, and what can provide that coverage besides Questions?

The motivating observation is that counting Questions aligned to a KnowledgeNode cannot establish that the knowledge is adequately taught, practiced, assessed or transferable.

## Main finding

The literature does not support one universal scalar notion of educational coverage.

A more defensible framing is an **alignment problem** across several layers:

```text
intended outcome / claim
        ↓
knowledge / capability scope
        ↓
learning support and activities
        ↓
evidence required
        ↓
assessment / performance tasks
```

Coverage is adequate only relative to what capability or inference is intended.

## 1. Learning support and assessment evidence are different

Constructive Alignment connects intended learning outcomes with both teaching/learning activities and assessment tasks. This means "material that helps the learner acquire the capability" and "tasks that provide evidence the capability exists" are related but not identical.

Evidence-Centered Design similarly starts from the claim we want to make, identifies evidence needed for that claim, then designs tasks capable of eliciting the evidence.

Evidence-Centered Design for Learning adds an explicit pedagogical model for how growth/learning is fostered, reinforcing that assessment coverage alone is not a complete learning design.

### Implication for Prep

A future coverage model should distinguish at least:

- **learning-support coverage** — does the learner have suitable explanation, examples, guided practice or other learning experiences for the intended capability?
- **evidence/assessment coverage** — do available tasks provide evidence for the intended capability?

A KnowledgeNode can be well explained but poorly assessed, or heavily quizzed but poorly taught.

## 2. Content breadth must be sampled deliberately

Assessment blueprinting exists partly to prevent **construct underrepresentation**: tests accidentally over-sample some content and omit other important content.

Blueprints map important content/outcomes to assessment tasks and weight or sample them deliberately.

### Implication for Prep

For a KnowledgeNode or Requirement, a future curation model may need explicit semantic aspects/subclaims rather than a raw count such as "12 Questions".

Potential examples for a technical concept:

- definition/identity;
- mechanism/cause;
- conditions/constraints;
- consequences/trade-offs;
- comparison with alternatives;
- failure modes/misconceptions;
- application to examples/cases.

This list is illustrative, not a canonical taxonomy.

## 3. Cognitive/performance depth changes what counts as evidence

Bloom's revised taxonomy distinguishes cognitive processes such as remember, understand, apply, analyze, evaluate and create.

Miller's assessment framework makes the same general point for professional competence using "knows", "knows how", "shows how" and "does": different intended performances require different assessment methods.

A recall Question can therefore cover factual retrieval while leaving application, diagnosis, design or actual performance untested.

### Implication for Prep

Coverage should likely be multidimensional rather than a single percentage.

For example:

```text
Knowledge/capability: database transaction isolation

remember      -> retrieval item
understand    -> explain anomalies
apply         -> choose isolation for a case
analyze       -> diagnose concurrency behavior
evaluate      -> justify trade-off
perform       -> configure/debug in a realistic task
```

Prep should not adopt Bloom or Miller verbatim without project-specific validation; they demonstrate the need for a depth/performance dimension.

## 4. Variety matters for transfer

Research on retrieval practice shows that repeated retrieval can improve retention, but transfer is not automatic.

A meta-analysis of test-enhanced learning found positive transfer overall, with effects varying by transfer type and task.

Experimental work found that retrieving/applying a concept across different examples improved later transfer to new examples compared with repeatedly practicing the same example.

Recent work continues to show that the interaction between retrieval practice, worked examples and content variability depends on instructional context and the kind of learning sought.

### Implication for Prep

"Many Questions" can still under-cover a KnowledgeNode if they are near-duplicates.

A future coverage model should consider **context/example variability** or the range of situations in which a capability must be demonstrated.

## 5. No single item format captures every kind of competence

Miller explicitly argued that different levels of competence require different assessment approaches.

Recent reviews of higher-order-thinking assessment also report multiple tool families and warn about over-reliance on outcome-only/summative instruments.

Possible evidence sources can include, depending on the intended outcome:

- retrieval questions;
- constructed explanations;
- comparison/justification prompts;
- problem solving;
- debugging/diagnosis tasks;
- worked-example completion;
- simulations;
- projects or implementation tasks;
- observation of actual performance.

### Implication for Prep

`Question` is justified as the first concrete artifact for the Anki/retrieval slice, but should not silently become the universal abstraction for all future learning evidence.

## 6. Mapping items to attributes is possible but not automatically authoritative

Cognitive Diagnostic Assessment uses structures such as a Q-matrix to map items to latent skills/attributes.

This is conceptually relevant to Prep's alignment problem, but Q-matrix construction and validation typically require expert judgment and calibration; recent methodological work still treats Q-matrix validation as a substantial problem.

### Implication for Prep

Automation can eventually suggest:

- likely uncovered aspects;
- redundant/near-duplicate items;
- missing depth levels;
- weakly supported mappings.

But current evidence does not justify making an automated "coverage score" authoritative without a defined semantic model and validation process.

## 7. Concept inventories show why inference must be conservative

Concept inventories are designed to probe conceptual understanding and often use distractors based on known misconceptions.

However, validation research has shown that evidence for claims about understanding specific concepts or diagnosing misconceptions can be much weaker than the apparent simplicity of a test score suggests.

### Implication for Prep

A curation UI should distinguish:

- structural facts: "no tasks aligned";
- curator judgments: "coverage judged adequate for X";
- validated measurement claims;
- machine suggestions/confidence.

These should not collapse into one percentage.

## Candidate model for future Prep research

A useful next hypothesis is a **coverage matrix**, not a scalar:

```text
                       learning support        evidence / assessment
content/aspects              ?                        ?
cognitive depth              ?                        ?
context/transfer range       ?                        ?
performance modality         ?                        ?
```

Rows/columns can be refined after experiments with real technical topics.

This matrix could be attached to a Requirement or KnowledgeNode, but ownership is intentionally unresolved. Target-relative depth may mean some coverage is specific to a LearningTarget rather than intrinsic to KnowledgeNode.

## Recommendation for current v1

Do not expand the first implementation merely to satisfy this research.

Keep the current coherent slice:

```text
curated Target
  -> Requirements
  -> Knowledge
  -> Questions
  -> Study Set
  -> Anki
  -> ReviewObservations
```

But preserve these constraints:

- Question count is not coverage;
- "has Questions" is a structural fact, not semantic adequacy;
- no coverage percentage;
- curation owns future coverage-quality work;
- Learning mode does not ask the learner to judge material completeness;
- future material/activity types must be introduced from demonstrated coverage/use-case needs, not as a generic abstraction in advance.

## Research sources

1. Biggs, J. (1996). *Enhancing teaching through constructive alignment*. Higher Education 32, 347–364. DOI: 10.1007/BF00138871.
2. Mislevy, R. J., Almond, R. G., & Lukas, J. F. (2003). *A Brief Introduction to Evidence-Centered Design*. ETS Research Report RR-03-16.
3. Hansen, E. G. (2011). *Evidence-Centered Design for Learning*. ETS Research Memorandum RM-11-02.
4. Raymond, M. R., & Grande, J. P. (2019). *A practical guide to test blueprinting*. Medical Teacher 41(8), 854–861. DOI: 10.1080/0142159X.2019.1595556.
5. Miller, G. E. (1990). *The assessment of clinical skills/competence/performance*. Academic Medicine 65(9 Suppl), S63–S67. DOI: 10.1097/00001888-199009000-00045.
6. Pan, S. C., & Rickard, T. C. (2018). *Transfer of test-enhanced learning: Meta-analytic review and synthesis*. Psychological Bulletin 144(7), 710–756. DOI: 10.1037/bul0000151.
7. Butler, A. C., Black-Maier, A. C., Raley, N. D., & Marsh, E. J. (2018). *Retrieving and applying knowledge to different examples promotes transfer of learning*. Journal of Experimental Psychology: Applied. DOI: 10.1037/xap0000142.
8. Cao, M., & Carvalho, P. F. (2026). *Striking the Balance: How Variability Shapes Retrieval Practice and Worked Examples for Transfer Learning*. Educational Psychology Review 38, 71.
9. Jorion, N. et al. (2015). *An Analytic Framework for Evaluating the Validity of Concept Inventory Claims*. Journal of Engineering Education 104(4), 454–496. DOI: 10.1002/jee.20104.
10. *From theory to practice: A comprehensive toolkit for Q-matrix validation in cognitive diagnosis* (2026), systematic review indexed in PubMed PMID 42082874.

## Research URLs

- https://doi.org/10.1007/BF00138871
- https://www.ets.org/research/policy_research_reports/publications/report/2003/hsgs.html
- https://www.ets.org/research/policy_research_reports/publications/report/2011/imbu.html
- https://pubmed.ncbi.nlm.nih.gov/31017518/
- https://pubmed.ncbi.nlm.nih.gov/2400509/
- https://pubmed.ncbi.nlm.nih.gov/29733621/
- https://pubmed.ncbi.nlm.nih.gov/29265856/
- https://link.springer.com/article/10.1007/s10648-026-10169-w
- https://onlinelibrary.wiley.com/doi/10.1002/jee.20104
- https://pubmed.ncbi.nlm.nih.gov/42082874/
