import * as React from 'react'
import { Check, Filter, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getColumnLabel, useDataTable } from '../core/context'
import { useDismissibleMenu } from '../hooks/menu-hooks'
import { Pinning } from '../utilities/column-pinning'

export type DataTableFilterProps = {
  columnId: string
  className?: string
  placeholder?: string
}

export function FilterInput({
  columnId,
  className,
  placeholder = 'Filter…',
}: DataTableFilterProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  if (!column) return null

  const value = String(column.getFilterValue() ?? '')

  return (
    <label className={cn('dt-filter', className)}>
      <Filter size={14} aria-hidden="true" />
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          column.setFilterValue(event.target.value || undefined)
        }
        aria-label={`Filter ${getColumnLabel(column)}`}
      />
    </label>
  )
}

export type DataTableColumnFilterProps = {
  columnId: string
  label?: string
  placeholder?: string
  className?: string
}

export function ColumnFilter({
  columnId,
  label = 'Filter',
  placeholder = 'Filter values…',
  className,
}: DataTableColumnFilterProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useDismissibleMenu(open, setOpen, ref)

  if (!column || !column.getCanFilter()) return null

  const value = String(column.getFilterValue() ?? '')
  const title = `${label} ${getColumnLabel(column)}`

  return (
    <div className={cn('dt-menu-wrap', className)} ref={ref}>
      <button
        className={cn('dt-icon-button', value && 'is-active')}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={title}
      >
        <Filter size={14} aria-hidden="true" />
        {value ? <span className="dt-filter-dot" /> : null}
      </button>
      {open ? (
        <div
          className="dt-menu dt-column-filter-menu"
          role="dialog"
          aria-label={title}
        >
          <div className="dt-column-filter-title">{getColumnLabel(column)}</div>
          <label className="dt-filter-popover-input">
            <Filter size={14} aria-hidden="true" />
            <input
              autoFocus
              value={value}
              placeholder={placeholder}
              onChange={(event) =>
                column.setFilterValue(event.target.value || undefined)
              }
              aria-label={title}
            />
          </label>
          <Pinning columnId={column.id} />
          <button
            className="dt-menu-item dt-menu-action"
            type="button"
            onClick={() => {
              column.setFilterValue(undefined)
              setOpen(false)
            }}
            disabled={!value}
          >
            <span>Clear filter</span>
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}

export type DataTableFacetedFilterProps = {
  columnId: string
  label?: string
  className?: string
}

export function FacetedFilter({
  columnId,
  label,
  className,
}: DataTableFacetedFilterProps) {
  const { table } = useDataTable()
  const column = table.getColumn(columnId)
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  useDismissibleMenu(open, setOpen, ref)

  if (!column) return null

  const raw = column.getFilterValue()
  const selected = Array.isArray(raw)
    ? raw.map(String)
    : raw == null
      ? []
      : [String(raw)]
  const values = Array.from(column.getFacetedUniqueValues().keys())
    .filter((value) => value !== undefined && value !== null)
    .map(String)
    .sort((a, b) => a.localeCompare(b))
  const title = label ?? getColumnLabel(column)

  const toggle = (item: string) => {
    const next = selected.includes(item)
      ? selected.filter((value) => value !== item)
      : [...selected, item]
    column.setFilterValue(next.length ? next : undefined)
  }

  return (
    <div className={cn('dt-menu-wrap', className)} ref={ref}>
      <button
        className="dt-button dt-button-secondary"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <SlidersHorizontal size={15} aria-hidden="true" />
        {title}
        {selected.length ? (
          <span className="dt-count">{selected.length}</span>
        ) : null}
      </button>
      {open ? (
        <div
          className="dt-menu dt-faceted-menu"
          role="menu"
          aria-label={`${title} filter`}
        >
          <button
            className="dt-menu-item dt-menu-action"
            type="button"
            onClick={() => {
              column.setFilterValue(undefined)
              setOpen(false)
            }}
          >
            <span>All</span>
            {!selected.length ? <Check size={14} aria-hidden="true" /> : null}
          </button>
          {values.map((item) => (
            <button
              className="dt-menu-item dt-menu-action"
              type="button"
              key={item}
              onClick={() => toggle(item)}
            >
              <span>{item}</span>
              {selected.includes(item) ? (
                <Check size={14} aria-hidden="true" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export type DataTableFilterRowProps = { className?: string }

export function FilterRow({ className }: DataTableFilterRowProps) {
  const { table } = useDataTable()

  return (
    <div className={cn('dt-filter-row', className)}>
      {table
        .getVisibleLeafColumns()
        .filter((column) => column.getCanFilter())
        .map((column) => (
          <div className="dt-filter-cell" key={column.id}>
            <FilterInput
              columnId={column.id}
              placeholder={`Filter ${getColumnLabel(column)}…`}
            />
          </div>
        ))}
    </div>
  )
}

export type DataTableClearFiltersProps = {
  className?: string
  label?: string
}

export function ClearFilters({
  className,
  label = 'Clear filters',
}: DataTableClearFiltersProps) {
  const { table } = useDataTable()
  const active =
    table.getState().columnFilters.length > 0 ||
    Boolean(table.getState().globalFilter)

  if (!active) return null

  return (
    <button
      className={cn('dt-button dt-button-secondary', className)}
      type="button"
      onClick={() => {
        table.resetColumnFilters()
        table.setGlobalFilter('')
      }}
    >
      <X size={15} aria-hidden="true" />
      {label}
    </button>
  )
}
