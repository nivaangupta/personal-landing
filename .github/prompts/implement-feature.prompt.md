---
description: Implement a feature by completing tasks sequentially
---

# Implement Feature

Implement a feature by completing tasks sequentially with proper tracking.

## Usage

```
/implement-feature {{ISSUE_KEY}}-123
/implement-feature docs/tasks/feature-name.md
```

## Process

1. **Load Feature Context**:
   - Read specification from `docs/specs/{{FEATURE_NAME}}.md`
   - Read implementation plan from `docs/plans/{{FEATURE_NAME}}.md`
   - Read task list from `docs/tasks/{{FEATURE_NAME}}.md`
   - Review `AGENTS.md` for project patterns
   - Request clarification for any uncertainties before starting implementation
   - Once all context is clear, confirm understanding and readiness to implement the feature with the user before proceeding to the next step

2. **Create Feature Branch**:

   ```bash
   git checkout -b feature/{{FEATURE_NAME}}
   git pull origin main
   ```

3. **Sequential Task Implementation**:

   For each task in dependency order:

   a. **Mark Task In Progress**

   b. **Research & Understand**:
   - Search codebase for similar patterns
   - Review referenced files
   - Understand dependencies

   c. **Implement**:
   - Follow acceptance criteria exactly
   - Use patterns from `AGENTS.md`
   - Write tests alongside implementation
   - Ensure type safety

   d. **Validate**:
   - Run type checking: `pnpm run check-types`
   - Run linter: `pnpm run lint`
   - Run tests: `pnpm run test`
   - Build: `pnpm run build`

   e. **Update Documentation** _(required before committing)_:
   - Update `docs/features/{{ISSUE_ID}}-FEATURE-NAME/spec.md` to reflect the completed task
   - Update `docs/features/{{ISSUE_ID}}-FEATURE-NAME/plan.md` if scope changed
   - If the task introduced an architectural decision, create or update `docs/architecture/`
   - Do **not** proceed to commit until docs are in place

   f. **Commit Changes**:

   ```bash
   git commit -m "feat({{SCOPE}}): {{DESCRIPTION}}"
   ```

   g. **Mark Task Complete**

4. **Create Pull Request**:

   After all tasks complete:

   a. **Final Validation**:
   - All tests passing
   - No type errors
   - No linter errors
   - Build successful

   b. **Push and Create PR**:

   ```bash
   git push -u origin feature/{{FEATURE_NAME}}
   ```

   - Create PR targeting `main`
   - Include feature summary and testing notes

5. **Report Status**:
   - Completed tasks count
   - PR URL
   - Ready for code review

## Guidelines

- **No Placeholders**: Never implement "Coming Soon" or placeholder functionality
- **Complete Features**: Each task should result in working functionality
- **Test-Driven**: Write tests before or alongside implementation
- **Atomic Commits**: One logical change per commit
