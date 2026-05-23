# Project State

## 1. Project purpose

The project is an owned website for a small FDM 3D-printing business focused on automotive plastic parts and custom manufactured plastic items.

The business goal is not to immediately replace Ozon and other marketplaces. The intended strategy is hybrid:

- Ozon and marketplaces remain important sales channels.
- The website becomes an SEO channel, catalog, showcase, request channel, and partial direct-order layer.
- The strongest focus is on services: custom manufacturing, 3D scanning, rare-part selection, and making parts from a sample/photo/model.

Current audit classification: the project is a working production-like MVP with remaining operational launch tasks.

Readiness estimates from the latest audit:

- Internal testing: 75%.
- Showing to friends / first clients: 55%.
- Real SEO launch: 40%.
- Production deployment: 35%.

## 2. Current architecture

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Simple modular monolith for MVP.
- No Prisma/ORM.
- No online payment in the first phase.
- Product/catalog data is file-based through TypeScript data modules.
- Public catalog data flows through `data/site.ts` and `data/catalog-public.ts`.
- Ozon-derived raw/imported product data exists in `data/ozon-catalog.ts` and `ozon_data/*`.
- Request submission goes through `POST /api/requests`.
- Orders use a file-based store in `data/orders`.
- Request attachments use private file storage under `data/request-attachments` and signed access routes.
- Internal order backoffice exists under `/internal/*`.
- SEO routes now include `/sitemap.xml` and `/robots.txt`.
- Yandex Metrica is connected through `NEXT_PUBLIC_YANDEX_METRIKA_ID` and has been verified on the VPS.
- The production receiver path is connected through Make + Google Sheets.
- VPS runtime backup workflow exists for `data/orders`, `data/requests`, and `data/request-attachments`.
- Repo-local Codex skills exist for project workflow, visual polish, architecture audit, bug diagnosis, and handoff.
- Production product card images are configured through `data/product-image-assets.ts` with `cardImage` assets for 7 homepage featured SKU.

Verified after the latest VPS dry run:

- Docker production build works on a Cloud.ru VPS.
- The container starts.
- HTTPS works through Caddy.
- Next.js is reachable locally through `127.0.0.1:3000`.
- Public pages, internal backoffice, request inbox, request flow, signed attachments, backup creation, sitemap, and robots were checked.

Needs verification before real production:

- Real domain instead of temporary `sslip.io`.
- Production env after switching from the VPS dry-run URL to the real domain.
- Recurring backup schedule and restore rehearsal.
- Firewall hardening for port `3000` and SSH.
- Legal/privacy readiness for real production.

Workflow source-of-truth docs have been added and should be used by new Codex chats and human maintainers:

- `docs/codex-task-template.md` — task-packet template for new Codex chats.
- `docs/next-actions.md` — current Now/Next/Later/Done tracker.
- `docs/decision-log.md` — accepted product and architecture decisions.
- `docs/catalog-ozon-workflow.md` — safe Ozon import and public visibility workflow.

## 3. Implemented features

- Main page.
- Catalog page.
- Category pages.
- Individual product pages.
- Service pages for custom manufacturing and 3D scanning.
- Supporting pages: delivery, FAQ, contacts, about, policy, thanks.
- Request form with client and server validation.
- Request image attachments: JPG, PNG, WEBP, limited file count and file size.
- Primary webhook delivery for requests.
- Optional sidecar notification hooks for messenger, email, and sheets-like receivers.
- Cart and short checkout without online payment.
- Order API and file-based order records.
- Internal order backoffice with login, order list, statuses, delivery status, retry, and public status links.
- Internal request inbox with request list and request detail pages.
- Signed access for request attachments.
- Sitemap.
- Robots.
- ESLint pipeline via `npm run lint`.
- First-launch public product selection exists through `data/catalog-public.ts`; product content and SEO copy may still need polish.
- Homepage featured products have public copy overrides and local card images for the current 7-SKU homepage selection.

## 4. Known P0 issues

Original P0 list from the audit:

- Header horizontal overflow on mobile and 1024 desktop.
- Broken lint pipeline because `npm run lint` opened an interactive setup wizard.
- Missing sitemap and robots.
- Missing Docker/VPS readiness.
- Production request/env risk around `REQUESTS_WEBHOOK_URL`.

Current status:

