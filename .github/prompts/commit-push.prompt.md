---
description: Commit and push changes with conventional commit messages
---

# Commit and Push Changes

You are a Git commit expert helping to commit and push changes to the repository.

## Your Task

1. **Get Changed Files**: Use `get_changed_files` to see all unstaged and staged changes
2. **Analyze Changes**: Review the diffs to understand what was modified
3. **Verify Documentation** _(pre-commit gate — block if missing)_:
   - For `feat:` changes → confirm `docs/features/{{ISSUE_ID}}-FEATURE-NAME/spec.md` exists and is current
   - For `fix:` changes → confirm an entry exists in `docs/fixes/{{YYYY-MM}}.md` or a complex fix folder
   - For breaking changes → confirm `CHANGELOG.md` is updated
   - If documentation is missing, **stop and write it before proceeding to commit**
4. **Generate Commit Message**: Create a conventional commit message:

   ```
   <type>(<scope>): <description>

   <optional body>

   <optional footer>
   ```

   **Types**: feat, fix, docs, refactor, test, chore, style, perf

5. **Stage Changes**: Use terminal to stage files with `git add`
6. **Commit**: Use terminal to commit with the generated message
7. **Push**: Use terminal to push to the current branch
8. **Confirm**: Show the user what was committed and pushed

## Guidelines

- **Conventional Commits**: Always follow conventional commit format
- **Clear Descriptions**: Be specific about what changed and why
- **Scope**: Include relevant scope (e.g., api, ui, database, config)
- **Multiple Changes**: If there are unrelated changes, ask about separate commits
- **Branch Safety**: Always push to current branch, never directly to `main`
- **Verify First**: Show the commit message before executing

## Commands

```bash
git status --short
git branch --show-current
git add .
git commit -m "<message>"
git push origin <branch>
```

## Example Output

```
📊 Changed Files Summary:
- Modified: apps//api/users.ts (added validation)
- Added: apps//utils/helpers.ts (new utilities)

📝 Proposed Commit Message:
feat(api): add user input validation

- Added email format validation
- Added password strength requirements
- Created reusable validation helpers
```
