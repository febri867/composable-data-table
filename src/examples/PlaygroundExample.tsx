import { useMemo, useState } from 'react'
import {
  createColumnHelper,
  type ColumnDef,
  type FilterFn,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { DataTable } from '@/components/data-table'
import { playgroundData, type PlaygroundUser } from './data'

const helper = createColumnHelper<PlaygroundUser>()
const multiSelect: FilterFn<PlaygroundUser> = (row, columnId, value) => {
  const values = Array.isArray(value) ? value.map(String) : [String(value)]
  return values.includes(String(row.getValue(columnId)))
}
const globalSearch: FilterFn<PlaygroundUser> = (row, _id, value) => {
  const query = String(value ?? '')
    .trim()
    .toLowerCase()
  if (!query) return true
  return Object.values(row.original).join(' ').toLowerCase().includes(query)
}

const columns: ColumnDef<PlaygroundUser, any>[] = [
  helper.display({
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
    header: () => <DataTable.SelectionHeader />,
    cell: ({ row }) => <DataTable.SelectionCell row={row} />,
    size: 46,
  }),
  helper.accessor('id', {
    header: () => (
      <div className="header-with-filter">
        <DataTable.SortButton columnId="id" label="ID" />
        <DataTable.ColumnFilter columnId="id" />
      </div>
    ),
    size: 105,
    filterFn: 'includesString',
  }),
  helper.accessor('name', {
    header: () => (
      <div className="header-with-filter">
        <DataTable.SortButton columnId="name" label="Name" />
        <DataTable.ColumnFilter columnId="name" />
      </div>
    ),
    size: 180,
    filterFn: 'includesString',
  }),
  helper.accessor('email', {
    header: () => (
      <div className="header-with-filter">
        <DataTable.SortButton columnId="email" label="Email" />
        <DataTable.ColumnFilter columnId="email" />
      </div>
    ),
    size: 250,
    filterFn: 'includesString',
  }),
  helper.accessor('role', {
    header: () => <DataTable.SortButton columnId="role" label="Role" />,
    size: 125,
    filterFn: multiSelect,
  }),
  helper.accessor('status', {
    header: () => <DataTable.SortButton columnId="status" label="Status" />,
    size: 125,
    filterFn: multiSelect,
  }),
  helper.accessor('team', {
    header: () => <DataTable.SortButton columnId="team" label="Team" />,
    size: 125,
    filterFn: multiSelect,
  }),
  helper.accessor('score', {
    header: () => <DataTable.SortButton columnId="score" label="Score" />,
    size: 100,
    filterFn: 'inNumberRange',
  }),
]

export function PlaygroundExample() {
  const [selection, setSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [visibility, setVisibility] = useState<VisibilityState>({})
  const [density, setDensity] = useState<'compact' | 'default' | 'comfortable'>(
    'default',
  )
  const [mode, setMode] = useState<'pagination' | 'infinite'>('pagination')
  const [loadedCount, setLoadedCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const infiniteData = useMemo(
    () => playgroundData.slice(0, loadedCount),
    [loadedCount],
  )
  const data = mode === 'pagination' ? playgroundData : infiniteData
  const hasMore = loadedCount < playgroundData.length

  const loadMore = async () => {
    if (!hasMore || loading) return
    setLoading(true)
    await new Promise((resolve) => window.setTimeout(resolve, 450))
    setLoadedCount((current) => Math.min(current + 20, playgroundData.length))
    setLoading(false)
  }
  const switchMode = (next: 'pagination' | 'infinite') => {
    setMode(next)
    setPagination({ pageIndex: 0, pageSize: 10 })
    setLoadedCount(20)
    setSelection({})
    setColumnFilters([])
    setGlobalFilter('')
    setSorting([])
  }

  return (
    <div className="playground-shell">
      <div className="playground-toolbar">
        <div className="playground-toolbar-left">
          <button
            type="button"
            className={`docs-tab ${mode === 'pagination' ? 'is-active' : ''}`}
            onClick={() => switchMode('pagination')}
          >
            Pagination
          </button>
          <button
            type="button"
            className={`docs-tab ${mode === 'infinite' ? 'is-active' : ''}`}
            onClick={() => switchMode('infinite')}
          >
            Infinite scroll
          </button>
        </div>
        <label className="docs-control">
          Density
          <select
            value={density}
            onChange={(event) =>
              setDensity(event.target.value as typeof density)
            }
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
      </div>
      <DataTable.Root<PlaygroundUser>
        data={data}
        columns={columns}
        enableRowSelection
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
        manualPagination={mode === 'infinite'}
        rowCount={mode === 'infinite' ? loadedCount : undefined}
        globalFilterFn={globalSearch}
        meta={{ density, setDensity }}
      >
        <DataTable.Header>
          <DataTable.Toolbar>
            <div className="toolbar-primary">
              <DataTable.Search placeholder="Search all columns…" />
              <DataTable.RowCount />
            </div>
            <DataTable.Actions>
              <DataTable.FacetedFilter columnId="status" label="Status" />
              <DataTable.FacetedFilter columnId="role" label="Role" />
              <DataTable.FacetedFilter columnId="team" label="Team" />
              <DataTable.ClearFilters />
              <DataTable.ExportCsv filename="users.csv" />
              <DataTable.ViewOptions />
              <DataTable.Density />
              <DataTable.Reset />
            </DataTable.Actions>
          </DataTable.Toolbar>
          <DataTable.FilterRow />
          <DataTable.BulkActions />
        </DataTable.Header>
        <DataTable.Table
          density={density}
          stickyHeader
          striped
          empty="No users match the current filters."
        />
        {mode === 'pagination' ? (
          <DataTable.Footer>
            <DataTable.Pagination pageSizeOptions={[10, 20, 50]} />
          </DataTable.Footer>
        ) : (
          <DataTable.InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />
        )}
      </DataTable.Root>
      <div className="playground-statusbar">
        <span>
          <strong>{playgroundData.length}</strong> rows in source
        </span>
        <span>
          {mode === 'infinite'
            ? `${loadedCount} / ${playgroundData.length} loaded`
            : `${pagination.pageIndex + 1} / ${Math.max(1, Math.ceil(playgroundData.length / pagination.pageSize))} pages`}
        </span>
        <span>
          Search, filter, sort, select, hide columns, export and navigate pages.
        </span>
      </div>
    </div>
  )
}
