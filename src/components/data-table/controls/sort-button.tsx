import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

export type DataTableSortButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    columnId: string
    label: ReactNode
  }

export function SortButton({
  columnId,
  label,
  className,
  onClick,
  ...props
}: DataTableSortButtonProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  const sort = column?.getIsSorted()

  if (!column) return null

  return (
    <button
      {...props}
      type="button"
      className={cn('dt-sort-button', className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented && column.getCanSort()) {
          column.toggleSorting(sort === 'asc', event.shiftKey)
        }
      }}
      aria-label={`Sort by ${typeof label === 'string' ? label : columnId}`}
      aria-pressed={Boolean(sort)}
    >
      {label}
      <span className="dt-sort-indicator" aria-hidden="true">
        {sort === 'asc' ? '↑' : sort === 'desc' ? '↓' : '↕'}
      </span>
    </button>
  )
}
