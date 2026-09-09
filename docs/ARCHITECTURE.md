# Architecture

## Goals

Coconut Composable Data Table is designed as a small frontend system rather than a page-level table. The architecture separates **headless table state**, **reusable UI primitives**, and **reference application behavior**.

The implementation follows the workflow demonstrated in TanStack Table's Basic Use Table example: stable data and column definitions feed a single table instance, while rendering and product-specific controls remain composable.

Reference: https://tanstack.com/table/latest/docs/framework/react/examples/basic-use-table

## Repository boundaries

```text
src/
├── components/data-table/       # reusable package implementation
│   ├── core/                    # table context + root state
│   ├── controls/                # search, filters, menus, sorting
│   ├── display/                 # table renderer + layout slots
│   ├── navigation/              # pagination
│   ├── utilities/               # selection, export, density, pinning
│   ├── fullscreen/              # fullscreen workspace + button
│   ├── hooks/                   # shared interaction hooks
│   └── index.ts                 # package-local public barrel
├── index.ts                     # npm package boundary
├── examples/                    # reference consumers only
├── demo/                        # `/` application shell
├── docs/                        # `/docs` documentation shell
├── styles/                      # package + reference styles
└── test/                        # package behavior tests
```

Only `src/index.ts` is published as the package entry point. The reference application and fixtures are intentionally not exported.

## State ownership

`DataTable.Root` creates exactly one TanStack Table instance. State can be used in two modes:

1. **Uncontrolled** — Root keeps local state for sorting, filters, global search, pagination, selection, visibility, expansion, grouping, pinning, and order.
2. **Controlled** — a consumer passes a state slice and an `on*Change` handler. Root keeps all unspecified slices internally, allowing partial control without forcing a fully controlled table.

This hybrid model avoids a common component-library trap where adding `state={{ rowSelection }}` accidentally makes every other state slice difficult to manage.

### Filter/search → pagination contract

Changing column filters or the global search explicitly resets `pageIndex` to `0`. This is a deliberate UX invariant: a user should never filter on page 7 and see an empty page simply because the filtered result set is shorter.

The Root also clamps a stale page index when client-side data changes, for example after deleting the last row on the final page.

## Rendering pipeline

```text
Consumer data + ColumnDef
          │
          ▼
   DataTable.Root
          │
          ├── state ownership
          ├── feature configuration
          └── useReactTable()
                    │
                    ▼
             TanStack Table
                    │
        ┌───────────┼────────────┐
        ▼           ▼            ▼
     filters      sorting     pagination
        │           │            │
        └───────────┼────────────┘
                    ▼
           table.getRowModel()
                    │
                    ▼
            DataTable.Table
```

The table renderer does not fetch data and does not own business mutations. It renders the row model supplied by TanStack.

## Composable UI

Every primitive reads the same table instance through `useDataTable()`:

- `Search` → global or column filter state
- `Filter` → text filter for one column
- `ColumnFilter` → discoverable header popover for a column
- `FacetedFilter` → unique-value filter
- `FilterRow` → filter controls below the toolbar
- `SortButton` → explicit sortable header control
- `Pagination` → page navigation and page size
- `InfiniteScroll` → transport-agnostic loading sentinel
- `SelectionHeader` / `SelectionCell` → row selection
- `BulkActions` → selection-aware slot
- `ViewOptions` / `ColumnVisibility` → visibility state
- `Pinning` → column pinning action
- `ResizeHandle` → column sizing interaction
- `ExpandButton` → expansion interaction
- `Density` → application-controlled presentation density
- `ExportCsv` → small client-side export primitive
- `useDataTable()` → escape hatch for custom controls

No primitive needs to know about the domain model.

## Pagination architecture

Client pagination uses TanStack's `getPaginationRowModel()`.

Server pagination uses:

```tsx
<DataTable.Root
  data={query.data.rows}
  columns={columns}
  state={{ pagination }}
  onPaginationChange={setPagination}
  manualPagination
  rowCount={query.data.total}
>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable.Root>
```

The component does not fetch. The application translates `pagination.pageIndex/pageSize` into API parameters and owns caching/loading/error behavior.

## Infinite-scroll architecture

`DataTable.InfiniteScroll` is intentionally smaller than a query library:

```text
IntersectionObserver
        │
        ▼
  onLoadMore()
        │
        ▼
 application fetch/cache
        │
        ▼
 append rows
        │
        ▼
 DataTable.Root(data={rows})
```

It owns neither cursors nor data merging. This keeps the component compatible with TanStack Query, SWR, custom fetchers, GraphQL, or a local data source.

## Filtering architecture

