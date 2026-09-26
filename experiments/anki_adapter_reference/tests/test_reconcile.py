from __future__ import annotations

import base64
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from anki_adapter import (
    CardTemplateSpec,
    NoteTypeSpec,
    ensure_deck,
    ensure_note_type,
    find_note_by_external_id,
    store_media_file,
    upsert_note,
)


class FakeAnki:
    def __init__(self):
        self.decks = set()
        self.models: dict[str, dict] = {}
        self.notes: dict[int, dict] = {}
        self.next_note_id = 100
        self.media: dict[str, bytes] = {}

    def invoke(self, action, **params):
        if action == "deckNames":
            return sorted(self.decks)
        if action == "createDeck":
            self.decks.add(params["deck"])
            return 1

        if action == "modelNames":
            return sorted(self.models)
        if action == "createModel":
            self.models[params["modelName"]] = {
                "fields": list(params["inOrderFields"]),
                "templates": {
                    template["Name"]: {
                        "Front": template["Front"],
                        "Back": template["Back"],
                    }
                    for template in params["cardTemplates"]
                },
                "css": params["css"],
            }
            return {"id": 1}
        if action == "modelFieldNames":
            return list(self.models[params["modelName"]]["fields"])
        if action == "modelFieldAdd":
            self.models[params["modelName"]]["fields"].append(params["fieldName"])
            return None
        if action == "modelFieldRemove":
            self.models[params["modelName"]]["fields"].remove(params["fieldName"])
            for note in self.notes.values():
                note["fields"].pop(params["fieldName"], None)
            return None
        if action == "modelFieldReposition":
            fields = self.models[params["modelName"]]["fields"]
            field_name = params["fieldName"]
            fields.remove(field_name)
            fields.insert(params["index"], field_name)
            return None
        if action == "modelTemplates":
            return dict(self.models[params["modelName"]]["templates"])
        if action == "modelTemplateAdd":
            template = params["template"]
            self.models[params["modelName"]]["templates"][template["Name"]] = {
                "Front": template["Front"],
                "Back": template["Back"],
            }
            return None
        if action == "modelTemplateRemove":
            self.models[params["modelName"]]["templates"].pop(params["templateName"], None)
            return None
        if action == "updateModelTemplates":
            model = params["model"]
            self.models[model["name"]]["templates"] = dict(model["templates"])
            return None
        if action == "updateModelStyling":
            model = params["model"]
            self.models[model["name"]]["css"] = model["css"]
            return None

        if action == "findNotes":
            query = params["query"]
            if query.startswith('note:"') and query.count(":") == 1:
                model = query[len('note:"') : -1]
                return [nid for nid, note in self.notes.items() if note["model"] == model]
            field_fragment = query.split()[-1]
            field_name, quoted = field_fragment.split(":", 1)
            wanted = quoted.strip('"').replace('\\"', '"').replace('\\\\', '\\')
            model = None
            if query.startswith('note:"'):
                model = query.split('"', 2)[1]
            return [
                nid
                for nid, note in self.notes.items()
                if (model is None or note["model"] == model)
                and note["fields"].get(field_name, "") == wanted
            ]
        if action == "notesInfo":
            return [
                {
                    "noteId": nid,
                    "fields": {
                        key: {"value": value} for key, value in self.notes[nid]["fields"].items()
                    },
                    "tags": list(self.notes[nid]["tags"]),
                    "cards": [nid * 10],
                }
                for nid in params["notes"]
                if nid in self.notes
            ]
        if action == "addNote":
            nid = self.next_note_id
            self.next_note_id += 1
            note = params["note"]
            self.notes[nid] = {
                "model": note["modelName"],
                "deck": note["deckName"],
                "fields": dict(note["fields"]),
                "tags": list(note["tags"]),
            }
            return nid
        if action == "updateNoteFields":
            nid = params["note"]["id"]
            self.notes[nid]["fields"].update(params["note"]["fields"])
            return None
        if action == "addTags":
            for nid in params["notes"]:
                for tag in params["tags"].split():
                    if tag not in self.notes[nid]["tags"]:
                        self.notes[nid]["tags"].append(tag)
            return None

        if action == "storeMediaFile":
            data = base64.b64decode(params["data"])
            self.media[params["filename"]] = data
            return params["filename"]

        raise AssertionError(f"Unexpected action {action}: {params}")


