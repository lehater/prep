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
NONCANONICAL_DOC_PREFIXES = ("docs/research/",)
HUMAN_PROJECTION_DOCS = {
    "docs/vision/vision.md",
    "docs/vision/product-capabilities.md",
}
PROGRAM_CONTROL_DOCS = {
    "docs/process/harness-first-defect-remediation.md",
}
GENERATED_GRAPH_DOCS = {
    "docs/generated/harness-graphs/capability-requires.dot",
    "docs/generated/harness-graphs/capability-requires.svg",
    "docs/generated/harness-graphs/capability-requires-reachability-only.dot",
    "docs/generated/harness-graphs/capability-requires-reachability-only.svg",
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
    allowed = (
        _canonical_doc_paths()
        | {"docs/README.md"}
        | HUMAN_PROJECTION_DOCS
        | PROGRAM_CONTROL_DOCS
        | GENERATED_GRAPH_DOCS
    )
    actual = {
        path.relative_to(ROOT).as_posix()
        for path in (ROOT / "docs").rglob("*")
        if path.is_file()
    }
    extra = sorted(
        path
        for path in actual - allowed
        if not path.startswith(NONCANONICAL_DOC_PREFIXES)
    )
    missing = sorted(allowed - actual)
    errors: list[str] = []
    if extra:
        errors.append(
            "docs/ contains unclassified files outside Harness Core, research, or human projections: "
            + ", ".join(extra)
        )
    if missing:
        errors.append(
            "Harness Core/index references missing docs files: " + ", ".join(missing)
        )
    return errors


def _walk_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from _walk_strings(item)
    elif isinstance(value, dict):
        for item in value.values():
            yield from _walk_strings(item)


def validate_harness_doc_references() -> list[str]:
    errors: list[str] = []
    for path in sorted((ROOT / ".harness").glob("*.yaml")):
        value = yaml.safe_load(path.read_text(encoding="utf-8"))
        for item in _walk_strings(value):
            if not item.startswith("docs/"):
                continue
            referenced = item.split("@", 1)[0]
            if not (ROOT / referenced).is_file():
                errors.append(
                    f"{path.relative_to(ROOT)}: missing Harness doc reference {item!r}"
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
    errors.extend(validate_harness_doc_references())

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
        f"research/human projections are explicitly noncanonical; "
        f"{len(markdown_files)} repository markdown file(s) have resolved relative links"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
