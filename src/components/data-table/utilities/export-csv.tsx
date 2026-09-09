import { Download } from 'lucide-react'
import type { RowData } from '@tanstack/react-table'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableExportProps<TData extends RowData> = {
  className?: string
  filename?: string
  getRows?: () => TData[]
  label?: string
}

export function ExportCsv<TData extends RowData>({
  className,
  filename = 'data.csv',
  getRows,
  label = 'Export',
}: DataTableExportProps<TData>) {
  const { table } = useDataTable<TData>()
  const exportRows =
    getRows ??
    (() => table.getFilteredRowModel().rows.map((row) => row.original))

  return (
    <button
      className={cn('dt-button dt-button-secondary', className)}
      type="button"
      onClick={() => downloadCsv(exportRows(), filename)}
    >
      <Download size={15} aria-hidden="true" />
      {label}
    </button>
  )
}

function downloadCsv(rows: unknown[], filename: string) {
  if (!rows.length) return

  const firstRow = rows[0]
  if (typeof firstRow !== 'object' || firstRow === null) return

  const headers = Object.keys(firstRow)
  const csv = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((key) =>
          csvEscape(
            typeof row === 'object' && row !== null
              ? (row as Record<string, unknown>)[key]
              : undefined,
          ),
        )
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function csvEscape(value: unknown) {
  const text =
    value == null
      ? ''
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)

  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}
