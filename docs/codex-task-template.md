# Codex Task Template

Use this template when starting a new Codex chat for a small, focused task in this repository.

Copy the task packet below, fill in the blanks, and remove sections that clearly do not apply. Keep one task to one meaningful result.

# Task: <short task title>

## 1. Task Title

<Short name of the task. One task should have one semantic outcome.>

Examples:

- Fix mobile header overflow.
- Add SEO metadata for catalog categories.
- Document VPS backup restore check.

## 2. Context

Project:

- Next.js App Router website for a small FDM 3D-printing business.
- Business focus: automotive plastic parts, custom manufactured plastic items, public SEO/catalog pages, service pages, and request flows.
- MVP shape: simple modular monolith, TypeScript, Tailwind CSS, file-based data where practical.

Source-of-truth docs to read before changing files:

- `AGENTS.md` - agent rules, project constraints, checks, reporting format.
- `docs/project-state.md` - current MVP state and known launch risks.
- `docs/code-review.md` - review priorities and project-specific risk checklist.
- `docs/production-dry-run.md` - VPS/deploy runbook if the task touches runtime, Docker, env, storage, or deploy.
- `docs/vps-dry-run-result.md` - historical VPS/HTTPS dry run result if the task touches production readiness.
- `README.md` - onboarding context, but not the only source of truth.

Why this task is needed now:

- <Explain the immediate reason, bug, review finding, launch blocker, or documentation gap.>

Already checked:

- <List what the human/ChatGPT already verified, including pages, files, screenshots, logs, or prior commands.>
- <If nothing was checked yet, write: "Nothing beyond the source-of-truth docs.">

## 3. Dev Environment

- Primary local environment: Windows.
- Editor: VS Code.
- Codex runs as the VS Code extension.
- Do not assume WSL is installed.
- Local commands must be PowerShell-friendly.
- Prefer `npm` scripts or Node scripts for cross-platform automation.
- Bash/Linux commands are allowed only when clearly labeled as VPS/Linux commands.

## 4. Goal

Expected result:

- <Describe the concrete user-visible, code-visible, or docs-visible result.>

Acceptance criteria:

- <Criterion 1.>
- <Criterion 2.>
- <Criterion 3.>

## 5. Constraints / Do Not Touch

Required constraints:

- Do not change unrelated files.
- Do not do a broad refactor.
- Do not add dependencies unless clearly necessary and approved.
- Do not change `package.json` unless the task explicitly requires it.
- Do not commit raw, runtime, generated-private, uploaded, backup, `.env`, `.next`, or local-only files.
- Do not touch Docker, VPS, backoffice, or request/order flow unless the task is specifically about them.
- Do not manually change generated data unless the task is specifically about generated data.
- Do not publish finance/internal Ozon fields.
- Do not use fake descriptions, reviews, ratings, prices, stock states, testimonials, or made-up Ozon URLs.
- Do not expose secrets to client code or public docs.
- Do not hide production misconfiguration behind fake success states.

Task-specific constraints:

- <Add extra "do not touch" rules for this task.>

## 6. Files Likely Involved

Allowed to inspect:

- <File or directory.>
- <File or directory.>

Allowed to edit:

- <File or directory.>
- <File or directory.>

Do not edit:

- <File or directory.>
- <File or directory.>

Notes:

- If Codex discovers that another file must be changed, it should explain why before editing when the change is risky or broad.
- Keep the final diff small and directly tied to the task.

## 7. Analysis-First Mode

For risky tasks, start the Codex prompt with:

> Ничего не меняй. Только анализ и отчёт.

Use analysis-first mode before edits when the task touches:

- Ozon import.
- Docker/VPS/deploy.
- Auth/backoffice.
- Request/order storage.
- Request attachments or signed access.
- SEO catalog visibility, sitemap, robots, or Schema.org.
- Security, env variables, secrets, or production configuration.
- Any migration from raw/internal data to public data.

Expected analysis-only output:

- What is true now.
- Which files are involved.
- Risks and likely failure modes.
- Proposed small change plan.
- Checks that would be required if edits are approved.

## 8. Required Checks

Default checks for code changes:

```powershell
npm run check:all
```

Use separate commands for diagnostics when the aggregate check fails or only one layer is relevant:

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Docs-only tasks:

- `npm run build` and `npm run test:e2e` may be unnecessary if only Markdown documentation changed.
- Codex must explicitly say why omitted checks were not needed.
- At minimum, inspect the created/changed document and run `git status --short -uall`.

Runtime/VPS-impacting tasks:

- Run the default local checks when safe.
- Add manual VPS checks from `docs/production-dry-run.md`.
- Clearly label any commands that are VPS/Linux-only.
- Do not commit `.env.production`, runtime data, backups, uploads, or server-only artifacts.

Ozon import or catalog data tasks:

