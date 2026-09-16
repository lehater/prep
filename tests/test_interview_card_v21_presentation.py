from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fake_anki import FakeAnki
from experiments.interview_card_v2.anki_v21 import (
    BACK_TEMPLATE,
    DEFAULT_DECK,
    FRONT_TEMPLATE,
    NOTE_TYPE_NAME,
    PrototypeAnkiStudySystemV21,
    render_fields,
)
from experiments.interview_card_v2.model import load_prototypes


class PrepCardV21PresentationTests(unittest.TestCase):
    def setUp(self):
        self.objects = load_prototypes(
            ROOT / "experiments" / "interview_card_v2" / "prototypes.json",
            ROOT / "model" / "question-taxonomy.json",
        )

    def test_v21_reuses_exact_same_fourteen_semantic_objects(self):
        self.assertEqual(14, len(self.objects))
        self.assertEqual(
            14,
            len({obj.prototype_id for obj in self.objects}),
        )

    def test_front_hides_raw_taxonomy_and_uses_learner_labels(self):
        self.assertIn("Тема", FRONT_TEMPLATE)
        self.assertIn("Контекст", FRONT_TEMPLATE)
        self.assertIn("Формат ответа", FRONT_TEMPLATE)
        self.assertIn("{{ConceptDisplay}}", FRONT_TEMPLATE)
        self.assertIn("{{ContextDisplay}}", FRONT_TEMPLATE)
        self.assertIn("{{ResponseGuidance}}", FRONT_TEMPLATE)

        self.assertNotIn("{{LearningTask}}", FRONT_TEMPLATE)
        self.assertNotIn("{{StimulusFormat}}", FRONT_TEMPLATE)
        self.assertNotIn("{{GuidanceLevel}}", FRONT_TEMPLATE)
        self.assertNotIn("{{ResponseFormat}}", FRONT_TEMPLATE)
        self.assertNotIn("{{QuestionType}}", FRONT_TEMPLATE)
        self.assertNotIn("{{KnowledgeKind}}", FRONT_TEMPLATE)
        self.assertNotIn("{{PrototypeId}}", FRONT_TEMPLATE)

    def test_payment_scenario_has_explicit_topic_context_and_human_response_guidance(self):
        obj = next(
            item
            for item in self.objects
            if item.prototype_id == "backend.idempotency.proto.002"
        )
        fields = render_fields(obj)

        self.assertEqual("Idempotency (идемпотентность)", fields["ConceptDisplay"])
        self.assertEqual("Payment API", fields["ContextDisplay"])
        self.assertEqual(
            "свободный ответ своими словами",
            fields["ResponseGuidance"],
        )
        self.assertNotEqual(fields["ResponseFormat"], fields["ResponseGuidance"])
        self.assertEqual("", fields["InteractionCue"])

    def test_instructional_context_is_not_presented_as_domain_context(self):
        obj = next(
            item
            for item in self.objects
            if item.prototype_id == "python.asyncio.proto.001"
        )
        fields = render_fields(obj)

        self.assertEqual("", fields["ContextDisplay"])
        self.assertEqual("Разобранный пример", fields["InteractionCue"])

    def test_diagnose_uses_one_human_cue_instead_of_taxonomy_badges(self):
        obj = next(
            item
            for item in self.objects
            if item.prototype_id == "python.asyncio.proto.004"
        )
        fields = render_fields(obj)

        self.assertEqual("Диагностика", fields["InteractionCue"])
        self.assertEqual(
            "найдите причину и исправьте код",
            fields["ResponseGuidance"],
        )

    def test_fast_check_precedes_deeper_explanation(self):
        short_answer = BACK_TEMPLATE.index("Краткий ответ")
        key_points = BACK_TEMPLATE.index("Ключевые пункты")
        explanation = BACK_TEMPLATE.index("Объяснение")

        self.assertLess(short_answer, explanation)
        self.assertLess(key_points, explanation)
        self.assertNotIn("prep-debug-meta", BACK_TEMPLATE)
        self.assertNotIn("{{PrototypeId}}", BACK_TEMPLATE)

    def test_v21_isolated_apply_is_idempotent(self):
        anki = FakeAnki()
        system = PrototypeAnkiStudySystemV21(anki)

        first = system.reconcile(self.objects, dry_run=False)
        first_ids = sorted(anki.notes)
        second = system.reconcile(self.objects, dry_run=False)

        self.assertEqual(14, sum(result.status == "created" for result in first))
        self.assertEqual(14, sum(result.status == "unchanged" for result in second))
        self.assertEqual(first_ids, sorted(anki.notes))
        self.assertEqual({DEFAULT_DECK}, anki.decks)
        self.assertIn(NOTE_TYPE_NAME, anki.models)

    def test_v21_dry_run_is_read_only(self):
        anki = FakeAnki()
        system = PrototypeAnkiStudySystemV21(anki)

        results = system.reconcile(self.objects, dry_run=True)

        self.assertEqual(14, sum(result.status == "created" for result in results))
        self.assertEqual(set(), anki.decks)
        self.assertEqual({}, anki.models)
        self.assertEqual({}, anki.notes)


if __name__ == "__main__":
    unittest.main()
