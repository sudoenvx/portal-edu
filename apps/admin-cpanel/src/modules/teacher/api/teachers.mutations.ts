import { useMutationAction } from '@/core/hooks/use_query_actions'
import type { TeacherFormValues } from '../schemas/teachers.schemas'

export function useAddTeacher() {
  return useMutationAction<void, TeacherFormValues>({
    method: 'post',
    url: '/teachers',
    key: ['teachers'], // سيقوم بتحديث جدول المدرسين تلقائياً
  })
}

export function useUpdateTeacher(teacherId: string) {
  return useMutationAction<void, TeacherFormValues>({
    method: 'put',
    url: `/admin/teachers/${teacherId}`,
    key: ['teachers'],
  })
}

export function useDeleteTeacher() {
  return useMutationAction<void, { id: string }>({
    method: 'delete',
    url: (data) => `/admin/teachers/${data.id}`,
    key: ['teachers'],
  })
}