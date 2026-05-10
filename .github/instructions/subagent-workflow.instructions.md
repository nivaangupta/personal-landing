---
applyTo: "**/*"
description: "Subagent workflow patterns and orchestrator-first approach for multi-step monorepo work."
---

# Subagent Workflow

## Orchestrator-First Principle

Default to using a coordinator agent for non-trivial work. Coordinators keep context smaller, route work to the right specialist, and enforce planning/review checkpoints.

## When to Use Orchestrator + Subagents

- Features spanning multiple files, modules, or apps
- Tasks requiring planning → implementation → review cycles
- Work that benefits from domain specialization
- Any task with 2+ independent subtasks
- Cross-app work involving `apps/api`, `apps/admin`, `apps/web`, `apps/docs`, or shared packages

## When to Use a Single Agent Directly

- Quick one-file fixes or focused edits
- Research questions with no code changes
- Ad-hoc code reviews
- Small documentation-only updates

## Available Coordinators

| Coordinator | Purpose | Dispatches |
| --- | --- | --- |
| **Feature Builder** | End-to-end feature or workflow orchestration | Planner, Implementer, Reviewer, Researcher, Backend Architect, Frontend Developer, API Specialist, Admin Portal, Documenter |
| **TDD** | Red-green-refactor coordination | Red, Green, Refactor |

## Domain Specialist Selection

| Domain | Specialist |
| --- | --- |
| NestJS modules, adapters, data models, RLS, backend architecture | **Backend Architect** |
| Next.js UI, components, responsive design, accessibility | **Frontend Developer** |
| API contracts, endpoint docs, versioning, integration guides | **API Specialist** |
| Admin dashboards, route handlers, RBAC, audit logging, operational tools | **Admin Portal** |
| AGENTS/README/docs updates, fix logs, architecture writeups | **Documenter** |
| General or cross-cutting implementation | **Implementer** |

## Orchestration Patterns

### Sequential

Use for dependent tasks. Each task should be reviewed before the next one begins.

### Parallel

Use only when tasks are file-independent and can be safely isolated.

### Monorepo Cross-App

When work spans multiple apps or packages:

1. Research each affected workspace independently.
2. Plan shared package changes before app-specific changes.
3. Implement shared changes first.
4. Implement app-specific changes after downstream contracts are stable.
5. Review cross-app impact before final verification.

## Quality Gates

- Every implementation stage should pass through **Reviewer** before completion.
- If review finds issues, route them back to the original specialist.
- Documenter should be used when changes affect onboarding, workflows, contracts, or project-facing guidance.

## Skills Integration

These skills complement subagent workflows in this repo:

| Skill | When to Use |
| --- | --- |
| `writing-plans` | Create a scoped implementation plan before edits |
| `subagent-driven-development` | Execute plans one task at a time with fresh subagents |
| `dispatching-parallel-agents` | Coordinate parallel-safe independent tasks |
| `requesting-code-review` | Add structured review checkpoints |
| `verification-before-completion` | Verify outcomes before claiming completion |