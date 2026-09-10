# Coconut Composable Data Table

A flexible and composable data table for React applications.

The table is built from small components, so you can use only the features your application needs.

## Installation

```bash
npm install coconut-composable-data-table
```

Import the stylesheet once in your application:

```tsx
import 'coconut-composable-data-table/styles.css'
```

Then import the table components:

```tsx
import {
  DataTable,
  type DataTableColumn,
} from 'coconut-composable-data-table'
```

## Basic Usage

Only `data` and `columns` are required.

```tsx
import 'coconut-composable-data-table/styles.css'

import {
  DataTable,
  type DataTableColumn,
} from 'coconut-composable-data-table'

type User = {
  id: string
  name: string
  email: string
  role: string
}

const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'User',
  },
]

export function UsersTable() {
  return (
    <DataTable.Root data={users} columns={columns}>
      <DataTable.Table />
    </DataTable.Root>
  )
}
```

## Columns

Columns define how your data is displayed.

### Basic column

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]
```

### Custom column ID

Use `id` when a column does not directly map to a property in your data.

```tsx
const columns: DataTableColumn<User>[] = [
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <button
        type="button"
        onClick={() => console.log(row.original)}
      >
        Edit
      </button>
    ),
  },
]
```

### Custom cell

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <strong>{row.original.name}</strong>
    ),
  },
]
```

### Custom header

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'User Name',
  },
]
```

### Column width

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 240,
  },
]
```

### Enable filtering

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    filterFn: 'includesString',
  },
]
```

### Enable sorting

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
]
```

## Composition

The table is designed to be composed from small components.

```tsx
<DataTable.Root data={users} columns={columns}>
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

You can add or remove features without changing the table's core component.

## Search

Add global search:

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

Customize the search input:

```tsx
<DataTable.Search placeholder="Search users..." />
```

Search a specific column:

```tsx
<DataTable.Search
  columnId="name"
  placeholder="Search names..."
/>
```

## Filtering

Column filtering:

```tsx
<DataTable.ColumnFilter columnId="role" />
```

Filter input:

```tsx
<DataTable.Filter columnId="name" />
```

Filter row:

```tsx
<DataTable.FilterRow />
```

Clear active filters:

```tsx
<DataTable.ClearFilters />
```

## Faceted Filtering

For columns with a known set of values:

```tsx
<DataTable.FacetedFilter
  columnId="role"
  label="Role"
/>
```

## Sorting

A sortable column can use the sort button in its header:

```tsx
const columns: DataTableColumn<User>[] = [
  {
    accessorKey: 'name',
    header: () => (
      <DataTable.SortButton
        columnId="name"
        label="Name"
      />
    ),
  },
]
```

Sorting state can also be controlled:

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

Add pagination:

```tsx
<DataTable.Root data={users} columns={columns}>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable.Root>
```

Customize page sizes:

```tsx
<DataTable.Pagination
  pageSizeOptions={[10, 25, 50, 100]}
/>
```

Hide page size selection:

```tsx
<DataTable.Pagination showPageSize={false} />
```

Hide page numbers:

```tsx
<DataTable.Pagination showPageNumbers={false} />
```

## Server-side Pagination

Use `manualPagination` when pagination is handled by your application or API.

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  manualPagination
  rowCount={totalUsers}
  state={{ pagination }}
  onPaginationChange={setPagination}
>
  <DataTable.Table loading={loading} />
  <DataTable.Pagination />
</DataTable.Root>
```

The table does not perform network requests. Your application remains responsible for fetching data.

## Server-side Sorting

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  manualSorting
  state={{ sorting }}
  onSortingChange={setSorting}
>
  <DataTable.Table />
</DataTable.Root>
```

## Server-side Filtering

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  manualFiltering
  state={{ columnFilters }}
  onColumnFiltersChange={setColumnFilters}
>
  <DataTable.Table />
</DataTable.Root>
```

## Row Selection

Enable row selection:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableRowSelection
>
  <DataTable.Table />
