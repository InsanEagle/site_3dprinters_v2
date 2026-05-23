# Next Actions

Created: 2026-05-21

Purpose: keep a current, compact action tracker for new ChatGPT and Codex chats so they can understand what is next, what is postponed, and what is already closed.

Update rule: update this file after major project stages, launch-readiness changes, production dry runs, large documentation updates, or meaningful workflow decisions.

## Current Status

- VPS/HTTPS dry run passed.
- Docker, Caddy, and HTTPS work in the production-like VPS setup.
- Internal backoffice works.
- Internal request inbox works.
- Private signed request attachments work.
- VPS runtime backup workflow has been added.
- Ozon catalog refresh has been completed.
- Basic `/policy` page has been added.
- Codex task template has been added.
- ChatGPT + Codex workflow has been formalized.
- `.ai` quick-start layer has been added.
- `npm run check:all` has been added as the standard full local check.
- VS Code tasks have been added.
- GitHub Actions CI with E2E has been added.
- CodeQL analysis has been enabled through GitHub UI.
- Dependabot has been added.
- PR and Codex task issue templates have been added.
- Yandex Metrica has been connected through env and verified on VPS.
- Production webhook receiver has been connected through Make + Google Sheets.
- Ozon workflow has been documented.
- Decision log has been added.
- Homepage featured products have been narrowed to a stronger first-launch selection.
- No known code-level P0 blockers are currently open.

## NOW

- Use the new ChatGPT + Codex workflow on the next real product task and adjust docs only if the workflow shows a gap.
- Manually review polished homepage and first-launch products on 390/768/1024/1280 widths.
- Review product page SEO descriptions for first-launch SKU group.
- Keep the working tree clean before starting new tasks.
- Use a fresh AI-review after important or risky diffs.

## NEXT

- Run a UX/copy audit for the first wave of products.
- Switch from `sslip.io` to a real domain.
- Update product content and SEO descriptions where real product data is available.
- Consider optional `markdownlint` later if Markdown drift becomes a recurring problem.

## LATER

- Add Make/n8n automation after the production receiver path is chosen.
- Add CRM, Sheets, or Telegram workflow after real operations show the right shape.
- Add Sentry before public launch if runtime observability becomes necessary.
- Add branch protection later if the project moves to a PR-based workflow.
- Expand the internal backoffice after real operational usage shows what is needed.
- Do not add Husky for now.
- Add online payment only after the direct-sale scenario is stable.

## DONE

- Lint pipeline fixed.
- Repository hygiene improved.
- Sitemap and robots added.
- Request flow made honest for missing or failed delivery.
- Orders and internal backoffice added.
- Docker/VPS readiness added.
- HTTPS dry run completed.
- Internal request inbox added.
- Ozon import refreshed.
- Basic policy page added.
- Codex task template added.
- Next actions tracker added.
- Decision log added.
- Ozon catalog workflow doc added.
- Docs navigation added.
- `.ai` workspace prompts added.
- `typecheck` and `check:all` scripts added.
- VS Code tasks added.
- AI-review workflow docs added.
- GitHub Actions CI with E2E added.
- CodeQL analysis enabled through GitHub UI.
- Dependabot added.
- PR template added.
- Codex task issue template added.
- First-launch homepage selection and copy polished.
- Homepage featured products narrowed after first-launch SKU audit.
- Yandex Metrica added through env and verified on VPS.
- Production webhook receiver connected through Make + Google Sheets.
- VPS runtime backup workflow added.

## Working Rules

- One task should produce one small, focused diff.
- For normal small tasks, use a short prompt from `.ai/COMMON_PROMPTS.md` when it fits.
- Default complex/risky workflow: Audit -> Implement -> Review.
- Risky tasks should start as analysis-only.
- Risky implemented diffs must get a fresh AI-review before commit or deployment.
- Codex should not commit by itself.
- Before commit, run:

```powershell
git status --short -uall
```

- Do not commit raw, runtime, private, generated-local, uploaded, backup, `.env`, `.next`, or `node_modules` files.
- Local Windows commands must be PowerShell-friendly.
- Use `npm run check:all` as the standard full check before commit when the change affects code, runtime behavior, CI, E2E, or public product flow.
- Use separate `npm run lint`, `npm run typecheck`, `npm run build`, or `npm run test:e2e` commands for targeted diagnostics.
- Do not run the same checks twice without a clear reason.
- Linux/bash commands are allowed only when clearly labeled as VPS/Linux.

## Open Questions

- When should the real domain be bought and connected?
- Which 20-30 SKU should stay in the first launch wave?
- Is `markdownlint` worth adding later?
- Is branch protection needed later if the project moves to PR-based work?
- When should requests move into a fuller CRM workflow?
