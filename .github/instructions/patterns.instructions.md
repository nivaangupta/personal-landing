---
applyTo: "**/*"
description: "Project-specific coding patterns and shared utilities for napx-pms."
---

# Patterns and conventions

## Adapter Pattern (MANDATORY)

**⚠️ ALL integrations MUST use the Adapter Pattern. This is NON-NEGOTIABLE.**

### Why

- **Loose coupling**: Swap providers (Stripe → PayPal, Seam → August) without changing business logic
- **Testability**: Mock adapters easily in unit tests
- **Consistency**: Unified interface across all external dependencies

### Required Adapters

| Adapter                | Interface             | Default Provider         |
| ---------------------- | --------------------- | ------------------------ |
| `DATABASE_ADAPTER`     | `DatabaseAdapter`     | `PrismaAdapter`          |
| `AUTH_ADAPTER`         | `AuthAdapter`         | `BetterAuthAdapter`      |
| `PAYMENT_ADAPTER`      | `PaymentAdapter`      | `StripeAdapter`          |
| `SMART_LOCK_ADAPTER`   | `SmartLockAdapter`    | `SeamAdapter`            |
| `STORAGE_ADAPTER`      | `StorageAdapter`      | `S3Adapter`              |
| `NOTIFICATION_ADAPTER` | `NotificationAdapter` | `AwsNotificationAdapter` |
| `CACHE_ADAPTER`        | `CacheAdapter`        | `RedisAdapter`           |
| `QUEUE_ADAPTER`        | `QueueAdapter`        | `BullMqAdapter`          |

### Pattern

```ts
// 1. Define interface with Symbol token
export const PAYMENT_ADAPTER = Symbol('PAYMENT_ADAPTER');
export interface PaymentAdapter {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>;
  refund(paymentIntentId: string): Promise<RefundResult>;
}

// 2. Implement provider
@Injectable()
export class StripeAdapter implements PaymentAdapter { ... }

// 3. Register in module
@Module({
  providers: [{ provide: PAYMENT_ADAPTER, useClass: StripeAdapter }],
  exports: [PAYMENT_ADAPTER],
})
export class PaymentModule {}

// 4. Inject in services
@Injectable()
export class TransactionsService {
  constructor(@Inject(PAYMENT_ADAPTER) private payment: PaymentAdapter) {}
}
```

### ⛔ Anti-Patterns

```ts
// ❌ NEVER: Direct SDK/client usage in services
constructor(private prisma: PrismaService) {}  // NO!
private stripe = new Stripe(key);              // NO!

// ✅ ALWAYS: Inject via adapter
constructor(@Inject(DATABASE_ADAPTER) private db: DatabaseAdapter) {}
```

See `AGENTS.md` for complete adapter documentation with examples.

---

## State management

- State modules live in `apps/web/` and `apps/admin/` (local state).
- Use React state hooks (useState, useContext) and server state via Next.js App Router (RSC) for state management.
- Server state managed via Next.js server components and API routes. Client state via React hooks. No external state library required for MVP.

## API patterns

- API services live in `apps/api/src/<domain>/`.
- NestJS modular architecture: one module per domain feature. Controllers handle HTTP, services hold business logic. All endpoints protected by AuthGuard + TenantGuard. DTOs validated with class-validator.
- **All external dependencies accessed via adapters** (database, payments, storage, notifications, etc.).

## Admin app patterns (`apps/admin`)

The admin app is **self-contained** — it does **not** call `apps/api`. All data access goes through the same adapter pattern used in `apps/api`, adapted for Next.js (no NestJS DI).

Domain-specific adapters in `apps/admin` should be grouped under `lib/adapters/<domain>/` when applicable.

Examples:
- Database adapters: `lib/adapters/database.adapter.ts`, `lib/adapters/prisma.adapter.ts`
- Email adapters: `lib/adapters/email/*`

### Adapter pattern in admin

