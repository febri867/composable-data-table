# Coconut Composable Data Table

A flexible and composable data table for React applications.

The table is built from small components, so you can use only the features your application needs.

Live Demo: https://composable-data-table.vercel.app/

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

The following example is based on the `ProjectTableExample` used by the demo.
It includes mock data, expandable rows, row selection, sorting, filtering,
column visibility, column resizing, pagination, CSV export, fullscreen mode,
inline editing, row actions, and toast notifications.

The complete example below is self-contained, including 15 mock records and
the custom styling used by the demo. Copy the entire snippet into a React/TSX
component in a project that has `coconut-composable-data-table` installed.

> This example also uses `lucide-react` for the action icons:
> `npm install lucide-react`

### ProjectTableExample

```tsx
import 'coconut-composable-data-table/styles.css'

import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import {
  CheckCircle2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
} from 'lucide-react'
import { DataTable, type DataTableColumn } from 'coconut-composable-data-table'

const demoStyles = `
  .demo-table-shell {
    width: 100%;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #ffffff;
    color: #374151;
  }

  .demo-table-shell .avatar-image-shell {
    position: relative;
    display: inline-flex;
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    overflow: hidden;
    border-radius: 8px;
    background: #eef1f4;
    align-items: center;
    justify-content: center;
  }

  .demo-table-shell .avatar-image-shell img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .demo-table-shell .avatar-fallback {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  }

  .owner-cell {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 9px;
  }

  .owner-cell > span:last-child {
    display: grid;
    min-width: 0;
    line-height: 1.2;
  }

  .owner-cell strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 650;
  }

  .owner-cell small {
    margin-top: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #6b7280;
    font-size: 11px;
  }

  .header-with-filter {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .inline-select {
    min-width: 82px;
    height: 32px;
    padding: 0 28px 0 8px;
    border: 1px solid #9ca3af;
    border-radius: 4px;
    background: #fff;
    color: #111827;
    font-size: 13px;
  }

  .project-link {
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    color: #1117d8;
    font-size: 13px;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .project-link svg {
    flex: 0 0 auto;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 500;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #9ca3af;
  }

  .status-verified .status-dot {
    background: #16a34a;
  }

  .status-ongoing .status-dot {
    background: #2563eb;
  }

  .status-on-hold .status-dot {
    background: #f59e0b;
  }

  .status-rejected .status-dot {
    background: #ef4444;
  }

  .progress-cell {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 100px;
  }

  .progress-cell > span {
    width: 68px;
    height: 6px;
    overflow: hidden;
    border-radius: 999px;
    background: #e5e7eb;
  }

  .progress-cell > span > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #111827;
  }

  .progress-cell strong {
    min-width: 34px;
    font-size: 12px;
    font-weight: 650;
    text-align: right;
  }

  .avatar-stack {
    display: flex;
    align-items: center;
    padding-left: 8px;
  }

  .avatar-stack .avatar {
    position: relative;
    width: 30px;
    height: 30px;
    margin-left: -8px;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  .avatar-stack .avatar-more {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #eef2f7;
    color: #64748b;
    font-size: 10px;
    font-weight: 700;
  }

  .row-actions-wrap {
    position: relative;
    display: flex;
    justify-content: flex-end;
  }

  .row-actions {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }

  .row-actions > button,
  .demo-modal-close {
    display: inline-flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #64748b;
    cursor: pointer;
  }

  .row-actions > button:hover,
  .demo-modal-close:hover {
    background: #f1f5f9;
    color: #111827;
  }

  .row-action-menu {
    position: fixed;
    z-index: 1000;
    width: 184px;
    padding: 5px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
  }

  .row-action-menu button {
    display: block;
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: #374151;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
  }

  .row-action-menu button:hover {
    background: #f3f4f6;
  }

  .expanded-project {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    color: #64748b;
    font-size: 12px;
  }

  .expanded-project strong {
    color: #111827;
  }

  .demo-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1100;
    display: grid;
    place-items: center;
    padding: 20px;
    background: rgba(15, 23, 42, .34);
  }

  .demo-modal {
    width: min(440px, 100%);
    padding: 20px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 24px 60px rgba(15, 23, 42, .2);
  }

  .demo-modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 18px;
  }

  .demo-modal-header .kicker {
    color: #64748b;
    font-size: 10px;
    font-weight: 750;
    letter-spacing: .08em;
  }

  .demo-modal-header h3 {
    margin: 5px 0 0;
    color: #111827;
    font-size: 18px;
  }

  .demo-modal label {
    display: grid;
    gap: 7px;
    margin-top: 14px;
    color: #475569;
    font-size: 12px;
    font-weight: 600;
  }

  .demo-modal input:not([type="range"]),
  .demo-modal select {
    width: 100%;
    box-sizing: border-box;
    height: 36px;
    padding: 0 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    color: #111827;
    font-size: 13px;
  }

  .range-control {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .range-control input {
    flex: 1;
  }

  .range-value {
    min-width: 42px;
    color: #111827;
    font-size: 12px;
    font-weight: 700;
    text-align: right;
  }

  .demo-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 22px;
  }

  .demo-secondary,
  .demo-primary {
    height: 36px;
    padding: 0 13px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
  }

  .demo-secondary {
    border: 1px solid #d1d5db;
    background: #fff;
    color: #374151;
  }

  .demo-primary {
    border: 1px solid #111827;
    background: #111827;
    color: #fff;
  }

  .demo-toast {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 1200;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 13px;
    border: 1px solid #dbe3ea;
    border-radius: 8px;
    background: #fff;
    color: #334155;
    box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    .demo-table-shell {
      overflow-x: auto;
    }
  }
