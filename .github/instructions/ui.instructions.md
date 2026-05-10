---
applyTo: "apps/admin/**,apps/web/**,packages/ui/**"
description: "UI responsiveness, mobile-first design, and component standards for napx-pms."
---

# UI Standards

## Overview

All UI in `apps/admin`, `apps/web`, and `packages/ui` must be **mobile-first and fully responsive**. No layout or component should assume a fixed desktop viewport.

---

## Mobile-First Principle

Write styles for the smallest screen first, then layer up with responsive prefixes:

```tsx
// ✅ Correct — mobile base, scale up
<div className="flex flex-col gap-4 md:flex-row md:gap-6">

// ❌ Wrong — desktop assumed, broken on mobile
<div className="flex flex-row gap-6">
```

Tailwind breakpoints used in this project:

| Prefix | Min-width | Use case                     |
| ------ | --------- | ---------------------------- |
| (none) | 0px       | Mobile — default styles      |
| `sm:`  | 640px     | Large phones / small tablets |
| `md:`  | 768px     | Tablets                      |
| `lg:`  | 1024px    | Laptops / desktops           |
| `xl:`  | 1280px    | Wide desktops                |

---

## Dashboard Layout (`apps/admin`)

### Sidebar

The sidebar must be collapsible on mobile. Use a sheet/drawer pattern — the sidebar is hidden off-canvas on small screens and toggled via a hamburger button in the header.

```tsx
// Sidebar: hidden on mobile, fixed on desktop
<aside className="hidden md:flex h-full w-64 flex-col border-r bg-card">

// Mobile: sheet/drawer overlay
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-64 p-0">
    <SidebarContent />
  </SheetContent>
</Sheet>
```

### Page layout

```tsx
// Dashboard layout shell
<div className="flex h-screen overflow-hidden bg-background">
	{/* Desktop sidebar */}
	<aside className="hidden md:flex ...">
		<SidebarContent />
	</aside>

	<div className="flex flex-1 flex-col overflow-hidden">
		{/* Header with mobile menu toggle */}
		<Header />
		<main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
	</div>
</div>
```

### Page header pattern

```tsx
// Page title + action button — stack on mobile, row on desktop
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
		<p className="text-sm text-muted-foreground">Manage platform tenants</p>
	</div>
	<Button className="w-full sm:w-auto">
		<Plus className="mr-2 h-4 w-4" /> Add Tenant
	</Button>
</div>
```

---

## Tables

Data tables are the primary challenge for mobile. Follow this pattern:

### Desktop-first data: hide low-priority columns

```tsx
<TableHead className="hidden md:table-cell">Slug</TableHead>
<TableHead className="hidden lg:table-cell">Created</TableHead>

<TableCell className="hidden md:table-cell">...</TableCell>
<TableCell className="hidden lg:table-cell">...</TableCell>
```

### Table container

Always wrap tables in a horizontally scrollable container so they degrade gracefully:

```tsx
<div className="rounded-md border overflow-x-auto">
	<Table className="min-w-[480px]">...</Table>
</div>
```

### Mobile card fallback (for tables with many columns)

For tables with 5+ columns, provide a card-list view under the breakpoint where the table becomes unusable:

```tsx
{
	/* Mobile card list */
}
<div className="space-y-3 md:hidden">
	{items.map((item) => (
		<div key={item.id} className="rounded-lg border p-4 space-y-2">
			<div className="flex items-center justify-between">
				<span className="font-medium">{item.name}</span>
				<Badge>{item.status}</Badge>
			</div>
			<p className="text-sm text-muted-foreground">{item.slug}</p>
			<RowActions item={item} />
		</div>
	))}
</div>;

{
	/* Desktop table */
}
<div className="hidden md:block rounded-md border overflow-x-auto">
	<Table>...</Table>
</div>;
```

---

## Forms & Dialogs

Dialogs are full-screen on mobile:

```tsx
<DialogContent className="w-full max-w-lg sm:max-w-xl">
	<form className="space-y-4">
		{/* Stack labels above inputs always — easier on small screens */}
		<div className="space-y-2">
			<Label htmlFor="name">Name</Label>
			<Input id="name" />
		</div>

		{/* Multi-field rows: stack on mobile, side-by-side on sm+ */}
		<div className="grid gap-4 sm:grid-cols-2">
			<div className="space-y-2">...</div>
			<div className="space-y-2">...</div>
		</div>

		{/* Action buttons: full-width on mobile */}
		<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
			<Button type="button" variant="outline" className="w-full sm:w-auto">
				Cancel
			</Button>
			<Button type="submit" className="w-full sm:w-auto">
				Save
			</Button>
		</div>
	</form>
</DialogContent>
```

---

## Stats / Dashboard Cards

```tsx
// Stat grid: 1 col → 2 cols → 4 cols
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
	<StatCard title="Total Tenants" value="12" />
</div>
```

