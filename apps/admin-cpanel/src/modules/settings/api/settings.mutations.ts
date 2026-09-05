import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SystemSettings } from '../types/settings.types'

// MOCK: Fetch Settings
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

// MOCK: Update Settings
const updateSettings = async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { ...await fetchSettings(), ...data }
}



export function useUpdateSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] })
    },
  })
}