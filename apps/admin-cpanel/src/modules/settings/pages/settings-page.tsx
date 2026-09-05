import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Loader2,
    ShieldCheck,
    SlidersHorizontal,
    Wallet,
    Bell,
    Save,
    Building2,
    Clock,
    Settings
} from 'lucide-react'

import {
    Button,
    Card,
    Input,
    SwitchTile,
    Typography
} from '@portal-edu/ui'

import type { SystemSettings } from '../types/settings.types'
import { useUpdateSettings } from '@/modules/settings/api/settings.mutations'
import { useGetSettings } from '@/modules/settings/api/settings.queries'

type SettingsTab = 'general' | 'billing' | 'notifications' | 'security'

const tabItems: { key: SettingsTab; label: string; icon: any }[] = [
    { key: 'general', label: 'إعدادات عامة', icon: SlidersHorizontal },
    { key: 'billing', label: 'الفواتير والتسعير', icon: Wallet },
    { key: 'notifications', label: 'إشعارات النظام', icon: Bell },
    { key: 'security', label: 'الأمان', icon: ShieldCheck },
]

export default function SettingsPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<SettingsTab>('general')

    const { data: settings, isLoading } = useGetSettings()
    const { mutate: saveSettings, isPending: isSaving } = useUpdateSettings()

    // Local state for the form so we can edit before saving
    const [formData, setFormData] = useState<SystemSettings | null>(null)

    useEffect(() => {
        if (settings) {
            setFormData(settings)
        }
    }, [settings])

    if (isLoading || !formData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-text-muted animate-pulse">
                    <Settings size={24} className="opacity-50 animate-spin" />
                    <Typography variant="body-small">جاري تحميل الإعدادات...</Typography>
                </div>
            </div>
        )
    }

    const handleChange = (field: keyof SystemSettings, value: string | number | boolean) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null)
    }

    const handleSave = () => {
        if (formData) {
            saveSettings(formData)
        }
    }

    return (
        <div className="mx-auto w-full max-w-5xl flex flex-col gap-3 animate-in fade-in duration-300 pb-12">

            {/* 1. Header & Actions */}
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <Typography variant="label-small" className="text-primary-dark font-bold">
                        لوحة تحكم الإدارة
                    </Typography>
                    <Typography variant="title-medium" element="h1" className="font-bold text-text">
                        إعدادات النظام (SaaS)
                    </Typography>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="neutral" outline size="sm" onClick={() => navigate(-1)} disabled={isSaving}>
                        إلغاء
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleSave} loading={isSaving} leftIcon={<Save size={14} />}>
                        حفظ التغييرات
                    </Button>
                </div>
            </header>

            {/* 2. Tabs Navigation */}
            <div className="overflow-x-auto rounded-sm bg-surface px-1.5 py-1.5">
                <div className="flex min-w-max gap-1.5">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`inline-flex group items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-bold transition-colors duration-150 ${activeTab === tab.key
                                        ? 'bg-primary/10 text-primary-dark'
                                        : 'bg-transparent text-text-muted hover:bg-secondary-tint hover:text-text'
                                    }`}
                            >
                                <Icon
                                    className={activeTab === tab.key ? 'text-primary' : 'text-text-muted group-hover:text-text'}
                                    size={14}
                                    strokeWidth={2}
                                />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* 3. Tab Content Area */}
            <div className="flex flex-col gap-3">

                {/* --- TAB: GENERAL --- */}
                {activeTab === 'general' && (
                    <Card
                        title={<span className="flex items-center gap-1.5 text-[12px] font-bold text-primary-dark"><Building2 size={14} className="text-primary-dark" /> معلومات الشركة والدعم</span>}
                        headerClassName='text-primary-dark!'
                        bodyClassName="p-2 pt-3"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="اسم المنصة / الشركة"
                                value={formData.businessName}
                                onChange={(e) => handleChange('businessName', e.target.value)}
                                variant="outstanding"
                            />
                            <Input
                                label="المنطقة الزمنية النظامية"
                                value={formData.timezone}
                                onChange={(e) => handleChange('timezone', e.target.value)}
                                variant="outstanding"
                                dir="ltr"
                                className="text-right"
                            />
                            <Input
                                label="البريد الإلكتروني للدعم الفني"
                                type="email"
                                value={formData.supportEmail}
                                onChange={(e) => handleChange('supportEmail', e.target.value)}
                                variant="outstanding"
                                dir="ltr"
                                className="text-right"
                            />
                            <Input
                                label="رقم هاتف الدعم"
                                type="tel"
                                value={formData.supportPhone}
                                onChange={(e) => handleChange('supportPhone', e.target.value)}
                                variant="outstanding"
                                dir="ltr"
                                className="text-right"
                            />
                        </div>
                    </Card>
                )}

                {/* --- TAB: BILLING & PRICING --- */}
                {activeTab === 'billing' && (
                    <div className="flex flex-col gap-3">
                        <Card
                            title={<span className="flex items-center gap-1.5 text-[12px] font-bold text-primary-dark"><Wallet size={14} className="text-primary-dark" /> تسعير الخدمة (SaaS Model)</span>}
                            headerClassName='text-primary-dark!'
                            bodyClassName="p-2 pt-3"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    label="السعر الافتراضي لكل طالب (ج.م)"
                                    type="number"
                                    value={formData.defaultPricePerStudent}
                                    onChange={(e) => handleChange('defaultPricePerStudent', Number(e.target.value))}
                                    variant="outstanding"
                                    hint="هذا السعر يطبق افتراضياً على المدرسين الجدد، يمكن تعديله لكل مدرس لاحقاً."
                                />
                                <Input
                                    label="دورة الفوترة (بالأيام)"
                                    type="number"
                                    value={formData.billingCycleDays}
                                    onChange={(e) => handleChange('billingCycleDays', Number(e.target.value))}
                                    variant="outstanding"
                                    hint="يتم إصدار فاتورة للمدرس كل (30) يوماً بناءً على عدد طلابه."
                                />
                                <Input
                                    label="فترة السماح بعد صدور الفاتورة (أيام)"
                                    type="number"
                                    value={formData.gracePeriodDays}
                                    onChange={(e) => handleChange('gracePeriodDays', Number(e.target.value))}
                                    variant="outstanding"
                                />
                            </div>
                        </Card>

                        <Card
                            title={<span className="text-[12px] font-bold text-text">إجراءات الفواتير المتأخرة</span>}
                            headerClassName='text-primary-dark!'
                            bodyClassName="p-2 pt-3"
                        >
                            <SwitchTile
                                size="sm"
                                label="تعليق الحسابات تلقائياً"
                                description="إيقاف حساب المدرس ومنعه من دخول النظام إذا تجاوز فترة السماح ولم يسدد الفاتورة."
                                checked={formData.autoSuspendUnpaid}
                                onCheckedChange={(val) => handleChange('autoSuspendUnpaid', val)}
                            />
                        </Card>
                    </div>
                )}

                {/* --- TAB: NOTIFICATIONS --- */}
                {activeTab === 'notifications' && (
                    <Card
                        title={<span className="flex items-center gap-1.5 text-[12px] font-bold text-primary-dark"><Bell size={14} className="text-primary-dark" /> تنبيهات الإدارة</span>}
                        headerClassName='text-primary-dark!'
                        bodyClassName="p-2 pt-3"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <SwitchTile
                                size="sm"
                                label="تسجيل مدرس جديد"
                                description="إرسال إشعار لك عند انضمام مدرس جديد للمنصة."
                                checked={formData.notifyOnNewTeacher}
                                onCheckedChange={(val) => handleChange('notifyOnNewTeacher', val)}
                            />
                            <SwitchTile
                                size="sm"
                                label="تأخر في السداد"
                                description="إشعار عند تجاوز مدرس لفترة السماح وعدم دفع الفاتورة."
                                checked={formData.notifyOnPaymentOverdue}
                                onCheckedChange={(val) => handleChange('notifyOnPaymentOverdue', val)}
                            />
                            <SwitchTile
                                size="sm"
                                label="تقرير النظام الأسبوعي"
                                description="إرسال ملخص أسبوعي بالأرباح وأعداد الطلاب عبر البريد."
                                checked={formData.weeklySystemReport}
                                onCheckedChange={(val) => handleChange('weeklySystemReport', val)}
                            />
                        </div>
                    </Card>
                )}

                {/* --- TAB: SECURITY --- */}
                {activeTab === 'security' && (
                    <div className="flex flex-col gap-3">
                        <Card
                            title={<span className="flex items-center gap-1.5 text-[12px] font-bold text-primary-dark"><ShieldCheck size={14} className="text-primary-dark" /> إعدادات الأمان</span>}
                            headerClassName='text-primary-dark!'
                            bodyClassName="p-2 pt-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <SwitchTile
                                    size="sm"
                                    label="المصادقة الثنائية (2FA)"
                                    description="إجبار جميع مدراء النظام (أنت وموظفيك) على استخدام المصادقة الثنائية."
                                    checked={formData.requireTwoFactorAdmin}
                                    onCheckedChange={(val) => handleChange('requireTwoFactorAdmin', val)}
                                />
                            </div>
                        </Card>

                        <Card
                            title={<span className="flex items-center gap-1.5 text-[12px] font-bold text-primary-dark"><Clock size={14} className="text-primary-dark" /> الجلسات</span>}
                            headerClassName='text-primary-dark!'
                            bodyClassName="p-2 pt-3"
                        >
                            <div className="max-w-md">
                                <Input
                                    label="مهلة انتهاء الجلسة (بالدقائق)"
                                    type="number"
                                    value={formData.sessionTimeoutMinutes}
                                    onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                                    variant="outstanding"
                                    hint="يتم تسجيل خروج المدراء تلقائياً بعد هذه المدة من الخمول."
                                />
                            </div>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    )
}