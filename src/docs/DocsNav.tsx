import { useEffect, useState } from 'react'
import { Table2 } from 'lucide-react'
import { cn } from '@/lib/cn'

const navItems = [
  ['overview', 'Overview'],
  ['installation', 'Installation'],
  ['composition', 'Composition'],
  ['playground', 'Playground'],
  ['features', 'Features'],
  ['pagination', 'Pagination'],
  ['infinite-scroll', 'Infinite scroll'],
  ['server-side', 'Server-side'],
  ['api', 'API reference'],
  ['architecture', 'Architecture'],
  ['reference', 'TanStack reference'],
  ['accessibility', 'Accessibility'],
  ['testing', 'Testing'],
  ['troubleshooting', 'Troubleshooting'],
] as const

export function DocsNav() {
  const [active, setActive] = useState('overview')

  useEffect(() => {
    const sections = navItems
      .map(([id]) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <aside className="docs-nav">
      <div className="docs-nav-title">
        <Table2 size={17} /> Data Table
      </div>
      {navItems.map(([id, label]) => (
        <a
          className={cn(active === id && 'is-active')}
          href={`#${id}`}
          key={id}
        >
          {label}
        </a>
      ))}
    </aside>
  )
}
