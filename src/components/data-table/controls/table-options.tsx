import { ArrowDown, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableResetProps = {
  className?: string
  label?: string
}

export function Reset({ className, label = 'Reset' }: DataTableResetProps) {
  const { table } = useDataTable()

  return (
    <button
      className={cn('dt-button dt-button-secondary', className)}
      type="button"
      onClick={() => table.reset()}
    >
      <RotateCcw size={15} aria-hidden="true" />
      {label}
    </button>
  )
}

export type DataTableTableOptionsProps = { className?: string }

export function TableOptions({ className }: DataTableTableOptionsProps) {
  const { table } = useDataTable()

  return (
    <div className={cn('dt-options', className)}>
      <button
        className="dt-icon-button"
        type="button"
        onClick={() => table.resetColumnVisibility()}
        aria-label="Reset column visibility"
      >
        <RotateCcw size={15} aria-hidden="true" />
      </button>
      <button
        className="dt-icon-button"
        type="button"
        onClick={() => table.resetSorting()}
        aria-label="Reset sorting"
      >
        <ArrowDown size={15} aria-hidden="true" />
      </button>
    </div>
  )
}
