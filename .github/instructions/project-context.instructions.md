---
applyTo: "**/*"
description: "Project architecture and data flow for napx-pms."
---

# napx-pms architecture

- **Framework:** NestJS + Next.js
- **Language:** TypeScript
- Entry point: apps/api/src/main.ts

## Directory structure

- `src/components/` - UI components
- `src/pages/` - Page components/routes
- `src/services/` - API and business logic
- `src/stores/` - State management
- `src/types/` - TypeScript definitions

## Data flow

- Next.js App Router (RSC/Client) → NestJS REST API → PostgreSQL (RLS). Tenant isolation enforced at database level via Row-Level Security policies. Request flow: Frontend sends authenticated requests with x-tenant-id header → API validates via AuthGuard + TenantGuard → Service layer queries database (RLS auto-filters by tenant).

## Authentication

- BetterAuth with adapter pattern for pluggable authentication providers (Auth0, AWS Cognito, etc.). NestJS guards (@UseGuards) for route-level authorization. TenantGuard sets RLS context per-request.

## API integration

- Domain-driven NestJS REST API with public (integration) and private (PMS-only) endpoints. External service integrations use the NestJS Adapter Pattern: Door Access Codes, Payments (Stripe), Identity Verification, Email, File Management.
