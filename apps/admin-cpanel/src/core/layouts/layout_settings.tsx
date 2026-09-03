import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutState {
  isSidebarCollapsed: boolean
}

interface LayoutActions {
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void
}

type LayoutStore = LayoutState & LayoutActions

const initialState: LayoutState = {
  isSidebarCollapsed: true,
}

export const useLayoutSettings = create<LayoutStore>()(
  persist(
    (set) => ({
      ...initialState,
      setIsSidebarCollapsed: (isSidebarCollapsed) =>
        set({ isSidebarCollapsed }),
    }),
    {
      name: 'layout-settings', // localStorage key
      partialize: (state) => ({ isSidebarCollapsed: state.isSidebarCollapsed }), // only persist state, not actions
    }
  )
)