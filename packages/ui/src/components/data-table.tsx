import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Pagination } from './pagination'
import { FloatingSelectionToolbar } from './floating-selection-toolbar'
import { cn } from '../utils/cn'
import { Checkbox } from './checkbox'

export interface DataTableColumn<T> {
  header: string
  accessor?: keyof T
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
  /** Pin this column to the start or end of the table while horizontally scrolling.
   *  Pinned columns are expected to be contiguous — start-pinned columns first, end-pinned columns last. */
  pinned?: 'start' | 'end'
  /** Optional fixed width, recommended for pinned columns to avoid layout shift, e.g. 160 or '10rem' */
  width?: number | string
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (item: T) => string

  /** Optional actions column */
  actions?: (item: T) => React.ReactNode
  actionsHeader?: string
  /** Pin the actions column to the end of the table */
  pinActions?: boolean

  /** Row selection */
  selectable?: boolean
  /** Controlled selection — omit to let the table manage selection internally */
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  /** Action buttons rendered inside the floating toolbar when rows are selected */
  toolbarActions?: (selectedIds: string[], clearSelection: () => void) => React.ReactNode
  toolbarItemLabel?: string

  /** Pagination (all optional — omit to render an unpaginated table) */
  currentPage?: number
  totalPages?: number
  totalItems?: number
  perPage?: number
  onPageChange?: (page: number) => void

  loading?: boolean
  skeletonRows?: number
  emptyMessage?: string

  /** Text direction — defaults to 'rtl' */
  dir?: 'rtl' | 'ltr'

