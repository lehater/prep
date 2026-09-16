from __future__ import annotations

import sys
import unittest
from dataclasses import replace
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fake_anki import FakeAnki
from experiments.interview_card_v2.anki import (
    DEFAULT_DECK,
    NOTE_TYPE_NAME,
    NOTE_TYPE_SPEC,
    PrototypeAnkiStudySystem,
    render_fields,
)
from experiments.interview_card_v2.model import load_prototypes


class PrepCardV2PrototypeTests(unittest.TestCase):
    def setUp(self):
        self.objects = load_prototypes(
            ROOT / "experiments" / "interview_card_v2" / "prototypes.json",
            ROOT / "model" / "question-taxonomy.json",
        )

    def test_dataset_covers_two_families_and_guidance_levels(self):
        self.assertEqual(14, len(self.objects))
        ids = {obj.prototype_id for obj in self.objects}
        self.assertEqual(14, len(ids))
        self.assertTrue(any(obj.prototype_id.startswith("backend.idempotency") for obj in self.objects))
        self.assertTrue(any(obj.prototype_id.startswith("python.asyncio") for obj in self.objects))
        self.assertEqual({"worked", "faded", "independent"}, {obj.guidance_level for obj in self.objects})
        formats = {obj.stimulus_format for obj in self.objects}
        self.assertTrue({"none", "prose", "scenario", "code", "mixed"}.issubset(formats))
        responses = {obj.response_format for obj in self.objects}
        self.assertTrue({"self-explanation", "trace-table", "code-completion", "code-repair", "code-writing", "architecture-sketch"}.issubset(responses))

    def test_note_type_uses_one_template_and_semantic_sections(self):
        self.assertEqual("Prep Learning Object v2", NOTE_TYPE_SPEC.name)
        self.assertEqual(1, len(NOTE_TYPE_SPEC.templates))
        back = NOTE_TYPE_SPEC.templates[0].back
        self.assertIn("Краткий ответ", back)
        self.assertIn("Объяснение", back)
        self.assertIn("Ключевые пункты", back)
        self.assertIn("Типичная ошибка", back)
        self.assertIn("{{#CorrectArtifact}}", back)
        self.assertIn(".nightMode", NOTE_TYPE_SPEC.css)

    def test_code_is_escaped_and_rendered_as_preformatted_block(self):
        obj = next(item for item in self.objects if item.stimulus_format == "code")
        changed = replace(obj, stimulus="if a < b:\n    await work()")
        fields = render_fields(changed)
        self.assertIn('<pre class="prep-code">', fields["Stimulus"])
        self.assertIn("a &lt; b", fields["Stimulus"])
        self.assertNotIn("a < b", fields["Stimulus"])

    def test_dry_run_is_read_only(self):
        anki = FakeAnki()
        results = PrototypeAnkiStudySystem(anki).reconcile(self.objects, dry_run=True)
        self.assertEqual({"created"}, {result.status for result in results})
        self.assertEqual(14, len(results))
        self.assertEqual(set(), anki.decks)
        self.assertEqual({}, anki.models)
        self.assertEqual({}, anki.notes)
        mutating = {"createDeck", "createModel", "addNote", "updateNoteFields", "addTags", "removeTags"}
        self.assertFalse(any(action in mutating for action, _ in anki.calls))

    def test_first_apply_creates_and_second_is_unchanged(self):
        anki = FakeAnki()
        system = PrototypeAnkiStudySystem(anki)
        first = system.reconcile(self.objects, dry_run=False)
        first_note_ids = sorted(anki.notes)
        second = system.reconcile(self.objects, dry_run=False)

        self.assertEqual(14, sum(result.status == "created" for result in first))
        self.assertEqual(14, sum(result.status == "unchanged" for result in second))
        self.assertEqual(first_note_ids, sorted(anki.notes))
        self.assertEqual(14, len(anki.notes))
        self.assertIn(DEFAULT_DECK, anki.decks)
        self.assertIn(NOTE_TYPE_NAME, anki.models)

    def test_content_update_preserves_note_identity(self):
        anki = FakeAnki()
        system = PrototypeAnkiStudySystem(anki)
        system.reconcile(self.objects, dry_run=False)
        original_ids = sorted(anki.notes)

        changed_first = replace(self.objects[0], prompt=self.objects[0].prompt + " Ответь кратко.")
        changed_objects = (changed_first,) + self.objects[1:]
        result = system.reconcile(changed_objects, dry_run=False)

        self.assertEqual(1, sum(item.status == "updated" for item in result))
        self.assertEqual(13, sum(item.status == "unchanged" for item in result))
        self.assertEqual(original_ids, sorted(anki.notes))


if __name__ == "__main__":
    unittest.main()
