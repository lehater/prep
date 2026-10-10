#!/usr/bin/env python3
"""Verify the unresolved model-language decision and unchanged acceptances."""
from __future__ import annotations

import copy
import hashlib
import os
import sys
import tempfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
PACK = Path(os.environ["HARNESS_ROOT"])
sys.path.insert(0, str(PACK / "src"))

from harness.application.project_publication import build_project_publication, prepare_capability_transition, publish_project_publication, read_project_publication
from harness.application.semantic_admission import derive_acceptance_policy_fingerprints
from harness.application.semantic_questions import append_question_proposals
from harness.assurance.capability_lifecycle import lifecycle_states
from harness.assurance.semantic_fingerprint import semantic_assertion_fingerprints
from harness.project_model.core import CoreError, capability_blockers

CAPABILITY = "prep.model-context-strategy"


def load(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def main() -> None:
    graph = load(ROOT / ".harness/engineering-graph.yaml")
    core = load(ROOT / ".harness/core.yaml")
    publication = read_project_publication(ROOT / ".harness/project-publication.yaml", graph=graph)
    state = publication["state"]
    review = load(ROOT / ".harness/candidates/mvp-model-context-strategy-review.yaml")
    assert review["status"] == "BLOCKED" and review["admission_attempted"] is False
    assert review["new_acceptances"] == []
    assert hashlib.sha256((ROOT / "docs/architecture/model-context-map.md").read_bytes()).hexdigest() == review["candidate_sha256"]
    assert state["core_model"] == core
    question = review["question"]
    assert question in core["questions"] and question.get("resolution") is None
    assert question["authority"] == "MODEL-CONTEXT-STRATEGY"
    assert question["blocks_capabilities"] == [CAPABILITY]
    assert capability_blockers(core, CAPABILITY) == [question["id"]]
    assert append_question_proposals(core, [question]) == core
    providers = {row["capability"]: row for row in state["lifecycle"]["providers"]}
    evaluations = {row["capability"]: row for row in state["semantic_evaluations"]["semantic_evaluations"]}
    expected = {"prep.problem-evidence", "prep.user-needs", "prep.product-intent", "prep.product-capabilities", "prep.domain-strategy"}
    assert set(providers) == set(evaluations) == expected
    assert len(state["lifecycle"]["providers"]) == len(state["semantic_evaluations"]["semantic_evaluations"]) == 5
    for cap in expected:
        prefix = cap.removeprefix("prep.")
        accepted = load(ROOT / f".harness/candidates/mvp-{prefix}-evaluation.yaml")
        assert evaluations[cap] == accepted
        assert providers[cap] == accepted["lifecycle_assertion"]
        candidate = load(ROOT / f".harness/candidates/mvp-{prefix}-admission.yaml")
        assert semantic_assertion_fingerprints(candidate) == providers[cap]["semantic_atom_fingerprints"]
    policies = derive_acceptance_policy_fingerprints(graph=graph, knowledge_contracts=load(PACK / "spec/semantic-acceptance/knowledge-kind-contracts-v1.yaml"))
    states = lifecycle_states(graph, core, state["lifecycle"], current_acceptance_policy_fingerprints=policies)
    assert {cap for cap, row in states.items() if row["state"] == "CURRENT"} == expected
    assert states[CAPABILITY]["state"] != "CURRENT"
    previous_core = copy.deepcopy(core)
    previous_core["questions"].remove(question)
    prior_review = load(ROOT / ".harness/candidates/mvp-domain-strategy-verification.yaml")
    previous = build_project_publication(
        graph=graph, core_model=previous_core, semantic_evaluations=state["semantic_evaluations"],
        lifecycle=state["lifecycle"], decision_failures=state["decision_failures"], parent_revision=prior_review["parent_revision"],
    )
    assert previous["revision"] == prior_review["publication_revision"] == publication["parent_revision"]
    inputs = dict(
        graph=graph, current_publication=previous, expected_revision=previous["revision"], capability=CAPABILITY,
        core_model=core, semantic_evaluations=state["semantic_evaluations"], lifecycle=state["lifecycle"], decision_failures=state["decision_failures"],
    )
    assert prepare_capability_transition(outcome="BLOCKED", **inputs) == publication
    for outcome, model in [("CURRENT", core), ("BLOCKED", previous_core)]:
        try:
            prepare_capability_transition(outcome=outcome, **dict(inputs, core_model=model))
        except CoreError:
            pass
        else:
            raise AssertionError(f"Harness accepted unsupported {outcome}")
    with tempfile.TemporaryDirectory() as directory:
        path = Path(directory) / "publication.yaml"
        path.write_text(yaml.safe_dump(previous, sort_keys=False))
        assert publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"]) == publication
        try:
            publish_project_publication(path, graph=graph, publication=publication, expected_revision=previous["revision"])
        except CoreError:
            pass
        else:
            raise AssertionError("Publication accepted stale CAS")
    print("PASS: candidate/review binding, routed unresolved Question, exact BLOCKED CAS, five upstream policy-bound CURRENT and unchanged acceptances; unsupported CURRENT/BLOCKED and stale CAS rejected")


if __name__ == "__main__":
    main()
