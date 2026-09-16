from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Protocol, Sequence


SyncStatus = Literal["created", "updated", "unchanged", "conflict", "error"]


@dataclass(frozen=True)
class StudyQuestion:
    question_id: str
    concept_id: str
    question_type: str
    learning_task: str
    prompt: str
    reference_answer: str
    required_points: tuple[str, ...]
    sources: tuple[str, ...] = ()


@dataclass(frozen=True)
class StudySyncResult:
    question_id: str
    status: SyncStatus
    external_ref: str | None = None
    message: str | None = None


class StudySystem(Protocol):
    """Outbound capability required by Interview Preparation to publish questions."""

    def reconcile_questions(
        self,
        questions: Sequence[StudyQuestion],
        *,
        dry_run: bool,
    ) -> Sequence[StudySyncResult]: ...