</DataTable.Root>
```

Add a selection column:

```tsx
const columns: DataTableColumn<User>[] = [
  {
    id: 'select',
    header: () => <DataTable.SelectionHeader />,
    cell: ({ row }) => (
      <DataTable.SelectionCell row={row} />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
]
```

Display actions for selected rows:

```tsx
<DataTable.BulkActions />
```

## Column Visibility

Add a column visibility menu:

```tsx
<DataTable.ViewOptions />
```

Or:

```tsx
<DataTable.ColumnVisibility />
```

## Column Pinning

Enable column pinning:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableColumnPinning
>
  <DataTable.Table />
</DataTable.Root>
```

Use the pinning control:

```tsx
<DataTable.Pinning columnId="name" />
```

## Column Resizing

Enable column resizing:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableColumnResizing
>
  <DataTable.Table />
</DataTable.Root>
```

Use resize updates at the end of the interaction:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableColumnResizing
  columnResizeMode="onEnd"
>
  <DataTable.Table />
</DataTable.Root>
```

## Expandable Rows

Enable expandable rows:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  enableExpanding
>
  <DataTable.Table />
</DataTable.Root>
```

Add an expand button:

```tsx
const columns: DataTableColumn<User>[] = [
  {
    id: 'expand',
    header: '',
    cell: ({ row }) => (
      <DataTable.ExpandButton row={row} />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
]
```

## Infinite Scroll

```tsx
<DataTable.InfiniteScroll
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadMore}
/>
```

Customize the trigger:

```tsx
<DataTable.InfiniteScroll
  hasMore={hasMore}
  loading={loading}
  onLoadMore={loadMore}
  rootMargin="300px"
  threshold={0}
  label="Load more..."
/>
```

## Loading State

Display loading rows:

```tsx
<DataTable.Table loading />
```

Customize the number of loading rows:

```tsx
<DataTable.Table
  loading
  loadingRows={8}
/>
```

## Empty State

```tsx
<DataTable.Table empty="No users found." />
```

Or:

```tsx
<DataTable.Empty>
  No users found.
</DataTable.Empty>
```

## Table Appearance

### Striped rows

```tsx
<DataTable.Table striped />
```

### Sticky header

```tsx
<DataTable.Table stickyHeader />
```

### Density

```tsx
<DataTable.Table density="compact" />
```

Available density values:

```text
compact
default
comfortable
```

## Fullscreen

```tsx
<DataTable.Fullscreen>
  <DataTable.Header>
    <DataTable.Toolbar>
      <DataTable.Search />
      <DataTable.FullscreenButton />
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table stickyHeader />
</DataTable.Fullscreen>
```

Available strategies:

```tsx
<DataTable.Fullscreen strategy="overlay">
  ...
</DataTable.Fullscreen>
```

or:

```tsx
<DataTable.Fullscreen strategy="native">
  ...
</DataTable.Fullscreen>
```

## CSV Export

Export table data:

```tsx
<DataTable.ExportCsv filename="users.csv" />
```

Provide custom rows:

```tsx
<DataTable.ExportCsv
  filename="selected-users.csv"
  getRows={() => selectedUsers}
/>
```

## Row Count

```tsx
<DataTable.RowCount />
```

Customize the label:

```tsx
<DataTable.RowCount label="users" />
```

## Controlled State

The table supports both internal and controlled state.

You can control only the state your application needs:

```tsx
<DataTable.Root
  data={users}
  columns={columns}
  state={{
    sorting,
    pagination,
    rowSelection,
  }}
  onSortingChange={setSorting}
  onPaginationChange={setPagination}
  onRowSelectionChange={setRowSelection}
>
  <DataTable.Table />
  <DataTable.Pagination />
</DataTable.Root>
```

Supported state includes:

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

## Custom Controls

Use `useDataTable()` to access the current table instance from a child component.

```tsx
import {
  DataTable,
  useDataTable,
} from 'coconut-composable-data-table'

function ResetSorting() {
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

Use it inside the table:

```tsx
<DataTable.Root data={users} columns={columns}>
  <DataTable.Header>
    <DataTable.Toolbar>
      <ResetSorting />
    </DataTable.Toolbar>
  </DataTable.Header>

  <DataTable.Table />
</DataTable.Root>
```

## Root Props

Only these props are required:

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `TData[]` | Yes | Data displayed by the table |
| `columns` | `DataTableColumn<TData>[]` | Yes | Column definitions |
| `children` | `ReactNode` | No | Composable table content |

Common optional props:

| Prop | Type | Description |
| --- | --- | --- |
| `className` | `string` | Custom root class |
| `initialState` | `DataTableInitialState` | Initial table state |
| `state` | `Partial<TableState>` | Controlled table state |
| `onSortingChange` | handler | Sorting state callback |
| `onColumnFiltersChange` | handler | Column filter callback |
| `onColumnVisibilityChange` | handler | Column visibility callback |
| `onRowSelectionChange` | handler | Row selection callback |
| `onPaginationChange` | handler | Pagination callback |
| `onGlobalFilterChange` | handler | Global filter callback |
| `onExpandedChange` | handler | Expanded row callback |
| `onGroupingChange` | handler | Grouping callback |
| `onColumnPinningChange` | handler | Column pinning callback |
| `onColumnOrderChange` | handler | Column order callback |
| `manualPagination` | `boolean` | Enable server-side/manual pagination |
| `manualSorting` | `boolean` | Enable server-side/manual sorting |
| `manualFiltering` | `boolean` | Enable server-side/manual filtering |
| `manualGrouping` | `boolean` | Enable server-side/manual grouping |
| `manualExpanding` | `boolean` | Enable server-side/manual expanding |
| `pageCount` | `number` | Total page count for manual pagination |
| `rowCount` | `number` | Total row count for manual pagination |
| `enableRowSelection` | `boolean \| function` | Enable row selection |
| `enableMultiRowSelection` | `boolean \| function` | Enable multi-row selection |
| `enableSubRowSelection` | `boolean \| function` | Enable sub-row selection |
| `enableExpanding` | `boolean \| function` | Enable expandable rows |
| `enableColumnResizing` | `boolean` | Enable column resizing |
| `enableColumnPinning` | `boolean` | Enable column pinning |
| `columnResizeMode` | `'onChange' \| 'onEnd'` | Resize update strategy |

All non-essential props are optional.

## Available Components

### Core

```text
DataTable.Root
DataTable.Table
DataTable.Header
DataTable.Toolbar
DataTable.Actions
DataTable.Footer
DataTable.Caption
DataTable.Empty
DataTable.Loading
```

### Search & Filtering

```text
DataTable.Search
DataTable.Filter
DataTable.ColumnFilter
DataTable.FacetedFilter
DataTable.FilterRow
DataTable.ClearFilters
```

### Sorting

```text
DataTable.SortButton
```

### Pagination

```text
DataTable.Pagination
```

### Selection

```text
DataTable.SelectionCell
DataTable.SelectionHeader
DataTable.BulkActions
```

### Columns

```text
DataTable.ViewOptions
DataTable.ColumnVisibility
DataTable.Pinning
DataTable.ResizeHandle
```

### Rows

```text
DataTable.ExpandButton
DataTable.InfiniteScroll
DataTable.RowCount
```

### Utilities

```text
DataTable.ExportCsv
DataTable.Density
DataTable.Reset
DataTable.TableOptions
```

### Fullscreen

```text
DataTable.Fullscreen
DataTable.FullscreenButton
```


## Full Feature Example

The following example demonstrates a more complete table built only with
`coconut-composable-data-table`.

It does not require a separate table library, icon library, UI library, or
other component library. The table components, state management hooks, and
controls come from this package.

### Mock data

```tsx
type Project = {
  id: string
  name: string
  owner: string
  email: string
  status: 'Active' | 'Planning' | 'Completed' | 'Archived'
  priority: 'Low' | 'Medium' | 'High'
  progress: number
  teamSize: number
  budget: number
  dueDate: string
}

const projects: Project[] = [
  { id: 'PRJ-001', name: 'Website Redesign', owner: 'Sarah Chen', email: 'sarah@example.com', status: 'Active', priority: 'High', progress: 72, teamSize: 8, budget: 48000, dueDate: '2026-09-18' },
  { id: 'PRJ-002', name: 'Mobile Application', owner: 'Michael Brown', email: 'michael@example.com', status: 'Active', priority: 'High', progress: 61, teamSize: 10, budget: 72000, dueDate: '2026-10-02' },
  { id: 'PRJ-003', name: 'Design System', owner: 'Emily Davis', email: 'emily@example.com', status: 'Completed', priority: 'Medium', progress: 100, teamSize: 5, budget: 32000, dueDate: '2026-08-28' },
  { id: 'PRJ-004', name: 'Analytics Dashboard', owner: 'David Wilson', email: 'david@example.com', status: 'Planning', priority: 'Medium', progress: 24, teamSize: 6, budget: 41000, dueDate: '2026-10-20' },
  { id: 'PRJ-005', name: 'Payment Integration', owner: 'Olivia Taylor', email: 'olivia@example.com', status: 'Active', priority: 'High', progress: 83, teamSize: 4, budget: 27000, dueDate: '2026-09-14' },
  { id: 'PRJ-006', name: 'Customer Portal', owner: 'James Anderson', email: 'james@example.com', status: 'Planning', priority: 'Low', progress: 15, teamSize: 7, budget: 39000, dueDate: '2026-11-05' },
  { id: 'PRJ-007', name: 'Internal Tools', owner: 'Sophia Martin', email: 'sophia@example.com', status: 'Active', priority: 'Medium', progress: 48, teamSize: 5, budget: 22000, dueDate: '2026-09-30' },
  { id: 'PRJ-008', name: 'API Modernization', owner: 'Daniel Moore', email: 'daniel@example.com', status: 'Completed', priority: 'High', progress: 100, teamSize: 9, budget: 65000, dueDate: '2026-08-15' },
  { id: 'PRJ-009', name: 'Onboarding Flow', owner: 'Ava Jackson', email: 'ava@example.com', status: 'Active', priority: 'Medium', progress: 67, teamSize: 3, budget: 18000, dueDate: '2026-09-25' },
  { id: 'PRJ-010', name: 'Reporting Service', owner: 'William Harris', email: 'william@example.com', status: 'Archived', priority: 'Low', progress: 100, teamSize: 4, budget: 21000, dueDate: '2026-07-30' },
  { id: 'PRJ-011', name: 'Search Platform', owner: 'Mia Thompson', email: 'mia@example.com', status: 'Active', priority: 'High', progress: 54, teamSize: 8, budget: 56000, dueDate: '2026-10-12' },
  { id: 'PRJ-012', name: 'Notification Center', owner: 'Ethan Garcia', email: 'ethan@example.com', status: 'Planning', priority: 'Medium', progress: 8, teamSize: 4, budget: 16000, dueDate: '2026-11-18' },
  { id: 'PRJ-013', name: 'Access Management', owner: 'Isabella Martinez', email: 'isabella@example.com', status: 'Active', priority: 'High', progress: 76, teamSize: 6, budget: 44000, dueDate: '2026-09-21' },
  { id: 'PRJ-014', name: 'Data Importer', owner: 'Lucas Robinson', email: 'lucas@example.com', status: 'Completed', priority: 'Low', progress: 100, teamSize: 3, budget: 14000, dueDate: '2026-08-05' },
  { id: 'PRJ-015', name: 'Workspace Management', owner: 'Charlotte Lee', email: 'charlotte@example.com', status: 'Active', priority: 'Medium', progress: 39, teamSize: 7, budget: 35000, dueDate: '2026-10-28' },
]
```

### Full example

```tsx
import 'coconut-composable-data-table/styles.css'

import {
  DataTable,
  type DataTableColumn,
} from 'coconut-composable-data-table'

const columns: DataTableColumn<Project>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 110,
  },
  {
    accessorKey: 'name',
    header: 'Project',
    size: 220,
  },
  {
    accessorKey: 'owner',
    header: 'Owner',
    size: 180,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 220,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: 'arrIncludesSome',
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    filterFn: 'arrIncludesSome',
  },
  {
    accessorKey: 'progress',
    header: 'Progress',
    cell: ({ getValue }) => `${getValue<number>()}%`,
  },
  {
    accessorKey: 'teamSize',
    header: 'Team',
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    cell: ({ getValue }) =>
      `$${getValue<number>().toLocaleString()}`,
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
  },
]

export function ProjectDataExample() {
  return (
    <DataTable.Root
      data={projects}
      columns={columns}
      enableRowSelection
      enableColumnResizing
      enableColumnPinning
    >
      <DataTable.Header>
        <DataTable.Toolbar>
          <DataTable.Search placeholder="Search projects..." />

          <DataTable.FacetedFilter
            columnId="status"
            label="Status"
          />

          <DataTable.FacetedFilter
            columnId="priority"
            label="Priority"
          />

          <DataTable.ClearFilters />

          <DataTable.ViewOptions />

          <DataTable.ExportCsv filename="projects.csv" />

          <DataTable.Reset />
        </DataTable.Toolbar>
      </DataTable.Header>

      <DataTable.Table
        striped
        stickyHeader
        density="comfortable"
      />

      <DataTable.Footer>
        <DataTable.RowCount label="projects" />

        <DataTable.Pagination
          pageSizeOptions={[5, 10, 15, 25]}
        />
      </DataTable.Footer>
    </DataTable.Root>
  )
}
```

This example demonstrates that a consumer can combine the package's
composable primitives into a feature-rich table while keeping the application
data and column definitions fully under the consumer's control.

## TypeScript

Public types are available directly from the package:

```tsx
import type {
  DataTableColumn,
  DataTableRootProps,
  DataTablePaginationProps,
} from 'coconut-composable-data-table'
```

## Styling

Import the default stylesheet once:

```tsx
import 'coconut-composable-data-table/styles.css'
```

Components also expose `className` where customization is useful.

You can override the default styles with your application's CSS.

## License

MIT
