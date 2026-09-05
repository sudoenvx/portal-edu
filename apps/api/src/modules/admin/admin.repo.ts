import { prisma } from "../../core/database/prisma.client";
import type { Prisma } from "../../generated/prisma/client";

export class AdminRepository {
    async findOne(id: number) {
        return prisma.admin.findUnique({
            where: { id }
        })
    }

    async findByEmail(email: string) {
        return prisma.admin.findUnique({
            where: { email }
        })
    }

    async find(filter: Prisma.AdminWhereInput) {
        return prisma.admin.findMany({ where: filter })
    }

    async create(data: Prisma.AdminCreateInput) {
        return prisma.admin.create({ data })
    }

    async update(id: number, data: Prisma.AdminUpdateInput) {
        return prisma.admin.update({ where: { id }, data })
    }

    async delete(id: number) {
        return prisma.admin.delete({ where: { id } })
    }
}