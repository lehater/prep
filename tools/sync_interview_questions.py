#!/usr/bin/env python3
from __future__ import annotations

import argparse
import glob
import json
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from prep.infrastructure.anki import AnkiConnect, AnkiConnectError
from prep.interview.application import SyncInterviewQuestions
from prep.interview.infrastructure import (
    InterviewAnkiStudySystem,
    load_learning_task_mapping,
    load_question_bank,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Preview or synchronize canonical Interview Preparation questions to Anki."
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Perform Anki mutations. Without this flag the command is read-only dry-run.",
    )
    parser.add_argument(
        "--endpoint",
        default="http://127.0.0.1:8765",
        help="AnkiConnect endpoint (default: %(default)s).",
    )
    parser.add_argument("--deck", default="Prep", help="Target Anki deck.")
    parser.add_argument(
        "--taxonomy",
        type=Path,
        default=ROOT / "model" / "question-taxonomy.json",
        help="Question taxonomy JSON path.",
    )
    parser.add_argument(
        "--questions",
        default=str(ROOT / "questions" / "*.json"),
        help="Glob selecting canonical question-bank JSON files.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    paths = [Path(path) for path in sorted(glob.glob(args.questions))]
    if not paths:
        print(f"No question banks matched: {args.questions}", file=sys.stderr)
        return 2

    try:
        learning_tasks = load_learning_task_mapping(args.taxonomy)
        anki = AnkiConnect(args.endpoint)
        api_version = anki.invoke("version")
    except (ValueError, AnkiConnectError) as exc:
        print(str(exc), file=sys.stderr)
        return 2

    study_system = InterviewAnkiStudySystem(anki, deck_name=args.deck)
    use_case = SyncInterviewQuestions(
        study_system,
        learning_task_by_question_type=learning_tasks,
    )

    total = Counter()
    rows: list[dict[str, str | None]] = []
    for path in paths:
        try:
            bank = load_question_bank(path)
            report = use_case.execute(bank, dry_run=not args.apply)
        except ValueError as exc:
            print(f"{path}: {exc}", file=sys.stderr)
            return 2

        total.update(result.status for result in report.results)
        rows.extend(
            {
                "bank": bank.id,
                "question_id": result.question_id,
                "status": result.status,
                "external_ref": result.external_ref,
                "message": result.message,
            }
            for result in report.results
        )

    print(
        json.dumps(
            {
                "mode": "apply" if args.apply else "dry-run",
                "anki_connect_version": api_version,
                "deck": args.deck,
                "counts": dict(sorted(total.items())),
                "results": rows,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 1 if total["conflict"] or total["error"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
