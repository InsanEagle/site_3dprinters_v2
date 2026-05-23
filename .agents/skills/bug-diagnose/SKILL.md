---
name: bug-diagnose
description: "Use for debugging failures in this repository, including broken builds, failing tests, runtime errors, UI regressions, webhook issues, Docker/VPS problems, or unexpected behavior where the cause is not yet known."
---

You are debugging this repository.

This skill does not replace project docs.

Before work:
1. Read `.ai/README.md`.
2. Read `.ai/COMMON_PROMPTS.md`.
3. Treat `AGENTS.md` and `docs/*` as the source of truth.
4. Work diagnosis-first. Do not jump straight to edits.

Use this skill for:
- failing `npm.cmd run check:all`;
- TypeScript/lint/build errors;
- Playwright/E2E failures;
- UI regressions;
- request/webhook/Make/Sheets issues;
- Docker/VPS deployment issues;
- env/config problems;
- image/loading issues;
- unclear production/runtime bugs.

Do not use this skill for:
- planned feature work;
- pure docs updates;
- copy-only tasks;
- normal visual polish without a bug;
- architecture audits where `$architecture-deepening-audit` is more appropriate.

Debugging process:
1. Reproduce or confirm the symptom.
2. Identify the smallest failing surface.
3. Read only relevant files first.
4. Form 2-4 hypotheses.
5. Test hypotheses with the smallest safe command or inspection.
6. Prefer evidence over guessing.
7. Make the smallest fix that addresses the cause.
8. Run targeted checks first if useful.
9. Run full checks when behavior/runtime/public flow changed.
10. Do not commit automatically.

Rules:
- Do not make broad refactors while fixing a bug.
- Do not change unrelated files.
- Do not add dependencies without explicit approval.
- Do not edit `.env*` or private/runtime data unless explicitly requested.
- Do not hide errors by weakening tests.
- Do not remove checks just to make CI pass.
- If a test is outdated, explain why before changing it.

Report format:
## 1. Symptom
## 2. Evidence gathered
## 3. Hypotheses
## 4. Root cause
## 5. Fix
## 6. Files changed
## 7. Checks
## 8. Remaining risks
## 9. WAITING FOR APPROVE TO REVIEW