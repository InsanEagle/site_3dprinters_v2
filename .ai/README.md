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
