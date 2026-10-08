#!/usr/bin/env python3
"""Prepare a fresh, explicitly unaccepted MVP publication from the current Core.

Does not carry old lifecycle acceptance or derivation evidence into the new model.
Outputs to a separate file; never overwrites the historical publication.
"""
from __future__ import annotations
import argparse
import sys
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".harness-tool" / "src"))
from harness.application.project_publication import build_project_publication

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--output", required=True)
    args = p.parse_args()
    graph = yaml.safe_load((ROOT / ".harness/engineering-graph.yaml").read_text())
    core = yaml.safe_load((ROOT / ".harness/core.yaml").read_text())
    fresh = build_project_publication(
        graph=graph, core_model=core,
        semantic_evaluations={"version": 1, "kind": "harness-semantic-evaluation-set", "semantic_evaluations": [], "derivation_evaluations": []},
        lifecycle={"version": 1, "kind": "harness-capability-lifecycle", "providers": []},
        parent_revision=None,
    )
    out = ROOT / args.output
    if out.exists():
        raise SystemExit(f"refusing to overwrite {out}")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(yaml.safe_dump(fresh, sort_keys=False, allow_unicode=True), encoding="utf-8")
    print(f"PREP MVP genesis: revision={fresh['revision']} providers=0, semantic_evaluations=0; output={out}")

if __name__ == "__main__":
    main()
