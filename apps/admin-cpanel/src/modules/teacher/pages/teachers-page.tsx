import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button, Input, Typography } from '@portal-edu/ui'
import { useDebounce } from '@/core/hooks/use_debounce' // خطاف جاهز في مشروعك
import { TeachersTable } from '@/modules/teacher/components/teachers/teachers-table'
import { useNavigate } from 'react-router-dom'


export default function TeachersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  // نستخدم Debounce حتى لا نرسل Request مع كل حرف يكتبه المستخدم
  const debouncedSearch = useDebounce(searchTerm, 500)
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300 h-full">



      {/* شريط البحث */}
      <div className="flex items-end justify-between gap-2">
        <div className="w-full max-w-sm">
          <Input
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            variant="standard"
            leadingIcon={<Search size={14} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          variant="primary"
          rightIcon={<Plus size={16} />}
          onClick={() => navigate('/teachers/new')}
        >
          إضافة مدرس
        </Button>
      </div>

      {/* جدول عرض المدرسين */}
      <TeachersTable searchQuery={debouncedSearch} />

    </div>
  )
}