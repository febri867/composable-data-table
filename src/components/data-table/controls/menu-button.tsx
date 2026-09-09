import * as React from 'react'

export type DataTableMenuButtonProps = {
  label: string
  icon: React.ReactNode
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

export const MenuButton = React.forwardRef<
  HTMLDivElement,
  DataTableMenuButtonProps
>(function MenuButton({ label, icon, open, onToggle, children }, ref) {
  return (
    <div className="dt-menu-wrap" ref={ref}>
      <button
        className="dt-button dt-button-secondary"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {icon}
        {label}
      </button>
      {open ? (
        <div className="dt-menu" role="menu" aria-label={label}>
          {children}
        </div>
      ) : null}
    </div>
  )
})
