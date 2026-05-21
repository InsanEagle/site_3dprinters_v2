# AGENTS.md

## Project Context

This repository is a website for a small FDM 3D-printing business focused on automotive plastic parts and custom manufactured items.

The business goal is to gradually move part of demand from Ozon and other marketplaces to the owned website through SEO, a public catalog, product pages, service pages, and request flows. Ozon remains an important sales channel; the site is a hybrid SEO/catalog/request channel, not an immediate marketplace replacement.

Core MVP goals:

- Public website for FDM 3D-printed auto parts and custom plastic parts.
- Catalog with category pages and individual product SEO pages.
- Service pages for custom manufacturing and 3D scanning.
- Request forms with file/photo attachments.
- A safe request flow without online payment.
- A small internal backoffice for orders/operations where already implemented.
- Basic SEO readiness: metadata, readable URLs, sitemap, robots, and appropriate Schema.org.
- Future self-host/VPS readiness.

## Technical Stack And Constraints

- Use Next.js App Router.
- Use TypeScript.
- Use Tailwind CSS.
- Keep the MVP as a simple modular monolith.
- Do not add Prisma, ORM, or a database unless explicitly approved and clearly necessary.
- Do not add online payment in the first MVP phase.
- Data can live in TypeScript/JSON files during MVP.
- Avoid heavy dependencies unless there is a strong project-specific reason.
- Prefer existing local patterns, helpers, and modules over new abstractions.

## Before Starting A Task

Read the current source-of-truth docs before editing:

- `docs/project-state.md` — current MVP state, architecture, blockers, and roadmap.
- `docs/next-actions.md` — current Now/Next/Later/Done tracker.
- `docs/decision-log.md` — accepted product and architecture decisions.
- `docs/code-review.md` — review rules and expectations.
- `docs/codex-task-template.md` — task-packet template for new Codex chats.
- A profile-specific doc when relevant, for example `docs/catalog-ozon-workflow.md` for Ozon/catalog import tasks or `docs/production-dry-run.md` for VPS/deploy tasks.

Use Windows, VS Code, and PowerShell-friendly local commands unless a step is explicitly for Linux/VPS.

Keep the working shape small: one task should produce one small, focused diff.

## Hard Prohibitions

- Do not rewrite the project from scratch.
- Do not add heavy dependencies without a clear reason and approval when needed.
- Do not connect online payment or payment providers.
- Do not add Prisma/ORM.
- Do not invent products, categories, prices, Ozon URLs, API keys, credentials, or secrets.
- Do not expose secrets to client code.
- Do not log personal request/customer data beyond what is required for the current feature.
- Do not change unrelated files.
- Do not hide production misconfiguration behind fake success states.

## Working Rules

- One task should produce one small, focused diff.
- Before editing, understand the current architecture and existing helpers.
- Change only files directly related to the task.
- Preserve existing business logic unless the task explicitly changes it.
- Prefer safe, incremental fixes over broad refactors.
- Keep request/order flows honest: if an operation was not delivered or saved, the UI must not say it succeeded.
- Update `.env.example` and documentation whenever adding or changing env variables.
- After every change, run relevant checks and report results.
- Always provide a concise final report.

## Checks

Run checks appropriate to the change:

- `npm run lint`
- `npx tsc --noEmit --incremental false`
- `npm run build` when safe and relevant
- Relevant smoke/E2E checks when they exist and are safe to run

If a check cannot be run safely, say why and describe the residual risk.

## Design Direction

The visual direction should be calm, industrial, precise, and trustworthy.

Use:

- White background.
- Soft gray surfaces.
- Borders around `#E5E7EB`.
- Main text around `#1F2328`.
- Secondary text around `#4B5563`.
- Orange accent around `#E86A2D`.
- Clean cards and controlled spacing.
- Clear CTAs.

Avoid:

- Aggressive marketplace-style UI.
- Overly decorative hero sections.
- Visual noise, excessive gradients, and inconsistent button/card styles.
- Layouts that cause horizontal overflow on mobile or desktop.

## SEO Rules

- Use human-readable URLs.
- Add or preserve metadata for public pages.
- Keep `sitemap` and `robots` aligned with public routes.
- Do not include `/api/*`, `/internal/*`, or protected/private order status URLs in public SEO surfaces.
- Use Schema.org only where truthful and useful.
- Do not invent fake ratings, prices, reviews, stock states, or testimonials.
- Product SEO should reflect actual catalog data.

## Env And Security

- Never reveal real secrets.
- Never put server-only secrets in client components or public bundles.
- Keep `.env.example` current when env variables are added.
- Required production env must be documented.
- Request submission misconfiguration must fail visibly and safely.
- If `REQUESTS_WEBHOOK_URL` is missing or delivery fails, users must not see a successful request state.
- Optional sidecar notifications must not replace the required primary request/order receiver.

Important env currently used or expected:

- `NEXT_PUBLIC_SITE_NAME`
- `NEXT_PUBLIC_SITE_URL`
- `APP_URL`
- `REQUESTS_WEBHOOK_URL`
- `REQUESTS_WEBHOOK_TOKEN`
- `REQUESTS_WEBHOOK_TIMEOUT_MS`
- `REQUEST_ATTACHMENTS_ACCESS_SECRET`
- `INTERNAL_BACKOFFICE_PASSWORD`
- `INTERNAL_BACKOFFICE_SESSION_SECRET`
- `ORDER_PUBLIC_ACCESS_SECRET`
- `OPERATIONS_MESSENGER_WEBHOOK_URL`
- `OPERATIONS_MESSENGER_WEBHOOK_TOKEN`
- `OPERATIONS_MESSENGER_LABEL`
- `OPERATIONS_EMAIL_WEBHOOK_URL`
- `OPERATIONS_EMAIL_WEBHOOK_TOKEN`
- `OPERATIONS_EMAIL_LABEL`
- `OPERATIONS_SHEETS_WEBHOOK_URL`
- `OPERATIONS_SHEETS_WEBHOOK_TOKEN`
- `OPERATIONS_SHEETS_LABEL`

## Report Format

After each task, report:

1. What was true before.
2. What changed.
3. Files changed.
4. Checks run and results.
5. Remaining risks.
6. Recommended next step, but do not perform it unless asked.
