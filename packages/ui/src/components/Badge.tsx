import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={['badge', variantStyles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
