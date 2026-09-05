import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  ArrowLeft, 
  Save, 
  Camera, 
  User, 
  Lock, 
  Wallet,
} from 'lucide-react'

import { 
  Typography, 
  Button, 
  Input, 
  WindowCard
} from '@portal-edu/ui'
import { useNotification } from '@/core/hooks/use_notification'

import { useAddTeacher } from '../api/teachers.mutations'
import { createTeacherSchema, type CreateTeacherFormValues } from '@/modules/teacher/schemas/create-teacher.schema'

export default function CreateTeacherPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const addMutation = useAddTeacher()
  
  // حالة محلية بسيطة لعرض معاينة الصورة عند اختيارها (UX UI)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      pricePerStudent: 0
    }
  })

  // دالة التعامل مع اختيار الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
      // ملاحظة: يمكنك هنا حفظ الملف في الـ state لإرساله لاحقاً مع الفورم
    }
  }

  const onSubmit = async (data: CreateTeacherFormValues) => {
    try {
      await addMutation.mutateAsync(data)
      notify.success('تم تسجيل المعلم في النظام بنجاح')
      navigate('/teachers') // العودة لصفحة المعلمين بعد النجاح
    } catch (error: any) {
      notify.error(error.message || 'حدث خطأ أثناء حفظ البيانات')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 animate-in fade-in duration-300">
      
      {/* 1. Header & Actions */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">

          <Typography variant="body-large" element="h1" className="text-text font-bold">
            تسجيل معلم جديد
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            leftIcon={<ArrowLeft strokeWidth={2} />} 
            variant="neutral" 
            size="sm" 
            onClick={() => navigate(-1)}
            disabled={addMutation.isPending}
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            leftIcon={<Save strokeWidth={2} />} 
            variant="primary" 
            size="sm"
            loading={addMutation.isPending}
          >
            حفظ وإنشاء الحساب
          </Button>
        </div>
      </header>

      {/* 2. Form Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mt-2">
        
        {/* العمود الأيمن: البيانات الشخصية (يأخذ مساحة أكبر) */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <WindowCard 
            bodyClassName='p-3!'
            title={
              <div className="flex items-center gap-2">
                <User size={14} />
                <span>البيانات الأساسية والشخصية</span>
              </div>
            }
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              
              {/* قسم الصورة الشخصية */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <label 
                  htmlFor="avatar-upload" 
                  className="group relative flex h-24 w-24 cursor-pointer items-center justify-center rounded-sm border-2 border-dashed border-border bg-secondary-tint/50 hover:border-secondary transition-colors overflow-hidden group"
                >
                  {avatarPreview ? (
                    <>
                      <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={20} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-text-muted">
                      <Camera size={24} className="mb-1 opacity-50 group-hover:opacity-100" />
                      <span className="text-[10px] font-medium">اختر صورة</span>
                    </div>
                  )}
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>

              </div>

              {/* باقي حقول البيانات */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Input
                  label="الاسم الرباعي"
                  placeholder="مثال: أحمد محمود إبراهيم"
                  variant="bordered"
                  {...register('name')}
                  error={errors.name?.message}
                />
                
                <Input
                  label="المادة العلمية"
                  placeholder="مثال: الفيزياء"
                  variant="bordered"
                  {...register('subject')}
                  error={errors.subject?.message}
                />

                <Input
                  label="رقم الهاتف"
                  placeholder="01xxxxxxxxx"
                  variant="bordered"
                  dir="ltr"
                  className="text-left font-inter"
                  {...register('phone')}
                  error={errors.phone?.message}
                />

                <Input
                  required
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="teacher@example.com"
                  variant="bordered"
                  dir="ltr"
                  className="text-left font-inter"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
            </div>
          </WindowCard>
        </div>

        {/* العمود الأيسر: الأمان والماليات */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          
          {/* بطاقة بيانات الدخول (كلمة المرور) */}
          <WindowCard 
            title={
              <div className="flex items-center gap-2">
                <Lock size={14} />
                <span>بيانات الدخول والأمان</span>
              </div>
            }

            bodyClassName='p-3!'
          >
            <div className="flex flex-col gap-4">
              <div className="bg-accent-tint p-1.5 rounded-xs">
                <Typography variant="body-small" className="text-text text-[11px] leading-relaxed">
                  هذه البيانات سيستخدمها المدرس ومساعدوه لتسجيل الدخول إلى النظام الخاص بهم.
                </Typography>
              </div>
              
              <Input
                label="كلمة المرور الإفتراضية"
                type="password"
                placeholder="••••••••"
                variant="bordered"
                dir="ltr"
                className="text-left"
                {...register('password')}
                error={errors.password?.message}
              />
              
              <Input
                label="تأكيد كلمة المرور"
                type="password"
                placeholder="••••••••"
                variant="bordered"
                dir="ltr"
                className="text-left"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>
          </WindowCard>

          {/* بطاقة الماليات */}
          <WindowCard 
            title={
              <div className="flex items-center gap-2">
                <Wallet size={14} />
                <span>إعدادات المحاسبة</span>
              </div>
            }
            bodyClassName='p-3!'
          >
            <div className="flex flex-col gap-4">
              <Input
                label="تسعيرة المنصة لكل طالب (ج.م)"
                type="number"
                placeholder="10"
                variant="bordered"
                {...register('pricePerStudent')}
                error={errors.pricePerStudent?.message}
              />
              
              <div className="bg-accent-tint p-1.5 rounded-xs">
                <Typography variant="body-small" className="text-text text-[11px] leading-relaxed">
                  هذا الرقم هو ما سيتم ضربه في إجمالي عدد الطلاب النشطين نهاية كل شهر لإصدار فاتورة المعلم.
                </Typography>
              </div>
            </div>
          </WindowCard>

        </div>
      </div>
    </form>
  )
}