# Copilot Instructions — napx-pms

## Project overview

- **Framework:** NestJS + Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, ShadCN UI
- Entry point: apps/api/src/main.ts

## Architecture

- Monorepo (Turborepo) with NestJS 11 API backend and Next.js 16 App Router frontends. Multi-tenant shared-schema with PostgreSQL RLS. BetterAuth for authentication, NestJS guards for authorization.

## Data flow

- Next.js frontend → NestJS API → PostgreSQL (RLS). Tenant isolation via `x-tenant-id` header. Auth via BetterAuth adapter pattern.

## Key directories

| Directory         | Purpose                |
| ----------------- | ---------------------- |
| `src/components/` | UI components          |
| `src/pages/`      | Page components/routes |
| `src/services/`   | API and business logic |
| `src/stores/`     | State management       |
| `src/types/`      | TypeScript definitions |

## Workflows (package.json)

- **Dev:** `pnpm run dev` (starts on port 3000)
- **Build:** `pnpm run build`
- **Test:** `pnpm run test`
- **Lint:** `pnpm run lint`

## Environment variables

| Variable        | Purpose            |
| --------------- | ------------------ |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | BetterAuth signing secret |

## Other instruction sources

- [AGENTS.md](../AGENTS.md) - AI agent context
- [README.md](../README.md) - Project documentation
- [.cursor/rules/](../.cursor/rules/) - Cursor IDE rules
- [.github/instructions/](./instructions/) - Focused Copilot instruction files
- [.github/agents/](./agents/) - Custom Copilot subagents

## Agent Workflow

- Prefer orchestrator + subagents for multi-file or multi-app work.
- Use `Feature Builder` for research → plan → implement → review flows.
- Use `TDD` when a change should be driven through Red → Green → Refactor.
- Route domain work to the closest specialist: `Backend Architect`, `Frontend Developer`, `API Specialist`, `Admin Portal`, or `Documenter`.
- Use `Reviewer` as a quality gate after implementation, not only at the end.

Detailed workflow guidance lives in `.github/instructions/agent-conduct.instructions.md` and `.github/instructions/subagent-workflow.instructions.md`.

## Skills References

For detailed standards on specific topics, refer to these skills:

| Topic             | Skill Location                                    | Description                                                  |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------ |
| **Logging**       | `.agents/skills/logging/SKILL.md`                 | Structured logging standards, log levels, message formatting |
| **Documentation** | `.agents/skills/project-documentation/SKILL.md`   | README standards, code comments, ADRs, changelogs            |
| **Writing Plans** | `.agents/skills/writing-plans/SKILL.md`           | Feature planning and specification                           |
| **Code Review**   | `.agents/skills/requesting-code-review/SKILL.md`  | Code review process and checklists                           |
| **Debugging**     | `.agents/skills/systematic-debugging/SKILL.md`    | Systematic debugging workflows                               |
| **TDD**           | `.agents/skills/test-driven-development/SKILL.md` | Test-driven development practices                            |
| **Subagent Dev**  | `.agents/skills/subagent-driven-development/SKILL.md` | Executing plans with fresh subagents per task             |
| **Parallel Agents** | `.agents/skills/dispatching-parallel-agents/SKILL.md` | Coordinating independent subagent tasks                |
| **Verification**  | `.agents/skills/verification-before-completion/SKILL.md` | Verifying completion claims before handoff            |
