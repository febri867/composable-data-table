import * as React from 'react'
import type { Row, RowData } from '@tanstack/react-table'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableExpandButtonProps<TData extends RowData> = {
  row: Row<TData>
  className?: string
  label?: string
}

export function ExpandButton<TData extends RowData>({
  row,
  className,
  label = 'Toggle row details',
}: DataTableExpandButtonProps<TData>) {
  if (!row.getCanExpand()) return null

  const expanded = row.getIsExpanded()

  return (
    <button
      className={cn('dt-icon-button', className)}
      type="button"
      onClick={row.getToggleExpandedHandler()}
      aria-expanded={expanded}
      aria-label={label}
    >
      {expanded ? '−' : '+'}
    </button>
  )
}

export type DataTableSelectionCellProps<TData extends RowData> = {
  row: Row<TData>
}

export function SelectionCell<TData extends RowData>({
  row,
}: DataTableSelectionCellProps<TData>) {
  return (
    <input
      className="dt-checkbox"
      type="checkbox"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onChange={(event) => row.toggleSelected(event.target.checked)}
      aria-label={`Select row ${row.id}`}
    />
  )
}

export type DataTableSelectionHeaderProps = { className?: string }

export function SelectionHeader({ className }: DataTableSelectionHeaderProps) {
  const { table } = useDataTable()
  const checked = table.getIsAllPageRowsSelected()
  const indeterminate = table.getIsSomePageRowsSelected()

  return (
    <input
      className={cn('dt-checkbox', className)}
      type="checkbox"
      checked={checked}
      ref={(node) => {
        if (node) node.indeterminate = indeterminate
      }}
      onChange={(event) =>
        table.toggleAllPageRowsSelected(event.target.checked)
      }
      aria-label={checked ? 'Deselect all rows' : 'Select all rows'}
    />
  )
}

export type DataTableBulkActionsProps = React.ComponentProps<'div'>

export function BulkActions({
  className,
  ...props
}: DataTableBulkActionsProps) {
  const { table } = useDataTable()
  const count = table.getFilteredSelectedRowModel().rows.length

  if (!count) return null

  return (
    <div className={cn('dt-bulk', className)} {...props}>
      <strong>{count}</strong> selected
    </div>
  )
}
