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
- Ozon catalog refresh has been completed.
- Basic `/policy` page has been added.
- Codex task template has been added.
- No known code-level P0 blockers are currently open.

## NOW

- Finish and commit the first-launch popular products selection if a relevant diff already exists.
- Check the first wave of products shown on the main page.
- Update the VPS after that product selection, if needed.
- Replace `webhook.site` with a production receiver later, not as the immediate next step.
- Close or verify external port `3000` if it is not already closed.

## NEXT

- Add `docs/catalog-ozon-workflow.md`.
- Add `docs/decision-log.md`.
- Add GitHub Actions CI.
- Add Yandex Metrica through env-based configuration.
- Document backup script and cron setup.
- Run a UX/copy audit for the first wave of products.

## LATER

- Set up a Make/n8n production receiver.
- Switch from `sslip.io` to a real domain.
- Improve SEO descriptions.
- Expand the internal backoffice after real operational usage shows what is needed.
- Add online payment only after the direct-sale scenario is stable.
- Add CRM, Sheets, or Telegram automation.

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

## Working Rules

- One task should produce one small, focused diff.
- Risky tasks should start as analysis-only.
- Risky implemented diffs should get a fresh AI-review before commit or deployment.
- Codex should not commit by itself.
- Before commit, run:

```powershell
git status --short -uall
```

- Do not commit raw, runtime, private, generated-local, uploaded, backup, `.env`, `.next`, or `node_modules` files.
- Local Windows commands must be PowerShell-friendly.
- Full local checks should use `npm run check:all`.
- Linux/bash commands are allowed only when clearly labeled as VPS/Linux.

## Open Questions

- When should the production webhook receiver replace the temporary receiver?
- Which 20-30 SKU should stay in the first launch wave?
- When should the real domain be bought and connected?
- Is Yandex Metrica needed before the first client showing?
- When should requests move into a fuller CRM workflow?
