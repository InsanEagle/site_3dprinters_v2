# Project Decision Log

This document records key product and architecture decisions that should be treated as project context for future Codex tasks. It is not a full project history and should not duplicate the README or operational docs.

Decisions here can change, but only through an explicit follow-up decision with a clear reason.

| ID | Decision | Status | Why | Consequences |
| --- | --- | --- | --- | --- |
| D-001 | Inquiry-first MVP | Accepted | The site supports a small FDM 3D-printing business where fit, material, production, and availability often need clarification. | The primary flow is request, clarification, selection, and manufacturing. Checkout/direct sale stays secondary and limited. |
| D-002 | No online payments for MVP | Accepted | Payment integration increases operational, legal, support, and failure-handling complexity. | Do not add YooKassa, acquiring, or another payment provider without a separate decision. |
| D-003 | No ORM or database for MVP | Accepted | The MVP should remain a simple modular monolith with low operational overhead. | Use file-based storage for `data/orders`, `data/requests`, and `data/request-attachments`. Do not add Prisma, PostgreSQL, or SQLite without a separate decision. |
| D-004 | Requests and orders are separate | Accepted | Inquiry forms and checkout orders represent different operational entities. | `/internal/requests` is for form requests. `/internal/orders` is for checkout orders. Do not merge or blur these concepts. |
| D-005 | Primary webhook required for request success | Accepted | Users must not see a successful request state if the required receiver was not reached. | Request submission shows success only after the primary webhook is delivered. Failed or missing webhook configuration must fail visibly and safely. Requests are also saved to the internal request inbox. |
| D-006 | Private attachments | Accepted | Request attachments may contain personal photos, documents, or customer-specific details. | Store attachments under `data/request-attachments`, not `public`. Access must use signed links or an active internal session. |
| D-007 | Runtime env must stay runtime | Accepted | Secrets and deployment-specific values must not be baked into the build. | Backoffice, session, status, attachment, cookie, and file-storage dependent routes must remain dynamic when they depend on runtime env or request state. |
| D-008 | Docker/VPS deployment model | Accepted | The site should be ready for self-hosted VPS deployment behind a reverse proxy. | Next.js runs in Docker. After Caddy/HTTPS, the app port should bind to `127.0.0.1:3000`. Public ingress is 80/443; SSH 22 is IP-restricted. Port 3000 must not remain public after reverse proxy setup. |
| D-009 | Ozon raw data stays private | Accepted | Marketplace exports can contain finance, internal, or operational fields that should not be published. | Do not commit `ozon_data/*`. Raw exports stay ignored. Only cleaned generated data may feed the public catalog. Do not publish finance or internal Ozon fields. |
| D-010 | Ozon catalog visibility is curated | Accepted | Imported marketplace products are not automatically ready for owned-site SEO or public catalog display. | `data/ozon-catalog.ts` is generated. `data/catalog-public.ts` controls public visibility. First-launch products must be curated. |
| D-011 | SEO honesty | Accepted | SEO must describe real products and services without fabricated trust signals. | Do not add fake reviews, fake `aggregateRating`, fake prices, or fake availability. Schema.org must be truthful and useful. |
| D-012 | Windows and VS Code workflow | Accepted | The local workflow is Windows with VS Code, without assuming WSL. | Local instructions and commands should be PowerShell-friendly. Bash/Linux commands are allowed only when clearly marked as VPS/Linux. |
| D-013 | One task equals one small diff | Accepted | Small focused changes reduce review risk and make Codex work easier to verify. | Codex should handle one small task at a time. Risky tasks should start analysis-only. Codex should not commit unless explicitly asked. |

## D-001: Inquiry-first MVP

The website is not meant to pretend it is a full marketplace-style online store. The main product flow is inquiry-first: a visitor asks about a part or custom job, the business clarifies fit and requirements, then selection or manufacturing proceeds.

Checkout and direct-sale flows may exist, but they are secondary and should remain limited during the MVP.

## D-002: No online payments for MVP

Online payment is intentionally out of scope for the MVP. Do not add YooKassa, acquiring, card payment, or similar payment provider integrations unless a separate decision explicitly changes this.

## D-003: No ORM or database for MVP

The MVP uses file-based storage instead of an ORM or database:

- `data/orders`
- `data/requests`
- `data/request-attachments`

Do not add Prisma, PostgreSQL, SQLite, or another persistence layer unless a separate decision approves the change.

## D-004: Requests and orders are separate

Requests and orders are separate operational concepts.

`/internal/requests` is the internal inbox for form-based inquiries. `/internal/orders` is for checkout orders. Do not combine these surfaces or make one silently stand in for the other.

## D-005: Primary webhook required for request success

A request may only show a success state to the user if the required primary webhook was delivered. If `REQUESTS_WEBHOOK_URL` is missing, misconfigured, timed out, or failed, the UI must not show fake success.

The request should also be stored in the internal request inbox, but that local save is not a replacement for the required primary receiver.

## D-006: Private attachments

Request attachments are private operational data. They must not be stored in `public` or exposed as static assets.

Attachments live under `data/request-attachments` and should be accessible only through signed links or an active internal session.

## D-007: Runtime env must stay runtime

Secrets and request-specific state must remain runtime concerns. Backoffice/session/status/attachment secrets must not be baked into static build output or exposed to client bundles.

Routes that depend on runtime environment variables, cookies, file storage, sessions, or attachment access should be dynamic.

## D-008: Docker/VPS deployment model

The production direction is a Dockerized Next.js app behind Caddy/HTTPS on a VPS.

After reverse proxy setup, the app should bind to `127.0.0.1:3000`. Only ports 80 and 443 should be public for web traffic, and SSH 22 should be restricted by IP. Port 3000 must not remain publicly exposed after Caddy is in front of the app.

## D-009: Ozon raw data stays private

Raw Ozon exports under `ozon_data/*` are not committed and should remain ignored.

Only a cleaned generated layer may feed public catalog data. Do not expose finance, marketplace-internal, or operational Ozon fields in the public catalog or SEO surfaces.

## D-010: Ozon catalog visibility is curated

Generated Ozon catalog data is not automatically public.

`data/ozon-catalog.ts` is generated data. `data/catalog-public.ts` controls public visibility. Products for the first public launch must be intentionally curated.

## D-011: SEO honesty

SEO and Schema.org markup must remain truthful.

Do not invent reviews, `aggregateRating`, prices, stock states, availability, testimonials, or other trust signals. Product SEO should reflect actual catalog data and known business facts.

## D-012: Windows and VS Code workflow

The local development workflow assumes Windows and VS Code. WSL should not be assumed.

Local commands in docs and task packets should be PowerShell-friendly. Bash/Linux commands are acceptable only when explicitly labeled as VPS/Linux.

## D-013: One task equals one small diff

Codex should perform one small, focused task at a time. Broad refactors, risky migrations, deployment changes, and security-sensitive changes should start with analysis-only work unless the user explicitly asks for implementation.

Codex should not create commits unless the user explicitly asks.

## How to update this log

When a key project decision changes, update this file in a small docs-only task:

- Add a new decision row or update the existing decision status.
- Keep the reason and consequences short.
- Do not include secrets, chat history, or long implementation notes.
- Cross-check against `AGENTS.md`, `README.md`, and current docs before changing accepted project direction.
