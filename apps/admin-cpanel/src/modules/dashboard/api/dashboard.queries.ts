import { useGetQuery } from '@/core/hooks/use_query_actions'
import type { DashboardStats, TeacherRecord } from '../types/dashboard.types'

// جلب إحصائيات لوحة التحكم
export function useDashboardStats() {
  return useGetQuery<DashboardStats>({
    key: ['dashboard', 'stats'],
    url: 'admin/dashboard/stats',
  })
}

// جلب أحدث المدرسين
export function useLatestTeachers() {
  return useGetQuery<TeacherRecord[]>({
    key: ['dashboard', 'latest-teachers'],
    url: 'admin/teachers/latest',
  })
}