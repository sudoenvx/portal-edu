import React from 'react'
import { cn } from '../utils/cn'

// Kept only the semantic variants that map to real states (success/warning/danger/neutral)
// plus 'primary' for brand-tinted badges. Anything more specific (custom hues, one-off
// statuses) should go through the `colors` prop instead of growing this list.
export type BadgeVariant = 'success' | 'warning' | 'danger' | 'primary' | 'neutral'

export type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  size?: BadgeSize
  className?: string
}

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.75 gap-1',
  md: 'text-[10px] px-2.5 py-1.25 gap-1.5',
}

export function Badge({
  children,
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center w-fit rounded font-medium leading-none whitespace-nowrap',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </span>
  )
}