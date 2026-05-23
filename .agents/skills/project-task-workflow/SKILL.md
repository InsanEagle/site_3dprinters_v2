---
name: project-task-workflow
description: Use for normal coding tasks in this repository when the user wants Codex to follow the project's established Audit -> Implement -> Review workflow. Do not use for one-off shell questions or purely conversational answers.
---

You are working in this repository's custom ChatGPT + Codex workflow.

Before doing work:
1. Read `.ai/README.md`.
2. Read the relevant prompt from `.ai/COMMON_PROMPTS.md`.
3. Treat `AGENTS.md` and `docs/*` as the source of truth.
4. Do not treat this skill as a replacement for project docs.

Default process:
1. Start with Level 1 Audit.
2. Do not change files during Audit.
3. End Audit with `WAITING FOR APPROVE TO IMPLEMENT`.
4. After explicit approval, implement one small focused diff.
5. Run the required checks.
6. End implementation with `WAITING FOR APPROVE TO REVIEW`.
7. After explicit approval, review the current git diff as a strict reviewer.
8. Do not commit automatically.

Core rules:
- One task = one small diff.
- Do not add dependencies without explicit approval.
- Do not change business logic outside the task.
- Do not touch `.env*`, runtime data, `ozon_data`, backups, or generated/private files unless explicitly requested.
- For risky changes, require fresh AI-review before commit.
- Use `npm.cmd run check:all` for code/runtime/public-flow changes.
- For docs-only changes, `git diff --check` is usually enough if runtime is not affected.

Report formats should follow `.ai/COMMON_PROMPTS.md`.