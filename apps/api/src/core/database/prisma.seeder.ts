import { hashPassword } from "../utils/auth/password"
import { prisma } from "./prisma.client"

const seedDatabase = async () => {
    await prisma.admin.upsert({
        where: {
            email: 'admin@edu.eg'
        },
        update: {
            name: 'Super Admin',
            password: await hashPassword('adminx'),
        },
        create: {
            name: 'Super Admin',
            email: 'admin@edu.eg',
            password: await hashPassword('adminx'),
        }
    })
}

seedDatabase()
    .then(() => console.log('Database seeded successfully'))
    .catch((error) => console.error('Error seeding database', error))
    .finally(async () => await prisma.$disconnect())