- Run the default local checks when safe.
- Add catalog-specific checks for public category/product pages affected by the change.
- Verify that public data does not expose finance/internal Ozon fields.
- Verify no fake descriptions, prices, ratings, reviews, stock states, or made-up URLs were added.

If a check cannot be run:

- Say which check was skipped.
- Say why it was skipped.
- Explain the residual risk.

## 9. Git / Commit Guidance

- Codex should not commit unless the user explicitly asks.
- One task should produce one small diff.
- Before staging, check:

```powershell
git status --short -uall
```

- Do not stage raw/runtime/private files.
- Do not stage `.env*`, `.next`, `node_modules`, uploaded files, backups, local temp files, or unrelated changes.
- When paths contain square brackets in PowerShell, quote them:

```powershell
git add "app/product/[slug]/page.tsx"
```

- To review staged files:

```powershell
git diff --cached --name-status
```

- Codex final report should include a suggested commit message.

## 10. Expected Report Format

Codex should finish with this report shape:

```md
## 1. Что изменено

<Кратко.>

## 2. Какие файлы изменены

- `<path>`

## 3. Что намеренно не трогал

- <Unrelated area/file/flow.>

## 4. Результаты проверок

- `<command>` - passed/failed/skipped, with reason if skipped.

## 5. Риски

- <Remaining risk, or "Не вижу существенных остаточных рисков.">

## 6. Как проверить вручную

- <Manual check steps.>

## 7. Можно ли коммитить

<Yes/no and conditions.>

## 8. Suggested commit message

`<type>: <message>`
```

## 11. Windows Command Notes

Use PowerShell-friendly commands locally:

```powershell
git status --short -uall
git diff --cached --name-status
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Quote paths with square brackets:

```powershell
git add "app/product/[slug]/page.tsx"
git diff -- "app/product/[slug]/page.tsx"
```

Use Bash/Linux commands only when explicitly working on the VPS or documenting VPS steps:

```bash
# VPS/Linux only
docker compose ps
git pull --ff-only
chmod 600 .env.production
```

For cross-platform automation, prefer:

- Existing `npm` scripts.
- Small Node scripts.
- PowerShell-compatible commands for local manual work.

Avoid assuming:

- WSL.
- Bash-only local scripts.
- Linux path syntax for local Windows commands.

## 12. Examples

### Example A: Docs-Only Task

```md
# Task: Add Codex task template

## Context

Read `AGENTS.md`, `docs/project-state.md`, and `docs/code-review.md`.

This is a docs-only workflow improvement for Windows + VS Code users. It should help future Codex chats stay small and reviewable.

Already checked:

- The repository already has `docs/project-state.md`, `docs/code-review.md`, `docs/production-dry-run.md`, and `docs/vps-dry-run-result.md`.

## Goal

Create `docs/codex-task-template.md` with a reusable task-packet template.

## Constraints / Do Not Touch

- Do not change application code.
- Do not change `package.json`.
- Do not edit existing docs or README.
- Do not add dependencies, GitHub Actions, markdownlint, or VS Code tasks.

## Files Likely Involved

Allowed to edit:

- `docs/codex-task-template.md`

Do not edit:

- `README.md`
- `AGENTS.md`
- `package.json`
- `app/*`
- `components/*`
- `lib/*`
- `data/*`

## Required Checks

- Inspect the new Markdown file.
- Run `git status --short -uall`.
- Skip build/E2E because this is docs-only and does not affect runtime.
```

### Example B: Code Task With Checks

```md
# Task: Fix mobile catalog card overflow

## Context

Read `AGENTS.md`, `docs/project-state.md`, and `docs/code-review.md`.

The catalog page has a responsive layout issue on narrow Windows browser widths. This affects public SEO/catalog usability.

Already checked:

- Overflow is visible around 390px width on the catalog page.
- The issue appears limited to product card text/actions.

## Goal

Fix the mobile overflow on the catalog page without changing product data or unrelated layouts.

Acceptance criteria:

- No horizontal overflow at 390px, 768px, 1024px, and 1280px.
- Product card actions remain visible and usable.
- Existing calm industrial visual style is preserved.

## Constraints / Do Not Touch

- Do not change catalog data.
- Do not change request/order/backoffice flows.
- Do not add dependencies.
- Do not invent product descriptions, prices, ratings, reviews, or stock states.

## Files Likely Involved

Allowed to inspect:

- `app/catalog/*`
- `components/*`
- `data/catalog-public.ts`

Allowed to edit:

- The catalog page/component files directly responsible for the overflow.

Do not edit:

- `data/ozon-catalog.ts`
- `ozon_data/*`
- `app/api/*`
- `app/internal/*`
- `package.json`

## Required Checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`

Manual check:

- Open the catalog page at 390px, 768px, 1024px, and 1280px.
- Confirm there is no horizontal scrollbar.
```
