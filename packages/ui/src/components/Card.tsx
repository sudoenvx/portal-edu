import type { ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
  none: 'card-p-none',
  sm: 'card-p-sm',
  md: 'card-p-md',
  lg: 'card-p-lg',
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  return (
    <div className={['card', paddingStyles[padding], className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
