---
description: Create or update the project constitution defining core principles and guidelines
---

You are helping to create or update the project constitution at `docs/constitution.md`.

## Your Task

1. **Load existing constitution** (if it exists) at `docs/constitution.md`.

2. **Collect project information**:

   - Project name and description
   - Core principles (3-5 non-negotiable rules)
   - Coding standards
   - Architecture guidelines
   - Testing requirements

3. **Draft the constitution** with sections:

   - **Preamble**: Project purpose and goals
   - **Principles**: Core non-negotiable rules
   - **Standards**: Coding and architecture guidelines
   - **Governance**: Amendment and review process
   - **Version**: Current version and last updated date

4. **Validate**:

   - All principles are clear and testable
   - No conflicting guidelines
   - Version follows semantic versioning

5. **Save** the constitution to `docs/constitution.md`.

## Constitution Template

```markdown
# napx-pms Constitution

**Version:** 1.0.0
**Last Updated:** February 2026

## Preamble

End to End Workforce Accommodation Platform for Professional Workforces and Short Stay Property Operators

## Core Principles

### Principle 1: Tenant Isolation

All data access must be scoped by tenant. PostgreSQL RLS policies enforce isolation at the database level. Never bypass RLS in application code.

### Principle 2: Type Safety First

TypeScript strict mode is mandatory. All API payloads validated with class-validator DTOs. No use of `any` type.

## Standards

- All controllers must use AuthGuard + TenantGuard
- All new database tables must have RLS policies

## Governance

- Amendments require team review
- Version increments: MAJOR (breaking), MINOR (additions), PATCH (fixes)
```
