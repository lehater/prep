# Plans

Use plans for multi-step work that benefits from durable execution state.

Recommended layout:

```text
docs/plans/
├── active/
└── completed/
```

An active plan should capture:
- goal and scope;
- assumptions and constraints;
- steps;
- progress;
- decisions discovered during execution;
- validation performed.

Move or rewrite the plan as completed when the pull request is merged.