```ts
// lib/adapters/database.adapter.ts — interface
export interface DatabaseAdapter {
  findMany<T>(model: string, args: FindManyArgs): Promise<T[]>
  findUnique<T>(model: string, args: FindUniqueArgs): Promise<T | null>
  create<T>(model: string, args: CreateArgs): Promise<T>
  update<T>(model: string, args: UpdateArgs): Promise<T>
  count(model: string, args?: CountArgs): Promise<number>
  $transaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T>
  // ... full CRUD surface
}

// lib/adapters/prisma.adapter.ts — implementation
export class PrismaAdapter implements DatabaseAdapter { ... }

// lib/container.ts — wiring (Next.js DI equivalent)
const db = new PrismaAdapter()
export const tenantsService = new TenantsService(db)
export const systemUsersService = new SystemUsersService(db)
export const dashboardService = new DashboardService(db)
```

### Service layer in admin

Services hold all business logic and throw typed domain errors. They receive `DatabaseAdapter` via constructor — never import `prisma` directly.

```ts
// lib/services/tenants.service.ts
export class TenantsService {
	constructor(private readonly db: DatabaseAdapter) {}

	async findAll(): Promise<TenantRow[]> {
		return this.db.findMany<TenantRow>("tenant", {
			where: { deletedAt: null },
		});
	}

	async create(dto: CreateTenantDto): Promise<TenantRow> {
		const existing = await this.db.findUnique("tenant", {
			where: { slug: dto.slug },
			select: { id: true },
		});
		if (existing)
			throw new ConflictError(`Slug '${dto.slug}' is already taken`);
		return this.db.create<TenantRow>("tenant", { data: dto });
	}
}
```

### Route handler pattern in admin

Route handlers are **thin**: auth check → input validation → service call → return response.

```ts
// app/api/tenants/route.ts
export async function GET(req: NextRequest) {
	const session = await getAdminSession(req);
	if (!session)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	try {
		return NextResponse.json(await tenantsService.findAll());
	} catch (err) {
		return handleError(err); // NotFoundError→404, ConflictError→409, ForbiddenError→403
	}
}
```

**Never** put db queries or business logic directly in route handlers. **Never** construct `NextResponse` inside a service.

### Anti-patterns in admin (FORBIDDEN)

```ts
// ❌ Direct Prisma in a route handler
import { prisma } from "@repo/database";
const items = await prisma.tenant.findMany();

// ❌ Direct Prisma in a service
export class TenantsService {
	async findAll() {
		return prisma.tenant.findMany();
	} // NO
}

// ✅ Via adapter in service, imported from container in handler
import { tenantsService } from "@/lib/container";
```

To swap the database provider: implement `DatabaseAdapter` → replace `new PrismaAdapter()` in `lib/container.ts`. Nothing else changes.

---

## Audit Logging (MANDATORY for all write operations)

**⚠️ Every service method that creates, updates, or deletes a record MUST emit an audit log entry. This is NON-NEGOTIABLE.**

### Why

- **Traceability**: Every mutation is attributable to a specific admin with timestamp and IP
- **Compliance**: Immutable audit trail required for multi-tenant SaaS
- **Centralised enforcement**: Audit logic lives in the service — any caller (route handler, Hono, background job) gets it for free

### Vocabulary — always use enums, never raw strings

```ts
// apps/admin/lib/services/audit.ts
export enum AuditAction {
  TENANT_CREATE = 'tenant.create',
  TENANT_UPDATE = 'tenant.update',
  TENANT_DELETE = 'tenant.delete',
  SYSTEM_USER_CREATE = 'system_user.create',
  SYSTEM_USER_UPDATE = 'system_user.update',
  SYSTEM_USER_DELETE = 'system_user.delete',
  // ... one value per write operation
}
export enum AuditEntityType { TENANT = 'tenant', SYSTEM_USER = 'system_user', ... }
export interface AuditContext {
  adminId: string
  isSuperAdmin: boolean
  ipAddress?: string | null
}
```

### How to wire it

**1. Service constructor — inject `AdminActivityLogService`**

