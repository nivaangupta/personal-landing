---
applyTo: "apps/admin/**"
description: "Admin app UI patterns for napx-pms, including entity sheet interactions, copyable IDs, relation display, and index search/filter behavior."
---

# Admin UI Standards

`apps/admin` is an operational console, not a marketing app. UIs should prioritize dense data, fast scanning, low-friction CRUD, and predictable behavior across desktop, tablet, and mobile.

This file extends `.github/instructions/ui.instructions.md` with admin-specific conventions.

## Product shape

- Prefer clarity over novelty.
- Prefer stable patterns over page-specific reinvention.
- Prefer inline operational feedback over hidden or delayed status.
- Keep interactions shallow: list -> dialog/sheet -> save -> refresh local state.

Do not add decorative layouts, oversized hero sections, or one-off branded page chrome.

## Visual system

- Reuse semantic tokens from `app/globals.css`.
- Preserve the neutral design language configured in `components.json`.
- Reuse `components/ui/*` primitives before creating wrappers.
- Use `cn()` from `lib/utils.ts` for composition.

Do not hardcode colors when a semantic token or existing variant already expresses the state.

## Layout shell

- Follow the sidebar + topbar shell from `app/(dashboard)/layout.tsx`.
- Keep page content inside the `AuthenticatedPage` shell.
- Default content spacing: `space-y-6` and `p-4 md:p-6`.
- Keep sidebar navigation primary; avoid competing page-local nav.

## Page composition

Most pages should follow this order:

1. Header with title and short supporting description.
2. Optional action row / primary action.
3. Inline error banner (if needed).
4. Primary data surface (table, tabs, cards, or form).
5. Dialogs and sheets mounted at page level.

Default header pattern:

- Title: `text-2xl font-bold tracking-tight`.
- Description: `text-muted-foreground`.
- Row: `flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`.

Primary actions should align right on larger screens and expand full-width on mobile.

## Tables

Tables are the default collection pattern in `apps/admin`.

- Use responsive tables with horizontal overflow and progressive column hiding.
- Wrap tables in a bordered, rounded, horizontally scrollable container.
- Hide lower-priority columns with `hidden sm:table-cell`, `hidden md:table-cell`, `hidden lg:table-cell`, and `hidden xl:table-cell`.
- Keep one primary identifying column always visible.
- Put row actions in the last column via dropdown menu.
- Use the existing dashed empty-state pattern.

Do not default to separate mobile card lists unless progressive hiding makes the table unusable.

## Detail views

- Prefer right-side sheets for read-only inspection.
- Prefer `EntityDetailSheet` for standard key/value details.
- Use entity-specific sheets only when richer composition is required.
- Keep sheets scrollable with `overflow-y-auto`.
- Prefer query-param-compatible sheet state when deep-linking improves workflows.

Do not route to a dedicated page for simple read-only details when a sheet fits.

## Dialogs and forms

- Prefer dialogs for create/edit.
- Use `react-hook-form` + `zod` for non-trivial forms.
- Keep controls in `space-y-1` or `space-y-2` groups.
- Default to stacked fields; move to `sm:grid-cols-2` only for true peers.
- Keep mobile-first dialog footer actions:
	- secondary action first in DOM
	- `flex-col-reverse gap-2 sm:flex-row sm:justify-end`
	- full-width buttons on mobile, auto-width on `sm+`
- Prevent duplicate-close/submit behavior during in-flight mutations.

## Selection patterns

- Use `Popover + Command` for searchable single-selects — this applies equally to **form fields AND filter sheet relation fields**.
- Use `Select` for short, fixed enumerations.
- Keep trigger text plain and operational.
- Express optionality in labels, not placeholders alone.
- Any filter field that represents a foreign-key relation (e.g. `tenantId`, `propertyId`, `couponId`) **must** use `Popover + Command + CommandInput` — never a plain `<Input>`.
- For high-volume relations (e.g. reservations), load the last 50 records and set the `CommandItem` `value` prop to a concatenation of all searchable fields (ID + name + email) so `CommandInput` can filter by any of them.

Do not introduce custom autocomplete patterns when existing popover/command fits.

## Feedback and states

- Show page-level errors as inline destructive banners near top content.
- Show validation errors at field level.
- Use shared skeleton patterns for initial loading.
- Prefer local state refresh after successful mutations over full reloads.
- Use badges for status and role visibility when helpful.

Do not hide primary-state failures only in toasts.

## Responsive behavior

- Start mobile-first and scale up.
- Preserve tablet usability at `md`.
- Favor progressive disclosure over removing core data/actions.
- Keep touch targets usable for icon and row actions.
- Allow long IDs/emails/slugs to wrap (`break-all`) in detail contexts.

## Typography and density

- Keep copy concise and operational.
- Use `text-sm` / `text-xs` for metadata.
- Keep headings strong but restrained.
- Use muted text for secondary metadata, not primary identifiers.

Do not inflate spacing/typography in ways that reduce useful information density.

## Reuse and abstraction

Before adding a new component, reuse in this order:

1. `components/ui/*`
2. `components/shared/*`
3. Existing domain components in adjacent admin features
4. New component only when the pattern is genuinely new

If a pattern repeats across entities, extract it to `components/shared/*`.

## Required interaction patterns

### 1) Name/title click opens detail sheet

- In index/list views, the primary model label (name/title/compound label) MUST be clickable.
- Clicking that label MUST open the entity detail sheet.
- Keep semantics separate: name click = View sheet; edit remains explicit action/menu item.

### 2) IDs at top and always copyable

- In detail sheets/views, the entity ID MUST appear in the top identity section.
- Any displayed ID MUST be copyable (entity, relation, external/system IDs).
- Copy actions MUST provide immediate feedback.

### 3) Relations must show human-readable identifiers

- ALWAYS load relation data needed to render labels (name/title/compound identifier).
- Prefer label-first display; show raw ID second when useful.
- Do not present relation fields as ID-only unless no meaningful label exists.

### 4) Visible relation IDs must be copyable

- If a relation ID appears in tables, sheets, metadata, forms, or audit rows, it MUST be copyable.
- Never show relation IDs as plain non-interactive text.

### 5) Every index page must include search and filter sheet

- Every admin index page MUST provide both search and filtering.
- Search MUST be inline in the header row on the right (desktop/tablet).
- The filter button MUST be in the same header row and open a filter sheet.
- Available filters SHOULD be inferred from model fields and relations (status/enums, relation selectors, date ranges, tenant/ownership fields).
- Active filters MUST be visible and clearable from the index state.

## Admin-specific anti-patterns

- Do not introduce consumer-style hero sections or oversized banners.
- Do not replace tables with cards unless the domain is truly card-shaped.
- Do not mix competing action patterns on a single page.
- Do not put business logic in UI-only helper components.
- Do not create one-off states when existing badge/alert/dialog/sheet/table/dropdown patterns fit.
- Do not bypass the authenticated dashboard shell.

## Acceptance checklist for admin index pages

- [ ] Primary model label is clickable and opens detail sheet.
- [ ] Record ID appears at top of detail view and is copyable.
- [ ] Relation display uses human-readable labels, not ID-only.
- [ ] Any shown relation IDs are copyable.
- [ ] Search exists in header row and filter button opens a filter sheet.
- [ ] Filters are model-informed, visible when active, and easy to clear.