The package supports TanStack's built-in filter functions plus consumer-defined functions.

For a multi-select facet, the consumer can use a custom filter function:

```tsx
const multiSelect = (row, columnId, values) =>
  values.includes(String(row.getValue(columnId)))

columnHelper.accessor('status', {
  filterFn: multiSelect,
})
```

`FacetedFilter` stores selected values as an array. This keeps the primitive generic while the column definition decides how those values should be interpreted.

## Styling architecture

`src/styles/data-table.css` is the package stylesheet. It contains only table-system styles and is exposed as:

```tsx
import 'coconut-composable-data-table/styles.css'
```

`globals.css` contains reference application and documentation styles and is not imported by the package entry point.

## Accessibility architecture

The renderer intentionally uses native table semantics:

- `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- `scope="col"`
- `aria-sort`
- labelled checkbox controls
- focus-visible states
- keyboard-accessible buttons
- live status for loading/infinite scroll
- indeterminate select-all state

Interactive visual affordances are backed by actual controls instead of click handlers on non-semantic containers.

## Testing strategy

Tests should target observable behavior rather than implementation details:

- rendered row model
- global and column filtering
- sorting
- pagination
- page reset after filters
- selection
- visibility
- custom primitive composition

The home page and `/docs` playground are also manual integration surfaces using deterministic fixtures.

## Package release boundary

```text
consumer
   │
   ▼
npm package
   │
   ├── DataTable primitives
   ├── useDataTable
   ├── types
   └── styles.css

NOT INCLUDED
   ├── demo application
   ├── docs page
   ├── fixture data
   └── product-specific actions
```

This boundary is validated by the package build configuration and `package.json` exports.


## Fullscreen surface

`DataTable.Fullscreen` is a presentation primitive, not a table-state concern. It owns only viewport state and delegates all data, sorting, filtering, selection, pagination, and rendering to the existing table instance. The implementation prefers the browser Fullscreen API and falls back to a fixed viewport surface when the API is unavailable or rejected.

## Reference media strategy

The demo uses local, tiny SVG avatar fixtures. Images are rendered with explicit dimensions, `loading="lazy"`, `decoding="async"`, and `fetchPriority="low"`. Initials render immediately and remain visible until an image finishes decoding. This avoids layout shifts, third-party network dependency, and image requests becoming a critical rendering path. The library package itself does not ship these demo assets.

## Action affordances

Reference actions use accessible labels rather than native `title` tooltips. This avoids browser tooltips escaping table cells and competing with action menus. Menus are positioned in a dedicated stacking context and remain keyboard reachable.

## Fullscreen boundary

Fullscreen is intentionally a presentation layer rather than a second table state machine.

```text
Root / TanStack state
        |
        +-- Fullscreen presentation boundary
               |
               +-- portal -> document.body (default overlay)
               |
               +-- same React context
               |
               +-- same table instance
```

This means entering fullscreen does not reset filters, sorting, pagination, selection, column visibility, or expansion. The only state transition is the viewport presentation state.

The overlay is the default because it is deterministic when embedded in dashboards, Storybook, documentation pages, or application shells that use transforms, clipping, or dark backgrounds. A dedicated body-level host owns the viewport, while the portalled table surface keeps the library `data-slot="data-table"` marker so scoped component styles remain active. The native browser Fullscreen API is opt-in.


## Module boundaries

The table implementation is intentionally split by responsibility. `root.tsx` is the only module that creates the TanStack table instance; `context.tsx` exposes the instance to descendants; renderers and interaction primitives remain independent. This keeps feature work local and reduces merge conflicts.

- `root.tsx`: state ownership, controlled/uncontrolled adapters, TanStack row-model configuration.
- `context.tsx`: dependency injection for table/fullscreen contexts and shared type helpers.
- `fullscreen.tsx`: viewport presentation and focus lifecycle; it does not own table state.
- `filters.tsx`: search, column filters, faceting, filter rows and sorting controls.
- `table.tsx`: semantic HTML table rendering, pinning and defensive column sizing.
- `pagination.tsx`: pagination UI only; state transitions are delegated to TanStack's table instance.
- `utilities.tsx`: independent selection, expansion, export, infinite-scroll and density primitives.
- `menus.tsx` / `layout.tsx`: composition-only UI slots and menus.

## Type-safety boundaries

TanStack Table 8.21 exposes `enableExpanding` as a boolean option, while row-level eligibility is represented by `getRowCanExpand`. The public API accepts both forms and normalizes a row predicate into `enableExpanding: true` plus `getRowCanExpand`. Resize handlers are bridged from React synthetic events to TanStack's native DOM event contract via `event.nativeEvent`.
