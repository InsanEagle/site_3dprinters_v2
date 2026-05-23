# VPS / HTTPS Dry Run Result

## Summary

The project was successfully deployed and checked on a Cloud.ru VPS in a production-like Docker + HTTPS setup.

This document records the result of that dry run without storing secrets, tokens, real webhook payloads, or personal data.

## Environment Shape

- Cloud.ru VPS.
- Docker production build.
- Docker container running the Next.js standalone app.
- Caddy reverse proxy in front of the app.
- HTTPS enabled through the reverse proxy layer.
- Next.js reachable locally on the VPS through `127.0.0.1:3000`.
- Public traffic goes through HTTPS.
- External port `3000` is prepared to be closed.

## Checked Successfully

- Docker build on the VPS passes.
- Container starts.
- Site opens through HTTPS.
- Caddy reverse proxy works.
- Next.js is available through `127.0.0.1:3000`.
- Public pages open.
- `/internal/login` works.
- `/internal/orders` works.
- `/internal/requests` works.
- Request submission without webhook returns an error instead of fake success.
- Request submission with webhook redirects to `/thanks`.
- Webhook receiver gets `request.created`.
- Attachment URL in webhook payload is public and does not contain `0.0.0.0`.
- Signed attachment link opens.
- Attachment without access token does not open.
- Uploaded file is stored in `data/request-attachments`.
- Uploaded file is not stored in `public`.
- Request record is saved in `data/requests`.
- Backup archive is created.
- `/sitemap.xml` opens.
- `/robots.txt` opens.

## Remaining Before Real Production

This list records the state at the time of the VPS/HTTPS dry run.

- Replace `sslip.io` with a real domain.
- Replace `webhook.site` with a real webhook receiver.
- Configure regular backup.
- Close external port `3000` in firewall.
- Restrict SSH to the operator IP where possible.
- Prepare personal data processing policy.
- Connect analytics.

## Current Assessment

Code-level P0 blockers are not known after this dry run.

The next P0 items before real production are operational:

- real domain;
- real webhook receiver;
- verified recurring backup;
- firewall hardening;
- privacy/legal readiness.

## Subsequent Updates

After this dry run, the following follow-up work was completed:

- Production webhook receiver connected through Make + Google Sheets.
- Yandex Metrica connected through env and verified on the VPS.
- VPS runtime backup workflow added.
- Production product card images added for 7 homepage featured SKU.
- Repo-local Codex skills added for project workflow, visual polish, architecture audit, bug diagnosis, and handoff.

The remaining real-production items are now focused on the real domain, firewall/SSH hardening, restore rehearsal, and privacy/legal readiness.
