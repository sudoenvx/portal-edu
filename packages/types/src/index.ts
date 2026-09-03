// ─── Generic Utility Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  statusCode: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type ApiError = {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export type CourseStatus = 'draft' | 'published' | 'archived'

export interface Course {
  id: string
  title: string
  description: string
  thumbnailUrl?: string
  status: CourseStatus
  teacherId: string
  teacher?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>
  enrollmentCount: number
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  content: string
  order: number
  durationMinutes?: number
  createdAt: string
  updatedAt: string
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

export type EnrollmentStatus = 'active' | 'completed' | 'dropped'

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  status: EnrollmentStatus
  progressPercent: number
  enrolledAt: string
  completedAt?: string
}

// ─── Assignments & Grades ─────────────────────────────────────────────────────

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate?: string
  maxScore: number
  createdAt: string
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  content: string
  score?: number
  feedback?: string
  submittedAt: string
  gradedAt?: string
}
