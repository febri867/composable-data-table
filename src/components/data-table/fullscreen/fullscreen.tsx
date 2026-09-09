import * as React from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DataTableFullscreenContext } from '../core/context'

export type DataTableFullscreenProps = React.ComponentProps<'div'> & {
  strategy?: 'overlay' | 'native'
}

export function Fullscreen({
  className,
  children,
  strategy = 'overlay',
  ...props
}: DataTableFullscreenProps) {
  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const [nativeFullscreen, setNativeFullscreen] = React.useState(false)
  const [overlayFullscreen, setOverlayFullscreen] = React.useState(false)

  const isFullscreen = nativeFullscreen || overlayFullscreen

  const registerTrigger = React.useCallback(
    (element: HTMLButtonElement | null) => {
      // Preserve the pre-fullscreen trigger. The overlay is portaled, so its
      // button unmounts on exit and must not replace the original focus target.
      if (element && !isFullscreen) triggerRef.current = element
    },
    [isFullscreen],
  )

  React.useEffect(() => {
    const onFullscreenChange = () => {
      const active = document.fullscreenElement === surfaceRef.current
      setNativeFullscreen(active)

      if (!active) {
        queueMicrotask(() => triggerRef.current?.focus())
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  React.useEffect(() => {
    if (!overlayFullscreen) return

    const previousOverflow = document.body.style.overflow
    const previousOverscroll = document.body.style.overscrollBehavior

    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.overscrollBehavior = previousOverscroll
    }
  }, [overlayFullscreen])

  const wasFullscreen = React.useRef(false)

  React.useLayoutEffect(() => {
    if (wasFullscreen.current && !isFullscreen) {
      triggerRef.current?.focus()
    }
    wasFullscreen.current = isFullscreen
  }, [isFullscreen])

  React.useEffect(() => {
    if (!overlayFullscreen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOverlayFullscreen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [overlayFullscreen])

  const toggle = React.useCallback(async () => {
    if (nativeFullscreen) {
      try {
        await document.exitFullscreen()
      } catch {
        // The browser may already have exited fullscreen.
      }
      return
    }

    if (overlayFullscreen) {
      setOverlayFullscreen(false)
      return
    }

    if (
      strategy === 'native' &&
      surfaceRef.current &&
      document.fullscreenEnabled
    ) {
      try {
        await surfaceRef.current.requestFullscreen()
        return
      } catch {
        // Fall back to deterministic overlay mode.
      }
    }

    setOverlayFullscreen(true)
  }, [nativeFullscreen, overlayFullscreen, strategy])

  const contextValue = React.useMemo(
    () => ({ isFullscreen, toggle, registerTrigger }),
    [isFullscreen, registerTrigger, toggle],
  )

  const surface = (
    <div
      ref={surfaceRef}
      className={cn(
        'dt-fullscreen',
        isFullscreen && 'is-fullscreen',
        overlayFullscreen && 'is-overlay-fullscreen',
        nativeFullscreen && 'is-native-fullscreen',
        className,
      )}
      data-slot="data-table"
      data-fullscreen={isFullscreen ? 'true' : 'false'}
      {...props}
    >
      {children}
    </div>
  )

  return (
    <DataTableFullscreenContext.Provider value={contextValue}>
      {overlayFullscreen && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="dt-fullscreen-portal"
              data-slot="data-table-fullscreen-portal"
            >
              {surface}
            </div>,
            document.body,
          )
        : surface}
    </DataTableFullscreenContext.Provider>
  )
}

export type DataTableFullscreenButtonProps = {
  label?: string
  exitLabel?: string
  className?: string
}

export function FullscreenButton({
  label = 'Full screen',
  exitLabel = 'Exit full screen',
  className,
}: DataTableFullscreenButtonProps) {
  const context = React.useContext(DataTableFullscreenContext)
  if (!context) {
    throw new Error(
      '<DataTable.FullscreenButton> must be used inside <DataTable.Fullscreen>.',
    )
  }

  const currentLabel = context.isFullscreen ? exitLabel : label

  return (
    <button
      ref={context.registerTrigger}
      className={cn(
        'dt-button dt-button-secondary',
        'dt-fullscreen-button',
        className,
      )}
      type="button"
      onClick={() => void context.toggle()}
      aria-pressed={context.isFullscreen}
      aria-label={currentLabel}
    >
      {context.isFullscreen ? (
        <Minimize2 size={15} aria-hidden="true" />
      ) : (
        <Maximize2 size={15} aria-hidden="true" />
      )}
      <span>{currentLabel}</span>
    </button>
  )
}
