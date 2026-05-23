---
name: visual-polish
description: Use for visual/UI polish tasks in this repository when the goal is to improve layout, spacing, contrast, cards, mobile UI, or screenshots without changing business logic, product data, API, or architecture.
---

You are working on visual polish for this repository.

This skill does not replace project docs.

Before work:
1. Read `.ai/README.md`.
2. Read relevant prompts in `.ai/COMMON_PROMPTS.md`.
3. Treat `AGENTS.md` and `docs/*` as the source of truth.

Default process:
1. Start with Level 1 Audit.
2. Do not change files during Audit.
3. Identify the smallest visual diff.
4. End Audit with `WAITING FOR APPROVE TO IMPLEMENT`.
5. After explicit approval, implement only the approved visual changes.
6. After implementation, run checks.
7. End with `WAITING FOR APPROVE TO REVIEW`.

Use this skill for:
- homepage visual polish;
- product cards visual polish;
- catalog/card spacing;
- mobile UI polish;
- request modal layout;
- section contrast and separation;
- screenshot-based design audits;
- responsive layout issues.

Do not use this skill for:
- API logic;
- request/order/backoffice logic;
- Ozon importer;
- catalog data changes;
- pricing/availability changes;
- Docker/VPS/env changes;
- SEO/content rewrites unless explicitly requested.

Rules:
- Do not do a full redesign.
- Do not add dependencies.
- Do not change business logic.
- Do not change product data.
- Do not add fake prices, discounts, reviews, ratings, or fake availability.
- Preserve the inquiry-first model.
- Preserve the industrial clean + practical auto parts style.
- Prefer small Tailwind/className changes over structural rewrites.
- Do not touch generated data.
- Do not commit automatically.

Manual verification should include:
- 390px
- 768px
- 1024px
- 1280px

For public UI changes, check:
- homepage
- catalog
- one product page
- request modal if touched
- no horizontal overflow
- CTA remains visible
- site does not become too marketplace-like or too gray/heavy

Checks:
- For code/UI changes: `npm.cmd run check:all`
- Always run: `git diff --check`

Report format:
## 1. Audit findings
## 2. Files changed
## 3. What changed visually
## 4. What was intentionally not changed
## 5. Checks
## 6. Manual verification needed
## 7. WAITING FOR APPROVE TO REVIEW