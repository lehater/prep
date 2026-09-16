from __future__ import annotations


class FakeAnki:
    def __init__(self):
        self.decks = set()
        self.models: dict[str, dict] = {}
        self.notes: dict[int, dict] = {}
        self.next_note_id = 100
        self.calls: list[tuple[str, dict]] = []

    def invoke(self, action, **params):
        self.calls.append((action, params))

        if action == "version":
            return 6
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
                        key: {"value": value}
                        for key, value in self.notes[nid]["fields"].items()
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
        if action == "removeTags":
            remove = set(params["tags"].split())
            for nid in params["notes"]:
                self.notes[nid]["tags"] = [
                    tag for tag in self.notes[nid]["tags"] if tag not in remove
                ]
            return None

        raise AssertionError(f"Unexpected action {action}: {params}")
