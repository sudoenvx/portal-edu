import { prisma } from '../prisma.client'
import { hashPassword } from '../../utils/auth/password'

export async function seedAdminData() {
  const password = await hashPassword('adminx')
  await prisma.admin.upsert({
    where: { email: 'admin@edu.eg' },
    update: { name: 'Super Admin', password, role: 'super_admin' },
    create: { name: 'Super Admin', email: 'admin@edu.eg', password, role: 'super_admin' },
  })
  console.log('  ✅ Admin user verified (admin@edu.eg / adminx)')
}
