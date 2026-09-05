// DropdownMenu.tsx
import { AnimatePresence, motion } from 'motion/react'
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Input } from './input'
import { cn } from '../utils/cn'

// ── Types ──────────────────────────────────────────────────────────

type Side = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'

type DropdownMenuProps = {
	trigger: ReactNode
	children: ReactNode
	side?: Side
	align?: Align
	offset?: number
	triggerClassName?: string
	menuClassName?: string

	// ── Search ──
	// Turns on a search input pinned to the top of the menu. The menu has no
	// knowledge of what its items are (they're arbitrary ReactNode children),
	// so by default it filters purely by matching each rendered menuitem's
	// visible text against the query. Pass `onSearchChange` if you want to
	// drive filtering/fetching yourself (e.g. server-side search over a large
	// list) — in that case set `filterItems={false}` so the built-in text
	// filter doesn't also hide things behind your back.
	searchable?: boolean
	searchPlaceholder?: string
	searchValue?: string // controlled search input value
	onSearchChange?: (value: string) => void
	filterItems?: boolean // default true — auto-hide items whose text doesn't match
	noResultsLabel?: ReactNode // shown when filterItems hides every item
}

type DropdownMenuItemProps = {
	icon?: ReactNode
	shortcut?: string
	variant?: 'default' | 'danger'
	selected?: boolean
	disabled?: boolean
	onSelect?: () => void
	className?: string
	children: ReactNode
}

type DropdownMenuCheckItemProps = {
	checked: boolean
	onCheckedChange: (v: boolean) => void
	children: ReactNode
	className?: string
	iconClassName?: string
	group?: string // pass the same group string for radioyle single-select
}

// ── Internal context ───────────────────────────────────────────────

const CloseCtx = createContext<(() => void) | null>(null)

// ── Position helper ────────────────────────────────────────────────

function clamp(val: number, min: number, max: number) {
	return Math.min(Math.max(val, min), max)
}

function calcPos(
	triggerRect: DOMRect,
	menuRect: DOMRect,
	side: Side,
	align: Align,
	offset: number,
): { top: number; left: number } {
	const vw = window.innerWidth
	const vh = window.innerHeight
	const pad = 6
	let top = 0,
		left = 0

	if (side === 'bottom' || side === 'top') {
		top = side === 'bottom' ? triggerRect.bottom + offset : triggerRect.top - menuRect.height - offset

		left =
			align === 'start'
				? triggerRect.left
				: align === 'end'
					? triggerRect.right - menuRect.width
					: triggerRect.left + (triggerRect.width - menuRect.width) / 2
	} else {
		left = side === 'right' ? triggerRect.right + offset : triggerRect.left - menuRect.width - offset

		top =
			align === 'start'
				? triggerRect.top
				: align === 'end'
					? triggerRect.bottom - menuRect.height
					: triggerRect.top + (triggerRect.height - menuRect.height) / 2
	}

	return {
		top: clamp(top, pad, vh - menuRect.height - pad),
		left: clamp(left, pad, vw - menuRect.width - pad),
	}
}

// ── DropdownMenu ───────────────────────────────────────────────────

