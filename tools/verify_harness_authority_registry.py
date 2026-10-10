#!/usr/bin/env python3
"""Validate the pinned Harness Authority registry without claiming semantic readiness."""
from __future__ import annotations

import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
HARNESS_ROOT = Path(os.environ.get("HARNESS_ROOT", ROOT / ".harness-tool"))
if not HARNESS_ROOT.is_absolute():
    HARNESS_ROOT = (ROOT / HARNESS_ROOT).resolve()
sys.path.insert(0, str(HARNESS_ROOT / "src"))

from harness.reference_model.project_status import (
    bootstrap_registry,
    validate_registry,
)


def read_yaml(path: Path) -> dict:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    assert isinstance(value, dict), path
    return value


def main() -> None:
    catalog = read_yaml(HARNESS_ROOT / "catalogs/software-authorities-v0.yaml")
    registry = read_yaml(ROOT / ".harness/authority-assessments.yaml")
    core = read_yaml(ROOT / ".harness/core.yaml")
    errors = validate_registry(catalog, registry)
    assert not errors, f"Authority registry shape/catalog coverage: {errors}"
    reconciled = bootstrap_registry(catalog, registry, core)
    assert not reconciled.get("migration_conflicts"), "Authority migration conflict"
    assert reconciled["assessments"] == registry["assessments"], (
        "Authority registry differs from pinned Harness reconciliation"
    )
    assessments = {row["authority_id"]: row for row in registry["assessments"]}
    canonical = {row["id"]: row["path"] for row in core["artifacts"]}

    for authority, artifact_ids in {
        "DISCOVERY": ("PROBLEM-EVIDENCE", "USER-NEEDS"),
        "PRODUCT-REQUIREMENTS": ("PRODUCT-VISION", "PRODUCT-CAPABILITIES"),
        "DOMAIN-STRATEGY": ("CONTEXT-MAP",),
    }.items():
        assessment = assessments[authority]
        assert assessment["applicability"] != "UNASSESSED"
        assert {canonical[artifact] for artifact in artifact_ids}.issubset(
            set(assessment["depends_on_evidence"])
        ), f"{authority} does not cite its currently registered canonical sources"

    for authority in ("PRODUCT-REQUIREMENTS", "DOMAIN-STRATEGY"):
        sources = assessments[authority]["depends_on_evidence"]
        assert not any(path.startswith("docs/vision/") for path in sources), (
            f"{authority} uses an obsolete human projection as evidence"
        )

    omitted = assessments["MODEL-CONTEXT-STRATEGY"]
    assert omitted["applicability"] == "NOT_APPLICABLE"
    assert "MODEL-CONTEXT-MAP" not in canonical
    assert "MODEL-CONTEXT-STRATEGY" not in {row["id"] for row in core["authorities"]}
    assert all((ROOT / path).is_file() for path in omitted["depends_on_evidence"])

    baseline = read_yaml(ROOT / ".harness/semantic-baseline.yaml")
    assert baseline["kind"] == "prep-strict-semantic-baseline"
    assert "Historical" in baseline["purpose"]
    assert "not Harness semantic acceptances" in baseline["purpose"]

    print(
        f"PASS: {len(registry['assessments'])} assessments conform to pinned catalog "
        "and canonical upper-frontier source paths; old semantic ledger explicitly historical."
    )
    print(
        "SCOPE LIMIT: structural registry checks do not decide conditional Authority "
        "applicability, downstream semantic readiness, or CURRENT beyond the published verifier."
    )


if __name__ == "__main__":
    main()
