# AI Workspace Notes

`.ai` is a quick-start layer for using Codex in VS Code. It is meant to make new tasks faster to start, not to become a second source of truth.

The source of truth remains `AGENTS.md` and the focused documents in `docs/*`. Do not duplicate project decisions, current state, architecture rules, or done criteria here. Before each task, read `AGENTS.md` plus the docs relevant to the area being changed.

Local workflow assumptions:

- Windows, VS Code, and Codex as the VS Code extension.
- Use PowerShell-friendly local commands.
- Codex should not commit unless explicitly asked.
- One task should produce one small, focused diff.
- Risky tasks should start analysis-only before edits.
- VS Code tasks are available through Terminal -> Run Task. Use `npm: check:all` as the standard full local check.

## Three-level AI workflow

Use the 3-level workflow as the default shape for complex or risky work: Audit -> Implement -> Review.

Level 1: Audit

- No code changes.
- Inspect relevant files and source-of-truth docs.
- Identify risks and likely failure modes.
- Propose a minimal implementation plan.
- Define checks to run after implementation.

Level 2: Implement

- Implement the approved plan only.
- Keep the diff minimal.
- Do not make unrelated changes.
- Run relevant checks, using `npm run check:all` when appropriate.

Level 3: Review

- Do a fresh AI-review of the current diff; prefer a new Codex chat for risky diffs.
- Do not change code during review.
- Classify findings as P0/P1/P2.
- Suggest a minimal fix plan for confirmed issues.

For risky areas, use all 3 levels. For simple docs-only tasks, Audit and Review can be lightweight or skipped with a clear explanation.
For complex tasks that should stay in one Codex chat, use the combined approval-gated prompt from `.ai/COMMON_PROMPTS.md`.

## Source Map

| Need | Read |
| --- | --- |
| Project context | `docs/project-state.md` |
| Task template | `docs/codex-task-template.md` |
| Current work | `docs/next-actions.md` |
| Decisions | `docs/decision-log.md` |
| Review checklist | `docs/code-review.md` |
| Ozon/catalog workflow | `docs/catalog-ozon-workflow.md` |
| Deploy/VPS | `docs/production-dry-run.md` |
| Agent rules | `AGENTS.md` |

## How To Use This Folder

Use `.ai/COMMON_PROMPTS.md` as a small prompt shelf in VS Code. Copy the prompt that matches the task, add concrete context and file paths, then let Codex work against the real source-of-truth docs.
