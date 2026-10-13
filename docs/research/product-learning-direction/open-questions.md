# Open research questions

This file owns live **research questions and priorities**, not Harness Core Questions or engineering acceptance.

| ID | Priority / state | Decision or missing evidence |
| --- | --- | --- |
| Q-PLD-17 — conceptual subject model | **P0 OPEN** | Select a faithful model of Goal, CapabilityDescription, Knowledge, StudyMaterial, directed/qualified assertions and contextual study scope. Required fixture with G→C→K (no direct G–K), shared K, typed K–K, incomplete G, material alternatives and mutation/delete cases. No owner-approved full ontology yet. |
| G/C and C/K semantic predicates | **P0 OPEN** | Distinguish Goal `requires` vs `targets` vs `focus`; distinguish meaning, necessity, role and direction of C–K links. Do not infer them from navigation. |
| Material associations | **P0 OPEN** | Whether and when StudyMaterial relates directly to Knowledge, CapabilityDescription or other entities; author's intended use vs learner selection; no M–K or M–C predicate is admitted. |
| Knowledge relations and levels | **P0 OPEN** | Which *meaningful* K–K predicate families and possible types to admit; whether width/depth is needed and what content detail vs study objective means. No universal depth scale selected. |
| Relation identity/lifecycle | **P0 OPEN** | Direction, proposition equality vs relation record identity, multiplicity, duplicate import, identity on edits, deletion/link integrity and incomplete/unknown facts. |
| Recorded learning data boundary | **P0 OPEN** | External Activity/Result vs aggregate statistics; whether records refer to exported items or materials, how missing mappings behave; no automatic competence estimation. Respect already accepted MVP Activity/Result obligations. |
| Capability composition | **P1 OPEN** | Optional C–C aspect/specialization versus prerequisite/procedure; no generic execution order, DAG or mandatory nesting. |
| Q-PLD-16 / EX-PLD-09 — integrated experience | **P0 WAITING** | Corrected subject model must be tested against the independently studied universal presentation contract before one coherent G/C/K/M journey and browser user-task checks. |
| Q-PLD-13 / EX-PLD-06 — actual user value | **P0 WAITING** | Once an integrated concept and usable prototype exist, compare orientation and material transfer against existing tools using the same coherent supplied corpus and real user actions. |
| Q-PLD-18 — independent universal workspace | **CLOSED — QUALIFIED RESEARCH ONLY** | Synthetic read-only projection/interaction expressiveness resolved for bounded cases (25/25); owner UX adoption, editing, accessibility and human usability remain undecided. |
| Graph added value, editorial corpus work | **P1/P2 DEFERRED** | Run only if a concrete task needs 2D/3D advantage or independent subject-content review; neither blocks EX-PLD-10 or the first integrated concept. |

Owner-confirmed research inputs: `IDENTITY=INSTANCE`, `RELATION-IDENTITY=INSTANCE`, `STRUCTURE=DISTINCT-CONCEPTS`, `D1=SELECTIVE-ADMISSIBILITY`; Goal may have zero C; no direct G–K; every asserted K–K edge is explicitly typed. **These do not resolve any particular predicate, relation count or data schema.**
