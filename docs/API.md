# API Reference

The package public surface is exported from `src/index.ts`. Demo data and application-specific screens are deliberately not exported.

## `DataTable.Root<TData>`

Creates one TanStack Table instance and provides it to every descendant primitive. State can be partially controlled: only the slices your application needs to own must be supplied.

```tsx
const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 25,
})

<DataTable.Root
  data={users}
  columns={columns}
  state={{ sorting, pagination }}
  onSortingChange={setSorting}
  onPaginationChange={setPagination}
>
  ...
</DataTable.Root>
```

Important props:

- `data`, `columns` — required TanStack data model.
- `state`, `on*Change` — optional controlled slices.
- `manualSorting`, `manualFiltering`, `manualPagination` — delegate data operations to the consumer.
- `rowCount`, `pageCount` — server-side pagination metadata.
- `enableRowSelection`, `enableExpanding`, `enableColumnResizing`, `enableColumnPinning` — feature switches.
- `globalFilterFn`, `filterFns` — custom TanStack filter functions.
- `getRowId`, `getSubRows`, `getRowCanExpand` — identity and hierarchy hooks.

## `DataTable.Table`

Presentation-focused semantic renderer.

```tsx
<DataTable.Table
  caption="Users"
  loading={isLoading}
  empty={<DataTable.Empty>No users found.</DataTable.Empty>}
  stickyHeader
  striped
  density="comfortable"
/>
```

It renders native `table`, `thead`, `tbody`, `th`, and `td` semantics and uses the row model from the shared table instance.

## Search and filtering

```tsx
<DataTable.Search placeholder="Search all users…" />
<DataTable.Search columnId="name" />
<DataTable.Filter columnId="status" />
<DataTable.ColumnFilter columnId="status" label="Filter" />
<DataTable.FacetedFilter columnId="status" label="Status" />
<DataTable.FilterRow />
<DataTable.ClearFilters />
```

`ColumnFilter` is intended for sortable/filterable table headers. It opens a small popover, updates the target column filter, exposes a clear action, and provides a pinning action when the column supports pinning.

Filtering and global search reset client-side pagination to page one. This avoids empty pages after narrowing a result set.

### Multi-value facets

A faceted control can store multiple selected values. The consuming column should define a filter function that understands the array:

```tsx
const multiSelect: FilterFn<User> = (row, columnId, value) =>
  (value as string[]).includes(String(row.getValue(columnId)))

columnHelper.accessor('status', {
  header: 'Status',
  filterFn: multiSelect,
})
```

## Sorting

```tsx
<DataTable.SortButton columnId="name" label="Name" />
```

Hold `Shift` while activating a sort button to add/remove a secondary sort. The component exposes `aria-pressed` and the table renderer exposes `aria-sort`.

## Pagination

```tsx
<DataTable.Pagination
  pageSizeOptions={[10, 25, 50]}
  showPageNumbers
  siblingCount={1}
/>
```

### Server pagination

```tsx
<DataTable.Root
  data={query.data.rows}
  columns={columns}
  state={{ pagination }}
  onPaginationChange={setPagination}
  manualPagination
  rowCount={query.data.total}
>
  <DataTable.Table loading={query.isFetching} />
  <DataTable.Pagination />
</DataTable.Root>
```

The library does not fetch or cache. The application owns query parameters, requests, errors, retries, and caching.

## Infinite scroll

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

`InfiniteScroll` only observes a sentinel using `IntersectionObserver`. It does not own cursors or merge arrays.

## Selection

```tsx
helper.display({
  id: 'select',
  header: () => <DataTable.SelectionHeader />,
  cell: ({ row }) => <DataTable.SelectionCell row={row} />,
})

<DataTable.BulkActions />
```

## Visibility, pinning, and sizing

```tsx
<DataTable.ViewOptions />
<DataTable.ColumnVisibility />
<DataTable.Pinning columnId="name" />
<DataTable.ResizeHandle columnId="name" />
<DataTable.TableOptions />
```

Resizable columns automatically render a resize handle when resizing is enabled. `Pinning` is also available inside `ColumnFilter` popovers.

## Expansion and density

```tsx
<DataTable.ExpandButton row={row} />
<DataTable.Density />
```

`Density` expects the application to provide `meta={{ density, setDensity }}` if it should control application-level density state.

## State primitives

```tsx
<DataTable.Empty>No results.</DataTable.Empty>
<DataTable.Loading label="Loading users…" />
<DataTable.Caption>Last updated just now.</DataTable.Caption>
```

## CSV export

```tsx
<DataTable.ExportCsv
  filename="users.csv"
  getRows={() => selectedUsers}
/>
```

This is intentionally a small client-side primitive. Large exports should normally be generated server-side.

## Custom controls

Use the hook when a product needs a control that is not generic enough for the library:

```tsx
function ResetSort() {
  const { table } = useDataTable<User>()
  return <button onClick={() => table.resetSorting()}>Reset sort</button>
}
```

Run `npm run docs:api` for generated TypeDoc from public TSDoc annotations.

## Fullscreen surface

`Fullscreen` groups the table UI into a viewport-sized surface without taking ownership of table state. It prefers the browser Fullscreen API and falls back to a fixed viewport surface.

```tsx
<DataTable.Root data={rows} columns={columns}>
  <DataTable.Fullscreen>
    <DataTable.Header>
      <DataTable.Toolbar>
        <DataTable.Search />
        <DataTable.Actions>
          <DataTable.FullscreenButton />
        </DataTable.Actions>
      </DataTable.Toolbar>
    </DataTable.Header>
    <DataTable.Table stickyHeader />
    <DataTable.Footer>
      <DataTable.Pagination />
    </DataTable.Footer>
  </DataTable.Fullscreen>
</DataTable.Root>
```

The fullscreen primitive does not change filtering, sorting, pagination, selection, or data fetching behavior. Press `Escape` to exit native fullscreen; the fallback surface also supports `Escape`.

## Reference images and performance

Images in the reference application are deliberately not part of the library. The demo uses local SVG fixtures with explicit dimensions, `loading="lazy"`, `decoding="async"`, and `fetchPriority="low"`. Initials are rendered immediately and remain visible until an image has loaded. This keeps media off the critical rendering path and avoids third-party image requests.
