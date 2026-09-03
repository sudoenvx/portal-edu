// components/ui/Modal.tsx
import { type ReactNode } from 'react'
import { X } from 'lucide-react'
import { BaseModal, type ModalSize } from './base-modal'


type ModalProps = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnOverlay?: boolean
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlay = false,
  className,
}: ModalProps) {
  return (
    <BaseModal open={open} onClose={onClose} size={size} closeOnOverlay={closeOnOverlay} className={className}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-1.5 pl-2 py-1.5 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase text-text">{title}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-6 h-6 flex items-center justify-center rounded-sm
                       text-faint bg-danger/30 hover:bg-danger/40
                       border-none cursor-pointer transition-colors"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-1.5 p-1.5 border-t border-border shrink-0">{footer}</div>
      )}
    </BaseModal>
  )
}

export type { ModalProps }