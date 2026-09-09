import * as React from 'react'
import { Filter, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableSearchProps = Omit<
  React.ComponentProps<'input'>,
  'value' | 'defaultValue'
> & {
  columnId?: string
  debounceMs?: number
  value?: string
  defaultValue?: string
}

export function SearchInput({
  className,
  columnId,
  value,
  defaultValue = '',
  onChange,
  debounceMs = 180,
  placeholder = 'Search…',
  ...props
}: DataTableSearchProps) {
  const { table } = useDataTable()
  const column = columnId ? table.getColumn(columnId) : undefined
  const tableValue = column
    ? String(column.getFilterValue() ?? '')
    : String(table.getState().globalFilter ?? '')
  const [inputValue, setInputValue] = React.useState(
    value ?? tableValue ?? defaultValue,
  )

  React.useEffect(() => {
    if (value === undefined) setInputValue(tableValue)
  }, [tableValue, value])

  React.useEffect(() => {
    if (value !== undefined) return

    const timer = window.setTimeout(() => {
      if (column) column.setFilterValue(inputValue || undefined)
      else table.setGlobalFilter(inputValue)
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [column, debounceMs, inputValue, table, value])

  const clear = () => {
    setInputValue('')
    if (column) column.setFilterValue(undefined)
    else table.setGlobalFilter('')
  }

  return (
    <div className={cn('dt-search', className)} role="search">
      <Filter aria-hidden="true" size={16} />
      <input
        {...props}
        value={value ?? inputValue}
        placeholder={placeholder}
        aria-label={props['aria-label'] ?? 'Search table'}
        onChange={(event) => {
          onChange?.(event)
          setInputValue(event.target.value)
          if (value !== undefined) {
            if (column) {
              column.setFilterValue(event.target.value || undefined)
            } else {
              table.setGlobalFilter(event.target.value)
            }
          }
        }}
      />
      {inputValue ? (
        <button
          className="dt-search-clear"
          type="button"
          onClick={clear}
          aria-label="Clear search"
        >
          <X size={14} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
