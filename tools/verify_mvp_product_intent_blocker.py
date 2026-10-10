#!/usr/bin/env python3
"""Verify a Product Requirements Question without admitting product intent."""
from __future__ import annotations

import copy
import os
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"])
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import build_project_publication, prepare_capability_transition, read_project_publication
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.application.semantic_questions import append_question_proposals
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.project_model.core import CoreError, capability_blockers
from harness.workspace.workspace import validate_knowledge_document


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    assert state["core_model"] == core
    review = load(ROOT / ".harness/candidates/mvp-product-intent-review.yaml")
    question = review["question"]
    assert review["status"] == "BLOCKED" and review["admission_attempted"] is False
    assert question in core["questions"]
    assert question["authority"] == "PRODUCT-REQUIREMENTS"
    assert question["blocks_capabilities"] == ["prep.product-intent"]
    assert capability_blockers(core, "prep.product-intent") == [question["id"]]
    assert append_question_proposals(core, [question]) == core
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    expected = {"prep.problem-evidence", "prep.user-needs"}
    assert set(providers) == set(evaluations) == expected
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 2
    for name in ["problem-evidence", "user-needs"]:
        accepted = load(ROOT / f".harness/candidates/mvp-{name}-evaluation.yaml")
        assert evaluations[f"prep.{name}"] == accepted
        assert providers[f"prep.{name}"] == accepted["lifecycle_assertion"]
    assert state["semantic_evaluations"]["derivation_evaluations"] == []
    policies = derive_acceptance_policy_fingerprints(
        graph=graph, knowledge_contracts=load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"),
    )
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == expected
    assert states["prep.product-intent"]["state"] != "CURRENT"
    previous_core = copy.deepcopy(core)
    previous_core["questions"].remove(question)
    previous_review = load(ROOT / ".harness/candidates/mvp-user-needs-verification.yaml")
    previous = build_project_publication(
        graph=graph, core_model=previous_core, semantic_evaluations=state["semantic_evaluations"],
        lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
        parent_revision=previous_review["parent_revision"],
    )
    assert previous["revision"] == previous_review["publication_revision"] == publication["parent_revision"]
    inputs = dict(
        graph=graph, current_publication=previous, expected_revision=previous["revision"],
        capability="prep.product-intent", core_model=core, semantic_evaluations=state["semantic_evaluations"],
        lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
    )
    assert prepare_capability_transition(outcome="BLOCKED", **inputs) == publication
    for outcome, model in [("CURRENT", core), ("BLOCKED", previous_core)]:
        try:
            prepare_capability_transition(outcome=outcome, **dict(inputs, core_model=model))
        except CoreError:
            pass
        else:
            raise AssertionError(f"Harness allowed {outcome} without its evidence")
    validate_knowledge_document(load(ROOT / ".harness/knowledge/product-intent.yaml"))
    print("PASS: valid artifact schema, routed unresolved Question, BLOCKED CAS transition, unchanged upstream CURRENT/acceptances, no other acceptance, invalid CURRENT and unsupported BLOCKED rejected")


if __name__ == "__main__":
    main()
