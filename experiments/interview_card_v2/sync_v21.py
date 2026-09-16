from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(ROOT))

from prep.infrastructure.anki import AnkiConnect  # noqa: E402

from experiments.interview_card_v2.anki_v21 import (  # noqa: E402
    DEFAULT_DECK,
    NOTE_TYPE_NAME,
    PrototypeAnkiStudySystemV21,
)
from experiments.interview_card_v2.model import load_prototypes  # noqa: E402

DEFAULT_DATA = ROOT / "experiments" / "interview_card_v2" / "prototypes.json"
DEFAULT_TAXONOMY = ROOT / "model" / "question-taxonomy.json"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description=(
            "Preview or sync the learner-first Prep Card v2.1 projection "
            "to local Anki."
        )
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Enable Anki mutations. Without this flag the command is read-only.",
    )
    parser.add_argument(
        "--endpoint",
        default="http://127.0.0.1:8765",
        help="AnkiConnect endpoint.",
    )
    parser.add_argument(
        "--deck",
        default=DEFAULT_DECK,
        help="Destination deck for v2.1 prototype notes.",
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=DEFAULT_DATA,
        help="Shared v2/v2.1 prototype JSON dataset.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    objects = load_prototypes(args.data, DEFAULT_TAXONOMY)
    anki = AnkiConnect(url=args.endpoint)
    system = PrototypeAnkiStudySystemV21(anki, deck_name=args.deck)
    results = system.reconcile(objects, dry_run=not args.apply)

    counts = dict(sorted(Counter(result.status for result in results).items()))
    payload = {
        "mode": "apply" if args.apply else "dry-run",
        "note_type": NOTE_TYPE_NAME,
        "deck": args.deck,
        "objects": len(objects),
        "counts": counts,
        "results": [
            {
                "prototype_id": result.prototype_id,
                "status": result.status,
                "external_ref": result.external_ref,
                "message": result.message,
            }
            for result in results
        ],
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 1 if counts.get("error") or counts.get("conflict") else 0


if __name__ == "__main__":
    raise SystemExit(main())
