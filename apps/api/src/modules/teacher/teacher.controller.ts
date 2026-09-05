import asyncWrapper from "../../core/wrappers/async-wrapper";
import { TeacherRepository } from "./teacher.repo";
import { TeacherService } from "./teacher.service";

const teacherRepository = new TeacherRepository()
const teacherService = new TeacherService(teacherRepository)

export const getAllTeachersHandler = asyncWrapper(
    async (_, res) => {
        const teachers = await teacherService.getAll()
        res.json(teachers)
    }
)

export const getLatestTeachersHandler = asyncWrapper(
    async (_, res) => {
        const teachers = await teacherService.getLatest()
        res.json(teachers)
    }
)

export const getTeacherHandler = asyncWrapper(
    async (req, res) => {
        const teacher = await teacherService.get(Number(req.params.id))
        res.json(teacher)
    }
)

export const createTeacherHandler = asyncWrapper(
    async (req, res) => {
        console.log(req.body);
        
        const teacher = await teacherService.create(req.body)
        res.json(teacher)
    }
)

export const updateTeacherHandler = asyncWrapper(
    async (req, res) => {
        const teacher = await teacherService.update(Number(req.params.id), req.body)
        res.json(teacher)
    }
)

export const loginTeacherHandler = asyncWrapper(
    async (req, res) => {
        const { email, password } = req.body
        const teacher = await teacherService.login({ email, password })
        res.json(teacher)
    }
)

export const deleteTeacherHandler = asyncWrapper(
    async (req, res) => {
        const { id } = req.params
        await teacherService.delete(Number(id))
        res.json({ message: 'تم حذف المدرس بنجاح' })
    }
)