SPEC = NoteTypeSpec(
    name="Shared Test Note",
    fields=("ExternalId", "Prompt"),
    templates=(CardTemplateSpec("Card", "{{Prompt}}", "{{FrontSide}}"),),
    css=".card { font-size: 20px; }",
)


class SharedAnkiReconcileTests(unittest.TestCase):
    def test_ensure_deck_is_idempotent(self):
        anki = FakeAnki()
        self.assertTrue(ensure_deck(anki, "Prep"))
        self.assertFalse(ensure_deck(anki, "Prep"))
        self.assertEqual({"Prep"}, anki.decks)

    def test_ensure_note_type_creates_model(self):
        anki = FakeAnki()
        migration = ensure_note_type(anki, SPEC)
        self.assertTrue(migration.created)
        self.assertEqual(["ExternalId", "Prompt"], anki.models[SPEC.name]["fields"])

    def test_note_type_removes_only_empty_legacy_fields(self):
        anki = FakeAnki()
        ensure_note_type(anki, SPEC)
        anki.models[SPEC.name]["fields"].extend(["EmptyLegacy", "UsedLegacy"])
        anki.notes[1] = {
            "model": SPEC.name,
            "deck": "Prep",
            "fields": {
                "ExternalId": "x",
                "Prompt": "p",
                "EmptyLegacy": "",
                "UsedLegacy": "keep me",
            },
            "tags": [],
        }

        migration = ensure_note_type(
            anki,
            SPEC,
            removable_legacy_fields=("EmptyLegacy", "UsedLegacy"),
        )

        self.assertEqual(["EmptyLegacy"], migration.removed_empty_fields)
        self.assertEqual(["UsedLegacy"], migration.preserved_nonempty_fields)
        self.assertNotIn("EmptyLegacy", anki.models[SPEC.name]["fields"])
        self.assertIn("UsedLegacy", anki.models[SPEC.name]["fields"])

    def test_upsert_reuses_same_note_and_preserves_existing_tags(self):
        anki = FakeAnki()
        ensure_note_type(anki, SPEC)
        first = upsert_note(
            anki,
            external_id_field="ExternalId",
            external_id="q-1",
            deck_name="Prep",
            model_name=SPEC.name,
            fields={"ExternalId": "q-1", "Prompt": "first"},
            tags=["prep"],
        )
        anki.notes[first.note_id]["tags"].append("user-tag")
        second = upsert_note(
            anki,
            external_id_field="ExternalId",
            external_id="q-1",
            deck_name="Prep",
            model_name=SPEC.name,
            fields={"ExternalId": "q-1", "Prompt": "second"},
            tags=["prep", "generated"],
        )

        self.assertEqual("created", first.status)
        self.assertEqual("updated", second.status)
        self.assertEqual(first.note_id, second.note_id)
        self.assertEqual(1, len(anki.notes))
        self.assertEqual("second", anki.notes[first.note_id]["fields"]["Prompt"])
        self.assertEqual({"prep", "generated", "user-tag"}, set(anki.notes[first.note_id]["tags"]))

    def test_duplicate_external_identity_is_conflict(self):
        anki = FakeAnki()
        ensure_note_type(anki, SPEC)
        for nid in (1, 2):
            anki.notes[nid] = {
                "model": SPEC.name,
                "deck": "Prep",
                "fields": {"ExternalId": "same", "Prompt": str(nid)},
                "tags": [],
            }
        with self.assertRaisesRegex(RuntimeError, "Duplicate Anki notes"):
            find_note_by_external_id(
                anki,
                field_name="ExternalId",
                external_id="same",
                model_name=SPEC.name,
            )

    def test_media_upload_encodes_file(self):
        anki = FakeAnki()
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "sample.mp3"
            path.write_bytes(b"audio-bytes")
            stored = store_media_file(anki, path, filename="stable.mp3")
        self.assertEqual("stable.mp3", stored)
        self.assertEqual(b"audio-bytes", anki.media["stable.mp3"])


if __name__ == "__main__":
    unittest.main()