---

## Touch Targets

All interactive elements must meet the 44×44px minimum touch target size:

```tsx
// ✅ Explicit minimum size on icon-only buttons
<Button variant="ghost" size="icon" className="h-9 w-9">
  <MoreHorizontal className="h-4 w-4" />
</Button>

// ✅ Row action menus: use DropdownMenu, not bare buttons
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
  </DropdownMenuTrigger>
  ...
</DropdownMenu>
```

---

## Typography

Use a consistent responsive type scale:

```tsx
<h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
<h2 className="text-lg font-semibold md:text-xl">
<p  className="text-sm text-muted-foreground">
```

---

## Spacing

Use responsive padding/margin that tightens on mobile:

```tsx
// Page padding: tighter on mobile
<main className="p-4 md:p-6 lg:p-8">

// Section spacing
<div className="space-y-4 md:space-y-6">
```

---

## Anti-Patterns

```tsx
// ❌ Fixed pixel widths that overflow on mobile
<div className="w-[800px]">

// ❌ Hardcoded desktop layout with no mobile consideration
<div className="flex h-screen">
  <aside className="w-64">  {/* invisible/broken on mobile */}

// ❌ Small touch targets
<button className="p-1"><Icon /></button>

// ❌ Wrapping content without overflow protection
<div className="rounded-md border">
  <Table>  {/* will overflow on small screens */}

// ✅ All of the above, fixed:
<div className="max-w-full overflow-x-auto rounded-md border">
  <Table className="min-w-[480px]">
```

---

## Component Selection Policy

**Always prefer shadcn/ui components over custom implementations.** Before building a custom component, check whether shadcn already provides it.

Install components on demand:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Only build a custom component if shadcn has no equivalent and the pattern is reused across 3+ places.

---

## Combobox (searchable select)

Use the shadcn Combobox pattern (built on `Command` + `Popover`) for any dropdown that needs search/filter capability — property filters, user pickers, role selectors, etc.

> shadcn docs: https://ui.shadcn.com/docs/components/combobox

Install the required primitives if not already present:

```bash
pnpm dlx shadcn@latest add command popover
```

Standard pattern:

```tsx
import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const [open, setOpen] = useState(false)
const [value, setValue] = useState('')

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" aria-expanded={open} className="w-56 justify-between">
      {value ? items.find(i => i.value === value)?.label : 'Select…'}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-56 p-0">
    <Command>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup>
          {items.map(item => (
            <CommandItem key={item.value} value={item.value}
              onSelect={(v) => { setValue(v === value ? '' : v); setOpen(false) }}>
              <Check className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

---

## Filter Sheet Pattern

Filters that span multiple dimensions (property, status, date range, etc.) should use an **icon-triggered Sheet** rather than a toolbar full of dropdowns. This keeps the table header clean and scales as more filters are added.

```tsx
import { SlidersHorizontal } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

<Sheet>
	<SheetTrigger asChild>
		<Button variant="outline" size="icon" aria-label="Filters">
			<SlidersHorizontal className="h-4 w-4" />
		</Button>
	</SheetTrigger>
	<SheetContent side="right" className="w-80">
		<SheetHeader>
			<SheetTitle>Filters</SheetTitle>
		</SheetHeader>
		<div className="mt-4 flex flex-col gap-5">
			{/* Each filter as a labelled combobox or select */}
		</div>
	</SheetContent>
</Sheet>;
```

Use this pattern on any list page that has one or more filter dimensions. Add new filters inside the Sheet without touching the page header layout.

---

## URL-Param Filter Pattern

When a filter should be **shareable via URL** (e.g. filtering rooms by property), encode the filter value as a search param instead of local state. The page must be split into an `Inner` component wrapped in `<Suspense>` because `useSearchParams` requires it in Next.js App Router.

```tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TablePageSkeleton } from "@/components/page-skeleton";

function RoomsPageInner() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const propertyId = searchParams.get("propertyId") ?? "";

	const setPropertyFilter = (pid: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (pid) {
			params.set("propertyId", pid);
		} else {
			params.delete("propertyId");
		}
		params.delete("id"); // reset detail panel when filter changes
		router.push(`/rooms?${params.toString()}`);
	};

	// Use propertyId to filter data fetched in useEffect…
}

export default function RoomsPage() {
	return (
		<Suspense fallback={<TablePageSkeleton />}>
			<RoomsPageInner />
		</Suspense>
	);
}
```

---

## Relation Badge Pattern

When a field represents a related entity in admin detail views, render it as an entity-specific badge component that links to the destination list page using the existing `?id=` detail-sheet route pattern.

Use thin wrappers such as `TenantBadge`, `PropertyBadge`, `RoomBadge`, `SpaceBadge`, `GuestBadge`, `CompanyBadge`, `UserBadge`, and `SystemUserBadge` instead of dropping `EntityBadge` or `EntityReference` directly into page-level field definitions.

```tsx
import { PropertyBadge } from '@/components/properties/property-badge'
import { TenantBadge } from '@/components/tenants/tenant-badge'

