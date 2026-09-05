import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  // إغلاق القائمة الجانبية في الموبايل عند تغيير المسار
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen w-full flex-col bg-background text-ink overflow-hidden" dir="rtl">
      
      {/* الـ Navbar الآن في الأعلى ويغطي العرض بالكامل */}
      <Navbar onMobileMenuClick={() => setMobileMenuOpen(true)} />

      {/* منطقة المحتوى السفلي (تحتوي على القائمة الجانبية ومحتوى الصفحة) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* القائمة الجانبية */}
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onMobileClose={() => setMobileMenuOpen(false)} 
        />

        {/* محتوى الصفحة الرئيسي */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        
      </div>
    </div>
  )
}

export default MainLayout