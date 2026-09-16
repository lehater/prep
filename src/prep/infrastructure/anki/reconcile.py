from __future__ import annotations

import base64
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Protocol


class AnkiApi(Protocol):
    def invoke(self, action: str, **params: Any) -> Any: ...


@dataclass(frozen=True)
class CardTemplateSpec:
    name: str
    front: str
    back: str

    def as_ankiconnect(self) -> dict[str, str]:
        return {"Name": self.name, "Front": self.front, "Back": self.back}


@dataclass(frozen=True)
class NoteTypeSpec:
    name: str
    fields: tuple[str, ...]
    templates: tuple[CardTemplateSpec, ...]
    css: str = ""
    is_cloze: bool = False

    def template_map(self) -> dict[str, dict[str, str]]:
        return {
            template.name: {"Front": template.front, "Back": template.back}
            for template in self.templates
        }


@dataclass
class NoteTypeMigration:
    created: bool = False
    added_fields: list[str] = field(default_factory=list)
    removed_empty_fields: list[str] = field(default_factory=list)
    preserved_nonempty_fields: list[str] = field(default_factory=list)
    added_templates: list[str] = field(default_factory=list)
    removed_templates: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class UpsertResult:
    note_id: int
    status: str


def escape_search_value(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def _batched(values: list[int], size: int = 500) -> list[list[int]]:
    return [values[index : index + size] for index in range(0, len(values), size)]


def ensure_deck(anki: AnkiApi, deck_name: str) -> bool:
    """Ensure a deck exists. Returns True only when it was created."""
    if deck_name in set(anki.invoke("deckNames")):
        return False
    anki.invoke("createDeck", deck=deck_name)
    return True


def _field_has_data(anki: AnkiApi, model_name: str, field_name: str) -> bool:
    note_ids = [
        int(note_id)
        for note_id in anki.invoke(
            "findNotes", query=f'note:"{escape_search_value(model_name)}"'
        )
    ]
    for batch in _batched(note_ids):
        for info in anki.invoke("notesInfo", notes=batch):
            field_info = info.get("fields", {}).get(field_name)
            if field_info is None:
                continue
            value = (
                field_info.get("value", "")
                if isinstance(field_info, dict)
                else str(field_info)
            )
            if str(value).strip():
                return True
    return False


def ensure_note_type(
    anki: AnkiApi,
    spec: NoteTypeSpec,
    *,
    removable_legacy_fields: tuple[str, ...] = (),
    remove_extra_templates: bool = False,
) -> NoteTypeMigration:
    """Create or safely evolve a NoteType.

    Legacy fields are removed only when empty across all notes. Non-empty fields
    are preserved to avoid destructive migration of user data.
    """
    migration = NoteTypeMigration()
    models = set(anki.invoke("modelNames"))
    if spec.name not in models:
        anki.invoke(
            "createModel",
            modelName=spec.name,
            inOrderFields=list(spec.fields),
            css=spec.css,
            isCloze=spec.is_cloze,
            cardTemplates=[template.as_ankiconnect() for template in spec.templates],
        )
        migration.created = True
        return migration

    existing_fields = set(anki.invoke("modelFieldNames", modelName=spec.name))
    for field_name in spec.fields:
        if field_name not in existing_fields:
            anki.invoke("modelFieldAdd", modelName=spec.name, fieldName=field_name)
            migration.added_fields.append(field_name)

    existing_templates = anki.invoke("modelTemplates", modelName=spec.name)
    desired_templates = spec.template_map()
    for template in spec.templates:
        if template.name not in existing_templates:
            anki.invoke(
                "modelTemplateAdd",
                modelName=spec.name,
                template=template.as_ankiconnect(),
            )
            migration.added_templates.append(template.name)

    anki.invoke(
        "updateModelTemplates",
        model={"name": spec.name, "templates": desired_templates},
    )
    anki.invoke("updateModelStyling", model={"name": spec.name, "css": spec.css})

    if remove_extra_templates:
        current_templates = anki.invoke("modelTemplates", modelName=spec.name)
        for template_name in list(current_templates):
            if template_name not in desired_templates:
                anki.invoke(
                    "modelTemplateRemove",
                    modelName=spec.name,
                    templateName=template_name,
                )
                migration.removed_templates.append(template_name)

    for legacy_field in removable_legacy_fields:
        current_fields = set(anki.invoke("modelFieldNames", modelName=spec.name))
        if legacy_field not in current_fields or legacy_field in spec.fields:
            continue
        if _field_has_data(anki, spec.name, legacy_field):
            migration.preserved_nonempty_fields.append(legacy_field)
            continue
        anki.invoke("modelFieldRemove", modelName=spec.name, fieldName=legacy_field)
        migration.removed_empty_fields.append(legacy_field)

    current_fields = set(anki.invoke("modelFieldNames", modelName=spec.name))
    for index, field_name in enumerate(spec.fields):
        if field_name in current_fields:
            anki.invoke(
                "modelFieldReposition",
                modelName=spec.name,
                fieldName=field_name,
                index=index,
            )

    return migration


def _exact_field_value(info: dict[str, Any], field_name: str) -> str:
    field_info = info.get("fields", {}).get(field_name)
    if field_info is None:
        return ""
    if isinstance(field_info, dict):
        return str(field_info.get("value", ""))
    return str(field_info)


def find_note_by_external_id(
    anki: AnkiApi,
    *,
    field_name: str,
    external_id: str,
    model_name: str | None = None,
) -> int | None:
    """Resolve exactly one note by repository-owned stable identity.

    Search results are rechecked via notesInfo so Anki search tokenization cannot
    silently turn an approximate match into identity equivalence.
    """
    parts: list[str] = []
    if model_name:
        parts.append(f'note:"{escape_search_value(model_name)}"')
    parts.append(f'{field_name}:"{escape_search_value(external_id)}"')
    candidate_ids = [
        int(note_id)
        for note_id in anki.invoke("findNotes", query=" ".join(parts))
    ]
    if not candidate_ids:
        return None

    infos = anki.invoke("notesInfo", notes=candidate_ids)
    exact_ids = [
        int(info["noteId"])
        for info in infos
        if _exact_field_value(info, field_name).strip() == external_id
    ]
    if len(exact_ids) > 1:
        raise RuntimeError(
            f"Duplicate Anki notes found for {field_name}={external_id!r}: {exact_ids}"
        )
    return exact_ids[0] if exact_ids else None


def upsert_note(
    anki: AnkiApi,
    *,
    external_id_field: str,
    external_id: str,
    deck_name: str,
    model_name: str,
    fields: dict[str, str],
    tags: list[str],
) -> UpsertResult:
    """Create or update one note while preserving Anki scheduling state."""
    if fields.get(external_id_field) != external_id:
        raise ValueError(
            f"fields[{external_id_field!r}] must equal external_id {external_id!r}"
        )

    existing = find_note_by_external_id(
        anki,
        field_name=external_id_field,
        external_id=external_id,
        model_name=model_name,
    )
    if existing is None:
        note_id = anki.invoke(
            "addNote",
            note={
                "deckName": deck_name,
                "modelName": model_name,
                "fields": fields,
                "tags": tags,
                "options": {"allowDuplicate": False},
            },
        )
        return UpsertResult(note_id=int(note_id), status="created")

    anki.invoke("updateNoteFields", note={"id": existing, "fields": fields})

    info_list = anki.invoke("notesInfo", notes=[existing])
    if info_list:
        existing_tags = set(info_list[0].get("tags", []))
        missing_tags = [tag for tag in tags if tag not in existing_tags]
        if missing_tags:
            anki.invoke("addTags", notes=[existing], tags=" ".join(missing_tags))

    return UpsertResult(note_id=existing, status="updated")


def store_media_file(anki: AnkiApi, path: Path, *, filename: str | None = None) -> str:
    """Upload one local file to Anki media and return Anki's stored filename."""
    target_name = filename or path.name
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    stored = anki.invoke("storeMediaFile", filename=target_name, data=data)
    return str(stored)
