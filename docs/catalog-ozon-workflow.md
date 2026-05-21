# Ozon Catalog Workflow

## Purpose

This document describes the safe workflow for working with Ozon exports, the generated catalog layer, and public catalog visibility.

It is intended for the project owner and Codex working in VS Code on Windows with PowerShell. It prevents the most common catalog mistakes: committing raw Ozon exports, publishing private finance/service data, replacing `Product.sku` with numeric Ozon SKU values, and accidentally opening new products to public SEO pages.

## Data Sources

- `ozon_data/csv/product_details_flat.csv` - flattened product details export used by the importer.
- `ozon_data/csv/product_list.csv` - product list export with product-level Ozon metadata.
- `ozon_data/csv/stocks.csv` - stock export used only to derive safe public availability.
- `ozon_data/csv/prices.csv` - price export; use price fields carefully and review before publishing.
- `ozon_data/raw/product_details.json` - raw product details source for importer/debugging.
- Raw finance, analytics, transaction, operation, commission, acquiring, and service files are non-public sources. They may help local analysis, but their fields must not be copied into public catalog data.

## Git Rules

- Do not commit `ozon_data/*`.
- Do not stage raw Ozon export files.
- Commit generated catalog data only after reviewing the diff.
- Do not touch runtime/private files while doing catalog import work.
- Do not commit secrets, API tokens, webhook payload dumps, private request data, or internal backoffice/runtime state.

## Safe Public Fields

The following fields are safe to use in generated or public catalog layers when reviewed:

- `offer_id`
- `product_id` only as internal/import metadata when needed
- `name`
- `price` and `old_price`, with careful review
- `primary_image`
- `images`
- Stock-derived availability
- `archived`, `is_archived`, and `status_name`
- `updated_at` as import metadata

`Product.sku` must remain the Ozon `offer_id` value, for example `KANC474`. A numeric Ozon SKU must not become `Product.sku`.

## Forbidden Fields

Never publish or copy these fields into public catalog output:

- Barcodes
- Commissions
- Acquiring
- Finance data
- Transactions
- Operation data
- Warehouse IDs
- Net price
- VAT
- Price indexes
- Analytics sales by day
- Cost template
- Any internal Ozon finance, service, accounting, analytics, or operations fields

## Import Workflow

Use PowerShell from the repository root.

1. Put the latest Ozon export files under `ozon_data/`.

2. Confirm raw export files are not staged:

```powershell
git status --short -uall
```

3. Run the importer dry run:

```powershell
node scripts/build-ozon-catalog.mjs --dry-run
```

4. Build the generated catalog:

```powershell
npm run catalog:build
```

5. Review only the generated catalog diff:

```powershell
git diff -- data/ozon-catalog.ts
```

6. Check that forbidden fields were not generated:

```powershell
rg -n "barcode|barcodes|commission|commissions|acquiring|finance|transaction|operation|warehouse|net_price|price_indexes" data/ozon-catalog.ts
```

7. Run checks:

```powershell
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm run test:e2e
```

If any check fails, fix the catalog/import/public visibility issue before committing. Do not hide import or production misconfiguration behind a successful UI state.

## Public Visibility Workflow

- `data/ozon-catalog.ts` is the generated import layer.
- `data/catalog-public.ts` controls what becomes visible on the public website.
- New SKU values must not become public automatically.
- Products with an empty `description` must not be public.
- Add first-wave SKU values intentionally and review them as real public SEO pages.
- Check `hiddenProductSkus`, `inquiryRepairSkus`, and category filters separately because each can change what users and search engines see.
- Archived, inactive, or unclear Ozon products must stay hidden from public pages.

## First-Launch Products

For the first public launch, choose a curated set of about 20-30 popular SKU values.

Do not open the full catalog at once. Prioritize understandable automotive/FDM parts with clear images, real availability, and a useful description. Avoid thin, duplicated, unclear, or near-empty SEO pages because they weaken the catalog and create maintenance risk.

## Commit Plan

Recommended commit order:

1. `chore(import): support new ozon export format`
2. `data(catalog): refresh ozon catalog from latest export`
3. `chore(catalog): tighten public product visibility`
4. `feat(catalog): add first-launch popular products selection`
5. `docs(catalog): document ozon import workflow`

## Review Checklist

Before committing catalog work, verify:

- Raw `ozon_data` files are not in Git.
- Forbidden fields are absent from generated/public catalog files.
- `Product.sku` equals `offer_id`.
- Archived products are not public.
- Public product count did not grow accidentally.
- Public products with empty `description` equals `0`.
- Sitemap, build, and E2E checks pass.