  className?: string
  rowClassName?: (item: T) => string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  actions,
  actionsHeader = '',
  pinActions = false,
  selectable = false,
  selectedIds,
  onSelectionChange,
  toolbarActions,
  toolbarItemLabel,
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  loading = false,
  skeletonRows = 6,
  emptyMessage = 'No records found. Try changing filters or create a new one.',
  dir = 'rtl',
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  // ---- selection state (controlled or internal) --------------------------
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set())
  const selected = selectedIds ? new Set(selectedIds) : internalSelected

  const setSelected = (next: Set<string>) => {
    onSelectionChange?.(Array.from(next))
    if (!selectedIds) setInternalSelected(next)
  }

  const clearSelection = () => setSelected(new Set())

  const currentPageIds = useMemo(() => data.map(getRowId), [data, getRowId])
  const selectedOnPageCount = currentPageIds.filter((id) => selected.has(id)).length
  const allOnPageSelected = data.length > 0 && selectedOnPageCount === data.length
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected

  const toggleSelectAll = () => {
    const next = new Set(selected)
    if (allOnPageSelected) currentPageIds.forEach((id) => next.delete(id))
    else currentPageIds.forEach((id) => next.add(id))
    setSelected(next)
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelected(next)
  }

  // ---- column layout -------------------------------------------------------
  const showPagination =
    currentPage !== undefined &&
    totalPages !== undefined &&
    totalItems !== undefined &&
    perPage !== undefined &&
    onPageChange !== undefined

  const checkboxIndex = selectable ? 0 : -1
  const columnStartIndex = selectable ? 1 : 0
  const colCount = (selectable ? 1 : 0) + columns.length + (actions ? 1 : 0)
  const actionsIndex = actions ? colCount - 1 : -1

  const pinnedMap = useMemo(() => {
    const map: Record<number, 'start' | 'end'> = {}
    if (selectable) map[checkboxIndex] = 'start'
    columns.forEach((col, i) => {
      if (col.pinned) map[columnStartIndex + i] = col.pinned
    })
    if (actions && pinActions) map[actionsIndex] = 'end'
    return map
  }, [columns, selectable, actions, pinActions, checkboxIndex, columnStartIndex, actionsIndex])

  const hasPinnedColumns = Object.keys(pinnedMap).length > 0

  // ---- measure pinned column offsets for sticky positioning ----------------
  const wrapperRef = useRef<HTMLDivElement>(null)
  const headerCellRefs = useRef<(HTMLTableCellElement | null)[]>([])
  const [pinOffsets, setPinOffsets] = useState<Record<number, number>>({})

  useLayoutEffect(() => {
    if (!hasPinnedColumns) return

    const computeOffsets = () => {
      const offsets: Record<number, number> = {}

      let runningStart = 0
      for (let i = 0; i < colCount; i++) {
        if (pinnedMap[i] === 'start') {
          offsets[i] = runningStart
          runningStart += headerCellRefs.current[i]?.offsetWidth ?? 0
        }
      }

      let runningEnd = 0
      for (let i = colCount - 1; i >= 0; i--) {
        if (pinnedMap[i] === 'end') {
          offsets[i] = runningEnd
          runningEnd += headerCellRefs.current[i]?.offsetWidth ?? 0
        }
      }

      setPinOffsets(offsets)
    }

    computeOffsets()
    const ro = new ResizeObserver(computeOffsets)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    window.addEventListener('resize', computeOffsets)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', computeOffsets)
    }
  }, [pinnedMap, colCount, hasPinnedColumns, data.length])

  const pinnedStyle = (index: number): React.CSSProperties | undefined => {
    const side = pinnedMap[index]
    if (!side) return undefined
    return {
      position: 'sticky',
      [side === 'start' ? 'insetInlineStart' : 'insetInlineEnd']: pinOffsets[index] ?? 0,
      zIndex: 1,
    }
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <div
        ref={wrapperRef}
        className="bg-surface rounded-sm  overflow-x-auto"
      >
        <table dir={dir} className="w-full">
          <thead>
            <tr className="bg-secondary">
              {selectable && (
                <th
                  ref={(el) => { headerCellRefs.current[checkboxIndex] = el }}
                  style={pinnedStyle(checkboxIndex)}
                  className="w-10 px-2.5 py-1.5 bg-secondary"
                >
                  <Checkbox
                    checked={allOnPageSelected}
                    indeterminate={someOnPageSelected}
                    onChange={toggleSelectAll}
                    aria-label="تحديد الكل"
                  />
                </th>
              )}

              {columns.map((col, i) => {
                const index = columnStartIndex + i
                return (
                  <th
                    key={i}
                    ref={(el) => { headerCellRefs.current[index] = el }}
                    style={{ width: col.width, ...pinnedStyle(index) }}
                    className={cn(
                      'text-start px-2.5 py-1.5  text-[10px] font-medium uppercase tracking-wider text-white/80 whitespace-nowrap bg-secondary',
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </th>
                )
              })}

              {actions && (
                <th
                  ref={(el) => { headerCellRefs.current[actionsIndex] = el }}
                  style={pinnedStyle(actionsIndex)}
                  className="text-start px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-secondary-text whitespace-nowrap bg-secondary"
                >
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-t border-border">
                  {Array.from({ length: colCount }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-2 py-3 bg-white">
                      <div className="h-4 rounded bg-secondary/20 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colCount || 1} className="px-2 py-4 text-center text-sm text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = getRowId(item)
                const isSelected = selected.has(id)

                return (
                  <tr
                    key={id}
                    className={cn(
                      'border-t first:border-t-0 border-border/80 transition-colors',
                      onRowClick && 'cursor-pointer',
                      isSelected && 'bg-primary/5',
                      rowClassName?.(item),
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td
                        style={pinnedStyle(checkboxIndex)}
                        className={cn('px-2.5 py-2', isSelected ? 'bg-primary/5' : 'bg-white')}
                      >
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          aria-label="تحديد الصف"
                        />
                      </td>
                    )}

                    {columns.map((col, i) => {
                      const index = columnStartIndex + i
                      return (
                        <td
                          key={i}
                          style={pinnedStyle(index)}
                          className={cn(
                            'px-1.5 py-1.5 whitespace-nowrap',
                            pinnedMap[index] && (isSelected ? 'bg-primary/5' : 'bg-white'),
                            col.cellClassName,
                          )}
                        >
                          {col.render
                            ? col.render(item)
                            : col.accessor
                            ? (item[col.accessor] as React.ReactNode)
                            : null}
                        </td>
                      )
                    })}

                    {actions && (
                      <td
                        style={pinnedStyle(actionsIndex)}
                        className={cn('px-1.5 py-1.5', pinnedMap[actionsIndex] && (isSelected ? 'bg-primary/5' : 'bg-white'))}
                      >
                        <div className="flex items-center gap-1 justify-end">{actions(item)}</div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      {showPagination && data.length > 0 && !loading && (
        <div className="px-1.5 py-1.5 rounded-sm bg-surface mt-0">
          <Pagination
            currentPage={currentPage!}
            totalPages={totalPages!}
            totalItems={totalItems!}
            perPage={perPage!}
            onPageChange={onPageChange!}
          />
        </div>
      )}
      </div>


      {selectable && (
        <FloatingSelectionToolbar count={selected.size} onClear={clearSelection} itemLabel={toolbarItemLabel}>
          {toolbarActions?.(Array.from(selected), clearSelection)}
        </FloatingSelectionToolbar>
      )}
    </div>
  )
}