import { useMemo } from 'react'
import { Eye, MoreVertical, CreditCard, Ban } from 'lucide-react'
import { DataTable, Badge, IconButton, DropdownMenu, DropdownMenuItem } from '@portal-edu/ui'
import { useLatestTeachers } from '../api/dashboard.queries'
import type { TeacherRecord } from '../types/dashboard.types'
// import type { BadgeVariant } from '@portal-edu/ui'

const STATUS_MAP = {
  ACTIVE: 'نشط',
  TRIAL: 'تجريبي',
  EXPIRED: 'منتهي'
}

export function LatestTeachersTable() {
  const { data: teachers = [], isLoading } = useLatestTeachers()

  const columns = useMemo(() => [
    {
      header: 'المدرس',
      accessor: 'name' as keyof TeacherRecord,
      render: (item: TeacherRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text text-[12px]">{item.name}</span>
          <span className="text-[11px] text-text-muted">{item.email}</span>
        </div>
      ),
    },
    {
      header: 'المادة',
      accessor: 'subject' as keyof TeacherRecord,
      render: (item: TeacherRecord) => (
        <span className="text-[12px] text-text-muted font-medium">{item.subject}</span>
      )
    },
    {
      header: 'إجمالي الطلاب',
      accessor: 'studentsCount' as keyof TeacherRecord,
      render: (item: TeacherRecord) => (
        <span className="text-[12px] font-semibold text-text tabular-nums">
          {item.studentsCount}
        </span>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status' as keyof TeacherRecord,
      render: (item: TeacherRecord) => {
        let variant: BadgeVariant = 'success'
        if (item.status === 'TRIAL') variant = 'warning'
        if (item.status === 'EXPIRED') variant = 'danger'

        return (
          <>
          </>
          //   <Badge variant={variant} size="sm">
          //     {STATUS_MAP[item.status]}
          //   </Badge>
        )
      },
    },
    {
      header: 'تاريخ الانضمام',
      accessor: 'joinDate' as keyof TeacherRecord,
      render: (item: TeacherRecord) => (
        <span className="text-[12px] text-text-muted">{item.joinDate}</span>
      )
    },
  ], [])

  return (
    <DataTable
      dir="rtl"
      data={teachers}
      columns={columns}
      getRowId={(item) => item.id}
      loading={isLoading}
      actionsHeader="الإجراءات"
      pinActions
      actions={(item) => (
        <div className="flex items-center gap-1">
          <IconButton icon={<Eye />} variant="ghost" size="sm" title="عرض التفاصيل" />
          <DropdownMenu
            align="end"
            trigger={<IconButton icon={<MoreVertical />} variant="ghost" size="sm" />}
          >
            <DropdownMenuItem icon={<Eye />}>عرض الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem icon={<CreditCard />}>سجل الفواتير</DropdownMenuItem>
            <DropdownMenuItem variant="danger" icon={<Ban />}>إيقاف الحساب</DropdownMenuItem>
          </DropdownMenu>
        </div>
      )}
    />
  )
}