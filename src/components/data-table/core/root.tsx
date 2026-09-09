import * as React from 'react'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type FilterFn,
  type ColumnFiltersState,
  type ExpandedState,
  type GroupingState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type VisibilityState,
  type ColumnPinningState,
  type ColumnOrderState,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/cn'
import { DataTableContext, resolveUpdater } from './context'

export type DataTableInitialState = Partial<Omit<TableState, 'pagination'>> & {
  pagination?: Partial<PaginationState>
}

export type DataTableRootProps<TData extends RowData> = {
  data: TData[]
  // TanStack's TValue parameter is intentionally bivariant/invariant; a table can
  // contain heterogeneous accessor value types, so the public boundary uses any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  children: React.ReactNode
  className?: string
  initialState?: DataTableInitialState
  state?: Partial<TableState>
  onSortingChange?: OnChangeFn<SortingState>
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  onColumnVisibilityChange?: OnChangeFn<VisibilityState>
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  onPaginationChange?: OnChangeFn<PaginationState>
  onGlobalFilterChange?: OnChangeFn<string>
  onExpandedChange?: OnChangeFn<ExpandedState>
  onGroupingChange?: OnChangeFn<GroupingState>
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  manualGrouping?: boolean
  manualExpanding?: boolean
  pageCount?: number
  rowCount?: number
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
  enableExpanding?: boolean | ((row: Row<TData>) => boolean)
  getSubRows?: TableOptions<TData>['getSubRows']
  getRowCanExpand?: TableOptions<TData>['getRowCanExpand']
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  meta?: TableOptions<TData>['meta']
  globalFilterFn?: TableOptions<TData>['globalFilterFn']
  filterFns?: TableOptions<TData>['filterFns']
  enableColumnResizing?: boolean
  enableColumnPinning?: boolean
  columnResizeMode?: 'onChange' | 'onEnd'
}

/**
 * Creates the table instance and owns the library's internal state.
 *
 * Controlled values supplied through `state` always win over internal state.
 * Consumers can progressively opt into controlled state without changing the
 * composition API.
 *
 * @public
 */
