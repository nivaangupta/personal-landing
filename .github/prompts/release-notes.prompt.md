---
description: Generate release notes from git commits (web, git tag, or documentation)
---

# Generate Release Notes

Generate professional release notes from git commits. Supports three output formats: **web** (customer-facing), **git tag** (concise), and **documentation** (detailed technical notes).

## Usage

```text
/release-notes web
/release-notes tag
/release-notes docs
```

## Process

1. **Determine output format**

   Ask the user which format they need:

   | Format | Purpose | Audience | Length |
   | --- | --- | --- | --- |
   | **Web** | Website changelog, blog post, customer announcement | End users, customers | 200-500 words |
   | **Git Tag** | Tag annotation, GitHub release | Developers, external consumers | 100-300 words |
   | **Documentation** | `RELEASE_NOTES.md`, internal technical notes | Internal developers, technical team | 500-2000 words |

2. **Ask for scope**

   Determine whether the notes are for:

   - The entire monorepo
   - A specific app in `apps/*`
   - A specific package in `packages/*`

3. **Ask for the commit range**

   Gather one of:

   - Date range
   - Tag range
   - Commit range
   - "Since last release"

4. **Gather commit data**

   Run commands like:

   ```bash
   git log --oneline --since="[START_DATE]" --until="[END_DATE]"
   git log --since="[START_DATE]" --format="%h|%s|%b|%an|%ad" --date=short
   git diff --stat [START_REF]..[END_REF]
   ```

   For scoped releases, limit commit/file analysis to the target app or package.

5. **Analyze commits**

   - Extract conventional commit types (`feat`, `fix`, `perf`, `refactor`, etc.)
   - Identify scope and impacted workspaces
   - Group related commits together
   - Note Jira keys such as `NAPX-###` when they appear and help explain the change

## Templates

### Web Format

```markdown
# What's New in napx-pms [Version]

**Released [Date]**

[1-2 sentence overview focused on user value]

## Highlights

### [Feature Title]

[2-3 plain-language sentences about what changed and why it matters]

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

[Only if breaking changes exist]
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
**Impact**: [Business or technical impact]

#### Changes

- [Change with file reference]

#### Benefits

- ✅ [Benefit]
```

## Guidelines

- Use conventional commit categories to group changes.
- Avoid sensitive information such as credentials, internal URLs, or secrets.
- For scoped releases, exclude unrelated workspaces.
- Keep tone appropriate to the selected audience.
- Call out breaking changes explicitly.

## Quality Checklist

- [ ] Correct format selected
- [ ] Significant commits grouped meaningfully
- [ ] Scope limited correctly
- [ ] Dates/version accurate
- [ ] No sensitive information included
- [ ] Breaking changes clearly called out