import { prisma } from "../../core/database/prisma.client"
import { Prisma } from "../../generated/prisma/client"
import type { CreateTeacherPayload, UpdateTeacherPayload } from "./teacher.dto"

export class TeacherRepository {
    public findAll = async (filter?: Prisma.TeacherWhereInput, limit?: number) => {
        return prisma.teacher.findMany({
            where: filter,
            orderBy: {
                updatedAt: 'desc'
            },
            take: limit
        })
    }

    public findOne = async (id: number) => {
        return prisma.teacher.findFirst({
            where: { id },
            omit: { password: true }
        })
    }

    public findOneByEmail = async (email: string) => {
        return prisma.teacher.findUnique({
            where: { email }
        })
    }

    public create = async (data: CreateTeacherPayload) => {
        return prisma.teacher.create({
            data
        })
    }

    public update = async (id: number, data: UpdateTeacherPayload) => {
        return prisma.teacher.update({
            where: { id },
            data
        })
    }

    public delete = async (id: number) => {
        return prisma.teacher.delete({
            where: { id }
        })
    }
}