```ts
export class TenantsService {
	constructor(
		private readonly db: DatabaseAdapter,
		private readonly audit: AdminActivityLogService,
	) {}

	async create(dto: CreateTenantDto, ctx: AuditContext): Promise<TenantRow> {
		const tenant = await this.db.create<TenantRow>("tenant", { data: dto });
		void this.audit.log({
			adminId: ctx.adminId,
			action: AuditAction.TENANT_CREATE,
			targetEntityType: AuditEntityType.TENANT,
			targetEntityId: tenant.id,
			modifiedData: tenant as unknown as Record<string, unknown>,
			ipAddress: ctx.ipAddress,
		});
		return tenant;
	}
}
```

**2. Container — declare `adminActivityLogService` first, inject it into every write-capable service**

```ts
// lib/container.ts
export const adminActivityLogService = new AdminActivityLogService(db);
export const tenantsService = new TenantsService(db, adminActivityLogService);
export const systemUsersService = new SystemUsersService(
	db,
	adminActivityLogService,
);
```

**3. Route handler — build `AuditContext` once, pass to every write call**

```ts
// app/api/tenants/route.ts
export const POST = withAdminAuth(async (req, _ctx, session) => {
	const auditCtx = buildAuditContext(req, session); // from lib/admin-auth.ts
	try {
		return NextResponse.json(
			await tenantsService.create({ name, slug }, auditCtx),
			{ status: 201 },
		);
	} catch (err) {
		return handleError(err);
	}
});
```

`buildAuditContext(req, session)` is a helper in `lib/admin-auth.ts` that extracts `adminId`, `isSuperAdmin`, and IP from the request.

### Rules

| Rule                                                                              | Detail                                             |
| --------------------------------------------------------------------------------- | -------------------------------------------------- |
| All write service methods accept `ctx: AuditContext` as the **last** parameter    | Reads do not need it                               |
| Use `void this.audit.log(...)` — fire-and-forget                                  | `log()` swallows its own errors internally         |
| **Never** call `adminActivityLogService.log()` from a route handler               | Put it in the service                              |
| **Never** use raw strings for `action`/`targetEntityType`                         | Use `AuditAction`/`AuditEntityType` enums          |
| Permission checks (e.g. `isSuperAdmin`) use `ctx.isSuperAdmin` **in the service** | Never re-check in the route handler                |
| `adminActivityLogService` must be the **first** export in `container.ts`          | So it's available when constructing other services |

### ⛔ Anti-Patterns

```ts
// ❌ WRONG: audit log called in route handler
edminActivityLogService.log({...}).catch(...) // NO — belongs in the service

// ❌ WRONG: raw string action
void this.audit.log({ action: 'tenant.create', ... }) // NO — use AuditAction enum

// ❌ WRONG: write method has no ctx param
async create(dto: CreateTenantDto): Promise<TenantRow> // NO — must accept AuditContext

// ❌ WRONG: permission check duplicated in route
if (!session.isSuperAdmin) return NextResponse.json({...}, { status: 403 }) // NO — do this in service, throw ForbiddenError

// ✅ CORRECT
async create(dto: CreateTenantDto, ctx: AuditContext): Promise<TenantRow> {
  if (!ctx.isSuperAdmin) throw new ForbiddenError('Super admin required')
  const record = await this.db.create(...)
  void this.audit.log({ adminId: ctx.adminId, action: AuditAction.TENANT_CREATE, ... })
  return record
}
```

### Adding a new domain / write operation checklist

- [ ] Add `AuditAction` enum values for each write operation in `lib/services/audit.ts`
- [ ] Add `AuditEntityType` enum value if entity is new
- [ ] Service constructor accepts `audit: AdminActivityLogService`
- [ ] Every write method accepts `ctx: AuditContext` as last param
- [ ] `void this.audit.log(...)` called after successful mutation
- [ ] `container.ts` passes `adminActivityLogService` to service constructor
- [ ] Route/Hono handler calls `buildAuditContext(req, session)` and passes result to service

- Components follow ShadCN UI component pattern.
- Shared UI components in packages/ui/ using ShadCN UI. App-specific components in apps/<app>/app/components/. Follow ShadCN composition pattern with Tailwind CSS 4.

## Utilities

- Shared utilities live in `packages/` (shared) and `apps/<app>/lib/` (app-specific).
- Shared business logic in packages/. App-specific utilities in each app's lib/ directory. Use barrel exports for clean imports.
