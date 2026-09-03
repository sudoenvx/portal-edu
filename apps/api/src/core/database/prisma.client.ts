// packages/database/src/index.ts

import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../generated/prisma/client'
import { DatabaseConfig } from '../config'


// Prevent multiple instances of Prisma Client in development due to hot reloading
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const adapter = new PrismaMariaDb(DatabaseConfig.database_url as string)

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Re-export models/types from Prisma Client so your apps don't need to import raw @prisma/client
export * from '@prisma/client'
