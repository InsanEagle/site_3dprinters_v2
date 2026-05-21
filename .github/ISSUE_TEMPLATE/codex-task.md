---
name: Codex task
about: Structured task packet for Codex / AI-assisted development
title: "[Codex] "
labels: ""
assignees: ""
---

## Goal

What should be true when this task is done?

<!-- Describe the concrete user-visible, code-visible, or docs-visible result. -->

## Context

Why is this task needed now?

<!-- Explain the immediate reason, bug, review finding, launch blocker, or documentation gap. -->

Source-of-truth docs and files to read before editing:

- `AGENTS.md`
- `docs/project-state.md`
- `docs/next-actions.md`
- `docs/decision-log.md`
- `docs/code-review.md`
<!-- Add task-specific docs or source files here. -->

## Scope

Files or areas that may be inspected or changed:

<!-- List allowed paths or zones. -->

## Out of scope

Files, areas, or behavior that must not be changed:

<!-- List paths, flows, data, or infrastructure that are out of scope. -->

## Constraints

- [ ] One task = one small diff.
- [ ] No unrelated refactor.
- [ ] No new dependencies without explicit reason.
- [ ] Do not commit raw/runtime/private files.
- [ ] Keep Windows + VS Code workflow in mind.
- [ ] Use PowerShell-friendly local commands.
- [ ] Linux/VPS commands must be labeled explicitly.
- [ ] Do not change Docker/VPS/backoffice/request flow unless task is about it.

## Acceptance criteria

Concrete criteria for accepting this task:

- [ ] Criterion 1.
- [ ] Criterion 2.
- [ ] Criterion 3.

## Required checks

- [ ] Full local pass: `npm run check:all`
- [ ] Individual diagnostics / scoped checks only if needed:
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] GitHub Actions green
- [ ] Explain if skipped because docs-only.

## AI review

- [ ] Fresh AI-review required if risky diff.
- [ ] P0/P1/P2 review done.
- [ ] P0/P1 fixed or explicitly deferred.

## Manual verification

Pages or flows to check by hand:

<!-- List manual verification steps, or write "None for docs-only changes." -->

## Report format

Codex should return:

- What changed.
- Files changed.
- Checks.
- Risks.
- Suggested commit message.