- Header overflow: fixed after audit. Verified on `/`, `/catalog`, `/custom`, `/3d-scan`, `/contacts` at 390, 768, 1024, 1280.
- Lint pipeline: fixed after audit. `npm run lint` is non-interactive.
- Sitemap: added after audit.
- Robots: added after audit.
- Production request/env behavior: strengthened after audit. Missing or failed primary webhook does not produce fake success.
- Docker/VPS readiness: minimal Dockerfile, `.dockerignore`, compose, README notes, and `docs/production-dry-run.md` added after audit.

Remaining P0:

- No known code-level P0 blockers after the VPS/HTTPS dry run.
- Next P0 before real launch is operational: real domain, firewall hardening, SSH restriction, backup restore rehearsal, and privacy/legal readiness.

## 5. Known P1 issues

- Truthful Schema.org has been added for Organization, Product, FAQPage, and Service where data is real.
- E2E isolation is implemented with `ORDERS_DATA_DIR`, `REQUESTS_DATA_DIR`, `REQUEST_ATTACHMENTS_DIR`, and `tmp/e2e/*` test storage.
- Clarify checkout as inquiry-first unless real direct-sale SKU data is ready.
- Add or verify real Ozon URLs if marketplace handoff CTAs are used.
- Review env/backoffice setup after switching from dry run to real domain.
- Keep the request inbox minimal until real production usage shows what workflow is actually needed.

## 6. Known P2 issues

- Refine categories toward a practical 6-8 category structure if needed.
- Review and polish imported product descriptions.
- Improve request admin/backoffice after first launch.
- Add more curated local product images beyond the current 7 homepage product card images if relying on external Ozon CDN remains a risk.
- Improve product SEO fields beyond generated metadata.

## 7. Decisions already made

- Keep MVP as a simple modular monolith.
- Do not add Prisma/ORM at this stage.
- Do not add online payment at this stage.
- Use file-based catalog/product data for MVP.
- Keep Ozon/marketplaces as part of the hybrid sales strategy.
- Use request-first flow as the main public conversion path.
- Treat `REQUESTS_WEBHOOK_URL` as required for production request/order delivery.
- Do not show fake success if request delivery is unavailable or fails.
- Keep `/internal/*`, `/api/*`, and `/orders/*` out of public SEO surfaces.
- Use `NEXT_PUBLIC_SITE_URL` / `APP_URL` for absolute sitemap and operational URLs.
- Keep Schema.org truthful only: no fake ratings, prices, reviews, or testimonials.
- Keep Next.js bound to `127.0.0.1:3000` behind Caddy/nginx/Traefik for HTTPS deployments.
- Store requests in `data/requests` and attachments in `data/request-attachments`; do not put uploaded files in `public`.

## 8. Things explicitly postponed

- Online payment integration.
- Prisma/ORM or full database migration.
- Full marketplace/ecommerce rebuild.
- Full CRM.
- Full user account area.
- Production-grade auth/RBAC for backoffice.
- Deep category hierarchy.
- Large-scale rewrite from scratch.
- Adding fake or guessed product data, prices, Ozon links, ratings, or reviews.

## 9. Current recommended roadmap

1. Replace temporary `sslip.io` access with a real domain.
2. Close external port `3000` and restrict SSH to the operator IP where possible.
3. Rehearse restore from the VPS runtime backup archive.
4. Prepare legal/privacy readiness before public launch.
5. Review checkout/product CTAs so the public flow stays inquiry-first unless direct-sale data is real.
6. Add or verify real Ozon URLs before using marketplace handoff as a serious user path.
7. Polish imported product descriptions, product SEO copy, and category grouping.

## 10. Last audit summary

The latest audit found a substantial MVP foundation:

- The site has real pages, catalog, categories, product pages, services, request flow, attachments, cart/checkout layer, internal order backoffice, and webhook notifications.
- The project is not just a static prototype; it has meaningful MVP functionality.
- The largest launch risks were operational and SEO-readiness gaps rather than lack of core pages.
- Header responsiveness, lint, sitemap, robots, and production request behavior were identified as P0 items.
- Several P0 items have since been addressed in follow-up tasks.
- Minimal Docker/VPS readiness and a production dry run checklist have been added.
- A Cloud.ru VPS / HTTPS dry run has been completed successfully; details are recorded in `docs/vps-dry-run-result.md`.
- Since the dry run, Make + Google Sheets receiver, Yandex Metrica, VPS runtime backup workflow, local Codex skills, and 7 homepage product card images have been added.

Residual risk:

- The project is still not fully production-ready until the real domain, firewall hardening, SSH restriction, backup restore rehearsal, and privacy/legal readiness are settled.
- Checkout/direct-sale behavior remains secondary to inquiry-first positioning.
- Product/import quality and Schema.org still need careful review before real SEO launch.
