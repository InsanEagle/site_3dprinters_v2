## Summary

- What changed:
- Why this is needed:

## Scope

- Files/areas touched:
- Intentionally not touched:

## Risk level

- [ ] docs-only
- [ ] UI/copy
- [ ] catalog/data
- [ ] API/request/order flow
- [ ] auth/backoffice/security
- [ ] Docker/VPS/deploy
- [ ] CI/tests

## Checks

- Full local pass:
- [ ] `npm run check:all`
- Individual diagnostics / scoped checks if run separately:
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run test:e2e`
- [ ] GitHub Actions green
- [ ] Not run because this is docs-only; explanation below

Explanation for skipped checks:

-

## Safety checklist

- [ ] raw/runtime/private files are not included in the diff
- [ ] `.env` / `.env.production` are not included in Git
- [ ] `ozon_data` is not included in Git
- [ ] no fake reviews/ratings/prices/availability were added
- [ ] `Product.sku` remains `offer_id` if this PR touches catalog data
- [ ] request success did not become fake success
- [ ] attachments are not placed in `public`
- [ ] runtime env is not baked into the build

## Manual verification

- Pages to verify manually:
- VPS update needed: yes/no
- VPS smoke test needed: yes/no

## Screenshots / notes

Add screenshots, review notes, or context here.