<EntityDetailSheet
  fields={[
    { label: 'Property', value: booking.propertyId ? <PropertyBadge id={booking.propertyId} label={booking.property?.name} /> : '—' },
    { label: 'Tenant', value: booking.tenantId ? <TenantBadge id={booking.tenantId} label={booking.tenant?.name} slug={booking.tenant?.slug} /> : '—' },
  ]}
/>
```

Rules:

- Use per-entity badge wrappers at the page/component edge so entity semantics stay explicit.
- Back those wrappers with the shared badge primitive in `components/shared/` so styling and route behavior stay centralized.
- Preserve the list-page URL pattern (`/tenants?id=...`, `/properties?id=...`) instead of opening one-off sheets inside badge components.
- Use a dynamic shared badge only when the entity type itself is data-driven, such as audit-log target entities.
- Prefer badges for relation fields in detail sheets, cards, and compact metadata rows. Reserve plain text for non-interactive values.

Rules:

- The `<Suspense>` wrapper is **required** whenever `useSearchParams` is used in the App Router.
- Always use `new URLSearchParams(searchParams.toString())` to preserve all existing params when pushing.
- Clear the `id` param when changing the filter to avoid showing a stale detail sheet.

Applied on: `rooms`, `spaces`, `space-types`.

---

## URL-Param Detail Sheet Pattern

All entity list pages support a `?id=` URL param that opens an `EntityDetailSheet` for the selected row. This makes detail views shareable (paste the URL → sheet opens) and browser-history navigable.

`EntityDetailSheet` lives in `@/components/entity-detail-sheet` — a generic read-only sheet that accepts a `fields` array of `{ label, value }` pairs where `value` is a `ReactNode`.

```tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EntityDetailSheet } from "@/components/entity-detail-sheet";
import { TablePageSkeleton } from "@/components/page-skeleton";

function XxxPageInner() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [items, setItems] = useState<Xxx[]>([]);

	const selectedId = searchParams.get("id") ?? "";
	const selectedItem = items.find((i) => i.id === selectedId) ?? null;

	const openDetail = (item: Xxx) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("id", item.id);
		router.push(`/xxx?${params.toString()}`);
	};

	const closeDetail = (open: boolean) => {
		if (!open) {
			const params = new URLSearchParams(searchParams.toString());
			params.delete("id");
			const qs = params.toString();
			router.push(qs ? `/xxx?${qs}` : "/xxx");
		}
	};

	return (
		<>
			<XxxTable items={items} onView={openDetail} />

			<EntityDetailSheet
				open={!!selectedId && !!selectedItem}
				onOpenChange={closeDetail}
				title={selectedItem?.name ?? ""}
				description="Entity details"
				fields={[
					{ label: "Name", value: selectedItem?.name },
					{ label: "Status", value: <Badge>{selectedItem?.status}</Badge> },
					{
						label: "Created",
						value: selectedItem?.createdAt
							? format(new Date(selectedItem.createdAt), "MMM d, yyyy")
							: "—",
					},
				]}
			/>
		</>
	);
}

export default function XxxPage() {
	return (
		<Suspense fallback={<TablePageSkeleton />}>
			<XxxPageInner />
		</Suspense>
	);
}
```

Rules:

- Check **both** `!!selectedId && !!selectedItem` for `open` — handles navigating to a URL with an unknown id gracefully.
- Every table component accepts an optional `onView?: (item: T) => void` prop that renders a **"View details"** item at the top of the row's dropdown menu.
- Use `<Badge>` for status/boolean fields in the `fields` array — `value` is `ReactNode`.
- Preserve all existing URL params when pushing (filter params + detail param coexist).

Applied on: all 20 entity list pages in `app/(dashboard)/`.

---

## ShadCN Component Notes

| Component      | Mobile guidance                                                                  |
| -------------- | -------------------------------------------------------------------------------- |
| `Sheet`        | Use for mobile nav drawer (sidebar) **and** filter panels                        |
| `Dialog`       | Add `className="w-full max-w-lg"` — inherits full-width on mobile                |
| `Table`        | Wrap in `overflow-x-auto`; hide low-priority columns with `hidden md:table-cell` |
| `DropdownMenu` | Preferred for row-level actions — avoids button overflow                         |
| `Tabs`         | Allow horizontal scroll on mobile: `overflow-x-auto` on the `TabsList` container |
| `Card`         | Use for mobile fallback views and stat blocks                                    |
| `Combobox`     | Use `Command` + `Popover` for any searchable dropdown (see above)                |
| `Select`       | Use for short, fixed option lists with no search need                            |
| `Popover`      | Use as the floating container for Combobox and custom pickers                    |

---

**Last Updated**: 2026-03-19
