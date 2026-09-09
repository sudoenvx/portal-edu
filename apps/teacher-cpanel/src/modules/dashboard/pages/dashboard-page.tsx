import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  ArrowUpLeft,
  ArrowLeft,
  CalendarDays,
  Clock3,
  GraduationCap,
  Users,
  Wallet,
  Plus,
} from 'lucide-react'
import { Button, Card, MiniCalendar, StatisticCard, Title } from '@portal-edu/ui'
import { useTeacherDashboardStats, useUpcomingTeacherSessions } from '../api/dashboard.queries'
import type { UpcomingSession } from '../types/dashboard.types'

const formatNumber = (value = 0) => value.toLocaleString('en')

function sessionStart(session: UpcomingSession) {
  const date = new Date(session.sessionDate)
  if (!session.startTime) return date

  const time = new Date(session.startTime)
  date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), 0)
  return date
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function startOfSaturdayWeek(date = new Date()) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  const daysSinceSaturday = (result.getDay() + 1) % 7
  result.setDate(result.getDate() - daysSinceSaturday)
  return result
}

function weekDays() {
  const saturday = startOfSaturdayWeek()
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(saturday)
    date.setDate(saturday.getDate() + index)
    return date
  })
}

function sessionTime(session: UpcomingSession) {
  if (!session.startTime) return 'الوقت غير محدد'
  return new Intl.DateTimeFormat('ar-EG', { hour: 'numeric', minute: '2-digit' }).format(
    sessionStart(session)
  )
}

function sessionState(session: UpcomingSession, index: number, sessions: UpcomingSession[]) {
  const now = Date.now()
  const start = sessionStart(session).getTime()
  const end = start + 60 * 60 * 1000
  if (now >= start && now < end) return 'current'
  const nextIndex = sessions.findIndex((item) => sessionStart(item).getTime() > now)
  return index === nextIndex ? 'next' : 'upcoming'
}

export default function TeacherDashboardPage() {
  // const navigate = useNavigate()
  const { data: stats, isLoading, isError } = useTeacherDashboardStats()
  const { data: sessions = [], isLoading: sessionsLoading } = useUpcomingTeacherSessions()
  const days = useMemo(() => weekDays(), [])
  const todayKey = dateKey(new Date())
  const [selectedDay, setSelectedDay] = useState(todayKey)
  const [calendarDate, setCalendarDate] = useState(() => new Date())
  const selectedSessions = sessions.filter(
    (session) => dateKey(new Date(session.sessionDate)) === selectedDay
  )
  const value = (number: number | undefined) => (isLoading ? '...' : formatNumber(number))

  return (
    <div className="pb-10 animate-in fade-in duration-300">
      {/* 
        GRID LAYOUT 
        Since Arabic is RTL, col-span-8 will naturally render on the right, 
        and col-span-4 (Aside) will render on the left. 
      */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* MAIN CONTENT (70% Width) */}
        <div className="lg:col-span-8 flex flex-col gap-6 w-full">
          <TeacherWelcomeHeader />

          {isError && (
            <div className="bg-danger-subtle p-2 rounded-sm text-[13px] font-medium text-danger">
              تعذر تحميل إحصائيات المنصة حالياً.
            </div>
          )}

          <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatisticCard
              label="إجمالي الطلاب"
              value={value(stats?.totalStudents)}
              icon={GraduationCap}
              iconClassName="bg-primary-subtle text-primary"
            />
            <StatisticCard
              label="المجموعات النشطة"
              value={value(stats?.activeGroups)}
              icon={Users}
              iconClassName="bg-accent-subtle text-accent"
            />
            <StatisticCard
              label="حصص هذا الشهر"
              value={value(stats?.sessionsThisMonth)}
              icon={CalendarDays}
              iconClassName="bg-info-subtle text-info"
            />
            <StatisticCard
              label="إيرادات هذا الشهر"
              value={isLoading ? '...' : `${formatNumber(stats?.revenueThisMonth)} EGP`}
              icon={Wallet}
              iconClassName="bg-success-subtle text-success"
            />
          </section>

          <Card className="rounded-sm" bodyClassName="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarDays size={16} />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-bold text-text">جدول الأسبوع</h3>
                    <p className="mt-0.5 text-[12px] text-text-muted">
                      اختر يوماً لعرض حصصه القادمة
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-text-muted">
                <span>{selectedSessions.length} حصص في اليوم</span>
                <Link
                  to="/teacher/schedule"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  فتح الجدول كامل <ArrowLeft size={14} />
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1.5 overflow-x-auto pb-2">
              {days.map((day) => (
                <DayTab
                  key={dateKey(day)}
                  date={day}
                  selected={dateKey(day) === selectedDay}
                  today={dateKey(day) === todayKey}
                  count={
                    sessions.filter(
                      (session) => dateKey(new Date(session.sessionDate)) === dateKey(day)
                    ).length
                  }
                  onClick={() => setSelectedDay(dateKey(day))}
                />
              ))}
            </div>

            {sessionsLoading ? (
              <ScheduleCardsSkeleton />
            ) : selectedSessions.length === 0 ? (
              <EmptySchedule />
            ) : (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                {selectedSessions.map((session, index) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    state={sessionState(session, index, selectedSessions)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ASIDE / SIDEBAR (30% Width) */}
        <aside className="lg:col-span-4 flex flex-col gap-5 w-full">
          <Card className="rounded-sm" bodyClassName="flex justify-center">
            <MiniCalendar
              value={calendarDate}
              onChange={(date) => {
                setCalendarDate(date)
                setSelectedDay(dateKey(date))
              }}
            />
          </Card>
        </aside>
      </div>
    </div>
  )
}

function TeacherWelcomeHeader() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between bg-surface p-3 rounded-sm shadow-card">
      <div>
        <p className="text-[13px] font-medium text-primary">مساحتك التعليمية</p>
        <Title size="large" className="mt-1 font-bold tracking-tight text-text">
          أهلاً بك مجدداً، محمد صلاح <span aria-hidden="true">👋</span>
        </Title>
        <p className="mt-1 text-[13px] leading-relaxed text-text-muted max-w-lg">
          يبدو أنك مستعد ليوم تعليمي مثمر. راجع حصصك القادمة وواصل بناء تقدم طلابك.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Main Action - Keeps primary color */}
        <Button
          type="button"
          color="primary"
          style="tint"
          size="sm"
          uppercase={false}
          rightIcon={<CalendarDays size={16} />}
          onClick={() => navigate('/teacher/schedule')}
        >
          فتح جدول اليوم
        </Button>

        {/* Secondary Actions - Changed to Outline/Subtle styles so they don't clash */}
        <Button
          type="button"
          style="tint"
          color="secondary"
          size="sm"
          uppercase={false}
          rightIcon={<Plus size={14} />}
          onClick={() => navigate('/teacher/students')}
        >
          طالب
        </Button>
        <Button
          type="button"
          style="tint"
          color="secondary"
          size="sm"
          uppercase={false}
          rightIcon={<Plus size={14} />}
          onClick={() => navigate('/teacher/groups')}
        >
          مجموعة
        </Button>
      </div>
    </div>
  )
}

function DayTab({
  date,
  selected,
  today,
  count,
  onClick,
}: {
  date: Date
  selected: boolean
  today: boolean
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-17.5 flex-col items-center gap-1.5 p-2 rounded-sm text-center transition-all sm:min-w-0 border ${
        selected
          ? 'bg-primary border-primary text-primary-foreground shadow-sm'
          : 'bg-canvas border-transparent text-text-muted hover:bg-surface-secondary hover:border-border'
      }`}
    >
      <span
        className={`text-[11px] font-semibold ${selected ? 'text-primary-foreground/90' : today ? 'text-primary' : ''}`}
      >
        {new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(date)}
      </span>
      <span
        className={`font-inter text-xl font-black leading-none ${selected ? 'text-primary-foreground' : today ? 'text-primary' : 'text-text'}`}
      >
        {new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)}
      </span>
      <span
        className={`text-[10px] flex items-center gap-1 ${selected ? 'text-primary-foreground/80' : 'text-text-muted'}`}
      >
        {count > 0 ? (
          <>
            <span
              className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-white' : 'bg-primary'}`}
            ></span>{' '}
            {count} حصص
          </>
        ) : (
          'لا حصص'
        )}
      </span>
    </button>
  )
}