export function DropdownMenu({
	trigger,
	children,
	side = 'bottom',
	align = 'start',
	offset = 4,
	triggerClassName,
	searchable = false,
	searchPlaceholder = 'Search…',
	searchValue,
	onSearchChange,
	filterItems = true,
	noResultsLabel = 'No results',
	menuClassName
}: DropdownMenuProps) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, left: 0 })
	const triggerRef = useRef<HTMLButtonElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const searchRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLDivElement>(null)

	// uncontrolled fallback so `searchable` works even without onSearchChange
	const [internalSearch, setInternalSearch] = useState('')
	const search = searchValue ?? internalSearch
	const [visibleCount, setVisibleCount] = useState<number | null>(null)

	const close = useCallback(() => setOpen(false), [])

	const setSearch = useCallback(
		(value: string) => {
			if (searchValue === undefined) setInternalSearch(value)
			onSearchChange?.(value)
		},
		[searchValue, onSearchChange],
	)

	// reset search each time the menu closes so it doesn't linger stale
	useEffect(() => {
		if (!open) {
			setInternalSearch('')
			setVisibleCount(null)
		}
	}, [open])

	// position after menu mounts
	useLayoutEffect(() => {
		if (!open || !triggerRef.current || !menuRef.current) return
		const tr = triggerRef.current.getBoundingClientRect()
		const mr = menuRef.current.getBoundingClientRect()
		setPos(calcPos(tr, mr, side, align, offset))
		if (searchable) searchRef.current?.focus()
		else menuRef.current.focus()
	}, [open, side, align, offset, searchable])

	// reposition on resize / scroll
	useEffect(() => {
		if (!open) return
		const update = () => {
			if (!triggerRef.current || !menuRef.current) return
			const tr = triggerRef.current.getBoundingClientRect()
			const mr = menuRef.current.getBoundingClientRect()
			setPos(calcPos(tr, mr, side, align, offset))
		}
		window.addEventListener('resize', update)
		window.addEventListener('scroll', update, true)
		return () => {
			window.removeEventListener('resize', update)
			window.removeEventListener('scroll', update, true)
		}
	}, [open, side, align, offset])

	// client-side text filter over rendered menuitems (opt-out via filterItems={false})
	useLayoutEffect(() => {
		if (!open || !searchable || !filterItems || !listRef.current) return
		const items = [
			...listRef.current.querySelectorAll<HTMLElement>('[role="menuitem"], [role="menuitemcheckbox"]'),
		]
		const query = search.trim().toLowerCase()
		let shown = 0
		for (const item of items) {
			const matches = query === '' || (item.textContent ?? '').toLowerCase().includes(query)
			item.style.display = matches ? '' : 'none'
			if (matches) shown++
		}
		setVisibleCount(shown)
	}, [open, searchable, filterItems, search, children])

	// outside click / escape
	useEffect(() => {
		if (!open) return
		const onDown = (e: MouseEvent) => {
			if (!menuRef.current?.contains(e.target as Node) && !triggerRef.current?.contains(e.target as Node)) close()
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close()
				return
			}
			const items = [
				...(menuRef.current?.querySelectorAll<HTMLButtonElement>(
					'button[role="menuitem"]:not(:disabled), button[role="menuitemcheckbox"]:not(:disabled)',
				) ?? []),
			].filter((el) => el.style.display !== 'none')
			if (items.length === 0) return

			const active = document.activeElement as HTMLButtonElement
			const idx = items.indexOf(active)

			if (e.key === 'ArrowDown') {
				e.preventDefault()
				// from the search input (idx === -1), ArrowDown goes to the first item
				items[idx === -1 ? 0 : (idx + 1) % items.length]?.focus()
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				items[idx === -1 ? items.length - 1 : (idx - 1 + items.length) % items.length]?.focus()
			}
			// if (e.key === 'Enter' && (active === searchRef.current)) {
			// 	e.preventDefault()
			// 	items[0]?.click()
			// }
		}
		document.addEventListener('mousedown', onDown)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', onDown)
			document.removeEventListener('keydown', onKey)
		}
	}, [open, close])

	const ctx = useMemo(() => close, [close])

	return (
		<>
			<button
				ref={triggerRef}
				type="button"
				aria-haspopup="menu"
				aria-expanded={open}
				onClick={() => setOpen((o) => !o)}
				className={`not-draggable inline-flex items-center ${triggerClassName ?? ''}`}
			>
				{trigger}
			</button>

			{createPortal(
				<AnimatePresence>
					{open && (
						<CloseCtx.Provider value={ctx}>
							<motion.div
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ type: 'tween', duration: 0.25 }}
								exit={{ y: -10, opacity: 0 }}
								ref={menuRef}
								role="menu"
								tabIndex={-1}
								style={{ top: pos.top, left: pos.left }}
								className={
									cn(
										'fixed max-h-60 overflow-hidden z-50 min-w-50 p-1 outline-none bg-surface  border-border rounded-md flex flex-col gap-1 shadow-sm shadow-secondary/60',
										menuClassName
									)
								}
							>
								{searchable && (
									<div>
										<Input
											ref={searchRef}
											type="text"
											role="searchbox"
											value={search}
											variant='bordered'
											className='mb-1'
											onChange={(e) => setSearch(e.target.value)}
											placeholder={searchPlaceholder}
										/>
									</div>
								)}

								<div ref={listRef} className="flex flex-col gap-1 overflow-auto">
									{children}
									{searchable && filterItems && visibleCount === 0 && (
										<div className="px-1.5 py-1 text-[12px] text-text-muted select-none">{noResultsLabel}</div>
									)}
								</div>
							</motion.div>
						</CloseCtx.Provider>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</>
	)
}

// ── DropdownMenuItem ───────────────────────────────────────────────

export function DropdownMenuItem({
	icon,
	shortcut,
	variant = 'default',
	selected = false,
	disabled,
	onSelect,
	children,
}: DropdownMenuItemProps) {
	const close = useContext(CloseCtx)

	return (
		<button
			type="button"
			role="menuitem"
			disabled={disabled}
			onClick={() => {
				if (!disabled) {
					onSelect?.()
					close?.()
				}
			}}
			className={`

        flex w-full items-center justify-between gap-2
        rounded px-1.5 py-0.5 text-[12px] text-left lowercase
        border-none cursor-pointer font-[inherit] outline-none
        transition-colors duration-100
        disabled:pointer-events-none disabled:opacity-40
        ${variant === 'danger'
					? 'bg-danger-tint text-danger-tint-text hover:bg-danger focus:bg-danger hover:text-danger-text focus:text-danger-text'
					: selected
						? 'bg-primary text-primary-text hover:bg-primary focus:bg-primary'
						: 'text-text font-medium hover:bg-card-hover hover:text-primary-tint-text focus:bg-surface-raised'
				}
				}
      `}
		>
			<span className="flex items-center gap-2">
				{icon && (
					<span className="w-3.5 h-3.5 text-primary-tint-text! flex items-center justify-center opacity-65 shrink-0 [&>svg]:w-full [&>svg]:h-full">
						{icon}
					</span>
				)}
				{children}
			</span>
			{shortcut && (
				<kbd
					className={`
          text-[11px] font-[inherit] px-1.5 py-px rounded-sm
          bg-surface-raised
          ${variant === 'danger' ? 'text-danger/60 bg-danger-tint border-danger-tint' : 'text-text-muted'}
        `}
				>
					{shortcut}
				</kbd>
			)}
		</button>
	)
}

// ── DropdownMenuCheckItem ──────────────────────────────────────────
// Works as both a toggle (no group) and radio (with group).

export function DropdownMenuCheckItem({ checked, onCheckedChange, className, iconClassName, children }: DropdownMenuCheckItemProps) {
	const close = useContext(CloseCtx)

	return (
		<button
			type="button"
			role="menuitemcheckbox"
			aria-checked={checked}
			onClick={() => {
				onCheckedChange?.(!checked)
				close?.()
			}}
			className={`
        flex w-full items-center gap-2
        rounded px-1.5 py-0.75 text-[12px] text-left
        border-none cursor-pointer font-[inherit] outline-none
        hover:bg-surface-raised focus:bg-surface-raised
        transition-colors duration-100
		${checked ? 'bg-primary text-primary-text' : 'text-text hover:bg-card-hover hover:text-primary-tint-text focus:bg-surface-raised'}
		${className}
      `}
		>
			{/* checkmark — takes up space even when unchecked to keep alignment */}
			<span
				className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${checked ? 'text-primary-text' : 'text-text-muted'} transition-opacity ${checked ? 'opacity-100' : 'opacity-0'} ${iconClassName}`}
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-full h-full">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</span>
			{children}
		</button>
	)
}

// ── DropdownMenuSeparator ──────────────────────────────────────────

export function DropdownMenuSeparator() {
	return <div role="separator" className="h-[0.5px] bg-border" />
}

// ── DropdownMenuLabel ──────────────────────────────────────────────

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
	return (
		<div className="px-1 pt-1 pb-0 text-[10px] font-bold tracking-widest uppercase text-text-faint select-none">
			{children}
		</div>
	)
}