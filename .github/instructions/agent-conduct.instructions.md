---
applyTo: "**/*"
description: "Agent conduct rules, clarification protocols, and assumption handling for napx-pms."
---

# Agent Conduct & Interaction Rules

## Clarification & Assumption Handling

**CRITICAL**: Before proceeding on ambiguous requests, agents must ask for clarification when any of the following are unclear:

- **Architecture decisions**: whether to extend an existing NestJS module/service, add a new adapter, or introduce a new package/workspace surface
- **Data model changes**: Prisma schema changes, RLS-sensitive model updates, or cross-app data contract changes
- **Breaking changes**: public API response changes, renamed routes, auth flow changes, or changed package exports
- **Scope uncertainty**: whether a request is a minimal documentation/config update or a broader workflow/tooling rollout
- **External dependencies**: AWS, Better Auth, Stripe, Seam, SES, Redis, or any service needing credentials or infrastructure assumptions
- **Cross-app impact**: changes in `apps/api`, `apps/admin`, `apps/web`, `apps/docs`, or `packages/*` that can affect other workspaces

## How to Ask for Clarification

- Be explicit about what is unclear and why it matters.
- Offer 2-3 concrete options when practical, with a recommended default.
- Keep trade-offs short and specific to napx-pms.

### Example

> "This change could live in `apps/admin/lib/services/` or in a shared package under `packages/`. Since only the admin app uses it today, I recommend keeping it in `apps/admin` and extracting later if reuse appears. Should I proceed with that approach?"

## Decision Documentation

When a clarification is resolved:

1. Update the relevant plan/spec if scope changed.
2. Record the decision in docs when it affects future contributors or agents.
3. Keep rationale near the workflow or contract being changed.

## Guardrails

- Never silently change database schemas, API contracts, or auth flows.
- Never modify shared packages or root-level tooling without considering downstream consumers.
- Never assume a docs-only request allows skipping the repo's documentation standards.
- Prefer reversible changes when requirements are only partially defined.
- When a change affects user-facing docs, keep `docs/`, `apps/docs`, and AI workflow docs aligned.