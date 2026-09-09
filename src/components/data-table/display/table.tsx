import * as React from 'react'
import {
  flexRender,
  type Column,
  type Row,
  type RowData,
} from '@tanstack/react-table'
import { cn } from '@/lib/cn'
import { getColumnLabel, useDataTable } from '../core/context'

export type DataTableResizeHandleProps = {
  columnId: string
  className?: string
}

type RuntimeResizableColumn = Column<RowData, unknown> & {
  getResizeHandler?: () => (
    event: globalThis.MouseEvent | globalThis.TouchEvent,
  ) => void
}

export function ResizeHandle({
  columnId,
  className,
}: DataTableResizeHandleProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  if (!column) return null

  const canResize =
    typeof column.getCanResize === 'function' && column.getCanResize()
  if (!canResize) return null

  const resizable = column as unknown as RuntimeResizableColumn
  const getResizeHandler = resizable.getResizeHandler
  if (typeof getResizeHandler !== 'function') return null

  let resizeHandler: ReturnType<
    NonNullable<RuntimeResizableColumn['getResizeHandler']>
  >

  try {
    resizeHandler = getResizeHandler()
  } catch {
    return null
  }

  return (
    <button
      type="button"
      aria-label={`Resize ${getColumnLabel(column)}`}
      className={cn('dt-resize-handle', className)}
      onMouseDown={(event) => resizeHandler(event.nativeEvent)}
      onTouchStart={(event) => resizeHandler(event.nativeEvent)}
    />
  )
}

export type DataTableTableProps = React.ComponentProps<'div'> & {
  empty?: React.ReactNode
  loading?: boolean
  loadingRows?: number
  caption?: React.ReactNode
  stickyHeader?: boolean
  striped?: boolean
  density?: 'compact' | 'default' | 'comfortable'
}

export function Table({
  className,
  empty = 'No results found.',
  loading = false,
  loadingRows = 6,
  caption,
  stickyHeader = false,
  striped = false,
  density = 'default',
  ...props
}: DataTableTableProps) {
  const { table } = useDataTable()
  const rows = table.getRowModel().rows
  const columns = table.getVisibleLeafColumns()

  return (
    <div
      className={cn(
        'dt-table-wrap',
        className,
        `dt-density-${density}`,
        striped && 'dt-striped',
      )}
      {...props}
    >
      <div
        className={cn('dt-scroll', stickyHeader && 'dt-sticky-header')}
        tabIndex={0}
        aria-label="Scrollable data table"
        aria-busy={loading}
      >
        <table className="dt-table">
          {caption ? <caption className="dt-caption">{caption}</caption> : null}
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sort = header.column.getIsSorted()
                  const canResize =
                    typeof header.column.getCanResize === 'function' &&
                    header.column.getCanResize()

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      aria-sort={
                        sort === 'asc'
                          ? 'ascending'
                          : sort === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                      style={{
                        width: header.getSize(),
                        ...getPinningStyles(header.column),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canResize ? (
                            <ResizeHandle columnId={header.column.id} />
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: loadingRows }, (_, index) => (
                <tr key={`loading-${index}`} aria-hidden="true">
                  {columns.map((column) => (
                    <td key={column.id}>
                      <span className="dt-skeleton" />
                    </td>
                  ))}
                </tr>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr data-state={row.getIsSelected() ? 'selected' : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={getPinningStyles(cell.column)}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() ? (
                    <tr className="dt-expanded-row">
                      <td colSpan={row.getVisibleCells().length}>
                        {renderExpandedRow(row)}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="dt-empty">{empty}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderExpandedRow<TData extends RowData>(row: Row<TData>) {
  const renderer = row
    .getAllCells()
    .find((cell) => cell.column.id === '__expander')?.column.columnDef.meta as
    | {
        renderExpanded?: (row: Row<TData>) => React.ReactNode
      }
    | undefined

  return renderer?.renderExpanded ? renderer.renderExpanded(row) : null
}

export function getPinningStyles<TData extends RowData>(
  column: Column<TData, unknown>,
): React.CSSProperties {
  const pinned = column.getIsPinned()
  const isLastLeft = pinned === 'left' && column.getIsLastColumn('left')
  const isFirstRight = pinned === 'right' && column.getIsFirstColumn('right')

  return {
    position: pinned ? 'sticky' : undefined,
    left: pinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: pinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex: pinned ? 2 : undefined,
    boxShadow: isLastLeft
      ? '4px 0 8px -7px rgba(15,23,42,.4)'
      : isFirstRight
        ? '-4px 0 8px -7px rgba(15,23,42,.4)'
        : undefined,
    background: pinned ? 'var(--dt-surface, #fff)' : undefined,
  }
}
