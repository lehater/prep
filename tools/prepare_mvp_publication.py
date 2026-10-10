#!/usr/bin/env python3
"""Prepare a fresh, explicitly unaccepted MVP publication candidate.

With --parent-publication, link the candidate to an existing validated revision
without copying any legacy acceptance or lifecycle evidence. Never publish here.
"""
from __future__ import annotations
import argparse
import sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".harness-tool" / "src"))
from harness.application.project_publication import build_project_publication, read_project_publication

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--output", required=True)
    p.add_argument("--parent-publication", help="Validated existing publication to use as revision parent")
    args = p.parse_args()
    graph = yaml.safe_load((ROOT / ".harness/engineering-graph.yaml").read_text())
    core = yaml.safe_load((ROOT / ".harness/core.yaml").read_text())
    parent_revision = None
    if args.parent_publication is not None:
        parent = read_project_publication(ROOT / args.parent_publication, graph=graph)
        parent_revision = parent["revision"]
    fresh = build_project_publication(
        graph=graph, core_model=core,
        semantic_evaluations={"version": 1, "kind": "harness-semantic-evaluation-set", "semantic_evaluations": [], "derivation_evaluations": []},
        lifecycle={"version": 1, "kind": "harness-capability-lifecycle", "providers": []},
        parent_revision=parent_revision,
    )
    out = ROOT / args.output
    if out.exists():
        raise SystemExit(f"refusing to overwrite {out}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(yaml.safe_dump(fresh, sort_keys=False, allow_unicode=True), encoding="utf-8")
    print(f"PREP MVP unaccepted candidate: revision={fresh['revision']} parent_revision={parent_revision} providers=0, semantic_evaluations=0; output={out}")

if __name__ == "__main__":
    main()
