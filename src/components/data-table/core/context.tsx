import * as React from 'react'
import type {
  Column,
  Row,
  RowData,
  Table as TanStackTable,
} from '@tanstack/react-table'

export type DataTableContextValue<TData extends RowData> = {
  table: TanStackTable<TData>
  getRowId?: (row: TData, index: number, parent?: Row<TData>) => string
}

export const DataTableContext =
  React.createContext<DataTableContextValue<RowData> | null>(null)

export type DataTableFullscreenContextValue = {
  isFullscreen: boolean
  toggle: () => Promise<void>
  registerTrigger: (element: HTMLButtonElement | null) => void
}

export const DataTableFullscreenContext =
  React.createContext<DataTableFullscreenContextValue | null>(null)

/** Access the nearest TanStack table instance from a composable child. @public */
export function useDataTable<TData extends RowData>() {
  const context = React.useContext(
    DataTableContext,
  ) as unknown as DataTableContextValue<TData> | null

  if (!context) {
    throw new Error(
      'DataTable subcomponents must be used inside <DataTable.Root>.',
    )
  }

  return context
}

export function resolveUpdater<T>(updater: T | ((old: T) => T), current: T): T {
  return typeof updater === 'function'
    ? (updater as (old: T) => T)(current)
    : updater
}

export function getColumnLabel<TData extends RowData>(
  column: Column<TData, unknown>,
) {
  const header = column.columnDef.header
  if (typeof header === 'string') return header

  return column.id
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}
