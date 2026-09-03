import { useLayoutSettings } from '@/core/layouts/layout_settings'
import { cn } from '@/core/utils'
import { Popover } from '@portal-edu/ui'
import {
  ChevronsUpDown,
  Globe,
  LayoutDashboard,
  X,
  Folder,
  Stethoscope,
  UserStarIcon,
  ChevronRight,
  Code,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

type SidebarProps = {
  open: boolean
  onClose: () => void
}

type NavigationItem = {
  label: string
  href: string
  icon: typeof LayoutDashboard
  end?: boolean
}

const mainNavigation: NavigationItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, end: true },
  { label: 'Patient Cases', href: '/cases', icon: Folder },
  { label: 'Portals', href: '/portals', icon: Globe },
  { label: 'Doctors', href: '/doctors', icon: Stethoscope },
  { label: 'Managers', href: '/managers', icon: UserStarIcon },
  { label: 'Development', href: '/dev', icon: Code },
  // { label: 'Settings', href: '/settings', icon: Settings },
]


// Detects >=1024px (Tailwind's `lg`) reactively so the JSX we render for
// collapsed mode always matches the CSS breakpoint driving the width.
function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true))

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => setIsLarge(mql.matches)
    handleChange()
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isLarge
}

function NavigationSection({
  title: _title,
  items,
  onClose,
  collapsed,
}: {
  title: string
  items: NavigationItem[]
  onClose: () => void
  collapsed: boolean
}) {
  return (
    <section className={cn('mt-6 first:mt-0', collapsed && 'mt-3')}>
      {/* {collapsed ? (
        <div className="mx-auto mb-1.5 h-px w-5 bg-text" />
      ) : (
        <h2 className="mb-2 px-3 text-[10px] font-bold tracking-wide text-text-muted">{title}</h2>
      )} */}

      <div className={cn('space-y-1', collapsed && 'flex flex-col items-center gap-1.5 space-y-0')}>
        {items.map((item) => {
          const Icon = item.icon

          if (collapsed) {
            return (
              <Popover
                key={item.href}
                side="right"
                align="center"
                offset={10}
                triggerType="hover"
                triggerClassName="w-fit"
                contentClassName="px-3 py-1 text-[12px] bg-surface rounded-xs font-medium whitespace-nowrap text-text"
                trigger={
                  <NavLink
                    to={item.href}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex h-8  w-8  items-center justify-center rounded-xs transition-colors duration-0',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                        isActive
                          ? 'bg-primary text-primary-text'
                          : 'text-text-muted bg-secondary-tint hover:bg-secondary hover:text-secondary-text',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <Icon className={cn('h-5 w-5', isActive ? 'text-primary-text' : 'text-text group-hover:text-secondary-text')} strokeWidth={1.8} />
                    )}
                  </NavLink>
                }
              >
                {item.label}
              </Popover>
            )
          }

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex h-8 items-center gap-3 rounded-xs px-2 text-[13px] font-medium transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                  isActive
                    ? 'bg-primary text-primary-text'
                    : 'text-text-muted hover:bg-creamy hover:text-secondary-tint-text focus-visible:bg-secondary-tint focus-visible:text-secondary',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-[17px] w-[17px] shrink-0', isActive ? 'text-primary-text' : 'text-text-muted group-hover:text-text')} strokeWidth={1.8} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className={cn('h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-80', isActive && 'opacity-100')} />
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </section>
  )
}

// Placeholder user menu — swap the name/role/avatar and the button actions
// for real auth data + handlers when wiring this up.
function SidebarUserMenu({ collapsed }: { collapsed: boolean }) {
  return (
    <Popover
      side="right"
      align="end"
      offset={collapsed ? 14 : 14}
      triggerType="click"
      triggerClassName={cn('rounded-xs', collapsed && 'flex justify-center')}
      contentClassName="w-56 p-1.5 "
      open={false}
      trigger={
        <span
          className={cn(
            'flex items-center gap-2 rounded-xs transition-colors duration-0 bg-creamy hover:bg-creamy-muted group',
            collapsed ? 'justify-center bg-secondary-tint hover:bg-secondary' : 'justify-between w-60 px-2 py-1',
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-xs  text-text  transition-colors font-bold',
                collapsed ? 'h-8 w-8 text-[11px]' : 'h-6 w-6 text-[12px]',
              )}
            >
              {/* <AdminUserIcon className="h-5 w-5 group-hover:text-white" /> */}
            </span>
            {!collapsed && (
              <span className="min-w-0 text-right">
                <p className="truncate text-[12px] font-semibold text-text">أحمد المدير</p>
                <p className="truncate text-[11px] text-text-muted">مدير النظام</p>
              </span>
            )}
          </span>
          {!collapsed && <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-muted" />}
        </span>
      }
    >
      body
      {/* <AdminDropdownMenu /> */}
    </Popover>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { isSidebarCollapsed } = useLayoutSettings()
  const isLargeScreen = useIsLargeScreen()
  // Collapse only ever applies on large screens — on mobile the drawer is
  // always shown fully expanded regardless of the toggle's last state.
  const isCollapsed = isSidebarCollapsed && isLargeScreen

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="إغلاق القائمة الجانبية"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#000000]/20 backdrop-blur-[1px] lg:hidden"
        />
      )}

      <aside
        aria-label="القائمة الرئيسية"
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-surface transition-all duration-200',
          'max-lg:translate-x-full rounded-md',
          open && 'max-lg:translate-x-0 max-lg:rounded-none left-0',
          // On desktop the sidebar joins the flex row as a sticky column instead
          // of being fixed to the viewport, so it sits inline with the p-4 gap.
          'lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:translate-x-0',
          // Fixed rail width in collapsed mode keeps every part (header, items,
          // footer) aligned on the same 2/1.5-scale box instead of shrink-wrapping.
          isCollapsed ? 'lg:w-auto ' : 'lg:w-64',
        )}
      >
        {/* Collapse toggle — floats on the sidebar's inner edge, desktop only */}
        {/* <button
          type="button"
          onClick={() => setIsSidebarCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
          className="absolute -left-3 top-10 z-10 hidden h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-text lg:flex"
        >
          {isCollapsed ? (
            <SidebarCloseIcon className="h-3.5 w-3.5 transition-transform" />
          ) : (
            <SidebarOpenIcon className="h-3.5 w-3.5 transition-transform" />
          )}
        </button> */}

        <div className={cn(isCollapsed ? 'p-1.5' : 'p-2')}>
          <div className={cn('flex items-center gap-2', isCollapsed ? 'justify-center' : 'justify-between')} dir="rtl">
            <div className="flex min-w-0 items-center gap-2">
                <img src={'LOGO'} alt="Ortho logo" className="h-8 w-8 object-contain" />
              {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs bg-secondary-tint">
              </span> */}
              {!isCollapsed && <p className="truncate text-[17px] font-medium text-text select-none">Orthotec</p>}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق القائمة الجانبية"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted hover:bg-background hover:text-text focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className={cn('min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2', isCollapsed ? 'px-1' : 'px-2')}>
          <NavigationSection title="الرئيسية" items={mainNavigation} onClose={onClose} collapsed={isCollapsed} />
        </nav>

        <footer className={cn('mt-3', isCollapsed ? 'flex justify-center p-1.5' : 'p-2 w-full')}>
          <SidebarUserMenu collapsed={isCollapsed} />
        </footer>
      </aside>
    </>
  )
}
