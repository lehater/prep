#!/usr/bin/env python3
"""Replay pre-omission proofs against the preserved project, never current truth."""
from contextlib import redirect_stdout
import importlib.util
import io
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
SCENARIOS = (
    "verify_mvp_model_context_strategy",
    "verify_mvp_model_context_blocker",
    "verify_authority_evidence_frontier_review",
    "preview_model_context_authority_omission",
)


def run_scenario(name: str) -> None:
    assert name in SCENARIOS
    archive = ROOT / ".harness/candidates/history/model-context-authority-omission/project"
    with tempfile.TemporaryDirectory() as directory:
        project = Path(directory) / "project"
        shutil.copytree(archive, project)
        for path in (".harness/candidates", ".harness/knowledge"):
            (project / path).symlink_to(ROOT / path, target_is_directory=True)
        spec = importlib.util.spec_from_file_location(name, ROOT / f"tools/{name}.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        module.ROOT = project
        output = io.StringIO()
        with redirect_stdout(output):
            module.main()
        print(f"HISTORICAL PASS: {name}; archived state only, no currentness claim.")
        for line in output.getvalue().splitlines():
            print(f"  HISTORICAL: {line}")


if __name__ == "__main__":
    for scenario in SCENARIOS:
        run_scenario(scenario)
