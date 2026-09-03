import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../utils/cn'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ReactNode
  current?: boolean
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: ReactNode
  className?: string
  ariaLabel?: string
}

export function Breadcrumb({ items, separator, className, ariaLabel = 'مسار التنقل' }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 text-[11px] leading-4">
        {items.map((item, index) => {
          const isCurrent = item.current ?? index === items.length - 1

          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="shrink-0 text-text-faint">
                  {separator ?? <ChevronLeft className="h-3 w-3" strokeWidth={1.8} />}
                </span>
              )}

              {isCurrent || !item.href ? (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'flex min-w-0 items-center gap-1.5 truncate',
                    isCurrent ? 'font-bold text-text' : 'text-text-muted',
                  )}
                >
                  {item.icon && <span className="shrink-0 text-text-muted [&>svg]:h-3.5 [&>svg]:w-3.5">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <a
                  href={item.href}
                  className="flex min-w-0 items-center gap-1.5 truncate text-text-muted transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.icon && <span className="shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
