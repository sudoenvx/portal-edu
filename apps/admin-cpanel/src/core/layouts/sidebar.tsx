import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, School, Settings, ChevronDown, UserCog } from 'lucide-react'
import { Popover } from '@portal-edu/ui'
import { useLayoutSettings } from '@/core/layouts/layout_settings'
import { cn } from '@/core/utils'

// --- الأنواع والبيانات ---
type NavigationItem = {
  label: string
  href?: string
  icon: any
  end?: boolean
  children?: Omit<NavigationItem, 'icon' | 'children'>[]
}

const mainNavigation: NavigationItem[] = [
  { label: 'لوحة التحكم', href: '/', icon: LayoutDashboard, end: true },
  { label: 'إدارة المدرسين', href: '/teachers', icon: School },
  {
    label: 'إعدادات النظام',
    icon: Settings,
    children: [
      { label: 'المديرون والصلاحيات', href: '/settings/admins' },
      { label: 'إعدادات الدفع', href: '/settings/billing' },
    ]
  },
]

// --- مكون العنصر الفردي (NavItem) ---
function NavItem({ item, isCollapsed }: { item: NavigationItem, isCollapsed: boolean }) {
  const location = useLocation()
  const Icon = item.icon
  const hasChildren = !!item.children?.length

  const isChildActive = hasChildren && item.children!.some(child => location.pathname.startsWith(child.href || ''))
  const [isOpen, setIsOpen] = useState(isChildActive)

  // -- 1. حالة הـ Sidebar مطوية (Collapsed) --
  if (isCollapsed) {
    const triggerBtn = (
      <button className={cn(
        "group flex h-8 w-8 items-center justify-center rounded-sm transition-colors duration-200",
        isChildActive ? "bg-primary text-primary-text" : "text-text-muted bg-secondary-tint hover:bg-secondary hover:text-secondary-text"
      )}>
        <Icon className={cn("h-4.5 w-4.5", isChildActive ? "text-primary-text" : "text-text group-hover:text-secondary-text")} strokeWidth={1.8} />
      </button>
    )

    if (hasChildren) {
      return (
        <Popover
          side="left"
          align="start"
          triggerType="hover"
          contentClassName="p-1 min-w-[150px] bg-surface rounded-sm"
          offset={12}
          trigger={triggerBtn}
        >
          <div className="px-2 pt-1.5 pb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
            {item.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {item.children!.map((child) => (
              <NavLink
                key={child.href}
                to={child.href!}
                className={({ isActive }) => cn(
                  "block px-2.5 py-1.5 text-[12px] rounded-sm font-medium transition-colors",
                  isActive ? "bg-primary text-white" : "text-text hover:bg-creamy hover:text-primary-dark"
                )}
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        </Popover>
      )
    }

    return (
      <Popover
        side="left"
        align="center"
        offset={10}
        triggerType="hover"
        contentClassName="px-3 py-1 text-[12px] bg-surface border border-border shadow-sm rounded-sm font-medium whitespace-nowrap text-text"
        trigger={
          <NavLink to={item.href!} end={item.end} className={({ isActive }) => cn(
            "group flex h-8 w-8 items-center justify-center rounded-sm transition-colors duration-200",
            isActive ? "bg-primary text-primary-text" : "text-text-muted bg-secondary-tint hover:bg-secondary hover:text-secondary-text"
          )}>
            <Icon className={cn("h-4.5 w-4.5", )} strokeWidth={1.8} />
          </NavLink>
        }
      >
        {item.label}
      </Popover>
    )
  }

  // -- 2. حالة الـ Sidebar مفتوحة (Expanded) --
  
  if (hasChildren) {
    return (
      <div className="flex flex-col">
        {/* العنصر الأب */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group flex h-8 items-center justify-between rounded-sm px-2 transition-colors",
            isChildActive ? "text-primary-dark font-semibold" : "text-text-muted hover:bg-creamy hover:text-text"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon className={cn("h-[17px] w-[17px] shrink-0", isChildActive ? "text-primary-dark" : "text-text-muted group-hover:text-text")} strokeWidth={1.8} />
            <span className="text-[13px]">{item.label}</span>
          </div>
          <ChevronDown className={cn("h-3.5 w-3.5 opacity-60 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>
        
        {/* العناصر الفرعية (Tree view design) */}
        <div 
          className={cn(
            "grid transition-all duration-200 ease-in-out", 
            isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden flex flex-col gap-0.5 pr-[28px]"> {/* الإزاحة لليسار مع الأيقونة */}
            {/* خط التتبع العمودي الجانبي (Guide Line) */}
            <div className="relative border-r border-border/60 pr-2.5 py-1 flex flex-col gap-0.5">
              {item.children!.map((child) => (
                <NavLink
                  key={child.href}
                  to={child.href!}
                  className={({ isActive }) => cn(
                    "relative flex h-7 items-center rounded-sm px-2 text-[12px] transition-colors",
                    isActive ? "bg-primary/10 text-primary-dark font-semibold" : "text-text-muted hover:bg-creamy hover:text-text"
                  )}
                >
                  {/* خط أفقي صغير متصل بخط التتبع (Optional for extra clean look) */}
                  <span className="absolute -right-2.5 top-1/2 w-2 h-px bg-border/60" />
                  <span className="relative z-10">{child.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <NavLink
      to={item.href!}
      end={item.end}
      className={({ isActive }) => cn(
        "group flex h-8 items-center gap-3 rounded-sm px-2 text-[13px] font-medium transition-colors",
        isActive ? "bg-primary text-primary-text" : "text-text-muted hover:bg-creamy hover:text-text"
      )}
    >
      <Icon className={cn("h-[17px] w-[17px] shrink-0", )} strokeWidth={1.8} />
      <span className="flex-1">{item.label}</span>
    </NavLink>
  )
}

// --- المكون الرئيسي للقائمة الجانبية ---
type SidebarProps = {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const { isSidebarCollapsed } = useLayoutSettings()
  const isDesktopCollapsed = isSidebarCollapsed

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full flex-col bg-surface transition-all duration-300 ease-in-out lg:static border-l border-border/50",
          // الموبايل (Drawer)
          mobileOpen ? "translate-x-0 w-64" : "translate-x-full lg:translate-x-0",
          // الديسكتوب
          isDesktopCollapsed ? "lg:w-auto" : "lg:w-64"
        )}
      >
        <nav className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2", isDesktopCollapsed ? "px-1.5" : "px-2")}>
          <div className={cn("flex flex-col", isDesktopCollapsed ? "items-center gap-1.5" : "gap-1")}>
            {mainNavigation.map((item, idx) => (
              <NavItem key={idx} item={item} isCollapsed={isDesktopCollapsed} />
            ))}
          </div>
        </nav>

        <footer className={cn("mt-3", isDesktopCollapsed ? "flex justify-center p-1.5" : "p-2 w-full")}>
          <div className={cn("flex items-center gap-2 rounded-sm bg-creamy transition-colors duration-0", isDesktopCollapsed ? "justify-center p-1" : "px-2 py-1")}>
            <span className="flex min-w-0 items-center gap-2">
              <span className={cn("flex shrink-0 items-center justify-center rounded-sm font-bold text-text", isDesktopCollapsed ? "h-8 w-8 text-[11px]" : "h-6 w-6 text-[12px]")}>
                <UserCog className="h-5 w-5 opacity-80" />
              </span>
              {!isDesktopCollapsed && (
                <span className="min-w-0 text-right">
                  <p className="truncate text-[12px] font-semibold text-text">أحمد المدير</p>
                  <p className="truncate text-[11px] text-text-muted">مدير النظام</p>
                </span>
              )}
            </span>
          </div>
        </footer>
      </aside>
    </>
  )
}