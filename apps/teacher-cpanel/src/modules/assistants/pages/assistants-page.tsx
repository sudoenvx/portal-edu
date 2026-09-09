import { useState } from 'react'
import { Edit3, KeyRound, Mail, Plus, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  DataTable,
  IconButton,
  Input,
  Modal,
  PageHeader,
  type DataTableColumn,
} from '@portal-edu/ui'
import { useNotification } from '@/core/hooks/use_notification'
import {
  useAssistants,
  useCreateAssistant,
  useDeleteAssistant,
  usePermissionCatalog,
  type Assistant,
  type AssistantInput,
} from '../api/assistants'

const emptyForm: AssistantInput = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  phoneNumber: '',
  permissionKeys: [],
}
export default function AssistantsPage() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const { data: result, isLoading } = useAssistants()
  const { data: permissions = [] } = usePermissionCatalog()
  const create = useCreateAssistant()
  const remove = useDeleteAssistant()
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState<Assistant | null>(null)
  const set = (key: keyof AssistantInput, value: string | string[]) =>
    setForm((current) => ({ ...current, [key]: value }))
  const submit = async () => {
    try {
      await create.mutateAsync(form)
      notify.success('تم إنشاء المساعد')
      setOpen(false)
      setForm(emptyForm)
    } catch (error) {
      notify.error(error instanceof Error ? error.message : 'تعذر إنشاء المساعد')
    }
  }
  const columns: DataTableColumn<Assistant>[] = [
    {
      header: 'المساعد',
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary-subtle text-primary">
            <UserRound size={15} />
          </span>
          <div>
            <p className="text-[12px] font-bold text-text">{item.fullName}</p>
            <p className="text-[10px] text-text-muted">{item.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الصلاحيات',
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.permissions.map((key) => (
            <Badge key={key} variant="neutral" size="sm">
              {permissions.find((permission) => permission.key === key)?.label || key}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      header: 'الإجراءات',
      render: (item) => (
        <div className="flex gap-1">
          <IconButton
            type="button"
            color="secondary"
            style="tint"
            size="sm"
            title="تعديل الصلاحيات"
            aria-label="تعديل الصلاحيات"
            icon={<Edit3 size={14} />}
            onClick={() => navigate(`/assistants/${item.id}/edit`)}
          />
          <IconButton
            type="button"
            color="danger"
            style="tint"
            size="sm"
            title="حذف المساعد"
            aria-label="حذف المساعد"
            icon={<Trash2 size={14} />}
            onClick={() => setDeleting(item)}
          />
        </div>
      ),
    },
  ]
  return (
    <div className="flex flex-col gap-4 pb-10">
      <PageHeader
        title="المساعدون"
        description="أضف فريقك وحدد ما يمكن لكل مساعد الوصول إليه."
        actions={
          <Button
            type="button"
            color="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setOpen(true)}
          >
            إضافة مساعد
          </Button>
        }
      />
      <DataTable
        title={
          <span className="flex items-center gap-2">
            قائمة المساعدين{' '}
            <Badge variant="neutral" size="sm">
              {result?.meta?.total || 0}
            </Badge>
          </span>
        }
        data={result?.data || []}
        columns={columns}
        getRowId={(item) => String(item.id)}
        loading={isLoading}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="md"
        footer={
          <>
            <Button
              type="button"
              color="secondary"
              style="tint"
              size="sm"
              onClick={() => setOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              color="primary"
              size="sm"
              loading={create.isPending}
              onClick={submit}
            >
              حفظ المساعد
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-[15px] font-bold text-text">إضافة مساعد</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="الاسم"
              value={form.fullName}
              onChange={(event) => set('fullName', event.target.value)}
              leadingIcon={<UserRound size={14} />}
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              value={form.username}
              onChange={(event) => set('username', event.target.value)}
              leadingIcon={<Mail size={14} />}
            />
            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              value={form.password}
              onChange={(event) => set('password', event.target.value)}
              leadingIcon={<KeyRound size={14} />}
            />
            <Input
              label="الهاتف (اختياري)"
              dir="ltr"
              value={form.phoneNumber || ''}
              onChange={(event) => set('phoneNumber', event.target.value)}
            />
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold text-text">الصلاحيات</p>
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
                      set(
                        'permissionKeys',
                        event.target.checked
                          ? [...form.permissionKeys, permission.key]
                          : form.permissionKeys.filter((key) => key !== permission.key)
                      )
                    }
                    className="mt-0.5 accent-primary"
                  />
                  <span>
                    <ShieldCheck size={13} className="mb-0.5 inline text-primary" />{' '}
                    {permission.label || permission.key}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        size="sm"
        footer={
          <>
            <Button
              type="button"
              color="secondary"
              style="tint"
              size="sm"
              onClick={() => setDeleting(null)}
            >
              إلغاء
            </Button>
            <Button
              type="button"
              color="danger"
              size="sm"
              loading={remove.isPending}
              onClick={async () => {
                if (deleting) {
                  await remove.mutateAsync({ id: deleting.id })
                  setDeleting(null)
                  notify.success('تم حذف المساعد')
                }
              }}
            >
              حذف
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-text">هل تريد حذف المساعد {deleting?.fullName}؟</p>
      </Modal>
    </div>
  )
}
