import { useQuery } from '@tanstack/react-query'
import type { TeacherProfileDetails } from '../types/teacher-profile.types'

// محاكاة استدعاء API لبيانات المدرس
const fetchDummyTeacherProfile = async (id: string): Promise<TeacherProfileDetails> => {
  // محاكاة تأخير الشبكة
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    id,
    name: 'أحمد محمود',
    phone: '01012345678',
    email: 'ahmed.m@example.com',
    subject: 'الفيزياء',
    pricePerStudent: 15,
    status: 'ACTIVE',
    joinDate: '2026/09/03',
    stats: {
      totalStudents: 450,
      activeGroups: 12,
      totalRevenue: 24500,
      currentMonthOwed: 6750,
    },
    settings: {
      allowLogin: true,
      canAddNewStudents: true,
      requireInvoicePayment: false,
    },
    recentInvoices: [
      { id: 'inv-001', month: 'أغسطس 2026', amount: 6200, isPaid: true },
      { id: 'inv-002', month: 'سبتمبر 2026', amount: 6750, isPaid: false },
    ],
    locations: [
      { id: 'loc-1', name: 'سنتر الفرسان - الإسكندرية', groupsCount: 5 },
      { id: 'loc-2', name: 'مجموعات أونلاين', groupsCount: 7 },
    ]
  }
}

export function useTeacherProfile(teacherId: string) {
  return useQuery({
    queryKey: ['teachers', 'profile', teacherId],
    queryFn: () => fetchDummyTeacherProfile(teacherId),
  })
}