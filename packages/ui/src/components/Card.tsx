import type { ReactNode } from 'react'

interface CardProps {
  title?: ReactNode
  description?: string
  headerActions?: ReactNode
  headerClassName?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  onClick?: () => void

  elevated?: boolean
}

export const Card = ({ title, description, headerActions, headerClassName = '', footer, children, className = '', bodyClassName = 'p-2', onClick, elevated = false }: CardProps) => {
  return (
    <div className={`w-full overflow-hidden rounded-sm bg-surface ${elevated && 'shadow-card'} ${className}`} onClick={onClick}>
      {(title || description || headerActions) && (
        <header className={`flex items-center justify-between gap-4 border-b border-border p-1.5 ${headerClassName}`}>
          {(title || description) && (
            <div className="min-w-0 flex-1">
              {title && <h2 className="m-0 text-[12px] font-medium leading-snug text-text/80">{title}</h2>}
              {description && <p className="m-0 text-xs leading-normal text-text-muted">{description}</p>}
            </div>
          )}
          {headerActions && <div className="flex shrink-0 items-center gap-2">{headerActions}</div>}
        </header>
      )}
      <section className={`text-sm leading-relaxed text-text/90 w-full p-2 ${bodyClassName}`}>{children}</section>
      {footer && <footer className="flex items-center justify-end gap-2 border-t border-border p-2">{footer}</footer>}
    </div>
  )
}

export type { CardProps }
