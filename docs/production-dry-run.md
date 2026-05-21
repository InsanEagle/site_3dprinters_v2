# Production Dry Run

This checklist describes a manual production-like VPS dry run for the current MVP.

The project uses:

- Next.js standalone Docker build.
- No database.
- File-based runtime storage:
  - `data/orders`
  - `data/requests`
  - `data/request-attachments`
- External webhook receiver for request/order delivery.
- Reverse proxy and HTTPS as an external infrastructure layer.

Do not commit `.env.production`, runtime data, backups, `.next`, `node_modules`, or uploaded files.

## 1. Prerequisites

- Linux VPS with SSH access.
- Docker installed.
- Docker Compose plugin installed.
- Repository access from the server.
- Domain name if the site will be checked with a real public URL.
- External webhook receiver ready to accept:
  - `request.created`
  - `order.created`
- Optional sidecar receivers if used:
  - messenger
  - email
  - sheets

Quick server checks:

```bash
docker --version
docker compose version
git --version
```

## 2. Prepare Project On Server

Clone or update the repository:

```bash
git clone <repo-url> site
cd site
```

For an existing checkout:

```bash
cd site
git fetch --all --prune
git status --short
git branch --show-current
git pull --ff-only
```

Before dry run, the server checkout should be clean:

```bash
git status --short
```

Create production env from the example:

```bash
cp .env.example .env.production
chmod 600 .env.production
```

Edit `.env.production` on the server only. Do not commit it.

## 3. Production Env

Required:

```env
REQUESTS_WEBHOOK_URL=https://example-webhook-receiver.test/webhook
REQUEST_ATTACHMENTS_ACCESS_SECRET=replace-with-long-random-secret
INTERNAL_BACKOFFICE_PASSWORD=replace-with-strong-password
INTERNAL_BACKOFFICE_SESSION_SECRET=replace-with-long-random-secret
ORDER_PUBLIC_ACCESS_SECRET=replace-with-long-random-secret
NEXT_PUBLIC_SITE_URL=https://example.com
APP_URL=https://example.com
```

Purpose:

- `REQUESTS_WEBHOOK_URL` — primary receiver for requests and orders. Without it, request submission must not show success.
- `REQUEST_ATTACHMENTS_ACCESS_SECRET` — signs private request attachment links.
- `INTERNAL_BACKOFFICE_PASSWORD` — password for `/internal/login`.
- `INTERNAL_BACKOFFICE_SESSION_SECRET` — signs internal backoffice session cookies.
- `ORDER_PUBLIC_ACCESS_SECRET` — signs public order status links.
- `NEXT_PUBLIC_SITE_URL` — absolute public URL for SEO surfaces such as sitemap.
- `APP_URL` — absolute public URL for operational links in webhook payloads.

Optional:

```env
REQUESTS_WEBHOOK_TOKEN=replace-if-receiver-requires-bearer-token
NEXT_PUBLIC_YANDEX_METRIKA_ID=
OPERATIONS_MESSENGER_WEBHOOK_URL=
OPERATIONS_MESSENGER_WEBHOOK_TOKEN=
OPERATIONS_MESSENGER_LABEL=
OPERATIONS_EMAIL_WEBHOOK_URL=
OPERATIONS_EMAIL_WEBHOOK_TOKEN=
OPERATIONS_EMAIL_LABEL=
OPERATIONS_SHEETS_WEBHOOK_URL=
OPERATIONS_SHEETS_WEBHOOK_TOKEN=
OPERATIONS_SHEETS_LABEL=
```

Purpose:

- `REQUESTS_WEBHOOK_TOKEN` — sent only server-side as bearer token to the primary receiver.
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` — optional Yandex Metrica counter ID. If it is empty, the Metrica script and noscript fallback are not added to the site. This is a public env value for the client bundle; on Docker/VPS it is passed from `.env.production` as a Docker build arg, and changing it requires rebuilding the Docker image so static pages include the updated counter.
- `OPERATIONS_MESSENGER_WEBHOOK_*` — optional sidecar notification channel.
- `OPERATIONS_EMAIL_WEBHOOK_*` — optional sidecar email channel.
- `OPERATIONS_SHEETS_WEBHOOK_*` — optional sidecar sheet/table channel.
- `OPERATIONS_*_LABEL` — optional human-readable labels for sidecar channels in backoffice and delivery status output.

Storage overrides normally stay empty in production:

```env
ORDERS_DATA_DIR=
REQUESTS_DATA_DIR=
REQUEST_ATTACHMENTS_DIR=
```

Use them only for custom deployments or tests. The Docker compose setup already mounts the default paths.

## 4. Runtime Storage

Runtime directories:

- `data/orders`
- `data/requests`
- `data/request-attachments`

Create them:

```bash
mkdir -p data/orders data/requests data/request-attachments
```

The Docker image runs as non-root user `1001`. On Linux/VPS, make mounted directories writable:

```bash
sudo chown -R 1001:1001 data/orders data/requests data/request-attachments
```

Check permissions:

```bash
ls -ld data/orders data/requests data/request-attachments
```

After the app starts, verify writes by submitting a test request/order and checking:

```bash
find data/orders -maxdepth 1 -type f -name '*.json' | tail
find data/requests -maxdepth 1 -type f -name '*.json' | tail
find data/request-attachments -type f | tail
```

Request attachments must stay in `data/request-attachments`, not in `public`.

## 5. Docker Startup

Validate compose config:

```bash
docker compose --env-file .env.production config
```

Build:

```bash
docker compose --env-file .env.production build
```

This passes `NEXT_PUBLIC_YANDEX_METRIKA_ID` from `.env.production` into the Docker build through `build.args`. Re-run this build after changing the counter ID.

Start:

```bash
docker compose --env-file .env.production up -d
```

Inspect:

```bash
docker compose ps
docker compose logs -f app
```

The app listens on container port `3000`. Docker compose binds it only to loopback: `127.0.0.1:${APP_PORT:-3000}:3000`.

After reverse proxy / HTTPS is enabled, do not expose host port `3000` publicly. Public traffic should enter through `80/443`, and Caddy/nginx/Traefik should proxy to `http://127.0.0.1:3000`.

