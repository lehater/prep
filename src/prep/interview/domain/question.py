from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class QuestionAssessment:
    reference_answer: str
    required_points: tuple[str, ...]


@dataclass(frozen=True)
class Concept:
    id: str
    title: str
    sources: tuple[str, ...] = ()


@dataclass(frozen=True)
class Question:
    id: str
    concept_id: str
    question_type: str
    prompt: str
    assessment: QuestionAssessment


@dataclass(frozen=True)
class QuestionBank:
    id: str
    title: str
    concepts: tuple[Concept, ...]
    questions: tuple[Question, ...]

    def concept(self, concept_id: str) -> Concept:
        matches = [concept for concept in self.concepts if concept.id == concept_id]
        if len(matches) != 1:
            raise ValueError(
                f"Expected exactly one concept {concept_id!r} in bank {self.id!r}; "
                f"found {len(matches)}"
            )
        return matches[0]
