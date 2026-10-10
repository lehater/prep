#!/usr/bin/env python3
"""Check the bounded applicability review without migrating accepted semantics."""
from __future__ import annotations

import copy
import hashlib
import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"])
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import read_project_publication
from harness.project_model.core import CoreError
from harness.project_model.engineering_graph import validate_engineering_graph
from harness.reference_model.project_status import bootstrap_registry, validate_registry


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    review = load(ROOT / ".harness/candidates/authority-evidence-frontier-review.yaml")
    assert review["status"] == "BLOCKED_COORDINATED_TRANSITION"
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    snapshot = review["preserved_snapshot"]
    assert publication["revision"] == snapshot["publication_revision"]
    assert publication["state"]["core_model"] == core
    for path, fingerprint in snapshot["unchanged_file_sha256"].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == fingerprint
    assert [row["capability"] for row in publication["state"]["lifecycle"]["providers"]] == snapshot["accepted_capabilities"]
    assert len(snapshot["accepted_capabilities"]) == 6
    catalog = load(PACK / "catalogs/software-authorities-v0.yaml")
    reference = next(row for row in catalog["authorities"] if row["id"] == "MODEL-CONTEXT-STRATEGY")
    assert review["catalog_evidence"]["applies_when"] == reference["applies_when"]
    assert review["catalog_evidence"]["merge_guidance"] == reference["merge_guidance"]
    registry = load(ROOT / ".harness/authority-assessments.yaml")
    assert validate_registry(catalog, registry) == []
    assert bootstrap_registry(catalog, registry, core)["assessments"] == registry["assessments"]
    assessment = next(row for row in registry["assessments"] if row["authority_id"] == "MODEL-CONTEXT-STRATEGY")
    assert assessment["applicability"] == review["assessment"]["disposition"] == "UNRESOLVED"
    assert review["assessment"]["REQUIRED_supported"] is False
    assert review["assessment"]["NOT_APPLICABLE_applied"] is False
    naive = copy.deepcopy(graph)
    naive["authorities"] = [row for row in naive["authorities"] if row["id"] != "MODEL-CONTEXT-STRATEGY"]
    try:
        validate_engineering_graph(naive)
    except CoreError as error:
        assert str(error) == review["impact"]["naive_graph_removal_validation"]["message"]
    else:
        raise AssertionError("Uncoordinated Authority removal passed graph validation")
    assert set(review["impact"]["direct_downstream_capabilities"]) == {"prep.preparation-information-model", "prep.recorded-activity-history-model"}
    assert review["docs_inventory"]["unclassified_docs"] == 28
    assert review["docs_inventory"]["mass_migration_or_allowlist"] is False
    print("PASS: UNRESOLVED applicability matches catalog review; Graph/Core/Publication and six acceptances preserved; naive Authority removal rejected; no NOT_APPLICABLE migration or downstream admission claimed")


if __name__ == "__main__":
    main()
