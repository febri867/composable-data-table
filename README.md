# Coconut Composable Data Table

A reusable and composable data table built with React, TypeScript, and TanStack Table.

The project focuses on building a table system from small, reusable primitives rather than a single component with a large configuration API.

## Overview

The table is built around a shared TanStack Table instance and can be composed with only the features an application needs.

For example:

```tsx
<DataTable.Root data={data} columns={columns} enableRowSelection>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />

      <DataTable.Actions>
        <DataTable.FacetedFilter columnId="status" />
        <DataTable.ViewOptions />
      </DataTable.Actions>
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table stickyHeader />

  <DataTable.Footer>
    <DataTable.Pagination />
  </DataTable.Footer>
</DataTable.Root>
```

Additional controls can access the same table instance through `useDataTable()` without modifying the table core.

## Demo & Documentation

The repository includes:

- **Demo** — a reference implementation showing the main table features.
- **Docs** — interactive examples and usage documentation.
- **Storybook** — isolated component development and testing.

When running locally:

```text
http://localhost:5173/
http://localhost:5173/docs
```

Start Storybook with:

```bash
npm run storybook
```

## Documentation Map

The repository keeps different types of documentation separate so each file has a clear purpose.

| File | Purpose |
| --- | --- |
| `README.md` | Project overview, setup, features, and basic usage |
| `SUBMISSION.md` | Submission notes, reviewer path, and main design decisions |
| `CHANGELOG.md` | Release and change history |
| `docs/API.md` | Public component API and usage details |
| `docs/ARCHITECTURE.md` | Component structure, state ownership, and architecture decisions |
| `docs/CONTRIBUTING.md` | Development workflow and contribution guidelines |
| `docs/PUBLISHING.md` | Package build and npm/GitLab publishing workflow |

## Features

### Table

- Type-safe column definitions
- Sorting
- Multi-column sorting
- Global search
- Column filtering
- Faceted filtering
- Pagination
- Infinite scroll
- Row selection
- Column visibility
- Column pinning
- Column ordering
- Grouping
- Expandable rows
- Sticky headers

### UI

- Loading state
- Empty state
- Skeleton rows
- Striped rows
- Density options
- Fullscreen workspace
- CSV export
- Row actions
- Responsive controls
- Keyboard-friendly interactions
- Focus management

### State

The table supports both uncontrolled and controlled state.

Supported controlled state includes:

- Sorting
- Global filtering
- Column filtering
- Pagination
- Row selection
- Column visibility
- Column ordering
- Column pinning
- Grouping
- Expanded rows

Server-side/manual modes are also supported for sorting, filtering, and pagination.

## Why Composition?

A common approach is to expose most functionality through boolean props:

```tsx
<DataTable
  searchable
  sortable
  filterable
  pagination
  selectable
  showColumnPicker
  ...
/>
```

This can become difficult to extend as the number of features grows.

This project instead exposes smaller primitives:

```tsx
<DataTable.Root data={data} columns={columns}>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />
      <DataTable.ViewOptions />
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table />

  <DataTable.Footer>
    <DataTable.Pagination />
  </DataTable.Footer>
</DataTable.Root>
```

This makes individual features optional and allows applications to provide their own controls when needed.

## Basic Usage

```tsx
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'

type User = {
  id: string
  name: string
  role: string
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
]

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable.Root data={users} columns={columns}>
      <DataTable.Table />
    </DataTable.Root>
  )
}
```

## Search & Filtering

Global search:

```tsx
<DataTable.Root data={users} columns={columns}>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table />
</DataTable.Root>
```

Column filtering can be configured through the column definition:

```tsx
const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    filterFn: 'includesString',
  }),
]
```

For columns with a known set of values, faceted filtering can be added:

```tsx
<DataTable.FacetedFilter columnId="status" />
```

## Sorting

Sorting is handled by TanStack Table and can be enabled through the column configuration and table controls.

A sortable column can define its header and participate in single or multi-column sorting.

