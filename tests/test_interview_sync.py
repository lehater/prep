from __future__ import annotations

import sys
import unittest
from dataclasses import replace
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fake_anki import FakeAnki
from prep.interview.application import SyncInterviewQuestions
from prep.interview.infrastructure import (
    InterviewAnkiStudySystem,
    load_learning_task_mapping,
    load_question_bank,
)


class CapturingStudySystem:
    def __init__(self):
        self.questions = ()
        self.dry_run = None

    def reconcile_questions(self, questions, *, dry_run):
        self.questions = tuple(questions)
        self.dry_run = dry_run
        return ()


class InterviewSyncTests(unittest.TestCase):
    def setUp(self):
        self.bank = load_question_bank(ROOT / "questions" / "idempotency.json")
        self.mapping = load_learning_task_mapping(
            ROOT / "model" / "question-taxonomy.json"
        )

    def test_use_case_projects_domain_question_without_anki_concepts(self):
        study_system = CapturingStudySystem()
        use_case = SyncInterviewQuestions(
            study_system,
            learning_task_by_question_type=self.mapping,
        )

        use_case.execute(self.bank, dry_run=True)

        self.assertTrue(study_system.dry_run)
        self.assertEqual(8, len(study_system.questions))
        diagnose = next(
            question
            for question in study_system.questions
            if question.question_type == "diagnose"
        )
        self.assertEqual("analyze", diagnose.learning_task)
        self.assertEqual("backend.idempotency", diagnose.concept_id)
        self.assertEqual(2, len(diagnose.sources))

    def test_dry_run_on_empty_anki_is_read_only_and_reports_created(self):
        anki = FakeAnki()
        use_case = self._use_case(anki)

        report = use_case.execute(self.bank, dry_run=True)

        self.assertEqual({"created": 8}, report.counts)
        self.assertEqual(set(), anki.decks)
        self.assertEqual({}, anki.models)
        self.assertEqual({}, anki.notes)
        mutating = {
            "createDeck",
            "createModel",
            "addNote",
            "updateNoteFields",
            "addTags",
            "removeTags",
        }
        self.assertFalse(any(action in mutating for action, _ in anki.calls))

    def test_first_apply_creates_and_second_apply_is_unchanged(self):
        anki = FakeAnki()
        use_case = self._use_case(anki)

        first = use_case.execute(self.bank, dry_run=False)
        note_ids = sorted(anki.notes)
        second = use_case.execute(self.bank, dry_run=False)

        self.assertEqual({"created": 8}, first.counts)
        self.assertEqual({"unchanged": 8}, second.counts)
        self.assertEqual(8, len(anki.notes))
        self.assertEqual(note_ids, sorted(anki.notes))

    def test_changed_content_updates_existing_note_without_new_identity(self):
        anki = FakeAnki()
        use_case = self._use_case(anki)
        use_case.execute(self.bank, dry_run=False)
        original_ids = sorted(anki.notes)

        first_question = self.bank.questions[0]
        changed_question = replace(
            first_question,
            prompt=first_question.prompt + " Explain briefly.",
        )
        changed_bank = replace(
            self.bank,
            questions=(changed_question,) + self.bank.questions[1:],
        )

        report = use_case.execute(changed_bank, dry_run=False)

        self.assertEqual(1, report.counts.get("updated", 0))
        self.assertEqual(7, report.counts.get("unchanged", 0))
        self.assertEqual(original_ids, sorted(anki.notes))
        self.assertEqual(8, len(anki.notes))

    def test_duplicate_question_identity_is_conflict(self):
        anki = FakeAnki()
        use_case = self._use_case(anki)
        use_case.execute(self.bank, dry_run=False)

        first_id = sorted(anki.notes)[0]
        duplicate_id = 999
        anki.notes[duplicate_id] = {
            "model": anki.notes[first_id]["model"],
            "deck": anki.notes[first_id]["deck"],
            "fields": dict(anki.notes[first_id]["fields"]),
            "tags": list(anki.notes[first_id]["tags"]),
        }

        report = use_case.execute(self.bank, dry_run=True)

        self.assertEqual(1, report.counts.get("conflict", 0))
        self.assertEqual(7, report.counts.get("unchanged", 0))

    def _use_case(self, anki: FakeAnki) -> SyncInterviewQuestions:
        return SyncInterviewQuestions(
            InterviewAnkiStudySystem(anki),
            learning_task_by_question_type=self.mapping,
        )


if __name__ == "__main__":
    unittest.main()
