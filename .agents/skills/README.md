# Codex Skills Strategy

This repository uses skills as lightweight workflow triggers, not as a replacement for project documentation.

## Source of truth

- `AGENTS.md` and `docs/*` are the source of truth.
- `.ai/*` is a quick-start prompt layer.
- `.agents/skills/*` contains small reusable modes for Codex CLI.

## Rules

1. Skills must not duplicate full project documentation.
2. Skills must point Codex back to `AGENTS.md`, `.ai/README.md`, `.ai/COMMON_PROMPTS.md`, and relevant `docs/*`.
3. One skill should do one job.
4. Do not install many external skills at once.
5. Prefer repo-local custom skills for project-specific workflows.
6. External skills can be tested only one at a time.
7. If a skill conflicts with project docs, project docs win.
8. Skills should usually start analysis-only and wait for approval before changing files.

## Recommended local skills

- `project-task-workflow` — default Audit -> Implement -> Review process.
- `visual-polish` — design/UI polish without business logic changes.
- `architecture-deepening-audit` — shallow/deep module audit.
- `bug-diagnose` — reproduce -> isolate -> fix -> regression test.
- `handoff` — summarize current state for a new chat/session.

## Do not use skills for

- trivial one-line edits;
- docs-only typo fixes;
- simple shell questions;
- tasks where normal `.ai/COMMON_PROMPTS.md` is already clearer.
