import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Users,
  MapPin,
  CreditCard,
  Wallet,
  CalendarDays,
  Phone,
  Mail,
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users2,
  Tag,
  Save,
  ArrowLeft,
  Settings
} from 'lucide-react'

import {
  Typography,
  StatisticCard,
  Button,
  Badge,
  SwitchTile,
  DataTable,
  type DataTableColumn,
  Card,
  Input,
  WindowCard
} from '@portal-edu/ui'
import { useTeacherProfile } from '@/modules/teacher/api/teacher-profiles.queries'
import type { TeacherProfileDetails } from '@/modules/teacher/types/teacher-profile.types'
import { AVATAR_PLACEHOLDER } from '@/core/assets'

type SettingsTab = 'overview' | 'students' | 'groups' | 'locations' | 'invoices' | 'settings'

const tabItems: { key: SettingsTab; label: string; icon: any }[] = [
  { key: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 'students', label: 'الطلاب', icon: GraduationCap },
  { key: 'groups', label: 'المجموعات', icon: Users2 },
  { key: 'locations', label: 'الأماكن', icon: MapPin },
  { key: 'invoices', label: 'الفواتير', icon: Wallet },
  { key: 'settings', label: 'إعدادات النظام', icon: Settings },
]

const TABLE_LABEL_CLASS = 'text-xs font-semibold text-primary-dark uppercase'

// Helper for the Aside Info Rows
function CompactInfoRow({ icon: Icon, label, value, dir = 'rtl', valueClass = 'text-text' }: { icon: any, label: string, value: string, dir?: 'ltr' | 'rtl', valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 last:pb-0">
      <div className="flex items-center gap-1.5 text-text-muted">
        <Icon size={13} strokeWidth={2.5} />
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <span className={`text-[11px] font-semibold ${valueClass}`} dir={dir}>{value}</span>
    </div>
  )
}


export default function TeacherManagePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SettingsTab>('overview')

  const { data: teacher, isLoading } = useTeacherProfile(id || 'dummy-id')

  if (isLoading || !teacher) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-text-muted animate-pulse">
          <Users size={24} className="opacity-50" />
          <Typography variant="body-small">جاري تحميل بيانات المدرس...</Typography>
        </div>
      </div>
    )
  }

  // --- Data Tables Columns ---
  const invoiceColumns: DataTableColumn<TeacherProfileDetails['recentInvoices'][0]>[] = [
    { header: 'الفاتورة', accessor: 'id', cellClassName: 'tabular-nums text-text-muted text-[11px]' },
    { header: 'الشهر', accessor: 'month', cellClassName: 'font-semibold text-[11px] text-text' },
    { header: 'القيمة', render: (row) => <span className="font-semibold text-[11px] text-primary-dark">{row.amount.toLocaleString()} ج.م</span> },
    { header: 'الحالة', render: (row) => <Badge variant={row.isPaid ? 'success' : 'warning'} size="sm">{row.isPaid ? 'مسددة' : 'مستحقة'}</Badge> }
  ]

  const locationColumns: DataTableColumn<any>[] = [
    { header: 'اسم المكان', accessor: 'name', cellClassName: 'font-semibold text-[11px] text-text' },
    { header: 'النوع', render: () => <Badge variant="gray" size="sm">سنتر تعليمي</Badge> },
    { header: 'المجموعات', accessor: 'groupsCount', cellClassName: 'text-[11px] font-semibold text-text tabular-nums' },
  ]

  const dummyGroups = [
    { id: 'g1', name: 'الأحد والثلاثاء (ثانوية عامة)', location: 'سنتر الفرسان - الإسكندرية', students: 120 },
    { id: 'g2', name: 'أونلاين مكثف', location: 'مجموعات أونلاين', students: 330 },
  ]

  const groupColumns: DataTableColumn<any>[] = [
    { header: 'المجموعة', accessor: 'name', cellClassName: 'font-semibold text-[11px] text-text' },
    { header: 'المكان', accessor: 'location', cellClassName: 'text-[10px] text-text-muted' },
    { header: 'الطلاب', render: (row) => <span className="font-semibold text-[11px] text-primary">{row.students}</span> },
  ]

  const dummyStudents = [
    { id: 's1', name: 'أحمد محمود', group: 'الأحد والثلاثاء (ثانوية عامة)', phone: '01012345678', isPaid: true },
    { id: 's2', name: 'مريم سعيد', group: 'أونلاين مكثف', phone: '01098765432', isPaid: false },
  ]

  const studentColumns: DataTableColumn<any>[] = [
    { header: 'اسم الطالب', accessor: 'name', cellClassName: 'font-semibold text-[11px] text-text' },
    { header: 'المجموعة', accessor: 'group', cellClassName: 'text-[10px] text-text-muted' },
    { header: 'الهاتف', accessor: 'phone', cellClassName: 'tabular-nums text-[11px] text-text-muted' },
    { header: 'الحالة', render: (row) => <Badge variant={row.isPaid ? 'success' : 'warning'} size="sm">{row.isPaid ? 'مسدد' : 'متأخر'}</Badge> },
  ]


  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">

      {/* 1. Header & Global Actions */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5" />
        <div className="flex flex-wrap items-center gap-2">
          <Button leftIcon={<ArrowLeft strokeWidth={2} />} variant="secondary" tint size="sm" onClick={() => navigate(-1)}>رجوع</Button>
          <Button leftIcon={<Save strokeWidth={2} />} variant="primary" size="sm">حفظ التغييرات</Button>
        </div>
      </header>

      {/* 2. Tabs Bar — floating vertical rail on large screens, horizontal scroller on mobile */}

{/* Mobile / tablet: horizontal tabs (unchanged) */}
<div className="lg:hidden overflow-x-auto rounded-sm bg-surface px-1.5 py-1.5">
  <div className="flex w-full gap-1.5">
    {tabItems.map((tab) => {
      const Icon = tab.icon
      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => setActiveTab(tab.key)}
          className={`inline-flex max-sm:min-w-fit group items-center gap-1.5 rounded-sm px-3 py-1 last:me-2 text-[12px] font-medium transition-all duration-150 ${
            activeTab === tab.key
              ? 'bg-accent-tint text-accent-text'
              : 'bg-transparent text-text hover:bg-secondary-tint hover:text-text'
          }`}
        >
          <Icon
            className={activeTab === tab.key ? 'h-3.5 w-3.5 text-accent-text' : 'h-3.5 w-3.5 text-text-muted group-hover:text-secondary-tint-text'}
            strokeWidth={2}
          />
          <span>{tab.label}</span>
        </button>
      )
    })}
  </div>
