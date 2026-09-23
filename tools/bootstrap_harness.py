#!/usr/bin/env python3
from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / ".harness-tool"
PIN = (ROOT / ".harness-version").read_text(encoding="utf-8").strip()
REPO = "https://github.com/lehater/harness.git"


def run(*args: str, cwd: Path | None = None) -> str:
    completed = subprocess.run(
        args,
        cwd=cwd,
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    return completed.stdout.strip()


def main() -> int:
    if not TARGET.exists():
        run("git", "clone", "--no-checkout", REPO, str(TARGET))
    elif not (TARGET / ".git").is_dir():
        raise SystemExit(f"{TARGET} exists but is not a Git checkout")

    run("git", "fetch", "--depth", "1", "origin", PIN, cwd=TARGET)
    run("git", "checkout", "--detach", PIN, cwd=TARGET)
    head = run("git", "rev-parse", "HEAD", cwd=TARGET)
    if head != PIN:
        raise SystemExit(f"Harness pin mismatch: expected {PIN}, got {head}")

    print(f"Harness ready at {TARGET} ({PIN})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
