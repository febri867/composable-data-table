import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableRowCountProps = {
  className?: string
  label?: string
}

export function RowCount({
  className,
  label = 'rows',
}: DataTableRowCountProps) {
  const { table } = useDataTable()
  const count = table.options.manualPagination
    ? (table.getRowCount() ?? table.getCoreRowModel().rows.length)
    : table.getFilteredRowModel().rows.length

  return (
    <span className={cn('dt-row-count', className)}>
      {count.toLocaleString()} {label}
    </span>
  )
}
