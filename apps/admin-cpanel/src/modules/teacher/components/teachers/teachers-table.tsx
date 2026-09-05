import { useMemo, useState } from 'react'
import { Eye, MoreVertical, CreditCard, Ban, Pencil, Trash } from 'lucide-react'
import { DataTable, IconButton, DropdownMenu, DropdownMenuItem } from '@portal-edu/ui'
import { useTeachers } from '../../api/teachers.queries'
import { useDeleteTeacher } from '../../api/teachers.mutations'
import type { Teacher } from '../../types/teachers.types'
import { useNotification } from '@/core/hooks/use_notification'


interface Props {
  searchQuery: string
}

export function TeachersTable({ searchQuery }: Props) {
  const [page, setPage] = useState(1)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const { data: result, isLoading } = useTeachers(page, searchQuery)
  const deleteMutation = useDeleteTeacher()
  const { notify } = useNotification()

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
      try {
        await deleteMutation.mutateAsync({ id })
        notify.success('تم حذف المدرس بنجاح')
      } catch (error: any) {
        notify.error('فشل في الحذف')
      }
    }
  }

  const columns = useMemo(() => [
    {
      header: 'المدرس',
      accessor: 'name' as keyof Teacher,
      render: (item: Teacher) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text text-[12px]">{item.name}</span>
          <span className="text-[11px] text-text-muted">{item.phone}</span>
        </div>
      ),
    },
    {
      header: 'المادة',
      accessor: 'subject' as keyof Teacher,
      render: (item: Teacher) => (
        <span className="text-[12px] text-text-muted font-medium">{item.subject}</span>
      )
    },
    {
      header: 'إجمالي الطلاب',
      accessor: 'studentsCount' as keyof Teacher,
      render: (item: Teacher) => (
        <span className="text-[12px] font-semibold text-text tabular-nums">
          {item.studentsCount}
        </span>
      )
    },

    {
      header: 'تاريخ الانضمام',
      accessor: 'joinDate' as keyof Teacher,
      render: (item: Teacher) => <span className="text-[12px] text-text-muted">{item.joinDate}</span>
    },
  ], [])

  return (
    <>
      <DataTable
        dir="rtl"
        data={result?.data || []}
        columns={columns}
        getRowId={(item) => item.id}
        loading={isLoading}
        persistedKey='teachers-main-table'
        striped
        title="قائمة المدرسين"
        description="عرض جميع المدرسين في النظام مع إمكانية البحث والتصفح."

        // إعدادات التصفح (Pagination) المربوطة بـ Backend
        currentPage={result?.meta?.current_page}
        totalPages={result?.meta?.last_page}
        totalItems={result?.meta?.total}
        perPage={result?.meta?.per_page}
        onPageChange={(newPage) => setPage(newPage)}

        actionsHeader="الإجراءات"
        pinActions
        actions={(item) => (
          <div className="flex items-center gap-1">
            <IconButton icon={<Eye />} variant="ghost" size="sm" title="عرض التفاصيل" />
            <DropdownMenu
              align="end"
              trigger={<IconButton icon={<MoreVertical />} variant="ghost" size="sm" />}
            >
              <DropdownMenuItem icon={<Pencil />} onSelect={() => setEditingTeacher(item)}>
                تعديل البيانات
              </DropdownMenuItem>
              <DropdownMenuItem icon={<CreditCard />}>سجل الفواتير</DropdownMenuItem>
              <DropdownMenuItem variant="danger" icon={<Ban />}>إيقاف مؤقت</DropdownMenuItem>
              <DropdownMenuItem variant="danger" icon={<Trash />} onSelect={() => handleDelete(item.id)}>
                حذف نهائي
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        )}
      />

    </>
  )
}