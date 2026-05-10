---
description: Generate release notes from git commits (web, git tag, or documentation)
---

You are helping to generate professional release notes from git commits.

## Your Task

1. Ask the user which format they need:

   - **Web** — customer-facing changelog or announcement
   - **Git Tag** — concise summary for a git tag annotation or GitHub release
   - **Documentation** — detailed technical notes for `RELEASE_NOTES.md` or internal changelog

2. Ask for the scope:

   - Entire monorepo
   - Specific app under `apps/*`
   - Specific package under `packages/*`

3. Ask for the commit range:

   - Date range
   - Tag range
   - Commit range
   - Since last release

4. Gather commit data with terminal commands:

   ```bash
   git log --oneline --since="[START_DATE]" --until="[END_DATE]"
   git log --since="[START_DATE]" --format="%h|%s|%b|%an|%ad" --date=short
   git diff --stat [START_REF]..[END_REF]
   ```

   For scoped releases, filter the analysis to the target app or package.

5. Analyze commits:

   - Extract conventional commit types
   - Identify scope and impacted workspaces
   - Group related commits
   - Note relevant Jira keys like `NAPX-###`

6. Generate release notes in the selected format.

### Web Format

```markdown
# What's New in napx-pms [Version]

**Released [Date]**

[1-2 sentence overview for end users]

## Highlights

### [Feature Title]

[2-3 sentences in plain language]

## Improvements

- [User-visible improvement]

## Bug Fixes

- Fixed an issue where [problem description]
```

### Git Tag Format

```markdown
## [Version] - [Date]

### Summary

[1-2 sentence overview]

### Key Changes

- 🚀 [Major improvement]
- ✨ [New feature]
- 🐛 [Important fix]

### Upgrade Notes

[Only for breaking changes]
```

### Documentation Format

```markdown
# Release Notes - [Month Year]

## Version: [Version] ([Date])

### Summary

[2-3 sentence overview]

---

## [Category with Emoji] ([Date])

### [Feature/Fix Title]

**Commit**: `[hash]` - `[message]`
**Impact**: [Impact statement]

#### Changes

- [Change with file reference]

#### Benefits

- ✅ [Benefit]
```

7. Present the release notes and ask whether any adjustments are needed.

## Guidelines

- Use conventional commit types to categorize changes.
- Filter to the requested workspace scope when needed.
- Never include sensitive information.
- Call out breaking changes explicitly.