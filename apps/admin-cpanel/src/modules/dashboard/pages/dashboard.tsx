import { Users, SchoolIcon } from 'lucide-react'
import { Button, Typography } from '@portal-edu/ui'
import { DashboardStats } from '@/modules/dashboard/components/dashboard-stats'
import { LatestTeachersTable } from '@/modules/dashboard/components/latest-teachers-table'
import { useNavigate } from 'react-router-dom'


export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">

      {/* 1. الإحصائيات العلوية */}
      <DashboardStats />

      {/* 2. جدول المدرسين */}
      <div className="flex flex-col gap-3">
        <div className="flex items-end justify-between px-1">
          <Typography variant="title-medium" element="h2" className="text-primary-dark font-semibold uppercase text-[12px] tracking-wide">
            أحدث المدرسين المشتركين
          </Typography>
          <div className="flex items-center gap-2">
            <Button variant="secondary" outline rightIcon={<SchoolIcon size={14} />}>
              جميع المدرسين
            </Button>
            <Button
              variant="primary"
              rightIcon={<Users size={14} />}
              onClick={() => navigate('/teachers/new')} // فتح الفورم
            >
              إضافة مدرس
            </Button>
          </div>
        </div>


        <LatestTeachersTable />
      </div>
    </div>
  )
}