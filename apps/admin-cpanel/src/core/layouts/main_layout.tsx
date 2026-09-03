import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const closeSidebarOnDesktop = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false)
    }

    window.addEventListener('resize', closeSidebarOnDesktop)
    return () => window.removeEventListener('resize', closeSidebarOnDesktop)
  }, [])

  return (
    <div className="min-h-screen bg-background text-ink">
      <div className="flex gap-4 p-4">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col gap-4 max-w-5xl mx-auto">
          <Navbar onMenuClick={() => setSidebarOpen((isOpen) => !isOpen)} sidebarOpen={sidebarOpen} />

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout