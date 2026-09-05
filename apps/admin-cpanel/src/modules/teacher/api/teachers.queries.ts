import { useGetPaginatedQuery } from '@/core/hooks/use_query_actions'
import type { Teacher } from '../types/teachers.types'

export function useTeachers(page: number = 1, search?: string) {
  return useGetPaginatedQuery<Teacher>({
    key: ['teachers', page, search],
    url: '/admin/teachers',
    params: {
      page,
      search: search || undefined,
    },
  })
}