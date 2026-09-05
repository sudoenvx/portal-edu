import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ChevronsUpDown, Columns3 } from 'lucide-react'
import { Pagination } from './pagination'
import { FloatingSelectionToolbar } from './floating-selection-toolbar'
import { Checkbox } from './checkbox'
import { useTableStore } from '../core/stores/use-table-store'
import { cn } from '../utils/cn'
import { DropdownMenu, DropdownMenuCheckItem } from './dropdown-menu'
import { IconButton } from './icon-button'
import { Button } from './button'

export interface DataTableColumn<T> {
  id?: string // مُعرف فريد للعمود (مهم إذا كنت ستستخدم خاصية إخفاء الأعمدة)
  header: string
  accessor?: keyof T
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
  pinned?: 'start' | 'end'
  width?: number | string
}

export interface DataTableProps<T> {
  // ---- Header Props ----
  title?: React.ReactNode
  description?: React.ReactNode
  tableActions?: React.ReactNode // أزرار الإجراءات العلوية للجدول
  persistedKey?: string // إذا تم تمريره، سيتم تفعيل زر إخفاء/إظهار الأعمدة وحفظها

  // ---- Table Props ----
  data: T[]
  columns: DataTableColumn<T>[]
  getRowId: (item: T) => string
  actions?: (item: T) => React.ReactNode
  actionsHeader?: string
  pinActions?: boolean
  striped?: boolean // تفعيل تلوين الصفوف بالتبادل

  // ---- Selection ----
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (ids: string[]) => void
  toolbarActions?: (selectedIds: string[], clearSelection: () => void) => React.ReactNode
  toolbarItemLabel?: string

  // ---- Pagination ----
  currentPage?: number
  totalPages?: number
  totalItems?: number
  perPage?: number
  onPageChange?: (page: number) => void

  loading?: boolean
  skeletonRows?: number
  emptyMessage?: string
  dir?: 'rtl' | 'ltr'
  className?: string
  rowClassName?: (item: T) => string
  onRowClick?: (item: T) => void
}

// دالة مساعدة للحصول على مُعرف العمود
function getColumnId<T>(col: DataTableColumn<T>, index: number): string {
  return col.id || (typeof col.accessor === 'string' ? col.accessor : col.header) || `col-${index}`
}

