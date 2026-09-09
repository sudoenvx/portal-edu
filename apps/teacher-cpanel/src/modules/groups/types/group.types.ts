export interface GroupListItem {
  id: number
  groupName: string
  standardMonthlyFee: number | string | null
  maxCapacity: number | null
  studyStage?: { id: number; stageName: string } | null
  _count: { enrollments: number; classSessions: number }
  createdAt: string
  schedules?: GroupSchedule[]
}

export interface GroupSchedule {
  id?: number
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface GroupInput {
  groupName: string
  studyStageId?: number | null
  standardMonthlyFee?: number | null
  maxCapacity?: number | null
  schedules?: GroupSchedule[]
}