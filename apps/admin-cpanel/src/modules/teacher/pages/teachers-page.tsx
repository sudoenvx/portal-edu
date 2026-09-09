import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  GraduationCap,
  UserCheck,
  Users,
  Layers,
  BookOpen,
  Mail,
  Settings
} from 'lucide-react'
import {
  Button,
  Input,
  DataTable,
  Badge,
  StatisticCard,
  Body,
  Pagination,
  IconButton,
} from '@portal-edu/ui'
import { useDebounce } from '@/core/hooks/use_debounce'
import { useTeachersList, type TeacherListItem } from '../api/teachers.queries'
import { useAdminStats } from '@/modules/dashboard/api/dashboard.queries'

const STATUS_MAP: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  active: { label: 'نشط', variant: 'success' },
  inactive: { label: 'غير نشط', variant: 'neutral' },
  suspended_payment: { label: 'موقوف (دفع)', variant: 'danger' },
  trial: { label: 'تجريبي', variant: 'warning' },
}

export default function TeachersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 400)

  const { data: result, isLoading } = useTeachersList(page, debouncedSearch)
  const { data: stats } = useAdminStats()

  const columns = useMemo(
    () => [
      {
        header: 'المدرس',
        accessor: 'fullName' as keyof TeacherListItem,
        render: (item: TeacherListItem) => (
          <div className="flex items-center gap-3">
            {/* <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
              {item.fullName ? item.fullName.charAt(0) : 'م'}
            </div> */}
            <div className="flex flex-col">
              <span className="font-bold text-text text-xs hover:text-primary transition-colors">
                {item.fullName}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-text-muted mt-0.5">
                {item.phoneNumber && (
                  <span className="flex items-center gap-1">
                    {/* <Phone size={10} /> */}
                    {item.phoneNumber}
                  </span>
                )}
                {item.email && !item.phoneNumber && (
                  <span className="flex items-center gap-1">
                    <Mail size={10} />
                    {item.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        header: 'المادة الدراسية',
        accessor: 'subjectSpecialization' as keyof TeacherListItem,
        render: (item: TeacherListItem) => (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-subtle text-text text-[11px] ">
            <BookOpen size={11} className="text-text" />
            {item.subjectSpecialization || 'عام'}
          </span>
        ),
      },
      {
        header: 'الطلاب النشطون',
        accessor: 'studentsCount' as keyof TeacherListItem,
        render: (item: TeacherListItem) => (
          <div className="flex items-center gap-1.5 tabular-nums text-xs font-bold text-primary">
            <Users size={12} className="text-primary/70" />
            <span>{item.studentsCount ?? 0}</span>
          </div>
        ),
      },
      {
        header: 'المجموعات',
        accessor: 'groupsCount' as keyof TeacherListItem,
        render: (item: TeacherListItem) => (
          <div className="flex items-center gap-1.5 tabular-nums text-xs font-semibold text-text">
            <Layers size={12} className="text-text-muted" />
            <span>{item.groupsCount ?? 0}</span>
          </div>
        ),
      },
      {
        header: 'حالة الحساب',
        render: (item: TeacherListItem) => {
          const cfg = STATUS_MAP[item.accountStatus] || { label: item.accountStatus, variant: 'neutral' as const }
          return (
            <Badge  size="sm">
              {cfg.label}
            </Badge>
          )
        },
      },

      {
        header: '',
        render: (item) => (
          <Link to={`/teachers/${item.id}`}>
              <IconButton color='secondary' aria-label="تعديل المدرس" icon={<Settings size={15} />} size="sm" title="عرض تفاصيل المدرس وإدارته"/>
          </Link>
        )
      }
    ],
    []
  )

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300 h-full pb-10">
      
      {/* 2. Top KPI Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatisticCard
          label="إجمالي المدرسين"
          value={String(stats?.totalTeachers ?? result?.meta?.total ?? 0)}
          icon={GraduationCap}
          iconClassName="bg-primary/10 text-primary"
          description={() => (
            <p className="text-[10px] text-text-muted mt-2">جميع حسابات المدرسين المسجلة بالنظام</p>
          )}
        />
        <StatisticCard
          label="المدرسون النشطون"
          value={String(stats?.activeTeachers ?? 0)}
          icon={UserCheck}
          iconClassName="bg-success/10 text-success"
          description={() => (
            <p className="text-[10px] text-success mt-2 font-medium">حسابات نشطة ومسددة للاشتراك</p>
          )}
        />
        <StatisticCard
          label="إجمالي الطلاب المسجلين"
          value={String(stats?.enrolledStudents ?? 0)}
          icon={Users}
          iconClassName="bg-info/10 text-info"
          description={() => (
            <p className="text-[10px] text-text-muted mt-2">عبر كافة مجموعات المدرسين</p>
          )}
        />
        <StatisticCard
          label="المجموعات الدراسية"
          value={String(stats?.activeGroups ?? 0)}
          icon={Layers}
          iconClassName="bg-warning/10 text-warning"
          description={() => (
            <p className="text-[10px] text-text-muted mt-2">فصول وحصص دراسية فعالة</p>
          )}
        />
      </div>

      {/* 3. Search and Table Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full max-w-sm">
          <Input
            placeholder="ابحث بالاسم، الهاتف، المادة، البريد..."
            variant="filled"
            leadingIcon={<Search size={14} />}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      {/* 4. Teachers Data Table */}
      <DataTable
        title={
          <div className="flex items-center gap-2">
            <Body className="text-text font-bold">
              إدارة المدرسين
            </Body>
            <Badge size="sm">
              {result?.meta?.total ?? 0} مدرس
            </Badge>
          </div>
        }


        tableActions={
          <Button
          leftIcon={<Plus size={16} />}
          onClick={() => navigate('/teachers/new')}
        >
          إضافة مدرس جديد
        </Button>
        }
        persistedKey="admin-teachers-table"
        data={result?.data || []}
        columns={columns}
        getRowId={(item) => String(item.id)}
        loading={isLoading}
        pagination={
          <Pagination
            currentPage={result?.meta?.current_page || 1}
            totalPages={result?.meta?.last_page || 1}
            totalItems={result?.meta?.total || 0}
            perPage={result?.meta?.per_page || 10}
            onPageChange={setPage}
          />
        }
      />
    </div>
  )
}