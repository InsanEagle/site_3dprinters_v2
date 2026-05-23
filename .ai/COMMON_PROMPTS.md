# Common Codex Prompts

Copy one prompt into Codex in VS Code, then add the concrete task details below it.

## A. Level 1 - Audit task, no changes

Read `AGENTS.md`, `.ai/README.md`, `docs/project-state.md`, `docs/next-actions.md`, `docs/code-review.md`, `docs/decision-log.md`, and any task-relevant docs. Audit the task only; do not change files. Use Windows + VS Code assumptions and PowerShell-friendly commands. Inspect relevant files, report current state, risks, a minimal implementation plan, checks to run, and whether a fresh Review is needed after implementation. Do not commit unless explicitly asked.

## B. Level 2 - Implement approved plan

Read `AGENTS.md`, `.ai/README.md`, `docs/project-state.md`, `docs/next-actions.md`, `docs/code-review.md`, `docs/decision-log.md`, and any task-relevant docs. Implement only the approved plan. Keep the diff minimal and do not change unrelated files. Use Windows + VS Code workflow and PowerShell-friendly commands. Run relevant checks, including `npm run check:all` when appropriate. Report changed files, checks, remaining risks, and a suggested commit message. Do not commit unless explicitly asked.

## C. Level 3 - Review current diff

Read `AGENTS.md`, `.ai/README.md`, `docs/code-review.md`, and `docs/decision-log.md`. Review the current `git diff`; do not change files. Inspect changed files only as needed to understand the diff. Classify findings as P0/P1/P2 and report findings first. Check for unrelated changes, raw/runtime/private leaks, fake SEO or Schema.org claims, env/runtime risks, request/order success honesty, security/session/signed-link risks, Windows/PowerShell and VPS/Linux issues, CI/E2E risks, and package/dependency drift. If there are no findings, say that clearly. Then provide checks run or skipped, residual risks, and a minimal fix plan for any findings. Suggest a commit message only if the diff is acceptable. Do not commit unless explicitly asked.

## D. Fix only P0/P1 review issues

Read `AGENTS.md`, `docs/code-review.md`, and the relevant task docs. Fix only the confirmed P0/P1 review issues in the current diff. Do not refactor or change unrelated files. Use Windows + VS Code workflow and PowerShell-friendly commands. Run `npm run check:all` when appropriate. Report changed files, checks, risks, and a suggested commit message. Do not commit unless explicitly asked.

## E. Investigate bug, no changes

Read `AGENTS.md`, `docs/project-state.md`, `docs/code-review.md`, and relevant area docs. Investigate the bug only; do not change files. Use PowerShell-friendly local commands. Report reproduction status, likely cause, involved files, risks, proposed smallest fix, checks to run including `npm run check:all` when appropriate, and a suggested commit message. Do not commit unless explicitly asked.

## F. Prepare VPS update checklist

Read `AGENTS.md`, `docs/production-dry-run.md`, `docs/vps-dry-run-result.md`, `docs/decision-log.md`, and `docs/next-actions.md`. Prepare an analysis-only VPS update checklist. Do not change files unless explicitly asked. Separate local Windows PowerShell commands from VPS/Linux commands. Include risks, rollback notes, verification steps, and a suggested commit message if docs changes are later needed. Do not commit unless explicitly asked.

## G. Ozon catalog task, analysis-first

Read `AGENTS.md`, `docs/catalog-ozon-workflow.md`, `docs/project-state.md`, `docs/decision-log.md`, and `docs/code-review.md`. Analyze the Ozon/catalog task first; do not change files. Do not invent products, prices, Ozon URLs, descriptions, ratings, reviews, or stock states. Do not expose raw/private Ozon data. Use Windows + VS Code workflow and PowerShell-friendly commands. Report involved files, data risks, smallest safe plan, checks including `npm run check:all` when appropriate, and a suggested commit message. Do not commit unless explicitly asked.

## H. Docs-only task

