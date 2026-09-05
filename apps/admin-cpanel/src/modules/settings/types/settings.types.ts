export interface SystemSettings {
  // General
  businessName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  
  // Billing & SaaS Model
  defaultPricePerStudent: number
  billingCycleDays: number
  gracePeriodDays: number
  autoSuspendUnpaid: boolean
  
  // Notifications
  notifyOnNewTeacher: boolean
  notifyOnPaymentOverdue: boolean
  weeklySystemReport: boolean
  
  // Security
  requireTwoFactorAdmin: boolean
  sessionTimeoutMinutes: number
}