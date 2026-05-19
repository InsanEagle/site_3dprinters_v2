# Project State

## 1. Project purpose

The project is an owned website for a small FDM 3D-printing business focused on automotive plastic parts and custom manufactured plastic items.

The business goal is not to immediately replace Ozon and other marketplaces. The intended strategy is hybrid:

- Ozon and marketplaces remain important sales channels.
- The website becomes an SEO channel, catalog, showcase, request channel, and partial direct-order layer.
- The strongest focus is on services: custom manufacturing, 3D scanning, rare-part selection, and making parts from a sample/photo/model.

Current audit classification: the project is closer to a working MVP with P0 blockers than to a raw prototype.

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

Needs verification:

- Final VPS/self-host production deployment shape.
- Long-term persistence strategy for orders and request attachments.
- Exact production webhook receiver implementation.

## 3. Implemented features

- Main page.
- Catalog page.
- Category pages.
- Individual product pages.
- Service pages for custom manufacturing and 3D scanning.
- Supporting pages: delivery, FAQ, contacts, about, thanks.
- Request form with client and server validation.
- Request image attachments: JPG, PNG, WEBP, limited file count and file size.
- Primary webhook delivery for requests.
- Optional sidecar notification hooks for messenger, email, and sheets-like receivers.
- Cart and short checkout without online payment.
- Order API and file-based order records.
- Internal order backoffice with login, order list, statuses, delivery status, retry, and public status links.
- Signed access for request attachments.
- Sitemap.
- Robots.
- ESLint pipeline via `npm run lint`.

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
- Docker/VPS readiness: still open.

Remaining P0:

- Docker/VPS readiness.
- Production deployment/runbook for the current file-based storage model.

## 5. Known P1 issues

- Add truthful Schema.org where useful.
- Improve E2E isolation so tests do not write into the same operational data paths as local/manual data.
- Clarify checkout as inquiry-first unless real direct-sale SKU data is ready.
- Add or verify real Ozon URLs if marketplace handoff CTAs are used.
- Review env/backoffice production setup and operational checklist.
- Decide whether requests need a local backoffice/inbox instead of webhook-only handling.
- Keep addressing existing lint warnings about `<img>` vs `next/image` when image handling is ready.

## 6. Known P2 issues

- Refine categories toward a practical 6-8 category structure if needed.
- Review and polish imported product descriptions.
- Improve request admin/backoffice after first launch.
- Add more curated local product images if relying on external Ozon CDN becomes a risk.
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

1. Add minimal Docker/VPS readiness: Dockerfile, `.dockerignore`, compose or runbook, and production storage notes.
2. Add truthful Schema.org for Organization, Product where data is real, and FAQ if appropriate.
3. Review checkout/product CTAs so the public flow stays inquiry-first unless direct-sale data is real.
4. Add or verify real Ozon URLs before using marketplace handoff as a serious user path.
5. Isolate E2E fixtures from operational `data/orders` and `data/request-attachments`.
6. Review request handling after first production-like test: decide whether webhook-only is enough or a local request inbox is needed.
7. Polish imported product descriptions and category grouping.
8. Add production runbook for env, webhook receiver, backoffice password, file storage, backup, and deploy checks.

## 10. Last audit summary

The latest audit found a substantial MVP foundation:

- The site has real pages, catalog, categories, product pages, services, request flow, attachments, cart/checkout layer, internal order backoffice, and webhook notifications.
- The project is not just a static prototype; it has meaningful MVP functionality.
- The largest launch risks were operational and SEO-readiness gaps rather than lack of core pages.
- Header responsiveness, lint, sitemap, robots, and production request behavior were identified as P0 items.
- Several P0 items have since been addressed in follow-up tasks.
- Docker/VPS readiness remains the main open P0 from that list.

Residual risk:

- The project is still not fully production-ready until deployment, storage, backup, and env/runbook details are settled.
- Checkout/direct-sale behavior remains secondary to inquiry-first positioning.
- Product/import quality and Schema.org still need careful review before real SEO launch.
