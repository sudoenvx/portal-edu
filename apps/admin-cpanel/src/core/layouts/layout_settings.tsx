import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutState {
  isSidebarCollapsed: boolean
  isDarkMode: boolean
}

interface LayoutActions {
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void
  toggleSidebar: () => void
  toggleDarkMode: () => void
}

type LayoutStore = LayoutState & LayoutActions

const initialState: LayoutState = {
  isSidebarCollapsed: false,
  isDarkMode: false,
}

export const useLayoutSettings = create<LayoutStore>()(
  persist(
    (set) => ({
      ...initialState,
      setIsSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      toggleDarkMode: () => {
        set((state) => {
          const newTheme = !state.isDarkMode
          // تطبيق الكلاس على عنصر الـ HTML ليتم تغيير الألوان فوراً
          if (newTheme) document.documentElement.classList.add('dark')
          else document.documentElement.classList.remove('dark')
          return { isDarkMode: newTheme }
        })
      },
    }),
    {
      name: 'portal-layout-settings',
      partialize: (state) => ({ 
        isSidebarCollapsed: state.isSidebarCollapsed,
        isDarkMode: state.isDarkMode
      }),
    }
  )
)