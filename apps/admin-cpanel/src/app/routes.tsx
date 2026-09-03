import { LayoutDashboard, Settings } from "lucide-react"
import { type IconType } from "react-icons"
import { useLocation } from "react-router-dom"

export type AppRoute = {
    path: string
    label: string
    description?: string
    icon: IconType
}


export const Routes: Record<string, AppRoute> = {
    "/": {
        path: "/",
        label: "Dashboard",
        description: "Quick look on your system",
        icon: LayoutDashboard,
    },


    "/settings": {
        path: "/settings",
        label: "Settings",
        description: "manage your system settings",
        icon: Settings,
    }
}

export const useRouteContext = () => {
    const { pathname } = useLocation()

    return Routes[pathname] as AppRoute | null
}
