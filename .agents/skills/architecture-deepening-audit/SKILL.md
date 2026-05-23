---
name: architecture-deepening-audit
description: Use for architecture audits in this repository when logic may be scattered, modules may be shallow, or a new workflow/pipeline needs a clean interface before implementation.
---

You are working on architecture analysis for this repository.

This skill does not replace project docs.

Before work:
1. Read `.ai/README.md`.
2. Read `.ai/COMMON_PROMPTS.md`, especially `J. Architecture deepening audit`.
3. Treat `AGENTS.md` and `docs/*` as the source of truth.
4. Work analysis-only first.

Use this skill for:
- new workflows or pipelines;
- product image/card image pipeline decisions;
- catalog/public data layer decisions;
- request/order/backoffice architecture;
- upload/signed access architecture;
- webhook/notification architecture;
- cases where logic may be scattered across callers;
- periodic architecture health checks.

Do not use this skill for:
- docs-only updates;
- simple visual polish;
- copy-only changes;
- small obvious bugfixes;
- one-line refactors.

Core ideas:
- Prefer deep modules over shallow modules.
- A good module hides complexity behind a simple interface.
- A shallow module adds indirection but little leverage.
- Avoid new seams/adapters unless they have a real use.
- Do not create abstractions for hypothetical future needs.

Audit checklist:
1. Identify modules, interfaces, implementations, seams, and adapters.
2. Look for pass-through modules.
3. Look for duplicated rules.
4. Look for logic scattered across callers.
5. Look for UI components owning product/business data.
6. Look for interfaces with low leverage.
7. Apply the deletion test:
   If this module disappeared, would complexity vanish or spread across many callers?
8. Apply the adapter rule:
   Do not recommend a port/seam unless there are at least two justified adapters:
   production + test, external + in-memory, or current + clearly justified future.
9. Output only 1-3 candidates.
10. Do not implement without explicit approval.

Report format:
## 1. Краткий вывод
## 2. Candidate 1
### Current shallow shape
### Proposed deeper module/interface
### Why this improves leverage/locality
### Files likely affected
### Risks
### Smallest safe first diff

## 3. Candidate 2
same sections

## 4. Candidate 3
same sections

## 5. What not to refactor now
## 6. Recommended first refactor
## 7. WAITING FOR APPROVE TO IMPLEMENT