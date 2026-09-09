import { Pin, PinOff } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTablePinningProps = {
  columnId: string
  className?: string
}

export function Pinning({ columnId, className }: DataTablePinningProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  if (!column || !column.getCanPin()) return null

  const pinned = column.getIsPinned()

  return (
    <button
      className={cn('dt-menu-item dt-menu-action', className)}
      type="button"
      onClick={() => column.pin(pinned ? false : 'left')}
    >
      {pinned ? (
        <PinOff size={14} aria-hidden="true" />
      ) : (
        <Pin size={14} aria-hidden="true" />
      )}
      {pinned ? 'Unpin column' : 'Pin column'}
    </button>
  )
}
