import type { ComponentType, ReactNode } from 'react'
import { Card } from './card'

export type StatisticCardProps = {
  label: string
  value: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  iconClassName: string
  /** Anything — a trend badge, a mini chart, a progress bar, custom UI */
  description?: (label: string, value: string) => ReactNode
}

export function StatisticCard({ label, value, icon: Icon, iconClassName, description }: StatisticCardProps) {
  return (
    <Card bodyClassName="p-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-[11px] font-medium text-text-muted">{label}</p>
          <p className="text-2xl font-bold leading-none tracking-tight text-text tabular-nums">{value}</p>
        </div>

        <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm ${iconClassName}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
        </span>
      </div>

      {description && <div>{description(label, value)}</div>}
    </Card>
  )
}