export type TeacherStatus = 'ACTIVE' | 'TRIAL' | 'EXPIRED'

export interface TeacherRecord {
  id: string
  name: string
  email: string
  subject: string
  studentsCount: number
  status: TeacherStatus
  joinDate: string
}

export interface DashboardStats {
  activeTeachers: number
  activeTeachersGrowth: number
  enrolledStudents: number
  enrolledStudentsGrowth: number
  monthlyRevenue: number
  systemHealth: number
}