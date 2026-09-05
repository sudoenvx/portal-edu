export type TeacherAccountStatus = 'ACTIVE' | 'TRIAL' | 'SUSPENDED'

export interface TeacherProfileDetails {
  id: string
  name: string
  phone: string
  email: string
  subject: string
  pricePerStudent: number
  status: TeacherAccountStatus
  joinDate: string
  
  // إحصائيات
  stats: {
    totalStudents: number
    activeGroups: number
    totalRevenue: number
    currentMonthOwed: number
  }

  // إعدادات التحكم (UI/UX Toggles)
  settings: {
    allowLogin: boolean
    canAddNewStudents: boolean
    requireInvoicePayment: boolean
  }

  // أحدث الفواتير
  recentInvoices: {
    id: string
    month: string
    amount: number
    isPaid: boolean
  }[]
  
  // أماكن الشرح
  locations: {
    id: string
    name: string
    groupsCount: number
  }[]
}