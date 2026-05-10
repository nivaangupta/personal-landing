---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/jest.config.*,**/vitest.config.*"
description: "Testing standards and conventions for napx-pms"
---

# Testing Standards

## Overview

All business logic in `apps/admin`, `apps/api`, and `packages/*` must be covered by automated tests. The test framework is **Jest** (with `ts-jest` for TypeScript). Frontend component tests use **@testing-library/react**.

## Test Framework & Tooling

| Layer                      | Framework                     | Runner command                                                                                  |
| -------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------ |
| Unit (API services)        | Jest + ts-jest                | `pnpm run test` (runs `turbo run test --filter=api`)                                            |
| Unit (frontend components) | Jest + @testing-library/react | App-specific test runner (e.g. `turbo run test --filter=admin` once an admin test script exists) |
| Coverage (API)             | Jest --coverage               | `pnpm run test:cov` (runs `turbo run test:cov --filter=api`)                                    |
| E2E (API)                  | Jest + @nestjs/testing        | `pnpm run test:e2e` (runs `turbo run test:e2e --filter=api`)                                    |
| E2E (frontend)             | Playwright                    | Run via `npx playwright test` in `apps/admin` (once Playwright is configured there)            |

## File Location Conventions

- **Unit tests**: Co-located alongside implementation, e.g. `lib/services/tenants.service.test.ts` lives next to `lib/services/tenants.service.ts`
- **E2E tests**: `apps/admin/e2e/` or `apps/api/test/`
- **Test helpers / factories**: `apps/admin/lib/__tests__/helpers/` or `apps/api/test/helpers/`

## Admin App Unit Test Pattern

The admin app uses **constructor injection** (no NestJS DI). Test by constructing the service with a mocked `DatabaseAdapter`.

```typescript
// apps/admin/lib/services/tenants.service.test.ts
import { TenantsService } from "./tenants.service";
import type { DatabaseAdapter } from "../../adapters/database.adapter";
import type { AdminActivityLogService } from "../admin-activity-log.service";
import { NotFoundError, ConflictError } from "../errors";

// ─── Mock factory ────────────────────────────────────────────────────────────
function makeMockDb(): jest.Mocked<DatabaseAdapter> {
	return {
		findMany: jest.fn(),
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		updateMany: jest.fn(),
		delete: jest.fn(),
		deleteMany: jest.fn(),
		count: jest.fn(),
		$transaction: jest.fn(),
		$queryRaw: jest.fn(),
		$executeRaw: jest.fn(),
	};
}

// Only mock the `log` method — services only ever call audit.log(), never other methods.
function makeMockAudit(): jest.Mocked<Pick<AdminActivityLogService, "log">> {
	return { log: jest.fn().mockResolvedValue(undefined) };
}

const mockCtx = {
	adminId: "admin-1",
	isSuperAdmin: true,
	ipAddress: "127.0.0.1",
};

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("TenantsService", () => {
	let db: jest.Mocked<DatabaseAdapter>;
	let audit: jest.Mocked<Pick<AdminActivityLogService, "log">>;
	let service: TenantsService;

	beforeEach(() => {
		db = makeMockDb();
		audit = makeMockAudit();
		service = new TenantsService(db, audit);
	});

	describe("findOne", () => {
		it("returns tenant when found and not deleted", async () => {
			const tenant = { id: "t1", name: "Test", deletedAt: null };
			db.findUnique.mockResolvedValue(tenant);
			await expect(service.findOne("t1")).resolves.toEqual(tenant);
		});

		it("throws NotFoundError when not found", async () => {
			db.findUnique.mockResolvedValue(null);
			await expect(service.findOne("t1")).rejects.toBeInstanceOf(NotFoundError);
		});

		it("throws NotFoundError when soft-deleted", async () => {
			db.findUnique.mockResolvedValue({ id: "t1", deletedAt: new Date() });
			await expect(service.findOne("t1")).rejects.toBeInstanceOf(NotFoundError);
		});
	});
});
```

## TDD — Red-Green-Refactor

Follow TDD strictly for all new service methods:

1. **Write the failing test** — run it, confirm it fails with the right error
2. **Write minimal implementation** — only enough to pass
3. **Refactor** — clean up while all tests remain green
4. **Commit** — after each green state

**Never write production code before the failing test exists.**

## What to Test

### Services (highest priority)

- Happy path for every public method
- `NotFoundError` / `ConflictError` / `ForbiddenError` thrown on invalid inputs
- Audit log called after every write (`void audit.log(...)`)
- `isSuperAdmin` permission checks enforced
- Soft-delete logic (`deletedAt` filter)
- Slug uniqueness conflicts

### Route Handlers

- Auth guard: unauthenticated requests return 401
- Valid request returns correct HTTP status
- Service errors correctly translated by `handleError()`: `NotFoundError→404`, `ConflictError→409`, `ForbiddenError→403`

### `lib/admin-auth.ts`

- `getAdminSession()` returns null on missing/invalid session
- `withAdminAuth()` HOF returns 401 when session is null
- `buildAuditContext()` extracts correct adminId and IP

### Database Adapter (PrismaAdapter)

- Not unit-tested (integration tested); mock `DatabaseAdapter` interface in service tests

## What NOT to Test

- Prisma client internals
- Third-party library internals (BetterAuth, bcrypt)
- Simple DTOs/type-only files with no logic

## Mock Conventions

- Use `jest.fn()` for every adapter method — no partial mocks
- Always `mockResolvedValue` / `mockRejectedValue` (never `mockReturnValue` for async)
- Reset mocks with `beforeEach` factory functions, not `beforeAll`
- `void audit.log(...)` is fire-and-forget — assert with `expect(audit.log).toHaveBeenCalledWith(expect.objectContaining({...}))`

## AuditContext in Tests

```typescript
const mockCtx: AuditContext = {
	adminId: "admin-uuid",
	isSuperAdmin: true,
	ipAddress: "127.0.0.1",
};
```

Never pass undefined — write methods that receive `undefined` for `ctx` would silently emit a null `adminId` to the audit log, creating phantom records with no traceability. Always supply a fully-populated `AuditContext` so every write is attributable to a specific admin.

## Coverage Targets

| Layer          | Line Coverage | Branch Coverage |
| -------------- | ------------- | --------------- |
| Services       | ≥ 90%         | ≥ 80%           |
| Route handlers | ≥ 70%         | ≥ 60%           |
| Auth utilities | ≥ 90%         | ≥ 85%           |

Run `pnpm run test:cov` to generate the HTML coverage report.

## Jest Configuration (admin)

Place `jest.config.ts` in `apps/admin/`:

```typescript
import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	testRegex: "lib/.*\\.test\\.ts$",
	collectCoverageFrom: [
		"lib/services/**/*.ts",
		"lib/admin-auth.ts",
		"!lib/services/audit.ts", // enums/types only
		"!lib/services/errors.ts", // typed error classes only
	],
};

export default config;
```

## Pre-Commit Gate

Before committing any service or route change:

- [ ] `pnpm run test` passes (currently API-only; once `pnpm run test:admin` is available per NAPX-519, run that too for admin changes)
- [ ] Admin type checks pass for `apps/admin` (use the current type-check command defined in `apps/admin/package.json`)
- [ ] `pnpm run lint:admin` passes
- [ ] New/modified logic has a corresponding test

---

**Last Updated**: 2026-03-20
