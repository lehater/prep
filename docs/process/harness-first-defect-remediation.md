# Harness-first Prep defect remediation

Status: ACTIVE REFERENCE

The canonical defect register and remediation protocol for the current Prep interface audit is owned by the Harness repository:

- repository: `lehater/harness`
- canonical branch after Stage 0: `main`
- canonical path: `docs/programs/prep-harness-defect-remediation-v0.md`

## Rule

Do not maintain a second defect list in Prep.

All defect ids, priorities, classifications, status transitions and cross-repository work ordering are controlled by the Harness program document.

Prep-specific work must refer to stable ids such as:

- `PREP-UX-001`
- `PREP-UX-005`
- `HARNESS-001`

## Harness-first freeze

Until the corresponding Harness defect(s) have a terminal disposition in the canonical register, Prep changes for the registered UI/semantic defects are limited to evidence collection and program references.

After Harness integration:

1. update Prep's `.harness-version` to the integrated Harness commit;
2. run currentness/coverage;
3. revalidate affected canonical Prep authorities;
4. only then implement frontend changes;
5. close each defect only with the evidence required by the canonical program.

This file is a pointer, not a copied register.

Prep must not maintain a second authoritative denominator, status table, classification table or work-package state. New defects and all status/classification changes are recorded in the Harness canonical document.

After any Prep work package, the executor reports evidence back to the managing chat and stops. Only the managing chat may authorize the next program stage or corrective stage.
