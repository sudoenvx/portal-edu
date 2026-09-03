import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../utils/cn'

export interface FloatingSelectionToolbarProps {
  /** Number of currently selected items — the toolbar renders nothing when this is 0 */
  count: number
  onClear: () => void
  /** Optional label override, e.g. "عنصر محدد" — defaults to Arabic "عنصر" */
  itemLabel?: string
  /** Action buttons rendered on the toolbar (e.g. delete, export selected) */
  children?: React.ReactNode
  className?: string
}

export function FloatingSelectionToolbar({
  count,
  onClear,
  itemLabel = 'عنصر',
  children,
  className,
}: FloatingSelectionToolbarProps) {
  if (count === 0) return null

  return (
    <div
      dir="rtl"
      className={cn(
        'fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none',
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-sm bg-white shadow-elevated px-1.5 py-1.5 animate-in fade-in slide-in-from-bottom-2">
        <button
          type="button"
          onClick={onClear}
          title="إلغاء التحديد"
          className="flex p-1.5 shrink-0 items-center justify-center rounded transition-colors hover:bg-danger/30 bg-danger/20"
        >
          <X size={12} />
        </button>

        <span className="text-[12px] font-medium whitespace-nowrap text-text pe-3">
          تم تحديد {count} {itemLabel}
        </span>

        {children && <div className="flex items-center gap-1.5">{children}</div>}
      </div>
    </div>
  )
}