## 6. Smoke Check After Startup

Open manually:

- `/`
- `/catalog`
- one `/product/[slug]`
- `/contacts`
- `/custom`
- `/3d-scan`
- `/sitemap.xml`
- `/robots.txt`
- `/internal/login`

Expected:

- Public pages render normally.
- Header has no horizontal overflow.
- `/sitemap.xml` contains public routes only.
- `/robots.txt` disallows `/api/`, `/internal/`, and `/orders/`.
- `/internal/login` is available only with configured production env.

## 7. Request Check

Scenario:

1. Open `/contacts`.
2. Fill request form.
3. Attach a small test image.
4. Submit.
5. Confirm user reaches `/thanks`.
6. Confirm webhook receiver got `request.created`.
7. Confirm request JSON is created under `data/requests`.
8. Confirm attachment file is stored under `data/request-attachments`.
9. Confirm no new file appears under `public/uploads/requests`.
10. Confirm signed attachment URL from webhook works only with valid access token or internal session.
11. Open `/internal/requests` and check the saved request.

Failure checks:

- Temporarily wrong `REQUESTS_WEBHOOK_URL` should not show a fake success state.
- User-facing error must not expose webhook URL, token, stack trace, or env names.

## 8. Order Check

If there is a direct-sale product available:

1. Add product to cart.
2. Go through cart/checkout.
3. Confirm user reaches `/thanks`.
4. Confirm order JSON is created under `data/orders`.
5. Confirm webhook receiver got `order.created`.
6. Open `/internal/login`.
7. Log in with `INTERNAL_BACKOFFICE_PASSWORD`.
8. Open `/internal/orders`.
9. Open the created order.
10. Check delivery status and retry action.
11. Open public order status link.

If no direct-sale product is currently intended for real launch, keep checkout as a dry-run path only and verify that public copy remains inquiry-first.

## 9. Backup / Restore

Create backup:

```bash
mkdir -p backups
tar -czf backups/site-data-$(date +%Y%m%d-%H%M%S).tar.gz data/orders data/requests data/request-attachments
```

Restore:

```bash
docker compose stop app
tar -xzf backups/site-data-YYYYMMDD-HHMMSS.tar.gz
sudo chown -R 1001:1001 data/orders data/requests data/request-attachments
docker compose up -d
```

After restore:

```bash
docker compose ps
docker compose logs --tail=100 app
```

Then verify:

- `/internal/orders`
- `/internal/requests`
- one existing order
- one public order status link
- one test request submission

## 10. Reverse Proxy / HTTPS

Reverse proxy is an external layer and is not implemented in this repo.

Recommended options:

- nginx
- Caddy
- Traefik

Expected shape:

- Public HTTPS on `https://example.com`.
- Let's Encrypt certificate managed by the proxy layer.
- Public firewall allows `80/443`.
- Host port `3000` stays closed externally and is reachable only as `127.0.0.1:3000` on the VPS.
- SSH `22` should be restricted to your own IP `/32` where possible.
- Proxy passes traffic to `http://127.0.0.1:3000`.
- App env uses the public URL:
  - `NEXT_PUBLIC_SITE_URL=https://example.com`
  - `APP_URL=https://example.com`

Do not terminate HTTPS inside the Next.js app for this MVP step.

## 11. Rollback

Before rollback, backup runtime data:

```bash
mkdir -p backups
tar -czf backups/site-data-before-rollback-$(date +%Y%m%d-%H%M%S).tar.gz data/orders data/requests data/request-attachments
```

Rollback code:

```bash
git fetch --all --prune
git checkout <previous-commit-or-tag>
docker compose --env-file .env.production build
docker compose --env-file .env.production up -d
docker compose ps
```

Do not delete mounted volumes during rollback. `data/orders`, `data/requests`, and `data/request-attachments` are the current MVP persistence layer.

## 12. Pre-Launch Checklist

- [ ] `git status --short` is clean.
- [ ] `.env.production` exists on the server and is not committed.
- [ ] `npm run lint` OK.
- [ ] `npx tsc --noEmit --incremental false` OK.
- [ ] `npm run build` OK.
- [ ] `npm run test:e2e` OK.
- [ ] `docker compose --env-file .env.production config` OK.
- [ ] `docker compose --env-file .env.production build` OK.
- [ ] Required env variables are filled.
- [ ] Runtime directories exist.
- [ ] Runtime directories are writable by container user `1001`.
- [ ] Primary webhook receiver is checked with `request.created`.
- [ ] Primary webhook receiver is checked with `order.created`, if checkout is tested.
- [ ] Backup archive is created.
- [ ] Restore process is tested at least once on staging/test VPS.
- [ ] `/internal/login` works with production credentials.
- [ ] `/internal/orders` shows saved orders.
- [ ] `/internal/requests` shows saved requests.
- [ ] Public order status link works.
- [ ] Request attachment signed link works.
- [ ] `/robots.txt` checked.
- [ ] `/sitemap.xml` checked.
- [ ] Reverse proxy / HTTPS plan is ready.
