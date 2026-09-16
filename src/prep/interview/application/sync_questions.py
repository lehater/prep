from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from typing import Mapping

from prep.interview.domain import QuestionBank

from .ports import StudyQuestion, StudySyncResult, StudySystem


@dataclass(frozen=True)
class SyncReport:
    results: tuple[StudySyncResult, ...]

    @property
    def counts(self) -> dict[str, int]:
        counts = Counter(result.status for result in self.results)
        return dict(sorted(counts.items()))


class SyncInterviewQuestions:
    def __init__(
        self,
        study_system: StudySystem,
        *,
        learning_task_by_question_type: Mapping[str, str],
    ) -> None:
        self._study_system = study_system
        self._learning_task_by_question_type = dict(learning_task_by_question_type)

    def execute(self, bank: QuestionBank, *, dry_run: bool = True) -> SyncReport:
        projections: list[StudyQuestion] = []
        for question in bank.questions:
            try:
                learning_task = self._learning_task_by_question_type[question.question_type]
            except KeyError as exc:
                raise ValueError(
                    f"Unknown QuestionType {question.question_type!r} for "
                    f"question {question.id!r}"
                ) from exc

            concept = bank.concept(question.concept_id)
            projections.append(
                StudyQuestion(
                    question_id=question.id,
                    concept_id=question.concept_id,
                    question_type=question.question_type,
                    learning_task=learning_task,
                    prompt=question.prompt,
                    reference_answer=question.assessment.reference_answer,
                    required_points=question.assessment.required_points,
                    sources=concept.sources,
                )
            )

        results = self._study_system.reconcile_questions(
            tuple(projections), dry_run=dry_run
        )
        return SyncReport(results=tuple(results))
