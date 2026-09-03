// components/ui/BaseModal.tsx
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, type Transition, type Variants } from 'motion/react'
import { cn } from '../utils/cn'

export type ModalSize = 'sm' | 'md' | 'lg'

export type BaseModalProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  size?: ModalSize
  closeOnOverlay?: boolean
  className?: string
}

export const modalSizeMap: Record<ModalSize, string> = {
  sm: 'w-[380px]',
  md: 'w-[480px]',
  lg: 'w-[600px]',
}

// ── Animation config ──────────────────────────────────────────
const transition: Transition = {
  duration: 0.25,
  ease: [0.4, 0, 0.2, 1], // material standard easing
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition },
  exit: { opacity: 0, transition: { ...transition, duration: 0.14 } },
}

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 1, y: 0 },
  visible: { opacity: 1, scale: 1, y: 0, transition },
  exit: { opacity: 0, scale: 1, y: 4, transition: { ...transition, duration: 0.14 } },
}

// ── BaseModal ────────────────────────────────────────────────
// No title, no close icon, no footer — just the portal, overlay,
// escape/scroll-lock behavior, and an animated panel shell. Build
// your own header/body/footer layout with `children`.
export function BaseModal({
  open,
  onClose,
  children,
  size = 'md',
  closeOnOverlay = false,
  className,
}: BaseModalProps) {
  // Escape key
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Body scroll lock
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return createPortal(
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-[#00000080]"
        >
          {/* Click zone for overlay dismiss */}
          <div data-overlay className="absolute inset-0" onClick={() => closeOnOverlay && onClose()} />

          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'relative flex flex-col bg-surface rounded',
              'max-w-[calc(100vw-32px)] max-h-[calc(100vh-48px)]',
              modalSizeMap[size],
              className,
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}   