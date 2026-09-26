from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

import yaml

ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
FENCED_BLOCK = re.compile(r"```.*?```", re.DOTALL)
IGNORED_SCHEMES = {"http", "https", "mailto", "tel", "data"}
IGNORED_PATH_PARTS = {
    ".git",
    ".harness-tool",
    "node_modules",
    "dist",
    "coverage",
    "playwright-report",
    "test-results",
}


def _target_from_markdown(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("<") and ">" in raw:
        return raw[1 : raw.index(">")]
    return raw.split(maxsplit=1)[0]


def _is_repository_owned(path: Path) -> bool:
    relative = path.relative_to(ROOT)
    return not any(part in IGNORED_PATH_PARTS for part in relative.parts)


def _canonical_doc_paths() -> set[str]:
    core = yaml.safe_load((ROOT / ".harness/core.yaml").read_text(encoding="utf-8"))
    artifacts = core.get("artifacts", []) if isinstance(core, dict) else []
    return {
        item["path"]
        for item in artifacts
        if isinstance(item, dict)
        and isinstance(item.get("path"), str)
        and item["path"].startswith("docs/")
    }


def validate_doc_inventory() -> list[str]:
    allowed = _canonical_doc_paths() | {"docs/README.md"}
    actual = {
        path.relative_to(ROOT).as_posix()
        for path in (ROOT / "docs").rglob("*")
        if path.is_file()
    }
    extra = sorted(actual - allowed)
    missing = sorted(allowed - actual)
    errors: list[str] = []
    if extra:
        errors.append(
            "docs/ contains files outside Harness Core: " + ", ".join(extra)
        )
    if missing:
        errors.append(
            "Harness Core/index references missing docs files: " + ", ".join(missing)
        )
    return errors


def validate_file(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    text = FENCED_BLOCK.sub("", text)
    errors: list[str] = []

    for match in MARKDOWN_LINK.finditer(text):
        target = _target_from_markdown(match.group(1))
        if not target or target.startswith("#"):
            continue

        parsed = urlparse(target)
        if parsed.scheme.lower() in IGNORED_SCHEMES or parsed.netloc:
            continue

        path_part = unquote(parsed.path)
        if not path_part:
            continue

        if path_part.startswith("/"):
            resolved = ROOT / path_part.lstrip("/")
        else:
            resolved = path.parent / path_part

        if not resolved.exists():
            rel_source = path.relative_to(ROOT)
            errors.append(f"{rel_source}: broken link {target!r}")

    return errors


def main() -> int:
    errors = validate_doc_inventory()

    markdown_files = [
        path for path in sorted(ROOT.rglob("*.md")) if _is_repository_owned(path)
    ]
    for path in markdown_files:
        errors.extend(validate_file(path))

    if errors:
        print("Documentation validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(
        f"OK: Harness owns {len(_canonical_doc_paths())} canonical docs artifacts; "
        f"{len(markdown_files)} repository markdown file(s) have resolved relative links"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
