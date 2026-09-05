import { Users, GraduationCap, CreditCard, Activity, ArrowUpRight } from 'lucide-react'
import { useDashboardStats } from '../api/dashboard.queries'
import { StatisticCard } from '@portal-edu/ui'

export function DashboardStats() {
  // جلب البيانات عبر API
  const { data: stats, isLoading } = useDashboardStats()

  // في حالة التحميل (Skeleton) - يمكنك استبداله بـ Skeleton Component مخصص
  if (isLoading || !stats) {
    return <div className="h-24 w-full bg-secondary/10 animate-pulse rounded-sm" />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        label="إجمالي المدرسين النشطين"
        value={stats.activeTeachers.toLocaleString()}
        icon={Users}
        iconClassName="bg-primary/10 text-primary"
        description={() => (
          <div className="flex items-center gap-1 text-success text-[11px] font-medium mt-1">
            <ArrowUpRight size={12} />
            <span>+{stats.activeTeachersGrowth} هذا الأسبوع</span>
          </div>
        )}
      />
      <StatisticCard
        label="إجمالي الطلاب المسجلين"
        value={stats.enrolledStudents.toLocaleString()}
        icon={GraduationCap}
        iconClassName="bg-accent/20 text-accent-dark"
        description={() => (
          <div className="flex items-center gap-1 text-success text-[11px] font-medium mt-1">
            <ArrowUpRight size={12} />
            <span>+{stats.enrolledStudentsGrowth} هذا الشهر</span>
          </div>
        )}
      />
      <StatisticCard
        label="الإيرادات الشهرية (ج.م)"
        value={stats.monthlyRevenue.toLocaleString()}
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
        value={`${stats.systemHealth}%`}
        icon={Activity}
        iconClassName="bg-secondary/15 text-secondary-dark"
        description={() => (
          <div className="flex items-center gap-1 text-text-muted text-[11px] font-medium mt-1">
            <span>جميع الخدمات تعمل بشكل ممتاز</span>
          </div>
        )}
      />
    </div>
  )
}