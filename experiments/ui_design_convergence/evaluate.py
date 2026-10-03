#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path
import sys

import yaml

ROOT = Path(__file__).resolve().parents[2]
EVIDENCE = Path(__file__).with_name("view-knowledge-evidence.yaml")


def load_yaml(path: Path) -> dict:
    value = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise SystemExit(f"{path} must contain a mapping")
    return value


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit("usage: evaluate.py <materialized-harness-consumer-pack>")

    pack = Path(sys.argv[1]).resolve()
    if not (pack / "harness/__init__.py").is_file():
        raise SystemExit(f"invalid Harness Consumer Pack: {pack}")

    sys.path.insert(0, str(pack))
    from harness.application.ui_design_convergence import (  # noqa: E402
        evaluate_ui_design_convergence,
    )

    catalog_path = pack / "catalogs/ui/decision-rules-v0.yaml"
    result = evaluate_ui_design_convergence(
        rule_catalog=load_yaml(catalog_path),
        evidence=load_yaml(EVIDENCE),
    )

    if result.get("status") != "NOT_READY" or result.get("ui_design_ready") is not False:
        raise SystemExit(f"expected VIEW-KNOWLEDGE production convergence to remain NOT_READY: {result}")

    findings = result.get("findings", [])
    observed = {
        (item.get("code"), item.get("decision"))
        for item in findings
        if isinstance(item, dict)
    }
    expected = {
        ("UI_EMPIRICAL_VALIDATION_REQUIRED", "KD-02"),
        ("UI_REQUIRED_EVALUATION_EVIDENCE_MISSING", "KD-02"),
        ("UI_EMPIRICAL_VALIDATION_REQUIRED", "KD-03"),
        ("UI_REQUIRED_EVALUATION_EVIDENCE_MISSING", "KD-03"),
    }
    missing = expected - observed
    if missing:
        raise SystemExit(f"expected empirical blockers were not reported: {sorted(missing)}; result={result}")

    allowed_codes = {
        "UI_EMPIRICAL_VALIDATION_REQUIRED",
        "UI_REQUIRED_EVALUATION_EVIDENCE_MISSING",
    }
    unexpected = [
        item
        for item in findings
        if isinstance(item, dict) and item.get("code") not in allowed_codes
    ]
    if unexpected:
        raise SystemExit(f"unexpected convergence findings: {unexpected}")

    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
