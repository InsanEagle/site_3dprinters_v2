---
name: handoff
description: "Use when the user needs a compact handoff summary for a new Codex or ChatGPT session, especially after several commits, workflow changes, deployment steps, or an interrupted task."
---

You are preparing a handoff summary for this repository.

This skill does not replace project docs.

Before work:
1. Read `.ai/README.md`.
2. Read `docs/next-actions.md`.
3. Read `docs/project-state.md` if needed.
4. Read recent git status/log/diff only as needed.
5. Do not change files unless explicitly requested.

Use this skill for:
- summarizing current project state for a new chat;
- preparing a compact Codex task packet;
- documenting what changed after several commits;
- recovering from interrupted work;
- explaining what is safe to do next;
- creating a handoff before switching devices/tools/chats.

Do not use this skill for:
- implementation;
- debugging;
- visual polish;
- architecture refactoring;
- broad audits unless explicitly requested.

Rules:
- Be compact.
- Separate facts from recommendations.
- Mention current working tree status.
- Mention current branch if available.
- Mention uncommitted/untracked files if any.
- Mention the next recommended action.
- Mention what not to touch.
- Do not invent completed work.
- Do not expose secrets or `.env*` values.

Recommended handoff format:
## 1. Current state
## 2. Recent completed work
## 3. Current working tree
## 4. Important project rules
## 5. Open tasks
## 6. Recommended next step
## 7. Files/areas not to touch
## 8. Suggested prompt for the next chat