import { cn } from '@/lib/cn'
import { useDataTable } from '../core/context'

export type DataTableDensityProps = { className?: string }
type Density = 'compact' | 'default' | 'comfortable'

type DensityMeta = {
  density?: Density
  setDensity?: (density: Density) => void
}

export function Density({ className }: DataTableDensityProps) {
  const { table } = useDataTable()
  const meta = table.options.meta as DensityMeta | undefined

  if (!meta?.setDensity) return null

  const density = meta.density ?? 'default'
  const next: Density =
    density === 'compact'
      ? 'default'
      : density === 'default'
        ? 'comfortable'
        : 'compact'

  return (
    <div className={cn('dt-density', className)}>
      <button
        type="button"
        className="dt-button dt-button-secondary"
        onClick={() => meta.setDensity?.(next)}
      >
        Density: {density}
      </button>
    </div>
  )
}