Read `AGENTS.md` and relevant docs from `docs/*`. Make only the requested documentation change. Do not change application code, business logic, `package.json`, CI, Docker/VPS config, catalog data, importer, or unrelated docs. Use Windows + VS Code workflow and PowerShell-friendly commands. Run `git diff --check` and inspect changed files; skip `npm run check:all` if the change is Markdown-only and explain why. Report changed files, checks, risks, and a suggested commit message. Do not commit unless explicitly asked.

## I. Three-level workflow with approval gates

Read `AGENTS.md`, `.ai/README.md`, `docs/project-state.md`, `docs/next-actions.md`, `docs/code-review.md`, `docs/decision-log.md`, and any task-relevant docs. Run the task as a 3-level workflow in this same Codex chat. Do not commit unless explicitly asked.

LEVEL 1 - AUDIT: do not change files. Inspect relevant files, describe current behavior, identify risks, propose the minimal implementation plan, list checks to run, then stop with exactly: `WAITING FOR APPROVE TO IMPLEMENT`.

LEVEL 2 - IMPLEMENT: start only after the user explicitly writes `APPROVE`. Implement only the approved plan, keep the diff minimal, do not touch unrelated files, and do not add dependencies without a project-specific reason. Run relevant checks, or `npm run check:all` when appropriate, then stop with exactly: `WAITING FOR APPROVE TO REVIEW`.

LEVEL 3 - REVIEW: start only after the user explicitly writes `APPROVE`. Act as a strict reviewer, do not change files, review the current `git diff`, classify issues as P0/P1/P2, check `docs/decision-log.md` and `docs/code-review.md`, and say `can commit` or `must fix`. Do not fix issues without a separate explicit `APPROVE`.

## J. Architecture deepening audit

Use this prompt before large architecture changes, before adding a new workflow or pipeline, when logic starts spreading across multiple files, when deciding whether refactoring is worthwhile, or once every 1-2 weeks as a preventive audit.

Do not use this prompt for docs-only tasks, small visual polish tasks, copy-only tasks, or simple bugfixes with a clear cause.

Read the source-of-truth docs first: `AGENTS.md`, `docs/project-state.md`, `docs/decision-log.md`, `docs/code-review.md`, task-relevant files from `docs/*`, and `.ai/README.md`. Remember that `.ai` is only a quick-start layer; source of truth remains `AGENTS.md` and `docs/*`.

Work analysis-only first. Do not change files. Do not implement anything.

Use these terms consistently: module, interface, implementation, depth, shallow module, deep module, seam, adapter, leverage, locality.

Look for pass-through modules, duplicated rules, logic scattered across callers, too many call sites needing implementation details, interfaces with low leverage, seams introduced without real need, and places where tests would be easier through one deeper interface.

Apply the deletion test for each candidate: "If this module disappeared, would complexity vanish or reappear across many callers?"

Apply the adapter rule: do not recommend a port/seam unless there are at least two justified adapters, such as production + test, external + in-memory, or current + future clearly justified. Otherwise avoid abstract indirection.

Output only 1-3 candidates. For each candidate include current shallow shape, why it hurts, proposed deeper module/interface, expected leverage/locality gain, files likely affected, risk level, smallest safe first diff, and checks needed.

Use this report format:

```md
## 1. Краткий вывод

## 2. Candidate 1

### Current shallow shape

### Proposed deeper module/interface

### Why this improves leverage/locality

### Files likely affected

### Risks

### Smallest safe first diff

## 3. Candidate 2

### Current shallow shape

### Proposed deeper module/interface

### Why this improves leverage/locality

### Files likely affected

### Risks

### Smallest safe first diff

## 4. Candidate 3

### Current shallow shape

### Proposed deeper module/interface

### Why this improves leverage/locality

### Files likely affected

### Risks

### Smallest safe first diff

## 5. What not to refactor now

## 6. Recommended first refactor

## 7. WAITING FOR APPROVE TO IMPLEMENT
```
