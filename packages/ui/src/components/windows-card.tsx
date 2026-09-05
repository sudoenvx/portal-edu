import type { ReactNode } from 'react'

interface WindowCardProps {
  title?: ReactNode
  description?: string
  headerActions?: ReactNode
  headerClassName?: string
  footer?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  windowClassName?: string
  onClick?: () => void

  elevated?: boolean
}

export const WindowCard = ({ title, description,windowClassName, headerActions, headerClassName = '', footer, children, className = '', bodyClassName = 'p-2', onClick, elevated = false }: WindowCardProps) => {
  return (
    <div className={`bg-secondary pt-0.75 pr-0.75 pl-0.75 pb-0.75 rounded-md ${windowClassName}`}>
        {(title || description || headerActions) && (
        <header className={`flex items-center justify-between gap-4 py-0.75 px-1 ${headerClassName}`}>
          {(title || description) && (
            <div className="min-w-0 flex-1">
              {title && <h2 className="m-0 text-[11px] text-secondary-text/80 font-medium leading-snug ">{title}</h2>}
              {description && <p className="m-0 text-xs leading-normal text-text-muted">{description}</p>}
            </div>
          )}
          {headerActions && <div className="flex shrink-0 items-center gap-2">{headerActions}</div>}
        </header>
      )}
        <div className={`w-full overflow-hidden rounded-sm rounded-tr-sm rounded-tl-sm bg-surface ${elevated && 'shadow-card'} ${className}`} onClick={onClick}>
      
      <section className={`text-sm leading-relaxed text-text/90 w-full p-2 ${bodyClassName}`}>{children}</section>
      {footer && <footer className="flex items-center justify-end gap-2 border-t border-border p-2">{footer}</footer>}
    </div>
    </div>
  )
}

export type { WindowCardProps }
