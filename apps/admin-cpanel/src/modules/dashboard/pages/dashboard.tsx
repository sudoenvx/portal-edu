import { useMemo } from 'react'
import { 
  Users, 
  GraduationCap, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  Eye,
  MoreVertical,
  Settings,
  Ban
} from 'lucide-react'
import { 
  StatisticCard, 
  DataTable, 
  Badge, 
  Button, 
  IconButton,
  DropdownMenu,
  DropdownMenuItem,
  Typography
} from '@portal-edu/ui'

// --- أنواع البيانات الوهمية ---
type TeacherRecord = {
  id: string
  name: string
  email: string
  subject: string
  studentsCount: number
  status: 'ACTIVE' | 'TRIAL' | 'EXPIRED'
  joinDate: string
}

// --- البيانات الوهمية ---
const LATEST_TEACHERS: TeacherRecord[] = [
  { id: 't-001', name: 'أحمد محمود', email: 'ahmed.m@example.com', subject: 'الفيزياء', studentsCount: 450, status: 'ACTIVE', joinDate: '2026/09/03' },
  { id: 't-002', name: 'سارة كامل', email: 'sara.k@example.com', subject: 'الرياضيات', studentsCount: 320, status: 'ACTIVE', joinDate: '2026/09/02' },
  { id: 't-003', name: 'عمر يوسف', email: 'omar.y@example.com', subject: 'الكيمياء', studentsCount: 85, status: 'TRIAL', joinDate: '2026/09/02' },
  { id: 't-004', name: 'نورهان علي', email: 'nourhan.a@example.com', subject: 'الأحياء', studentsCount: 0, status: 'EXPIRED', joinDate: '2026/08/28' },
  { id: 't-005', name: 'خالد حسن', email: 'khaled.h@example.com', subject: 'اللغة العربية', studentsCount: 210, status: 'ACTIVE', joinDate: '2026/08/25' },
]

// خريطة لترجمة حالة المعلم للغة العربية
const STATUS_MAP = {
  ACTIVE: 'نشط',
  TRIAL: 'تجريبي',
  EXPIRED: 'منتهي'
}

export default function AdminDashboard() {
  // --- أعمدة الجدول ---
  const columns = useMemo(() => [
    {
      header: 'المعلم',
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
        // let variant: 'success' | 'warning' | 'danger' = 'success'
        // if (item.status === 'TRIAL') variant = 'warning'
        // if (item.status === 'EXPIRED') variant = 'danger'

        return (
          <Badge  size="sm">
            {STATUS_MAP[item.status]}
          </Badge>
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
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="title-large" element="h1" className="text-text font-bold">
            نظرة عامة على النظام
          </Typography>
          <Typography variant="body-small" className="text-text-muted mt-1">
            نظرة سريعة على أداء منصتك التعليمية
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" outline leftIcon={<Settings size={14} />}>
            إعدادات المنصة
          </Button>
          <Button variant="primary" leftIcon={<Users size={14} />}>
            إضافة معلم
          </Button>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          label="إجمالي المعلمين النشطين"
          value="1,248"
          icon={Users}
          iconClassName="bg-primary/10 text-primary"
          description={() => (
            <div className="flex items-center gap-1 text-success text-[11px] font-medium mt-1">
              <ArrowUpRight size={12} />
              <span>+12 هذا الأسبوع</span>
            </div>
          )}
        />
        <StatisticCard
          label="إجمالي الطلاب المسجلين"
          value="45,200"
          icon={GraduationCap}
          iconClassName="bg-accent/20 text-accent-dark"
          description={() => (
            <div className="flex items-center gap-1 text-success text-[11px] font-medium mt-1">
              <ArrowUpRight size={12} />
              <span>+840 هذا الشهر</span>
            </div>
          )}
        />
        <StatisticCard
          label="الإيرادات الشهرية (ج.م)"
          value="135,600"
          icon={CreditCard}
          iconClassName="bg-success/20 text-success"
          description={() => (
            <div className="flex items-center gap-1 text-text-muted text-[11px] font-medium mt-1">
              <span>بناءً على الاشتراكات النشطة</span>
            </div>
          )}
        />
        <StatisticCard
          label="حالة النظام"
          value="99.9%"
          icon={Activity}
          iconClassName="bg-secondary/15 text-secondary-dark"
          description={() => (
            <div className="flex items-center gap-1 text-text-muted text-[11px] font-medium mt-1">
              <span>جميع الخدمات تعمل بشكل ممتاز</span>
            </div>
          )}
        />
      </div>

      {/* قسم جدول أحدث المعلمين */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <Typography variant="title-medium" element="h2" className="text-text font-bold uppercase text-[12px] tracking-wide">
            أحدث المعلمين المشتركين
          </Typography>
          <Button variant="ghost" size="xs" tint className="text-[11px]">
            عرض جميع المعلمين
          </Button>
        </div>

        <DataTable
          dir="rtl"
          data={LATEST_TEACHERS}
          columns={columns}
          getRowId={(item) => item.id}
          actionsHeader="الإجراءات"
          pinActions
          actions={() => (
            <div className="flex items-center gap-1">
              <IconButton 
                icon={<Eye />} 
                variant="ghost" 
                size="sm" 
                title="عرض التفاصيل" 
              />
              <DropdownMenu
                align="end"
                trigger={
                  <IconButton icon={<MoreVertical />} variant="ghost" size="sm" />
                }
              >
                <DropdownMenuItem icon={<Eye />}>عرض الملف الشخصي</DropdownMenuItem>
                <DropdownMenuItem icon={<CreditCard />}>سجل الفواتير</DropdownMenuItem>
                <DropdownMenuItem variant="danger" icon={<Ban />}>إيقاف الحساب</DropdownMenuItem>
              </DropdownMenu>
            </div>
          )}
        />
      </div>
    </div>
  )
}