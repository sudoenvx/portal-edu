import {
  LayoutDashboard,
  Menu,
  Power,
  SidebarCloseIcon,
} from 'lucide-react'
// import { Popover } from '../ui'
// import AdminUserIcon from '@/core/components/shared/admin_logo'
import { useRouteContext } from '@/app/routes'
// import AdminDropdownMenu from '@/core/components/shared/admin_dropdown_content'
// import { useNotification } from '@/core/hooks/use_notification'
// import { useNavigate } from 'react-router-dom'
import { cn } from '@/core/utils'

type NavbarProps = {
  onMenuClick: () => void
  sidebarOpen: boolean
}

// function NavbarUserMenu() {
//   return (
//     <Popover
//       side="bottom"
//       align="center"
//       offset={8}
//       triggerType="click"
//       triggerClassName="rounded-sm focus-visible:outline-none focus-visible:outline-offset-2 focus-visible:outline-primary"
//       contentClassName="w-54 p-1.5"
//       trigger={
//         <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-secondary-tint hover:bg-secondary-tint-dark text-text transition-colors duration-200 text-[11px] font-bold">
//           <AdminUserIcon className="h-5 w-5" />
//         </span>

//       }
//     >
//       <AdminDropdownMenu />
//     </Popover>
//   )
// }

function getCurrentDate() {
  return new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: 'numeric' }).format(new Date())
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const routeContext = useRouteContext()
  // const { logoutMutation } = useAuth()
  // const { notify } = useNotification()
  // const navigate = useNavigate()

  const handleLogout = async () => {
    // await logoutMutation.mutateAsync({}, {
    //   onSuccess() {
    //     notify.success('Logged out successfully')
    //     navigate('/login', { replace: true })
    //   }
    // })
  }

  return (
    <header className="sticky top-4 z-30 rounded-sm bg-surface/80 py-1.5 px-1.5 backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between gap-2 ">
        <div className="flex min-w-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={sidebarOpen ? 'إغلاق القائمة الجانبية' : 'فتح القائمة الجانبية'}
            aria-expanded={sidebarOpen}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-secondary-tint text-text-muted transition-colors duration-200 hover:bg-secondary/30 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
          >
            {sidebarOpen ? <SidebarCloseIcon className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>

          {
            routeContext != null ? (
              <div className="flex min-w-0 items-center gap-2">
                <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-text sm:inline-flex">
                  <routeContext.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold leading-4 text-text">{routeContext.label}</p>
                  <p className="hidden truncate text-[11px] leading-4 text-text-muted sm:block">{routeContext.description}</p>
                </div>
              </div>
            ) : (
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-text sm:inline-flex">
                <LayoutDashboard className="h-5 w-5" strokeWidth={1.8} />
              </span>
            )
          }
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="hidden items-center gap-1.5 rounded-sm px-2 text-primary-dark md:flex">
            {/* <CalendarDays className="h-4 w-4" strokeWidth={1.8} /> */}
            <span className="text-[12px] uppercase font-medium font-inter">{getCurrentDate()}</span>
          </div>

          {/* <NavbarUserMenu /> */}
          {/* logout icon */}
          <span onClick={handleLogout} className={
            cn(
              "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-danger text-danger-text hover:bg-danger-hover transition-colors duration-200 text-[11px] font-bold",
              // logoutMutation.isPending && 'pointer-events-none bg-text-faint! hover:bg-text-faint text-text'
            )
          }>
            {
            <Power className="h-4.5 w-4.5" />
              // logoutMutation.isPending ? (
              //   <Loader2 className="h-4.5 w-4.5 animate-spin" />
              // ) : (
              // )
            }
          </span>

        </div>
      </div>
    </header>
  )
}
