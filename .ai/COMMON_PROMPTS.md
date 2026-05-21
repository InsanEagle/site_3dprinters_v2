# Common Codex Prompts

Copy one prompt into Codex in VS Code, then add the concrete task details below it.

## A. Analyze task, no changes

Read `AGENTS.md` and relevant docs from `docs/*`. Analyze the task only; do not change files. Use Windows + VS Code assumptions and PowerShell-friendly local commands. Report current state, involved files, risks, a small implementation plan, checks to run, and a suggested commit message. Do not commit unless explicitly asked.

## B. Implement approved plan

Read `AGENTS.md`, `docs/project-state.md`, `docs/next-actions.md`, `docs/decision-log.md`, and any task-relevant docs. Implement only the approved small plan. Do not change unrelated files. Use Windows + VS Code workflow and PowerShell-friendly commands. Run `npm run check:all` when appropriate. Report changed files, checks, remaining risks, and a suggested commit message. Do not commit unless explicitly asked.

## C. Review current diff

Read `AGENTS.md` and `docs/code-review.md`. Review the current git diff as a code review; do not change files. Focus on P0/P1 regressions, broken routes, env/secrets, request honesty, SEO truthfulness, Windows workflow, and unrelated changes. Report findings first, then checks run or skipped, residual risks, and a suggested commit message if the diff is acceptable. Do not commit unless explicitly asked.

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
