import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTablePaginationProps = {
  className?: string
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showPageNumbers?: boolean
  siblingCount?: number
}

export function Pagination({
  className,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSize = true,
  showPageNumbers = true,
  siblingCount = 1,
}: DataTablePaginationProps) {
  const { table } = useDataTable()
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const total = table.options.manualPagination
    ? (table.getRowCount() ?? 0)
    : table.getFilteredRowModel().rows.length
  const selected = table.getFilteredSelectedRowModel().rows.length
  const start = total === 0 ? 0 : pageIndex * pageSize + 1
  const end = total === 0 ? 0 : Math.min((pageIndex + 1) * pageSize, total)
  const pages = getPageNumbers(pageIndex, pageCount, siblingCount)

  return (
    <div className={cn('dt-pagination', className)}>
      <div className="dt-pagination-meta">
        <span>
          {selected ? `${selected} selected · ` : ''}
          {start}–{end} of {total}
        </span>
      </div>
      <div className="dt-pagination-controls">
        {showPageSize ? (
          <label className="dt-page-size">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(event) =>
                table.setPageSize(Number(event.target.value))
              }
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showPageNumbers ? (
          <div className="dt-page-list" aria-label="Pagination">
            <button
              className="dt-icon-button"
              type="button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              className="dt-icon-button"
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {pages.map((page, index) =>
              page === 'ellipsis' ? (
                <span className="dt-page-ellipsis" key={`ellipsis-${index}`}>
                  …
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    'dt-page-button',
                    page === pageIndex + 1 && 'is-active',
                  )}
                  onClick={() => table.setPageIndex(page - 1)}
                  aria-current={page === pageIndex + 1 ? 'page' : undefined}
                >
                  {page}
                </button>
              ),
            )}
            <button
              className="dt-icon-button"
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="dt-icon-button"
              type="button"
              onClick={() => table.setPageIndex(Math.max(0, pageCount - 1))}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        ) : (
          <span className="dt-page-number">
            Page {pageIndex + 1} of {Math.max(pageCount, 1)}
          </span>
        )}
      </div>
    </div>
  )
}

export function getPageNumbers(
  currentIndex: number,
  pageCount: number,
  siblingCount: number,
): Array<number | 'ellipsis'> {
  if (pageCount <= 1) return [1]

  const current = currentIndex + 1
  const total = siblingCount * 2 + 5
  if (pageCount <= total)
    return Array.from({ length: pageCount }, (_, index) => index + 1)

  const left = Math.max(current - siblingCount, 2)
  const right = Math.min(current + siblingCount, pageCount - 1)
  const pages: Array<number | 'ellipsis'> = [1]

  if (left > 2) pages.push('ellipsis')
  for (let page = left; page <= right; page += 1) pages.push(page)
  if (right < pageCount - 1) pages.push('ellipsis')
  pages.push(pageCount)

  return pages
}