export function Root<TData extends RowData>({
  data,
  columns,
  children,
  className,
  initialState,
  state: controlledState,
  onSortingChange,
  onColumnFiltersChange,
  onColumnVisibilityChange,
  onRowSelectionChange,
  onPaginationChange,
  onGlobalFilterChange,
  onExpandedChange,
  onGroupingChange,
  onColumnPinningChange,
  onColumnOrderChange,
  manualPagination,
  manualSorting,
  manualFiltering,
  manualGrouping,
  manualExpanding,
  pageCount,
  rowCount,
  enableRowSelection,
  enableMultiRowSelection,
  enableSubRowSelection,
  enableExpanding,
  getSubRows,
  getRowCanExpand,
  getRowId,
  meta,
  globalFilterFn,
  filterFns,
  enableColumnResizing = false,
  enableColumnPinning = true,
  columnResizeMode = 'onChange',
}: DataTableRootProps<TData>) {
  const initialPagination = React.useMemo<PaginationState>(
    () => ({
      pageIndex: initialState?.pagination?.pageIndex ?? 0,
      pageSize: initialState?.pagination?.pageSize ?? 10,
    }),
    [initialState?.pagination?.pageIndex, initialState?.pagination?.pageSize],
  )

  const [internalState, setInternalState] = React.useState<Partial<TableState>>(
    () => ({
      sorting: initialState?.sorting ?? [],
      columnFilters: initialState?.columnFilters ?? [],
      columnVisibility: initialState?.columnVisibility ?? {},
      rowSelection: initialState?.rowSelection ?? {},
      pagination: initialPagination,
      globalFilter: initialState?.globalFilter ?? '',
      expanded: initialState?.expanded ?? {},
      grouping: initialState?.grouping ?? [],
      columnPinning: initialState?.columnPinning ?? {},
      columnOrder: initialState?.columnOrder ?? [],
    }),
  )

  const updateStateSlice = React.useCallback(
    <K extends keyof TableState>(
      key: K,
      updater: TableState[K] | ((old: TableState[K]) => TableState[K]),
    ) => {
      setInternalState((current) => {
        const currentValue = current[key] as TableState[K]
        const nextValue = resolveUpdater(updater, currentValue)

        // Filtering and pagination are coupled for an uncontrolled table.
        // Apply the page reset in the same state transition so consumers never
        // render a filtered result with the previous page metadata.
        if (key === 'globalFilter' || key === 'columnFilters') {
          const pagination = current.pagination ?? initialPagination
          return {
            ...current,
            [key]: nextValue,
            pagination: { ...pagination, pageIndex: 0 },
          }
        }

        return { ...current, [key]: nextValue }
      })
    },
    [initialPagination],
  )

  const makeChangeHandler = React.useCallback(
    <K extends keyof TableState>(
      key: K,
      callback: OnChangeFn<TableState[K]> | undefined,
    ): OnChangeFn<TableState[K]> => {
      const controlled = controlledState?.[key] !== undefined

      return (updater) => {
        if (!controlled) updateStateSlice(key, updater)
        callback?.(updater)
      }
    },
    [controlledState, updateStateSlice],
  )

  const changeHandlers = React.useMemo<Partial<TableOptions<TData>>>(
    () => ({
      onSortingChange: makeChangeHandler('sorting', onSortingChange),
      onColumnFiltersChange: makeChangeHandler(
        'columnFilters',
        onColumnFiltersChange,
      ),
      onColumnVisibilityChange: makeChangeHandler(
        'columnVisibility',
        onColumnVisibilityChange,
      ),
      onRowSelectionChange: makeChangeHandler(
        'rowSelection',
        onRowSelectionChange,
      ),
      onPaginationChange: makeChangeHandler('pagination', onPaginationChange),
      onGlobalFilterChange: makeChangeHandler(
        'globalFilter',
        onGlobalFilterChange,
      ),
      onExpandedChange: makeChangeHandler('expanded', onExpandedChange),
      onGroupingChange: makeChangeHandler('grouping', onGroupingChange),
      onColumnPinningChange: makeChangeHandler(
        'columnPinning',
        onColumnPinningChange,
      ),
      onColumnOrderChange: makeChangeHandler(
        'columnOrder',
        onColumnOrderChange,
      ),
    }),
    [
      makeChangeHandler,
      onColumnFiltersChange,
      onColumnOrderChange,
      onColumnPinningChange,
      onColumnVisibilityChange,
      onExpandedChange,
      onGlobalFilterChange,
      onGroupingChange,
      onPaginationChange,
      onRowSelectionChange,
      onSortingChange,
    ],
  )

  const effectiveState = React.useMemo(
    () => ({ ...internalState, ...controlledState }),
    [controlledState, internalState],
  )

  const scalarAwareArrIncludesSome: FilterFn<TData> = React.useCallback(
    (row, columnId, filterValue) => {
      const values = Array.isArray(filterValue) ? filterValue : [filterValue]
      const cellValue = row.getValue(columnId)

      if (Array.isArray(cellValue)) {
        return cellValue.some((value) => values.includes(value))
      }

      return values.includes(cellValue)
    },
    [],
  )

  const resolvedEnableExpanding =
    typeof enableExpanding === 'function' ? true : enableExpanding
  const resolvedGetRowCanExpand =
    getRowCanExpand ??
    (typeof enableExpanding === 'function' ? enableExpanding : undefined)

  const table = useReactTable<TData>({
    data,
    columns,
    initialState: { ...initialState, pagination: initialPagination },
    state: effectiveState,
    ...changeHandlers,
    meta,
    getRowId,
    enableRowSelection,
    enableMultiRowSelection,
    enableSubRowSelection,
    enableExpanding: resolvedEnableExpanding,
    getSubRows,
    getRowCanExpand: resolvedGetRowCanExpand,
    enableColumnResizing,
    enableColumnPinning,
    columnResizeMode,
    autoResetPageIndex: false,
    manualPagination,
    manualSorting,
    manualFiltering,
    manualGrouping,
    manualExpanding,
    pageCount,
    rowCount,
    filterFns: { arrIncludesSome: scalarAwareArrIncludesSome, ...filterFns },
    globalFilterFn: globalFilterFn ?? 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualSorting ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualFiltering ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getExpandedRowModel: manualExpanding ? undefined : getExpandedRowModel(),
    getGroupedRowModel: manualGrouping ? undefined : getGroupedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  /* eslint-disable react-hooks/exhaustive-deps */
  const contextValue = React.useMemo(
    () =>
      ({ table, getRowId }) as unknown as React.ContextType<
        typeof DataTableContext
      >,
    [table, getRowId, effectiveState],
  )

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={cn('dt-root', className)} data-slot="data-table">
        {children}
      </div>
    </DataTableContext.Provider>
  )
}
