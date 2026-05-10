---
applyTo: "**/*"
description: "Developer workflows and environment settings for napx-pms."
---

# Workflows

## Development

- **Start dev server:** `pnpm run dev` (port 3000)
- **Build:** `pnpm run build`
- **Type check:** `pnpm run type-check`

## Testing

- **Unit tests:** `pnpm run test`
- **Coverage:** `pnpm run test:coverage`
- **E2E tests:** `pnpm run test:e2e`

## Code quality

- **Lint:** `pnpm run lint`
- **Format:** `pnpm run format`

## Database migrations

- **Runbook:** `packages/database/MIGRATIONS.md`
- Read `packages/database/MIGRATIONS.md` before running migration commands.
- Any destructive database action requires explicit human confirmation every time in the current session.
- This rule applies even when autonomous mode is enabled.
- Destructive examples: `prisma migrate reset`, `prisma db push --force-reset`, `DROP`/`TRUNCATE` SQL.

## AWS CLI

All local AWS CLI commands must use the `napx` named profile. The CI/CD pipeline uses an IAM role and does **not** need a profile flag.

```bash
# Per-command
aws <command> --profile napx --region us-east-2

# Or export for the session
export AWS_PROFILE=napx
```

## Environment variables

| Variable             | Purpose                                           | Required |
| -------------------- | ------------------------------------------------- | -------- |
| `DATABASE_URL`       | PostgreSQL connection string                      | Yes      |
| `BETTER_AUTH_SECRET` | BetterAuth signing secret                         | No       |
| `AWS_PROFILE`        | AWS CLI named profile (`napx`) for local commands | No       |