The table can also expose sorting state to the consuming application:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  state={{ sorting }}
  onSortingChange={setSorting}
>
  <DataTable.Table />
</DataTable.Root>
```

## Pagination

Client-side pagination:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable.Root>
```

Page size options can be configured:

```tsx
<DataTable.Pagination
  pageSizeOptions={[10, 25, 50, 100]}
/>
```

## Server-side Pagination

Pagination state can be controlled by the consuming application:

```tsx
<DataTable.Root
  data={page.rows}
  columns={columns}
  state={{ pagination }}
  onPaginationChange={setPagination}
  manualPagination
  rowCount={page.total}
>
  <DataTable.Table loading={isFetching} />
  <DataTable.Pagination />
</DataTable.Root>
```

The table does not perform data fetching or caching itself. Those responsibilities remain with the consuming application.

## Server-side Sorting & Filtering

Sorting and filtering can also be controlled when the data comes from an API:

```tsx
<DataTable.Root
  data={query.data?.rows ?? []}
  columns={columns}
  state={{
    sorting,
    columnFilters,
    pagination,
  }}
  onSortingChange={setSorting}
  onColumnFiltersChange={setColumnFilters}
  onPaginationChange={setPagination}
  manualSorting
  manualFiltering
  manualPagination
  rowCount={query.data?.total ?? 0}
>
  <DataTable.Table loading={query.isFetching} />
  <DataTable.Pagination />
</DataTable.Root>
```

This keeps the table UI independent from the application's networking or query layer.

## Infinite Scroll

Infinite scrolling is available as a separate primitive:

```tsx
<DataTable.Root data={rows} columns={columns}>
  <DataTable.Table />

  <DataTable.InfiniteScroll
    hasMore={hasNextPage}
    loading={isFetchingNextPage}
    onLoadMore={fetchNextPage}
  />
</DataTable.Root>
```

The component handles the loading trigger. Data fetching and caching remain outside the table.

## Row Selection

Row selection can be enabled from the root component:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableRowSelection
>
  <DataTable.Table />
</DataTable.Root>
```

Selection can also be controlled:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableRowSelection
  state={{ rowSelection }}
  onRowSelectionChange={setRowSelection}
>
  <DataTable.Table />
</DataTable.Root>
```

## Column Visibility

Column visibility can be exposed through the built-in view options:

```tsx
<DataTable.Root data={users} columns={columns}>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.ViewOptions />
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table />
</DataTable.Root>
```

Applications can also control visibility directly through table state.

## Column Pinning

Columns can be pinned through TanStack Table's column pinning state.

The table exposes pinning as part of the reusable table state so applications can provide their own controls or use the built-in table options.

## Expandable Rows

Expandable rows can be enabled when the application provides nested or additional row content.

The same table instance is used for expansion state, allowing expansion to work alongside sorting, filtering, pagination, and selection.

## Fullscreen

The table can be displayed as a fullscreen workspace:

```tsx
<DataTable.Root data={data} columns={columns}>
  <DataTable.Fullscreen>
    <DataTable.Header>
      <DataTable.Toolbar>
        <DataTable.Search />
        <DataTable.FullscreenButton />
      </DataTable.Toolbar>
    </DataTable.Header>

    <DataTable.Table stickyHeader />

    <DataTable.Footer>
      <DataTable.Pagination />
    </DataTable.Footer>
  </DataTable.Fullscreen>
</DataTable.Root>
```

The default strategy uses an overlay:

```tsx
<DataTable.Fullscreen strategy="overlay">
  ...
</DataTable.Fullscreen>
```

A native browser Fullscreen API mode is also available:

```tsx
<DataTable.Fullscreen strategy="native">
  ...
</DataTable.Fullscreen>
```

Fullscreen keeps the existing table instance and state instead of creating a second table.

## Custom Controls

The table instance can be accessed through `useDataTable()`:

