import { useEffect, useState } from 'react'
import { ArrowRight, Save, ShieldCheck } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumb, Button, Card, Input, PageHeader } from '@portal-edu/ui'
import { useNotification } from '@/core/hooks/use_notification'
import { useAssistant, usePermissionCatalog, useUpdateAssistant } from '../api/assistants'

export default function AssistantEditPage() {
  const id = Number(useParams<{ id: string }>().id)
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { data: assistant, isLoading } = useAssistant(id)
  const { data: permissions = [] } = usePermissionCatalog()
  const update = useUpdateAssistant(id)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    permissionKeys: [] as string[],
  })
  useEffect(() => {
    if (assistant)
      setForm({
        fullName: assistant.fullName,
        username: assistant.username,
        email: assistant.email || '',
        phoneNumber: assistant.phoneNumber || '',
        password: '',
        permissionKeys: assistant.permissions.map((permission) => permission),
      })
  }, [assistant])
  if (isLoading || !assistant)
    return (
      <div className="flex h-[50vh] items-center justify-center text-[12px] text-text-muted">
        جاري تحميل المساعد...
      </div>
    )
  const save = async () => {
    try {
      await update.mutateAsync({ ...form, password: form.password || undefined })
      notify.success('تم تحديث المساعد')
      navigate('/assistants')
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'تعذر تحديث المساعد')
    }
  }
  return (
    <div className="flex flex-col gap-4 pb-10">
      <Breadcrumb
        items={[{ label: 'المساعدون', href: '/assistants' }, { label: 'تعديل المساعد' }]}
      />
      <PageHeader
        title="تعديل المساعد"
        description="حدّث بيانات الدخول والصلاحيات الخاصة بالمساعد."
        actions={
          <div className="flex gap-2">
            <Link to="/assistants">
              <Button
                type="button"
                color="secondary"
                style="tint"
                size="sm"
                leftIcon={<ArrowRight size={14} />}
              >
                إلغاء
              </Button>
            </Link>
            <Button
              type="button"
              color="primary"
              size="sm"
              loading={update.isPending}
              leftIcon={<Save size={14} />}
              onClick={save}
            >
              حفظ التغييرات
            </Button>
          </div>
        }
      />
      <Card bodyClassName="p-5 sm:p-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="الاسم"
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            dir="ltr"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <Input
            label="الهاتف"
            dir="ltr"
            value={form.phoneNumber}
            onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
          />
          <Input
            label="كلمة مرور جديدة (اختياري)"
            type="password"
            dir="ltr"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </div>
        <div className="mt-6 border-t border-border-subtle pt-5">
          <p className="mb-2 text-[12px] font-bold text-text">الصلاحيات</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {permissions.map((permission) => (
              <label
                key={permission.key}
                className="flex items-start gap-2 rounded-sm border border-border-subtle p-2 text-[11px] text-text"
              >
                <input
                  type="checkbox"
                  checked={form.permissionKeys.includes(permission.key)}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      permissionKeys: event.target.checked
                        ? [...form.permissionKeys, permission.key]
                        : form.permissionKeys.filter((key) => key !== permission.key),
                    })
                  }
                  className="mt-0.5 accent-primary"
                />
                <span>
                  <ShieldCheck size={13} className="inline text-primary" />{' '}
                  {permission.label || permission.key}
                </span>
              </label>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
