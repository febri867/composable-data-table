const apiExamples: Array<[string, string]> = [
  [
    'Root',
    `<DataTable.Root data={data} columns={columns}>
  {/* composable children */}
</DataTable.Root>`,
  ],
  [
    'Header',
    `<DataTable.Root data={data} columns={columns}>
  <DataTable.Header>
    <DataTable.Toolbar>Toolbar content</DataTable.Toolbar>
  </DataTable.Header>
  <DataTable.Table />
</DataTable.Root>`,
  ],
  [
    'Toolbar / Actions',
    `<DataTable.Toolbar>
  <DataTable.Search />
  <DataTable.Actions>
    <DataTable.ClearFilters />
    <DataTable.ViewOptions />
  </DataTable.Actions>
</DataTable.Toolbar>`,
  ],
  [
    'Table',
    `<DataTable.Table
  caption="Projects"
  stickyHeader
  striped
  density="comfortable"
  loading={isLoading}
  empty="No projects found."
/>`,
  ],
  [
    'Search',
    `<DataTable.Search
  placeholder="Search projects…"
  debounceMs={180}
/>

// Search a single column instead:
<DataTable.Search columnId="owner" />`,
  ],
  ['Filter', `<DataTable.Filter columnId="city" placeholder="Filter city…" />`],
  [
    'ColumnFilter',
    `<DataTable.ColumnFilter
  columnId="status"
  label="Status"
  placeholder="Filter status…"
/>`,
  ],
  ['FilterRow', `<DataTable.FilterRow />`],
  [
    'FacetedFilter',
    `<DataTable.FacetedFilter
  columnId="status"
  label="Status"
/>`,
  ],
  ['ClearFilters', `<DataTable.ClearFilters label="Reset filters" />`],
  [
    'SortButton',
    `<DataTable.SortButton
  columnId="owner"
  label="Owner"
/>

// Hold Shift to multi-sort.`,
  ],
  [
    'Pagination',
    `<DataTable.Footer>
  <DataTable.Pagination
    pageSizeOptions={[10, 25, 50, 100]}
    siblingCount={1}
  />
</DataTable.Footer>`,
  ],
  [
    'InfiniteScroll',
    `<DataTable.InfiniteScroll
  hasMore={hasNextPage}
  loading={isFetchingNextPage}
  onLoadMore={fetchNextPage}
  rootMargin="400px"
/>`,
  ],
  [
    'Selection',
    `<DataTable.SelectionHeader />

// inside a selection column:
<DataTable.SelectionCell row={row} />
<DataTable.BulkActions />`,
  ],
  [
    'ViewOptions / ColumnVisibility',
    `<DataTable.ViewOptions label="Columns" />

// Or render the primitive directly:
<DataTable.ColumnVisibility label="Visible columns" />`,
  ],
  [
    'Pinning',
    `<DataTable.Pinning columnId="owner" />

// Programmatic control:
const { table } = useDataTable<Project>()
table.getColumn('owner')?.pin('left')`,
  ],
  [
    'ResizeHandle',
    `<DataTable.ResizeHandle columnId="owner" />

// Usually the Table renderer places resize handles automatically
// when column resizing is enabled.`,
  ],
  [
    'ExpandButton',
    `<DataTable.ExpandButton row={row} />

<DataTable.Root
  data={data}
  columns={columns}
  enableExpanding
  getRowCanExpand={() => true}
>`,
  ],
  [
    'ExportCsv',
    `<DataTable.ExportCsv
  filename="projects.csv"
  label="Export CSV"
/>`,
  ],
  [
    'Density',
    `<DataTable.Density />

// Provide density state through table meta:
meta={{ density, setDensity }}`,
  ],
  ['TableOptions', `<DataTable.TableOptions />`],
  ['Reset', `<DataTable.Reset label="Reset table" />`],
  [
    'Caption / Empty / Loading',
    `<DataTable.Caption>Project directory</DataTable.Caption>
<DataTable.Empty>No matching projects.</DataTable.Empty>
<DataTable.Loading label="Loading projects…" />`,
  ],
  [
    'Footer',
    `<DataTable.Footer>
  <DataTable.Pagination />
</DataTable.Footer>`,
  ],
  [
    'useDataTable',
    `function ExportSelected() {
  const { table } = useDataTable<Project>()
  const rows = table.getSelectedRowModel().rows
  return <button disabled={!rows.length}>Export selected</button>
}`,
  ],
]

export { apiExamples }