</div>

{/* Desktop: floating vertical rail, fixed to the left edge of the viewport */}
<div className="hidden lg:flex flex-col gap-1 fixed left-4 top-1/2 -translate-y-1/2 z-30 rounded-sm bg-surface p-1.5 shadow-lg">
  {tabItems.map((tab) => {
    const Icon = tab.icon
    return (
      <button
        key={tab.key}
        type="button"
        title={tab.label}
        onClick={() => setActiveTab(tab.key)}
        className={`group relative flex items-center justify-center rounded-sm p-2 transition-all duration-150 ${
          activeTab === tab.key
            ? 'bg-accent-tint text-accent-text'
            : 'bg-transparent text-text-muted hover:bg-secondary-tint hover:text-text'
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
        {/* Label flyout on hover */}
        <span className="pointer-events-none absolute left-10 ms-2 whitespace-nowrap rounded-xs bg-secondary px-3 py-1 text-[11px] font-medium text-white/90 opacity-0 scale-95 origin-left transition-all duration-150 group-hover:opacity-100 group-hover:scale-100">
          {tab.label}
        </span>
      </button>
    )
  })}
</div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-3 items-start">

        {/* === ASIDE (Main Info) === */}
        <aside className="flex flex-col gap-3 lg:col-span-3 lg:sticky lg:top-16">
          <WindowCard
            title={'معلومات المدرس'}
            windowClassName='bg-primary-dark!'
            bodyClassName=" flex flex-col">

            {/* Identity Header */}
            <div className="flex items-center gap-2.5 p-1.5 bg-secondary-tint rounded-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-primary-dark font-semibold text-lg">
                <img src={AVATAR_PLACEHOLDER} alt="avatar" className="w-full h-full object-cover rounded-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <Typography variant="body-small" element="h2" className="font-semibold text-text truncate">
                  {teacher.name}
                </Typography>
                <div className="flex items-center gap-1 mt-0.5">
                  <Badge className="bg-success py-0.5 rounded-xs text-white/90" size="sm">
                    {teacher.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Core Info Details */}
            <div className="flex flex-col pt-1.5">
              <CompactInfoRow valueClass='font-inter font-semibold! text-text!' icon={CalendarDays} label="تاريخ الانضمام" value={teacher.joinDate} />
              <CompactInfoRow valueClass='font-inter font-semibold! text-text!' icon={Phone} label="الهاتف" value={teacher.phone} dir="ltr" />
              <CompactInfoRow valueClass='font-inter font-semibold! text-text!' icon={Mail} label="البريد" value={teacher.email || '—'} />
            </div>
          </WindowCard>

          {/* Extended Info */}
          <WindowCard
            title={'معلومات إضافية'}
            bodyClassName=" pt-0.5!"
          >
            <div className="flex flex-col">
              <CompactInfoRow icon={BookOpen} label="المادة الدراسية" value={teacher.subject} />
              <CompactInfoRow dir='ltr' icon={Wallet} label="سعر الطالب" value={`${teacher.pricePerStudent.toLocaleString()} EGP`} valueClass="text-primary-dark font-inter" />
              <CompactInfoRow icon={Tag} label="نوع الاشتراك" value={(teacher as any).subscriptionType ?? 'غير محدد'} />
            </div>
          </WindowCard>
        </aside>

        {/* === MAIN CONTENT AREA === */}
        <main className="flex flex-col gap-3 md:col-span-2 lg:col-span-9 min-w-0">

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatisticCard label="الطلاب" value={teacher.stats.totalStudents.toString()} icon={Users} iconClassName="bg-blue-ice text-primary" />
                <StatisticCard label="المجموعات" value={teacher.stats.activeGroups.toString()} icon={MapPin} iconClassName="bg-creamy text-text-muted" />
                <StatisticCard label="المستحق (ج.م)" value={teacher.stats.currentMonthOwed.toLocaleString()} icon={Wallet} iconClassName="bg-warning/10 text-warning" />
                <StatisticCard label="الأرباح (ج.م)" value={teacher.stats.totalRevenue.toLocaleString()} icon={CreditCard} iconClassName="bg-success/10 text-success" />
              </div>

            </div>
          )}

          {/* TAB: STUDENTS */}
          {activeTab === 'students' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className={TABLE_LABEL_CLASS}>طلاب المدرس</span>
              <DataTable
                perPage={5}
                currentPage={1}
                onPageChange={() => {}}
                totalPages={Math.ceil(dummyStudents.length / 5)}
                totalItems={dummyStudents.length}
              data={dummyStudents} columns={studentColumns} getRowId={(row) => row.id} className="border-0" />
            </div>
          )}

          {/* TAB: GROUPS */}
          {activeTab === 'groups' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className={TABLE_LABEL_CLASS}>المجموعات</span>
              <DataTable data={dummyGroups} columns={groupColumns} getRowId={(row) => row.id} className="border-0" />
            </div>
          )}

          {/* TAB: LOCATIONS */}
          {activeTab === 'locations' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className={TABLE_LABEL_CLASS}>أماكن التدريس</span>
              <DataTable data={teacher.locations} columns={locationColumns} getRowId={(row) => row.id} className="border-0" />
            </div>
          )}

          {/* TAB: INVOICES */}
          {activeTab === 'invoices' && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <span className={TABLE_LABEL_CLASS}>الفواتير الأخيرة</span>
              <DataTable data={teacher.recentInvoices} columns={invoiceColumns} getRowId={(row) => row.id} className="border-0" />
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">

              {/* General Settings */}
              <Card
                title={<span className="text-[12px] font-semibold text-primary-dark">إعدادات الحساب الأساسية</span>}
                headerClassName="pb-1.5! border-b border-border/60"
                bodyClassName=""
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="اسم المدرس" defaultValue={teacher.name} placeholder="الاسم" variant="bordered" />
                  <Input label="المادة التعليمية" defaultValue={teacher.subject} placeholder="مثال: فيزياء" variant="bordered" />
                  <Input label="رقم الهاتف" defaultValue={teacher.phone} type="tel" variant="bordered" dir="ltr" className="text-right" />
                  <Input label="البريد الإلكتروني" defaultValue={teacher.email || ''} type="email" placeholder="example@mail.com" variant="bordered" dir="ltr" className="text-right" />
                  <Input label="سعر المحاسبة لكل طالب (ج.م)" defaultValue={teacher.pricePerStudent.toString()} type="number" variant="bordered" />
                </div>
              </Card>

              {/* Access & Permissions */}
              <Card
                title={<span className="text-[12px] font-semibold text-primary-dark">صلاحيات النظام والوصول</span>}
                headerClassName="pb-1.5! border-b border-border/60"
                bodyClassName=""
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <SwitchTile
                    label="تفعيل تسجيل الدخول"
                    description="يسمح للمدرس والمساعدين بالوصول للوحة التحكم الخاصة بهم"
                    checked={teacher.settings.allowLogin}
                    onCheckedChange={() => { }}
                  />
                  <SwitchTile
                    label="صلاحية تسجيل الطلاب"
                    description="يسمح للمدرس بإضافة طلاب جدد للمجموعات التابعة له"
                    checked={teacher.settings.canAddNewStudents}
                    onCheckedChange={() => { }}
                  />
                  <SwitchTile
                    label="نظام الحظر التلقائي"
                    description="يتم إيقاف حساب المدرس تلقائياً عند التأخر في سداد الفواتير"
                    checked={teacher.settings.requireInvoicePayment}
                    onCheckedChange={() => { }}
                  />
                </div>
              </Card>

              {/* Danger Zone */}
              <Card bodyClassName="p-1.5!" className="border-danger/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-danger text-white">
                      <ShieldAlert size={14} />
                    </div>
                    <div>
                      <Typography variant="body-small" element="h3" className="text-danger-hover font-semibold">
                        حذف المدرس نهائياً من النظام
                      </Typography>
                      <p className="text-[10px] text-text-muted mt-0.5 leading-tight">
                        هذا الإجراء خطير ولا يمكن التراجع عنه. سيتم حذف جميع الفواتير والمجموعات المرتبطة به.
                      </p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm" className="shrink-0">
                    حذف الحساب
                  </Button>
                </div>
              </Card>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}