import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type DataTableInfiniteScrollProps = {
  hasMore: boolean
  loading?: boolean
  onLoadMore: () => void | Promise<void>
  rootMargin?: string
  threshold?: number
  className?: string
  label?: string
}

export function InfiniteScroll({
  hasMore,
  loading = false,
  onLoadMore,
  rootMargin = '500px',
  threshold = 0,
  className,
  label = 'Load more rows',
}: DataTableInfiniteScrollProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const loadingRef = React.useRef(false)

  React.useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry?.isIntersecting || loading || loadingRef.current) return
        loadingRef.current = true
        try {
          await onLoadMore()
        } finally {
          loadingRef.current = false
        }
      },
      { rootMargin, threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, onLoadMore, rootMargin, threshold])

  return (
    <div
      ref={sentinelRef}
      className={cn('dt-infinite', className)}
      aria-live="polite"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="dt-spin" aria-hidden="true" />
          Loading more…
        </>
      ) : hasMore ? (
        label
      ) : (
        'You’ve reached the end'
      )}
    </div>
  )
}
