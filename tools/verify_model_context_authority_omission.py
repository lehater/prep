#!/usr/bin/env python3
"""Verify the coordinated omission, preserved provenance and Harness CAS boundary."""
import copy
import hashlib
import os
from pathlib import Path
import sys
import tempfile

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"]).resolve()
sys.path.insert(0, str(PACK / "src"))
from harness.application.project_publication import (
    build_project_publication, publish_project_publication, read_project_publication,
)
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.assurance.capability_lifecycle import lifecycle_states, obsolete_lifecycle_rows
from harness.project_model.core import CoreError
from harness.project_model.engineering_graph import validate_engineering_graph, validate_realization

CAP = "prep.model-context-strategy"
AUTH = "MODEL-CONTEXT-STRATEGY"
QUESTION = "Q-PREP-MODEL-CONTEXT-INDEPENDENT-LANGUAGES"
TACTICAL = {"prep.preparation-information-model", "prep.recorded-activity-history-model"}


def load(path):
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def rejects(operation, label):
    try:
        operation()
    except CoreError:
        return
    raise AssertionError(f"Negative scenario passed: {label}")


def main():
    record = load(ROOT / ".harness/candidates/model-context-authority-omission-transition.yaml")
    archive = ROOT / record["historical_project"]
    for path, expected in record["historical_files_sha256"].items():
        assert hashlib.sha256((archive / path).read_bytes()).hexdigest() == expected
    for path, expected in record["unchanged_files_sha256"].items():
        assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == expected
    old_graph = load(archive / ".harness/engineering-graph.yaml")
    old_core = load(archive / ".harness/core.yaml")
    old = read_project_publication(archive / ".harness/project-publication.yaml", graph=old_graph)
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    validate_engineering_graph(graph)
    validate_realization(graph, core)
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    assert publication["state"]["core_model"] == core
    assert old["state"]["core_model"] == old_core
    assert old["revision"] == publication["parent_revision"] == record["atomicity"]["old_revision"]
    assert publication["revision"] == record["atomicity"]["new_revision"]
    # Exact change boundary: all other producers, prerequisites and canonical rows survive.
    expected_graph = copy.deepcopy(old_graph)
    expected_graph["authorities"] = [r for r in expected_graph["authorities"] if r["id"] != AUTH]
    tactical = next(r for r in expected_graph["authorities"] if r["id"] == "TACTICAL-DOMAIN-DESIGN")
    tactical["responsibility"] = "Own accepted domain concepts, semantic relationships and invariants inside the coherent Prep model language."
    tactical["boundary"]["independent_change"] = "Tactical semantics can evolve behind accepted product and strategic responsibility boundaries without selecting persistence, UI or runtime technology."
    tactical["boundary"]["semantic_cohesion"] = (
        "Preparation information and recorded activity/result meanings in one coherent "
        "model language, including the internal IR-01 subject-of-activity interpretation."
    )
    for row in tactical["produces"]:
        if row["capability"] in TACTICAL:
            for prerequisite in row["requires"]:
                if prerequisite["capability"] == CAP:
                    prerequisite["capability"] = "prep.domain-strategy"
    assert graph == expected_graph
    expected_core = copy.deepcopy(old_core)
    expected_core["authorities"] = [r for r in expected_core["authorities"] if r["id"] != AUTH]
    expected_core["artifacts"] = [r for r in expected_core["artifacts"] if r["id"] != "MODEL-CONTEXT-MAP"]
    question = next(r for r in old_core["questions"] if r["id"] == QUESTION)
    assert question["resolution"]["artifact"] == "MODEL-CONTEXT-MAP"
    expected_core["questions"] = [r for r in expected_core["questions"] if r["id"] != QUESTION]
    assert core == expected_core
    ev = copy.deepcopy(old["state"]["semantic_evaluations"])
    ev["semantic_evaluations"] = [r for r in ev["semantic_evaluations"] if r["capability"] != CAP]
    lc = copy.deepcopy(old["state"]["lifecycle"])
    historical = next(r for r in lc["providers"] if r["capability"] == CAP)
    assert historical["acceptance_id"] == record["historical_acceptance"]
    lc["providers"] = [r for r in lc["providers"] if r["capability"] != CAP]
    assert publication["state"]["semantic_evaluations"] == ev
    assert publication["state"]["lifecycle"] == lc
    assert {r["capability"]: r["acceptance_id"] for r in lc["providers"]} == record["current_acceptance_ids"]
    assert all(r["acceptance_id"] != historical["acceptance_id"] for r in lc["providers"])
    assert len(lc["providers"]) == 5 and record["new_acceptances"] == []
    assert record["downstream_accepted"] is False
    rebuilt = build_project_publication(
        graph=graph, core_model=core, semantic_evaluations=ev, lifecycle=lc,
        decision_failures=old["state"]["decision_failures"], parent_revision=old["revision"],
    )
    assert rebuilt == publication
    assert read_project_publication(archive / ".harness/project-publication.yaml", graph=graph) == old
    assert obsolete_lifecycle_rows(graph, old["state"]["lifecycle"]) == [{
        "capability": CAP, "artifact": "MODEL-CONTEXT-MAP",
        "acceptance_id": historical["acceptance_id"],
        "reason": "CAPABILITY_NOT_IN_ENGINEERING_GRAPH",
    }]
    policies = derive_acceptance_policy_fingerprints(
        graph=graph, knowledge_contracts=load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"),
    )
    states = lifecycle_states(graph, core, lc, current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == set(record["current_capabilities"])
    assert CAP not in states
    assert all(states[cap]["state"] != "CURRENT" for cap in TACTICAL)
    changed_policy = dict(policies, **{"prep.domain-strategy": "changed-policy"})
    assert lifecycle_states(graph, core, lc, current_acceptance_policy_fingerprints=changed_policy)["prep.domain-strategy"]["state"] == "STALE"
    registry = load(ROOT / ".harness/authority-assessments.yaml")
    assessment = next(r for r in registry["assessments"] if r["authority_id"] == AUTH)
    assert assessment["applicability"] == record["applicability"] == "NOT_APPLICABLE"
    # Reuse the admitted Product Requirements coverage guard, without readmitting it.
    from verify_mvp_product_capabilities import verify_coverage, RETIRED
    product = load(ROOT / ".harness/knowledge/product-capabilities.yaml")["content"]
    intent = load(ROOT / ".harness/knowledge/product-intent.yaml")["content"]
    verify_coverage(product, intent)
    assert sum(row["status"] == "ACCEPTED" for row in product["requirements"]) == 15
    for variant in ("partial-crud", "reactivated-retired"):
        invalid = copy.deepcopy(product)
        if variant == "partial-crud":
            invalid["requirements"][0]["statement"] = invalid["requirements"][0]["statement"].replace("every entity", "some entity")
        else:
            next(row for row in invalid["requirements"] if row["id"] in RETIRED)["status"] = "ACCEPTED"
        try:
            verify_coverage(invalid, intent)
        except AssertionError:
            pass
        else:
            raise AssertionError(f"Invalid product scope passed: {variant}")
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_bytes((archive / ".harness/project-publication.yaml").read_bytes())
        assert publish_project_publication(path, graph=graph, publication=publication, expected_revision=old["revision"]) == publication
        rejects(lambda: publish_project_publication(path, graph=graph, publication=publication, expected_revision=old["revision"]), "stale CAS")
        assert read_project_publication(path, graph=graph) == publication
    invalid_core = copy.deepcopy(core)
    invalid_core["questions"].append(question)
    rejects(lambda: validate_realization(graph, invalid_core), "dangling historical Question")
    invalid_graph = copy.deepcopy(old_graph)
    invalid_graph["authorities"] = [r for r in invalid_graph["authorities"] if r["id"] != AUTH]
    rejects(lambda: validate_engineering_graph(invalid_graph), "unrewired prerequisites")
    invalid_lifecycle = copy.deepcopy(lc)
    invalid_lifecycle["providers"][0]["acceptance_id"] = historical["acceptance_id"]
    rejects(lambda: build_project_publication(
        graph=graph, core_model=core, semantic_evaluations=ev, lifecycle=invalid_lifecycle,
        decision_failures=old["state"]["decision_failures"], parent_revision=old["revision"],
    ), "acceptance transfer")
    from validate_docs import validate_doc_inventory
    previous_inventory = load(ROOT / ".harness/candidates/authority-evidence-frontier-review.yaml")["docs_inventory"]
    assert validate_doc_inventory() == previous_inventory["errors"]
    print("PASS: coordinated Graph/Core/registry omission; exact historical hashes, Question and sixth acceptance preserved; five policy-bound CURRENT; no downstream admission; CAS child reproduced.")
    print("PRODUCT PASS: 15 accepted capabilities, full CRUD/bulk and four RETIRED preserved; partial CRUD/reactivated RETIRED rejected.")
    print("NEGATIVE PASS: stale CAS/policy, dangling Question, unrewired Graph and transferred acceptance rejected; existing 28-file inventory failure unchanged.")


if __name__ == "__main__":
    main()
