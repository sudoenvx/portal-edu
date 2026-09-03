import { AnimatePresence, motion } from 'motion/react'
import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../utils/cn'

type PopoverSide = 'top' | 'bottom' | 'left' | 'right'
type PopoverAlign = 'start' | 'center' | 'end'
type PopoverTriggerType = 'click' | 'hover'

type PopoverProps = {
  trigger: ReactNode
  children: ReactNode
  side?: PopoverSide
  align?: PopoverAlign
  offset?: number
  triggerType?: PopoverTriggerType
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
  contentClassName?: string
  closeOnOutsideClick?: boolean
  closeOnEscape?: boolean
  hoverOpenDelay?: number
  hoverCloseDelay?: number
}

type Position = {
  top: number
  left: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPosition(triggerRect: DOMRect, contentRect: DOMRect, side: PopoverSide, align: PopoverAlign, offset: number): Position {
  const viewportPadding = 8
  const maxTop = Math.max(viewportPadding, window.innerHeight - contentRect.height - viewportPadding)
  const maxLeft = Math.max(viewportPadding, window.innerWidth - contentRect.width - viewportPadding)
  let top = triggerRect.bottom + offset
  let left = triggerRect.left

  if (side === 'top' || side === 'bottom') {
    top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - contentRect.height - offset
    left =
      align === 'start'
        ? triggerRect.left
        : align === 'end'
          ? triggerRect.right - contentRect.width
          : triggerRect.left + (triggerRect.width - contentRect.width) / 2
  } else {
    left = side === 'right' ? triggerRect.right + offset : triggerRect.left - contentRect.width - offset
    top =
      align === 'start'
        ? triggerRect.top
        : align === 'end'
          ? triggerRect.bottom - contentRect.height
          : triggerRect.top + (triggerRect.height - contentRect.height) / 2
  }

  return {
    top: clamp(top, viewportPadding, maxTop),
    left: clamp(left, viewportPadding, maxLeft),
  }
}

function getAnimationOffset(side: PopoverSide) {
  if (side === 'top') return { y: 6 }
  if (side === 'bottom') return { y: -6 }
  if (side === 'left') return { x: 6 }
  return { x: -6 }
}

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  offset = 8,
  triggerType = 'click',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  triggerClassName,
  contentClassName,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  hoverOpenDelay = 80,
  hoverCloseDelay = 140,
}: PopoverProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  const openWithDelay = useCallback(() => {
    clearTimers()
    if (hoverOpenDelay === 0) {
      setOpen(true)
      return
    }
    openTimerRef.current = setTimeout(() => setOpen(true), hoverOpenDelay)
  }, [clearTimers, hoverOpenDelay, setOpen])

  const closeWithDelay = useCallback(() => {
    clearTimers()
    if (hoverCloseDelay === 0) {
      setOpen(false)
      return
    }
    closeTimerRef.current = setTimeout(() => setOpen(false), hoverCloseDelay)
  }, [clearTimers, hoverCloseDelay, setOpen])

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return
    setPosition(getPosition(triggerRef.current.getBoundingClientRect(), contentRef.current.getBoundingClientRect(), side, align, offset))
  }, [align, offset, side])

  useLayoutEffect(() => {
    if (!isOpen) return
    const frame = requestAnimationFrame(updatePosition)
    return () => cancelAnimationFrame(frame)
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen) return
    const handleViewportChange = () => updatePosition()
    const resizeObserver = contentRef.current ? new ResizeObserver(handleViewportChange) : undefined

    resizeObserver?.observe(contentRef.current as Element)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('scroll', handleViewportChange, true)
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !contentRef.current?.contains(target)) setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [closeOnOutsideClick, isOpen, setOpen])

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeOnEscape, isOpen, setOpen])

  useEffect(() => () => clearTimers(), [clearTimers])

  const handleTriggerPointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (triggerType === 'hover' && event.pointerType !== 'touch') openWithDelay()
  }

  const handleTriggerPointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (triggerType === 'hover' && event.pointerType !== 'touch') closeWithDelay()
  }

  const animationOffset = getAnimationOffset(side)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        onClick={() => triggerType === 'click' && setOpen(!isOpen)}
        onPointerEnter={handleTriggerPointerEnter}
        onPointerLeave={handleTriggerPointerLeave}
        className={cn('not-draggable overflow-hidden inline-flex items-center', triggerClassName)}
      >
        {trigger}
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={contentRef}
              role="dialog"
              tabIndex={-1}
              initial={{ ...animationOffset, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              exit={{ ...animationOffset, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 460, damping: 32, mass: 0.7 }}
              onPointerEnter={() => triggerType === 'hover' && (clearTimers(), openWithDelay())}
              onPointerLeave={() => triggerType === 'hover' && closeWithDelay()}
              style={{ top: position.top, left: position.left }}
              className={cn(
                'fixed z-60 max-h-[min(32rem,calc(100vh-1rem))] overflow-auto rounded-md bg-surface shadow-secondary/50 shadow-xs outline-none',
                contentClassName,
              )}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

export type { PopoverAlign, PopoverProps, PopoverSide, PopoverTriggerType }