function SessionCard({
  session,
  state,
}: {
  session: UpcomingSession
  state: 'current' | 'next' | 'upcoming'
}) {
  const highlighted = state !== 'upcoming'
  return (
    <article
      className={`flex min-w-[260px] snap-start flex-1 flex-col gap-3 rounded-sm p-4 border transition-colors ${
        highlighted
          ? 'bg-primary/5 border-primary/20'
          : 'bg-canvas border-border hover:border-border-hover hover:bg-surface-secondary'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`h-2 w-2 rounded-full shadow-sm ${
                state === 'current'
                  ? 'bg-success animate-pulse'
                  : state === 'next'
                    ? 'bg-primary'
                    : 'bg-border-strong'
              }`}
            />
            <h4 className="truncate text-[14px] font-bold text-text">{session.group.groupName}</h4>
          </div>
          <p className="truncate text-[12px] text-text-muted pr-4">
            {session.topic || 'حصة تعليمية عامة'}
          </p>
        </div>
        <div
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold ${
            state === 'current' ? 'bg-success/10 text-success' : 'bg-surface-secondary text-text'
          }`}
        >
          <Clock3 size={12} />
          {sessionTime(session)}
        </div>
      </div>
      <div className="flex items-center justify-between mt-1 text-[11px] font-medium text-text-muted border-t border-border-subtle pt-3">
        <span
          className={
            state === 'current' ? 'text-success font-bold' : state === 'next' ? 'text-primary' : ''
          }
        >
          {state === 'current' ? 'جارية الآن' : state === 'next' ? 'الحصة التالية' : 'مجدولة'}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} /> {session.group.groupName}
        </span>
      </div>
    </article>
  )
}

function ScheduleCardsSkeleton() {
  return (
    <div className="mt-4 flex gap-3 overflow-hidden">
      <div className="h-30 min-w-65 rounded-sm animate-pulse bg-canvas border border-border-subtle" />
      <div className="h-30 min-w-65 rounded-sm animate-pulse bg-canvas border border-border-subtle" />
      <div className="h-30 min-w-65 rounded-sm animate-pulse bg-canvas border border-border-subtle" />
    </div>
  )
}

function EmptySchedule() {
  const navigate = useNavigate()

  return (
    <div className="my-2 flex flex-col items-center justify-center rounded-sm bg-canvas border border-dashed border-border p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-primary-subtle flex items-center justify-center mb-3">
        <CalendarDays size={24} className="text-text-muted" />
      </div>
      <p className="text-[14px] font-bold text-text">يوم هادئ، لا توجد حصص قادمة</p>
      <p className="mt-1 mb-2 text-[12px] text-text-muted max-w-[250px]">
        استرح قليلاً، أو قم بإضافة حصة جديدة لجدولك اليوم.
      </p>
      <Button
        type="button"
        color="primary"
        style="tint"
        size="sm"
        uppercase={false}
        rightIcon={<ArrowUpLeft size={14} />}
        onClick={() => navigate('/teacher/schedule')}
      >
        إضافة حصة
      </Button>
    </div>
  )
}
