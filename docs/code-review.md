# Code Review Rules

Use this file for self-review before final reports and for reviewing diffs in this project.

## Review Priority

Review should focus on regressions and launch risk first, not style preferences.

Highest-priority findings:

1. P0/P1 regressions.
2. Broken public routes.
3. TypeScript errors.
4. Lint/build errors.
5. Env or secret leaks.
6. Fake success in request forms.
7. Loss of uploaded files.
8. Broken signed attachment access.
9. Indexing of private/internal/API routes.
10. Horizontal overflow.
11. False or misleading SEO/Schema.org data.
12. Fake prices, fake ratings, fake availability, fake reviews.
13. Unrelated code rewrites.
14. Unnecessary heavy dependencies.
15. Broken Windows or VPS workflow.

## Project-Specific Risks

### Request Flow

- A request must not show success unless it was actually delivered through the required primary receiver.
- Missing `REQUESTS_WEBHOOK_URL` must not look successful in production.
- Failed webhook delivery must surface a safe user-facing error.
- Error messages must not expose internal URLs, tokens, env names, stack traces, or secrets.
- Uploaded attachments must not be left behind if request delivery fails.

### Attachments

- Request attachments must stay outside public static paths.
- Signed access must require a valid token or internal session.
- Path traversal must remain impossible.
- Attachment routes should stay noindex/private.

### Env And Secrets

- Server-only secrets must not appear in client components, public bundles, or public docs with real values.
- `.env.example` must be updated when env variables are added or renamed.
- Production-required env variables must be documented.
- Optional sidecar env must not replace required primary env.

### SEO

- Sitemap must include only public routes.
- Robots must not open `/api/*`, `/internal/*`, or protected/private order status pages.
- Schema.org must be truthful and based on real data.
- Do not invent prices, ratings, reviews, availability, Ozon URLs, product claims, or organization details.

### UI And Responsive Behavior

- Check for horizontal overflow on key widths: 390, 768, 1024, 1280.
- Header, CTA, mobile nav, product cards, forms, and tables are common overflow sources.
- Keep the calm industrial design direction: white, soft grays, restrained orange accent, clear CTAs.

### Dependencies

- Avoid new dependencies unless clearly needed.
- Do not add Prisma/ORM, online payment, or large frameworks without explicit approval.
- Package changes must be explainable and scoped.

### Windows/VPS Workflow

- Commands should work on the Windows workspace.
- Avoid shell patterns that are fragile on PowerShell.
- Do not assume Linux-only scripts for core checks unless documented.
- For future VPS work, keep file storage, env, and build/start commands explicit.

## Review Checklist

Before approving or finalizing a task, check:

- Changed files are scoped to the task.
- Behavior matches the user request.
- No unrelated refactor was introduced.
- No business logic was changed accidentally.
- Public routes still work when relevant.
- Request success/failure states remain honest.
- Uploaded files are preserved or cleaned up correctly.
- Signed attachment access still works.
- Private/internal/API routes are not added to SEO surfaces.
- Metadata/Schema.org changes are truthful.
- No fake products, prices, ratings, availability, reviews, or Ozon URLs were added.
- No secrets are exposed to client code or committed docs.
- New env variables are documented in `.env.example` and README when relevant.
- Dependencies are justified and minimal.
- `npm run lint` was run when relevant.
- `npx tsc --noEmit --incremental false` was run when relevant.
- `npm run build` was run when safe and relevant.
- Smoke/E2E checks were run when relevant and safe.
- Remaining risks are listed clearly.

## Review Report Format

Use this structure for review findings:

1. Findings, ordered by severity.
2. Open questions or assumptions.
3. Checks run.
4. Residual risks.

If there are no findings, say that clearly and still mention any checks not run or residual risk.
