import * as React from 'react'
import { Columns3 } from 'lucide-react'
import { useDataTable, getColumnLabel } from '../core/context'
import { useDismissibleMenu } from '../hooks/menu-hooks'
import { MenuButton } from './menu-button'

export type DataTableColumnVisibilityProps = {
  label?: string
  className?: string
}

export function ColumnVisibility({
  label = 'Columns',
  className,
}: DataTableColumnVisibilityProps) {
  const { table } = useDataTable()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useDismissibleMenu(open, setOpen, ref)
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  return (
    <div className={className}>
      <MenuButton
        label={label}
        icon={<Columns3 size={16} aria-hidden="true" />}
        open={open}
        onToggle={() => setOpen((value) => !value)}
        ref={ref}
      >
        {columns.map((column) => (
          <label className="dt-menu-item" key={column.id}>
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={() => column.toggleVisibility()}
            />
            <span>{getColumnLabel(column)}</span>
          </label>
        ))}
      </MenuButton>
    </div>
  )
}

export type DataTableViewOptionsProps = {
  label?: string
  className?: string
}

export function ViewOptions({
  label = 'View',
  className,
}: DataTableViewOptionsProps) {
  return <ColumnVisibility label={label} className={className} />
}
