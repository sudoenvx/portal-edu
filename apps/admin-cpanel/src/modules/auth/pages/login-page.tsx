import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'

// استيراد مكونات الـ UI الخاصة بك
import { Button, Input, Typography } from '@portal-edu/ui'
import { useNotification } from '@/core/hooks/use_notification'

// استيراد الملفات الخاصة بميزة الـ Auth
import { useAdminLogin } from '../api/auth.mutations'
import { LOGO } from '@/core/assets'
import { adminLoginSchema, type AdminLoginFormValues } from '@/modules/auth/schemas/auth.schema'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { notify } = useNotification()
  const loginMutation = useAdminLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
  })

  // دالة الإرسال (Submit)
  const onSubmit = async (data: AdminLoginFormValues) => {
    await loginMutation.mutateAsync(data, {
      onSuccess: (response) => {
        console.log(response);

        localStorage.setItem('access_token', response.access_token)
        notify.success('تم تسجيل الدخول بنجاح')

        const redirectUrl = searchParams.get('redirect') || '/'
        navigate(redirectUrl, { replace: true })
      },

      onError: (error: any) => {
        notify.error(error.message || 'بيانات الدخول غير صحيحة')
      }
    })
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-[#3a1c71] via-[#d76d77] to-[#ffaf7b] p-4" dir="rtl">

      {/* حاوية الفورم (Card) */}
      <div className="flex w-full max-w-md flex-col gap-6 rounded-md bg-surface p-4 sm:p-6 shadow-card animate-in fade-in zoom-in-95 duration-300">

        {/* الترويسة والشعار */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-secondary/10 mb-2">
            {/* يمكنك استخدام الشعار الخاص بك هنا بدلاً من الأيقونة */}
            <img src={LOGO} alt="edu Logo" className="h-10 w-10 object-contain" />
          </div>
          <Typography variant="headline-small" element="h1" className="text-text font-bold uppercase">
            لوحة تحكم الإدارة
          </Typography>
          <Typography variant="body-small" className="text-text-muted">
            يرجى تسجيل الدخول للوصول إلى منصة إدارة المدرسين
          </Typography>
        </div>

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">

          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="admin@example.com"
            variant="bordered"
            size="lg"
            {...register('email')}
            error={errors.email?.message}
            dir="ltr" // البريد دائماً من اليسار لليمين
            className="text-left font-inter"
          />

          <Input
            label="كلمة المرور"
            type="password"
            placeholder="••••••••"
            variant="bordered"
            size="md"
            {...register('password')}
            error={errors.password?.message}
            dir="ltr"
            className="text-left font-inter"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2"
            loading={loginMutation.isPending}
            rightIcon={!loginMutation.isPending && <LogIn size={16} />}
          >
            تسجيل الدخول
          </Button>

        </form>
      </div>

    </div>
  )
}