export function DataTable<T>({
  title,
  description,
  tableActions,
  persistedKey,
  data,
  columns,
  getRowId,
  actions,
  actionsHeader = '',
  pinActions = false,
  striped = false,
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
  emptyMessage = 'لا توجد بيانات للعرض.',
  dir = 'rtl',
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  // ---- Store & Column Visibility -----------------------------------------
  const { hiddenColumns: allHiddenColumns, toggleColumn } = useTableStore()
  const hiddenColumns = persistedKey ? (allHiddenColumns[persistedKey] || []) : []

  // الأعمدة المرئية فقط هي التي سيتم رسمها
  const visibleColumns = useMemo(() => {
    return columns.filter((col, i) => !hiddenColumns.includes(getColumnId(col, i)))
  }, [columns, hiddenColumns])

  // ---- Selection State ---------------------------------------------------
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

  // ---- Column Layout & Pinning -------------------------------------------
  const showPagination = currentPage !== undefined && totalPages !== undefined && totalItems !== undefined && perPage !== undefined && onPageChange !== undefined

  const checkboxIndex = selectable ? 0 : -1
  const columnStartIndex = selectable ? 1 : 0
  const colCount = (selectable ? 1 : 0) + visibleColumns.length + (actions ? 1 : 0)
  const actionsIndex = actions ? colCount - 1 : -1

const hasActions = !!actions;

  const pinnedMap = useMemo(() => {
    const map: Record<number, 'start' | 'end'> = {}
    if (selectable) map[checkboxIndex] = 'start'
    visibleColumns.forEach((col, i) => {
      if (col.pinned) map[columnStartIndex + i] = col.pinned
    })
    if (hasActions && pinActions) map[actionsIndex] = 'end'
    return map
  }, [visibleColumns, selectable, hasActions, pinActions, checkboxIndex, columnStartIndex, actionsIndex])

  const hasPinnedColumns = Object.keys(pinnedMap).length > 0

  // ---- Sticky Positioning Offsets ----------------------------------------
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

      // التحديث الآمن: لا تقم بتحديث الـ State إلا إذا اختلفت الأرقام فعلياً
      setPinOffsets((prev) => {
        const prevKeys = Object.keys(prev);
        const newKeys = Object.keys(offsets);
        
        if (prevKeys.length !== newKeys.length) return offsets;
        
        for (const key of newKeys) {
          if (prev[Number(key)] !== offsets[Number(key)]) {
            return offsets; // القيمة تغيرت، قم بتحديث الحالة
          }
        }
        
        return prev; // لم يتغير شيء، لا تقم بعمل Re-render
      })
    }

    computeOffsets()
    const ro = new ResizeObserver(computeOffsets)
    if (wrapperRef.current) ro.observe(wrapperRef.current)
    window.addEventListener('resize', computeOffsets)
    
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', computeOffsets)
    }
  }, [pinnedMap, colCount, hasPinnedColumns, data.length, visibleColumns.length])

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
    <div className={cn('flex flex-col rounded-lg overflow-hidden bg-surface', className)}>
      
      {/* ---- Header Section ---- */}
      {(title || description || tableActions || persistedKey) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 p-2">
          <div className="flex flex-col min-w-0">
            {title && <h3 className="text-[13px] font-bold text-text truncate">{title}</h3>}
            {description && <p className="text-[11px] text-text-muted truncate">{description}</p>}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {tableActions}
            
            {/* زر التحكم في الأعمدة */}
            {persistedKey && (
              <DropdownMenu
              menuClassName='w-35!'
                
                align="start"
                trigger={
                  // <IconButton icon={<Columns3 />} variant="ghost" size="sm" title="إعدادات الأعمدة" />
                  <>
                    <Button
                      variant='secondary'
                      tint
                      leftIcon={<ChevronsUpDown className='text-[8px]!' />}
                    >الاعمدة</Button>
                  </>
                }
              >
                <div className="px-2 py-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  إظهار الأعمدة
                </div>
                <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5">
                  {columns.map((col, i) => {
                    const colId = getColumnId(col, i)
                    const isVisible = !hiddenColumns.includes(colId)
                    return (
                      <DropdownMenuCheckItem
                        key={colId}
                        checked={isVisible}
                        onCheckedChange={() => toggleColumn(persistedKey, colId)}
                        className={
                          cn(
                            isVisible && 'bg-accent-tint! text-text!',
                            'hover:bg-secondary-tint/80 text-[11px]!'
                          )
                        }
                        iconClassName={`${isVisible && 'text-text'}`}
                      >
                        {col.header}
                      </DropdownMenuCheckItem>
                    )
                  })}
                </div>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      {/* ---- Table Section ---- */}
      <div ref={wrapperRef} className="overflow-x-auto">
        <table dir={dir} className="w-full">
          <thead>
            <tr className="">
              {selectable && (
                <th
                  ref={(el) => { headerCellRefs.current[checkboxIndex] = el }}
                  style={pinnedStyle(checkboxIndex)}
                  className="w-10 px-2.5 py-2 bg-surface"
                >
                  <Checkbox checked={allOnPageSelected} indeterminate={someOnPageSelected} onChange={toggleSelectAll} />
                </th>
              )}

              {visibleColumns.map((col, i) => {
                const index = columnStartIndex + i
                return (
                  <th
                    key={index}
                    ref={(el) => { headerCellRefs.current[index] = el }}
                    style={{ width: col.width, ...pinnedStyle(index) }}
                    className={cn(
                      'text-start px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text whitespace-nowrap bg-[#e1e0d6]',
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
                  className="text-start px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-text whitespace-nowrap bg-[#e1e0d6]"
                >
                  {actionsHeader}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="border-b border-border/50 last:border-0">
                  {Array.from({ length: colCount }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-2 py-3 bg-white">
                      <div className="h-4 rounded bg-secondary/20 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={colCount || 1} className="px-2 py-8 text-center text-[12px] text-text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => {
                const id = getRowId(item)
                const isSelected = selected.has(id)
                // منطق الـ Striped Rows
                const rowBg = isSelected ? 'bg-primary/5' : (striped && rowIndex % 2 !== 0 ? 'bg-background/40' : 'bg-surface')

                return (
                  <tr
                    key={id}
                    className={cn(
                      'border-b border-border/50 last:border-0 transition-colors hover:bg-surface-raised',
                      onRowClick && 'cursor-pointer',
                      rowBg,
                      rowClassName?.(item),
                    )}
                    onClick={() => onRowClick?.(item)}
                  >
                    {selectable && (
                      <td style={pinnedStyle(checkboxIndex)} className={cn('px-2.5 py-2', rowBg)}>
                        <Checkbox checked={isSelected} onChange={() => toggleRow(id)} />
                      </td>
                    )}

                    {visibleColumns.map((col, i) => {
                      const index = columnStartIndex + i
                      return (
                        <td
                          key={index}
                          style={pinnedStyle(index)}
                          className={cn('px-2 py-2 whitespace-nowrap', pinnedMap[index] && rowBg, col.cellClassName)}
                        >
                          {col.render ? col.render(item) : col.accessor ? (item[col.accessor] as React.ReactNode) : null}
                        </td>
                      )
                    })}

                    {actions && (
                      <td style={pinnedStyle(actionsIndex)} className={cn('px-2 py-2', pinnedMap[actionsIndex] && rowBg)}>
                        <div className="flex items-center gap-1 justify-end">{actions(item)}</div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* ---- Pagination Section ---- */}
        {showPagination && data.length > 0 && !loading && (
          <div className="px-2 py-2 border-t border-border/80 bg-surface">
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