`

type ProjectStatus = 'Verified' | 'Ongoing' | 'On Hold' | 'Rejected'
type WorkLocation = 'Office' | 'Remote'

type ProjectMember = {
  name: string
  initials: string
  image?: string
}

type Project = {
  id: string
  owner: string
  role: string
  city: string
  location: WorkLocation
  project: string
  status: ProjectStatus
  progress: number
  avatar?: string
  members: ProjectMember[]
}

const projectData: Project[] = [
  {
    id: 'PRJ-001',
    owner: 'Sarah Chen',
    role: 'Product Designer',
    city: 'Jakarta',
    location: 'Remote',
    project: 'sarah-chen.example.com',
    status: 'Ongoing',
    progress: 72,
    avatar: 'https://i.pravatar.cc/96?img=47',
    members: [
      { name: 'Sarah Chen', initials: 'SC', image: 'https://i.pravatar.cc/96?img=47' },
      { name: 'Michael Brown', initials: 'MB', image: 'https://i.pravatar.cc/96?img=12' },
      { name: 'Emily Davis', initials: 'ED', image: 'https://i.pravatar.cc/96?img=32' },
      { name: 'David Wilson', initials: 'DW', image: 'https://i.pravatar.cc/96?img=11' },
      { name: 'Olivia Taylor', initials: 'OT', image: 'https://i.pravatar.cc/96?img=5' },
    ],
  },
  {
    id: 'PRJ-002',
    owner: 'Michael Brown',
    role: 'Engineering Manager',
    city: 'Bandung',
    location: 'Office',
    project: 'michael-brown.example.com',
    status: 'Ongoing',
    progress: 61,
    avatar: 'https://i.pravatar.cc/96?img=12',
    members: [
      { name: 'Michael Brown', initials: 'MB', image: 'https://i.pravatar.cc/96?img=12' },
      { name: 'James Anderson', initials: 'JA', image: 'https://i.pravatar.cc/96?img=68' },
      { name: 'Sophia Martin', initials: 'SM', image: 'https://i.pravatar.cc/96?img=44' },
    ],
  },
  {
    id: 'PRJ-003',
    owner: 'Emily Davis',
    role: 'UX Researcher',
    city: 'Surabaya',
    location: 'Remote',
    project: 'emily-davis.example.com',
    status: 'Verified',
    progress: 100,
    avatar: 'https://i.pravatar.cc/96?img=32',
    members: [
      { name: 'Emily Davis', initials: 'ED', image: 'https://i.pravatar.cc/96?img=32' },
      { name: 'Ava Jackson', initials: 'AJ', image: 'https://i.pravatar.cc/96?img=25' },
      { name: 'Mia Thompson', initials: 'MT', image: 'https://i.pravatar.cc/96?img=48' },
      { name: 'Ethan Garcia', initials: 'EG', image: 'https://i.pravatar.cc/96?img=13' },
    ],
  },
  {
    id: 'PRJ-004',
    owner: 'David Wilson',
    role: 'Data Analyst',
    city: 'Yogyakarta',
    location: 'Office',
    project: 'david-wilson.example.com',
    status: 'Ongoing',
    progress: 24,
    avatar: 'https://i.pravatar.cc/96?img=11',
    members: [
      { name: 'David Wilson', initials: 'DW', image: 'https://i.pravatar.cc/96?img=11' },
      { name: 'Lucas Robinson', initials: 'LR', image: 'https://i.pravatar.cc/96?img=69' },
      { name: 'Charlotte Lee', initials: 'CL', image: 'https://i.pravatar.cc/96?img=45' },
    ],
  },
  {
    id: 'PRJ-005',
    owner: 'Olivia Taylor',
    role: 'Frontend Engineer',
    city: 'Jakarta',
    location: 'Remote',
    project: 'olivia-taylor.example.com',
    status: 'Ongoing',
    progress: 83,
    avatar: 'https://i.pravatar.cc/96?img=5',
    members: [
      { name: 'Olivia Taylor', initials: 'OT', image: 'https://i.pravatar.cc/96?img=5' },
      { name: 'Daniel Moore', initials: 'DM', image: 'https://i.pravatar.cc/96?img=14' },
      { name: 'Isabella Martinez', initials: 'IM', image: 'https://i.pravatar.cc/96?img=23' },
      { name: 'William Harris', initials: 'WH', image: 'https://i.pravatar.cc/96?img=15' },
      { name: 'Mia Thompson', initials: 'MT', image: 'https://i.pravatar.cc/96?img=48' },
    ],
  },
  {
    id: 'PRJ-006',
    owner: 'James Anderson',
    role: 'Backend Engineer',
    city: 'Medan',
    location: 'Office',
    project: 'james-anderson.example.com',
    status: 'On Hold',
    progress: 15,
    avatar: 'https://i.pravatar.cc/96?img=68',
    members: [
      { name: 'James Anderson', initials: 'JA', image: 'https://i.pravatar.cc/96?img=68' },
      { name: 'Sarah Chen', initials: 'SC', image: 'https://i.pravatar.cc/96?img=47' },
      { name: 'Daniel Moore', initials: 'DM', image: 'https://i.pravatar.cc/96?img=14' },
    ],
  },
  {
    id: 'PRJ-007',
    owner: 'Sophia Martin',
    role: 'Product Manager',
    city: 'Semarang',
    location: 'Remote',
    project: 'sophia-martin.example.com',
    status: 'Ongoing',
    progress: 48,
    avatar: 'https://i.pravatar.cc/96?img=44',
    members: [
      { name: 'Sophia Martin', initials: 'SM', image: 'https://i.pravatar.cc/96?img=44' },
      { name: 'Emily Davis', initials: 'ED', image: 'https://i.pravatar.cc/96?img=32' },
      { name: 'Olivia Taylor', initials: 'OT', image: 'https://i.pravatar.cc/96?img=5' },
      { name: 'James Anderson', initials: 'JA', image: 'https://i.pravatar.cc/96?img=68' },
    ],
  },
  {
    id: 'PRJ-008',
    owner: 'Daniel Moore',
    role: 'Platform Engineer',
    city: 'Jakarta',
    location: 'Office',
    project: 'daniel-moore.example.com',
    status: 'Verified',
    progress: 100,
    avatar: 'https://i.pravatar.cc/96?img=14',
    members: [
      { name: 'Daniel Moore', initials: 'DM', image: 'https://i.pravatar.cc/96?img=14' },
      { name: 'Michael Brown', initials: 'MB', image: 'https://i.pravatar.cc/96?img=12' },
      { name: 'David Wilson', initials: 'DW', image: 'https://i.pravatar.cc/96?img=11' },
      { name: 'Lucas Robinson', initials: 'LR', image: 'https://i.pravatar.cc/96?img=69' },
      { name: 'Ethan Garcia', initials: 'EG', image: 'https://i.pravatar.cc/96?img=13' },
    ],
  },
  {
    id: 'PRJ-009',
    owner: 'Ava Jackson',
    role: 'Growth Manager',
    city: 'Bali',
    location: 'Remote',
    project: 'ava-jackson.example.com',
    status: 'Ongoing',
    progress: 67,
    avatar: 'https://i.pravatar.cc/96?img=25',
    members: [
      { name: 'Ava Jackson', initials: 'AJ', image: 'https://i.pravatar.cc/96?img=25' },
      { name: 'Charlotte Lee', initials: 'CL', image: 'https://i.pravatar.cc/96?img=45' },
      { name: 'Isabella Martinez', initials: 'IM', image: 'https://i.pravatar.cc/96?img=23' },
    ],
  },
  {
    id: 'PRJ-010',
    owner: 'William Harris',
    role: 'QA Engineer',
    city: 'Malang',
    location: 'Office',
    project: 'william-harris.example.com',
    status: 'Rejected',
    progress: 100,
    avatar: 'https://i.pravatar.cc/96?img=15',
    members: [
      { name: 'William Harris', initials: 'WH', image: 'https://i.pravatar.cc/96?img=15' },
      { name: 'Sophia Martin', initials: 'SM', image: 'https://i.pravatar.cc/96?img=44' },
      { name: 'Ava Jackson', initials: 'AJ', image: 'https://i.pravatar.cc/96?img=25' },
    ],
  },
  {
    id: 'PRJ-011',
    owner: 'Mia Thompson',
    role: 'DevOps Engineer',
    city: 'Jakarta',
    location: 'Remote',
    project: 'mia-thompson.example.com',
    status: 'Ongoing',
    progress: 54,
    avatar: 'https://i.pravatar.cc/96?img=48',
    members: [
      { name: 'Mia Thompson', initials: 'MT', image: 'https://i.pravatar.cc/96?img=48' },
      { name: 'Daniel Moore', initials: 'DM', image: 'https://i.pravatar.cc/96?img=14' },
      { name: 'Ethan Garcia', initials: 'EG', image: 'https://i.pravatar.cc/96?img=13' },
      { name: 'Michael Brown', initials: 'MB', image: 'https://i.pravatar.cc/96?img=12' },
    ],
  },
  {
    id: 'PRJ-012',
    owner: 'Ethan Garcia',
    role: 'Mobile Engineer',
    city: 'Bandung',
    location: 'Office',
    project: 'ethan-garcia.example.com',
    status: 'On Hold',
    progress: 8,
    avatar: 'https://i.pravatar.cc/96?img=13',
    members: [
      { name: 'Ethan Garcia', initials: 'EG', image: 'https://i.pravatar.cc/96?img=13' },
      { name: 'Olivia Taylor', initials: 'OT', image: 'https://i.pravatar.cc/96?img=5' },
      { name: 'James Anderson', initials: 'JA', image: 'https://i.pravatar.cc/96?img=68' },
    ],
  },
  {
    id: 'PRJ-013',
    owner: 'Isabella Martinez',
    role: 'Security Engineer',
    city: 'Surabaya',
    location: 'Remote',
    project: 'isabella-martinez.example.com',
    status: 'Ongoing',
    progress: 76,
    avatar: 'https://i.pravatar.cc/96?img=23',
    members: [
      { name: 'Isabella Martinez', initials: 'IM', image: 'https://i.pravatar.cc/96?img=23' },
      { name: 'Lucas Robinson', initials: 'LR', image: 'https://i.pravatar.cc/96?img=69' },
      { name: 'Sarah Chen', initials: 'SC', image: 'https://i.pravatar.cc/96?img=47' },
      { name: 'David Wilson', initials: 'DW', image: 'https://i.pravatar.cc/96?img=11' },
    ],
  },
  {
    id: 'PRJ-014',
    owner: 'Lucas Robinson',
    role: 'Solutions Architect',
    city: 'Jakarta',
    location: 'Office',
    project: 'lucas-robinson.example.com',
    status: 'Verified',
    progress: 100,
    avatar: 'https://i.pravatar.cc/96?img=69',
    members: [
      { name: 'Lucas Robinson', initials: 'LR', image: 'https://i.pravatar.cc/96?img=69' },
      { name: 'William Harris', initials: 'WH', image: 'https://i.pravatar.cc/96?img=15' },
      { name: 'Mia Thompson', initials: 'MT', image: 'https://i.pravatar.cc/96?img=48' },
    ],
  },
  {
    id: 'PRJ-015',
    owner: 'Charlotte Lee',
    role: 'Program Manager',
    city: 'Yogyakarta',
    location: 'Remote',
    project: 'charlotte-lee.example.com',
    status: 'Ongoing',
    progress: 39,
    avatar: 'https://i.pravatar.cc/96?img=45',
    members: [
      { name: 'Charlotte Lee', initials: 'CL', image: 'https://i.pravatar.cc/96?img=45' },
      { name: 'Sophia Martin', initials: 'SM', image: 'https://i.pravatar.cc/96?img=44' },
      { name: 'Emily Davis', initials: 'ED', image: 'https://i.pravatar.cc/96?img=32' },
      { name: 'Ava Jackson', initials: 'AJ', image: 'https://i.pravatar.cc/96?img=25' },
      { name: 'Olivia Taylor', initials: 'OT', image: 'https://i.pravatar.cc/96?img=5' },
    ],
  },
]

type PaginationState = { pageIndex: number; pageSize: number }
type SortingState = Array<{ id: string; desc: boolean }>
type RowSelectionState = Record<string, boolean>
type VisibilityState = Record<string, boolean>
type ColumnFiltersState = Array<{ id: string; value: unknown }>

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`status status-${status.toLowerCase().replaceAll(' ', '-')}`}
    >
      <span className="status-dot" />
      {status}
    </span>
  )
}
function DeferredAvatar({
  src,
  initials,
  label,
  className = '',
}: {
  src?: string
  initials: string
  label: string
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={`avatar-image-shell ${loaded && !failed ? 'is-loaded' : ''} ${className}`}
      aria-label={label}
    >
      {!failed && src ? (
        <img
          src={src}
          alt=""
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
      <span className="avatar-fallback" aria-hidden="true">
        {initials}
      </span>
    </span>
  )
}

function AvatarStack({ people }: { people: Project['members'] }) {
  return (
    <div className="avatar-stack" aria-label={`${people.length} team members`}>
      {people.slice(0, 4).map((person) => (
        <DeferredAvatar
          key={person.name}
          src={person.image}
          initials={person.initials}
          label={person.name}
          className="avatar"
        />
      ))}
      {people.length > 4 ? (
        <span className="avatar avatar-more">+{people.length - 4}</span>
      ) : null}
    </div>
  )
}

function ProjectActions({
  row,
  onEdit,
  onDelete,
  onShare,
  onDuplicate,
}: {
  row: Project
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
  onDuplicate: () => void
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{
    top: number
    left: number
  } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const width = 184
    const height = 144
    const gutter = 10
    const preferredTop = rect.bottom + 6
    const top =
      preferredTop + height <= window.innerHeight - gutter
        ? preferredTop
        : Math.max(gutter, rect.top - height - 6)
    const left = Math.max(
      gutter,
      Math.min(window.innerWidth - width - gutter, rect.right - width),
    )

    setPosition({ top, left })
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    updatePosition()

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      triggerRef.current?.focus()
    }

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, updatePosition])

  const menu =
    open && position
      ? createPortal(
          <div
            ref={menuRef}
            className="row-action-menu row-action-menu-portal"
            role="menu"
            style={{ top: position.top, left: position.left }}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onDuplicate()
                setOpen(false)
              }}
            >
              Duplicate project
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onEdit()
                setOpen(false)
              }}
            >
              Edit details
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onShare()
                setOpen(false)
              }}
            >
              Copy project link
            </button>
          </div>,
          document.body,
        )
      : null

  return (
    <div className="row-actions-wrap">
      <div className="row-actions">
        <button type="button" aria-label={`Edit ${row.owner}`} onClick={onEdit}>
          <Pencil size={15} />
        </button>
        <button
          type="button"
          aria-label={`Delete ${row.owner}`}
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
        <button
          type="button"
          aria-label={`Share ${row.owner}`}
          onClick={onShare}
        >
          <Share2 size={15} />
        </button>
        <button
          ref={triggerRef}
          type="button"
          aria-label={`More actions for ${row.owner}`}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
        >
          <MoreHorizontal size={15} />
        </button>
      </div>
      {menu}
    </div>
  )
}

function ProjectModal({
  project,
  onClose,
  onSave,
}: {
  project: Project
  onClose: () => void
  onSave: (next: Project) => void
}) {
  const [draft, setDraft] = useState(project)
  return (
    <div
      className="demo-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose()
      }}
    >
      <section
        className="demo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
      >
        <div className="demo-modal-header">
          <div>
            <span className="kicker">EDIT PROJECT</span>
            <h3 id="edit-project-title">{project.owner}</h3>
          </div>
          <button
            type="button"
            className="demo-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>
        <label>
          Owner
          <input
            value={draft.owner}
            onChange={(event) =>
              setDraft({ ...draft, owner: event.target.value })
            }
          />
        </label>
        <label>
          Work location
          <select
            value={draft.location}
            onChange={(event) =>
              setDraft({
                ...draft,
                location: event.target.value as WorkLocation,
              })
            }
          >
            <option>Office</option>
            <option>Remote</option>
          </select>
        </label>
        <label>
          Status
          <select
            value={draft.status}
            onChange={(event) =>
              setDraft({
                ...draft,
                status: event.target.value as ProjectStatus,
              })
            }
          >
            <option>Verified</option>
            <option>Ongoing</option>
            <option>On Hold</option>
            <option>Rejected</option>
          </select>
        </label>
        <label>
          Progress
          <div className="range-control">
            <input
              type="range"
              min="0"
              max="100"
              value={draft.progress}
              onChange={(event) =>
                setDraft({ ...draft, progress: Number(event.target.value) })
              }
              aria-label="Project progress"
            />
            <output className="range-value">{draft.progress}%</output>
          </div>
        </label>
        <div className="demo-modal-footer">
          <button type="button" className="demo-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="demo-primary"
            onClick={() => onSave(draft)}
          >
            Save changes
          </button>
        </div>
      </section>
    </div>
  )
}

export function ProjectTableExample() {
  const [rows, setRows] = useState(projectData)
  const [selection, setSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [visibility, setVisibility] = useState<VisibilityState>({})
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>(
    'default',
  )
  const [editing, setEditing] = useState<Project | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const copyLink = useCallback(
    async (project: Project) => {
      const url = `https://${project.project}`
      try {
        await navigator.clipboard.writeText(url)
        notify('Project link copied')
      } catch {
        notify(url)
      }
    },
    [notify],
  )

  const columns = useMemo<DataTableColumn<Project>[]>(
    () => [
      {
        id: '__expander',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <span className="sr-only">Details</span>,
        cell: ({ row }) => <DataTable.ExpandButton row={row} />,
        size: 38,
        meta: {
          renderExpanded: (row: {
            original: {
              owner:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              role:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              city:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
              progress:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined
            }
          }) => (
            <div className="expanded-project">
              <strong>{row.original.owner}</strong>
              <span>
                {row.original.role} · {row.original.city} ·{' '}
                {row.original.progress}% complete
              </span>
            </div>
          ),
        },
      },
      {
        id: 'select',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <DataTable.SelectionHeader />,
        cell: ({ row }) => <DataTable.SelectionCell row={row} />,
        size: 48,
      },
      {
        accessorKey: 'owner',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="owner" label="Owner" />
            <DataTable.ColumnFilter columnId="owner" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="owner-cell">
            <DeferredAvatar
              src={row.original.avatar}
              initials={row.original.owner
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
              label={row.original.owner}
              className="owner-avatar"
            />
            <span>
              <strong>{row.original.owner}</strong>
              <small>{row.original.role}</small>
            </span>
          </div>
        ),
        size: 230,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'city',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="city" label="City" />
            <DataTable.ColumnFilter columnId="city" />
          </div>
        ),
        size: 125,
        filterFn: 'includesString',
      },
      {
        accessorKey: 'location',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="location" label="Work Location" />
            <DataTable.ColumnFilter columnId="location" />
          </div>
        ),
        cell: ({ row, getValue }) => (
          <select
            className="inline-select"
            value={getValue() as WorkLocation}
            onChange={(event) =>
              setRows((current) =>
                current.map((item) =>
                  item.id === row.original.id
                    ? { ...item, location: event.target.value as WorkLocation }
                    : item,
                ),
              )
            }
            aria-label={`Work location for ${row.original.owner}`}
          >
            <option>Office</option>
            <option>Remote</option>
          </select>
        ),
        size: 150,
        filterFn: 'arrIncludesSome',
      },
      {
        accessorKey: 'project',
        header: () => <span>Project Link</span>,
        cell: ({ getValue }) => (
          <a
            className="project-link"
            href={`https://${getValue() as string}`}
            target="_blank"
            rel="noreferrer"
          >
            {getValue() as string} <ExternalLink size={12} />
          </a>
        ),
        enableSorting: false,
        size: 180,
      },
      {
        accessorKey: 'status',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="status" label="Status" />
            <DataTable.ColumnFilter columnId="status" />
          </div>
        ),
        cell: ({ getValue }) => (
          <StatusBadge status={getValue() as ProjectStatus} />
        ),
        size: 130,
        filterFn: 'arrIncludesSome',
      },
      {
        accessorKey: 'progress',
        header: () => (
          <div className="header-with-filter">
            <DataTable.SortButton columnId="progress" label="Progress" />
            <DataTable.ColumnFilter columnId="progress" />
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="progress-cell">
            <span>
              <span style={{ width: `${getValue() as number}%` }} />
            </span>
            <strong>{getValue() as number}%</strong>
          </div>
        ),
        size: 130,
        filterFn: 'inNumberRange',
      },
      {
        accessorKey: 'members',
        header: () => <span>Team Members</span>,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ getValue }) => (
          <AvatarStack people={getValue() as Project['members']} />
        ),
        size: 170,
      },
      {
        id: 'actions',
        enableHiding: false,
        enableSorting: false,
        enableColumnFilter: false,
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <ProjectActions
            row={row.original}
            onEdit={() => setEditing(row.original)}
            onDelete={() => {
              setRows((current) =>
                current.filter((item) => item.id !== row.original.id),
              )
              setSelection((current) => {
                const next = { ...current }
                delete next[row.original.id]
                return next
              })
              notify(`${row.original.owner} removed`)
            }}
            onShare={() => void copyLink(row.original)}
            onDuplicate={() => {
              const copy = {
                ...row.original,
                id: `${row.original.id}-copy-${Date.now()}`,
                owner: `${row.original.owner} Copy`,
              }
              setRows((current) => [copy, ...current])
              notify('Project duplicated')
            }}
          />
        ),
        size: 150,
      },
    ],
    [copyLink, notify],
  )

  return (
    <>
      <style>{demoStyles}</style>
      <div className="demo-table-shell">
      <DataTable.Root<Project>
        data={rows}
        columns={columns}
        enableRowSelection
        enableExpanding
        getRowCanExpand={() => true}
        enableColumnResizing
        state={{
          rowSelection: selection,
          sorting,
          columnFilters,
          globalFilter,
          pagination,
          columnVisibility: visibility,
        }}
        onRowSelectionChange={setSelection}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        onPaginationChange={setPagination}
        onColumnVisibilityChange={setVisibility}
        initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        meta={{ density, setDensity }}
      >
        <DataTable.Fullscreen>
          <DataTable.Header>
            <DataTable.Toolbar>
              <div className="toolbar-primary">
                <DataTable.Search placeholder="Search owners, cities, projects…" />
                <DataTable.RowCount />
              </div>
              <DataTable.Actions>
                <DataTable.FacetedFilter columnId="status" label="Status" />
                <DataTable.FacetedFilter columnId="location" label="Location" />
                <DataTable.ClearFilters />
                <DataTable.ExportCsv filename="coconut-projects.csv" />
                <DataTable.ViewOptions />
                <DataTable.Density />
                <DataTable.TableOptions />
                <DataTable.FullscreenButton label="Full screen" />
                <DataTable.Reset />
              </DataTable.Actions>
            </DataTable.Toolbar>
            <DataTable.FilterRow />
            <DataTable.BulkActions />
          </DataTable.Header>
          <DataTable.Table striped stickyHeader density={density} />
          <DataTable.Footer>
            <DataTable.Pagination pageSizeOptions={[10, 20, 50]} />
          </DataTable.Footer>
        </DataTable.Fullscreen>
      </DataTable.Root>
      {editing ? (
        <ProjectModal
          project={editing}
          onClose={() => setEditing(null)}
          onSave={(next) => {
            setRows((current) =>
              current.map((item) => (item.id === next.id ? next : item)),
            )
            setEditing(null)
            notify('Project updated')
          }}
        />
      ) : null}
      {toast ? (
        <div className="demo-toast" role="status">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      ) : null}
      </div>
    </>
  )
}
```

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