```tsx
import { useDataTable } from '@/components/data-table'

function ResetSortingButton() {
  const { table } = useDataTable()

  return (
    <button
      type="button"
      onClick={() => table.resetSorting()}
    >
      Reset sorting
    </button>
  )
}
```

This allows applications to build custom controls around the same table state.

## Project Structure

The reusable table components are organized by responsibility:

```text
src/
├── components/
│   └── data-table/
│       ├── core/
│       │   ├── context.tsx
│       │   ├── root.tsx
│       │   └── index.ts
│       │
│       ├── controls/
│       │   ├── search.tsx
│       │   ├── column-filters.tsx
│       │   ├── sort-button.tsx
│       │   ├── menu-button.tsx
│       │   ├── column-visibility.tsx
│       │   ├── table-options.tsx
│       │   └── index.ts
│       │
│       ├── display/
│       │   ├── layout.tsx
│       │   ├── table.tsx
│       │   └── index.ts
│       │
│       ├── navigation/
│       │   ├── pagination.tsx
│       │   └── index.ts
│       │
│       ├── utilities/
│       │   ├── selection.tsx
│       │   ├── export-csv.tsx
│       │   ├── density.tsx
│       │   ├── infinite-scroll.tsx
│       │   ├── column-pinning.tsx
│       │   ├── row-count.tsx
│       │   └── index.ts
│       │
│       ├── fullscreen/
│       │   ├── fullscreen.tsx
│       │   └── index.ts
│       │
│       ├── hooks/
│       │   ├── menu-hooks.ts
│       │   └── index.ts
│       │
│       └── index.ts
│
├── demo/
├── docs/
├── lib/
├── styles/
└── test/

stories/
└── DataTable.stories.tsx
```

The `components/data-table` directory contains the reusable table primitives. Demo, documentation, and test fixtures are kept separate from the package implementation.

## Architecture

TanStack Table provides the table state and row-model logic.

The component layer is responsible for rendering semantic table markup and providing reusable controls around the table instance.

The main relationship is:

```text
Application
    │
    ▼
DataTable.Root
    │
    ├── shared table instance
    │
    ├── Header / Toolbar
    │       ├── Search
    │       ├── Filters
    │       └── View Options
    │
    ├── Table
    │
    └── Footer
            └── Pagination
```

For more detail about state ownership and component boundaries, see:

```text
docs/ARCHITECTURE.md
```

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/
```

Documentation:

```text
http://localhost:5173/docs
```

## Storybook

Start Storybook:

```bash
npm run storybook
```

Build Storybook:

```bash
npm run build-storybook
```

## Testing

The project uses Vitest and Testing Library.

Run the test suite:

```bash
npm test
```

The tests focus on user-visible behavior such as:

- pagination
- global search
- column filtering
- faceted filtering
- sorting
- selection
- column visibility
- fullscreen behavior

## Quality Checks

Type checking:

```bash
npm run typecheck
```

Linting:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

Storybook build:

```bash
npm run build-storybook
```

Run the complete check:

```bash
npm run ci
```

## Package

The reusable library can be built separately from the demo application:

```bash
npm run build:package
```

The package exposes the `DataTable` components and stylesheet.

Example:

```tsx
import 'coconut-composable-data-table/styles.css'
import { DataTable } from 'coconut-composable-data-table'
```

## Reference

The implementation uses the TanStack Table v8 API.

The initial table implementation follows the concepts demonstrated in the TanStack Table Basic Table example:

https://tanstack.com/table/latest/docs/framework/react/examples/basic-use-table

## Notes

The repository contains both the reusable component library and a reference application.

The demo and documentation use local fixture data so the table interactions can be explored without requiring an external API.

For additional information:

- `SUBMISSION.md` — reviewer guide and main design decisions
- `docs/API.md` — public API
- `docs/ARCHITECTURE.md` — architecture and state ownership
- `docs/CONTRIBUTING.md` — development workflow
- `docs/PUBLISHING.md` — package publishing
- `CHANGELOG.md` — release history
