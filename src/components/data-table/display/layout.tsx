import * as React from 'react'
import { cn } from '@/lib/cn'

export type DataTableHeaderProps = React.ComponentProps<'div'>
export function Header({ className, ...props }: DataTableHeaderProps) {
  return (
    <div
      data-slot="data-table-header"
      className={cn('dt-header', className)}
      {...props}
    />
  )
}

export type DataTableToolbarProps = React.ComponentProps<'div'>
export function Toolbar({ className, ...props }: DataTableToolbarProps) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn('dt-toolbar', className)}
      {...props}
    />
  )
}

export type DataTableActionsProps = React.ComponentProps<'div'>
export function Actions({ className, ...props }: DataTableActionsProps) {
  return (
    <div
      data-slot="data-table-actions"
      className={cn('dt-actions', className)}
      {...props}
    />
  )
}

export type DataTableFooterProps = React.ComponentProps<'div'>
export function Footer({ className, ...props }: DataTableFooterProps) {
  return (
    <div
      data-slot="data-table-footer"
      className={cn('dt-footer', className)}
      {...props}
    />
  )
}

export type DataTableCaptionProps = React.ComponentProps<'div'>
export function Caption({ className, ...props }: DataTableCaptionProps) {
  return <div className={cn('dt-caption-block', className)} {...props} />
}

export type DataTableEmptyProps = {
  children?: React.ReactNode
  className?: string
}
export function Empty({
  children = 'No results found.',
  className,
}: DataTableEmptyProps) {
  return <div className={cn('dt-empty', className)}>{children}</div>
}

export type DataTableLoadingProps = { label?: string; className?: string }
export function Loading({
  label = 'Loading…',
  className,
}: DataTableLoadingProps) {
  return (
    <div className={cn('dt-loading-overlay', className)} role="status">
      {label}
    </div>
  )
}
