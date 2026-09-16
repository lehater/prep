#!/usr/bin/env python3
from __future__ import annotations

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"

RULES = (
    (
        SRC / "prep" / "interview" / "domain",
        (
            "prep.infrastructure",
            "prep.interview.application",
            "prep.interview.infrastructure",
        ),
        "Interview domain must not depend on application/infrastructure",
    ),
    (
        SRC / "prep" / "interview" / "application",
        (
            "prep.infrastructure",
            "prep.interview.infrastructure",
        ),
        "Interview application must depend on ports, not concrete infrastructure",
    ),
    (
        SRC / "prep" / "infrastructure",
        (
            "prep.interview",
        ),
        "Shared infrastructure must remain bounded-context independent",
    ),
)


def module_name(path: Path) -> str:
    return ".".join(path.relative_to(SRC).with_suffix("").parts)


def imported_modules(path: Path) -> list[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    current_package = module_name(path).split(".")[:-1]
    imports: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            if node.level:
                keep = max(0, len(current_package) - (node.level - 1))
                base = current_package[:keep]
                if node.module:
                    base.extend(node.module.split("."))
                imports.append(".".join(base))
            elif node.module:
                imports.append(node.module)
    return imports


def main() -> int:
    violations: list[str] = []
    for directory, forbidden_prefixes, rule in RULES:
        if not directory.exists():
            continue
        for path in sorted(directory.rglob("*.py")):
            for imported in imported_modules(path):
                if any(
                    imported == prefix or imported.startswith(prefix + ".")
                    for prefix in forbidden_prefixes
                ):
                    violations.append(
                        f"{path.relative_to(ROOT)} imports {imported}: {rule}"
                    )

    if violations:
        print("Architecture validation failed:")
        for violation in violations:
            print(f"- {violation}")
        return 1

    print("Architecture validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
