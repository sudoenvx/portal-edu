import { useState } from 'react'
import { LOGO } from '@/core/assets'
import { useLayoutSettings } from '@/core/layouts/layout_settings'
import { Menu, PanelRightClose, PanelRightOpen, Power, Maximize, Minimize, Moon, Sun } from 'lucide-react'

type NavbarProps = {
  onMobileMenuClick: () => void
}

function getCurrentDate() {
  // Format: FRI, SEP 4, 10:21 PM
  return new Intl.DateTimeFormat('en', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric' 
  }).format(new Date()).toUpperCase()
}

export function Navbar({ onMobileMenuClick }: NavbarProps) {
  const { isSidebarCollapsed, toggleSidebar, isDarkMode, toggleDarkMode } = useLayoutSettings()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleLogout = async () => {
    // Logic for logout
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <header className="z-40 flex h-12 shrink-0 items-center justify-between bg-surface px-2 border-b border-border/50">
      
      {/* الجزء الأيمن: اللوجو وزر التحكم بالقائمة */}
      <div className="flex items-center gap-4">
        {/* زر الموبايل */}
        <button
          type="button"
          onClick={onMobileMenuClick}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-muted hover:bg-secondary-tint hover:text-text lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* اللوجو فقط بدون الاسم */}
        <div className="flex items-center select-none">
          <img src={LOGO} alt="Portal Edu Logo" className="h-7 w-7 object-contain" />
        </div>

        {/* زر طي القائمة */}
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
          className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-sm text-text-muted hover:bg-secondary-tint hover:text-text transition-colors"
        >
          {isSidebarCollapsed ? <PanelRightOpen size={18} /> : <PanelRightClose size={18} />}
        </button>
      </div>

      {/* الجزء الأيسر: التاريخ وأدوات النظام */}
      <div className="flex items-center gap-2 sm:gap-2">
        
        {/* التاريخ بالإنجليزية والشكل المختصر */}
        <div className="hidden items-center px-2 text-primary-dark md:flex font-inter">
          <span className="text-[11px] font-bold tracking-wider">{getCurrentDate()}</span>
        </div>

        <div className="h-4 w-px bg-border hidden sm:block mx-1" />

        <div className="flex gap-1">
          {/* زر ملء الشاشة */}
        <button 
          onClick={toggleFullScreen}
          title="ملء الشاشة"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-muted hover:bg-creamy hover:text-text transition-colors duration-200"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>

        {/* زر الوضع الداكن */}
        <button 
          onClick={toggleDarkMode}
          title="تغيير المظهر"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-text-muted hover:bg-creamy hover:text-text transition-colors duration-200"
        >
          {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        {/* زر تسجيل الخروج */}
        <button 
          onClick={handleLogout} 
          title="تسجيل الخروج"
          className="flex h-7 w-7 items-center justify-center rounded-sm bg-danger text-white hover:bg-danger-hover transition-colors duration-200 ms-1"
        >
          <Power className="h-4 w-4" />
        </button>
        </div>
      </div>
    </header>
  )
}