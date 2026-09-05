import type { SystemSettings } from "@/modules/settings/types/settings.types"
import { useQuery } from "@tanstack/react-query"

const fetchSettings = async (): Promise<SystemSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return {
    businessName: 'Portal Edu (SaaS)',
    supportEmail: 'support@portaledu.com',
    supportPhone: '+20 100 000 0000',
    timezone: 'Africa/Cairo',
    defaultPricePerStudent: 15,
    billingCycleDays: 30,
    gracePeriodDays: 5,
    autoSuspendUnpaid: true,
    notifyOnNewTeacher: true,
    notifyOnPaymentOverdue: true,
    weeklySystemReport: false,
    requireTwoFactorAdmin: true,
    sessionTimeoutMinutes: 120,
  }
}

export function useGetSettings() {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: fetchSettings,
  })
}