from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
MARKDOWN_LINK = re.compile(r"!?\[[^\]]*\]\(([^)]+)\)")
FENCED_BLOCK = re.compile(r"```.*?```", re.DOTALL)
IGNORED_SCHEMES = {"http", "https", "mailto", "tel", "data"}


def _target_from_markdown(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("<") and ">" in raw:
        return raw[1 : raw.index(">")]
    # Markdown permits an optional title after the URL. Repository paths in this
    # project do not contain spaces, so the first token is the target.
    return raw.split(maxsplit=1)[0]


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
    errors: list[str] = []
    markdown_files = sorted(ROOT.rglob("*.md"))

    for path in markdown_files:
        if ".git" in path.parts:
            continue
        errors.extend(validate_file(path))

    if errors:
        print("Documentation validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"OK: {len(markdown_files)} markdown file(s), relative links resolved")
    return 0


if __name__ == "__main__":
    sys.exit(main())
