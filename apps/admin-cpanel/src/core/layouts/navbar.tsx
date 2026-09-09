import { useNavigate } from 'react-router-dom'
import { LayoutNavbar, type NotificationItemProps } from '@portal-edu/ui'
import { useAdminLogout } from '@/modules/auth/api/auth.mutations'
import Cookies from 'js-cookie'

type NavbarProps = { onMobileMenuClick: () => void }
const notifications: NotificationItemProps[] = [
  { variant: 'warning', title: 'اشتراك يحتاج مراجعة', description: 'يوجد حساب تعليمي يقترب من نهاية الاشتراك.', timestamp: 'منذ 20 دقيقة', read: false },
  { variant: 'info', title: 'مدرس جديد', description: 'تم إنشاء حساب مدرس جديد على المنصة.', timestamp: 'منذ 3 ساعات' },
]

export function Navbar({ onMobileMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const logoutMutation = useAdminLogout()
  const logout = async () => { try { await logoutMutation.mutateAsync() } finally { Cookies.remove('access_token'); localStorage.removeItem('access_token'); navigate('/login', { replace: true }) } }
  return <LayoutNavbar onMobileMenuClick={onMobileMenuClick} title="لوحة إدارة EDU-HUB" notifications={notifications} onLogout={logout} />
}