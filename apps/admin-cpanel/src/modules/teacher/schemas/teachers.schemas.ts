import { z } from 'zod'

export const teacherFormSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  subject: z.string().min(2, 'يرجى إدخال المادة'),
  pricePerStudent: z.coerce.number().min(1, 'سعر المحاسبة يجب أن يكون أكبر من صفر'),
})

export type TeacherFormValues = z.infer<typeof teacherFormSchema>