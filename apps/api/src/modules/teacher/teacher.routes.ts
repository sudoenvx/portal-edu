import { Router } from "express";
import { createTeacherHandler, deleteTeacherHandler, getAllTeachersHandler, getLatestTeachersHandler, updateTeacherHandler } from "./teacher.controller";

const router: Router = Router()

router.get('/teachers', getAllTeachersHandler)
router.post('/teachers', createTeacherHandler)
router.patch('/teachers/:id', updateTeacherHandler)
router.delete('/teachers/:id', deleteTeacherHandler)
router.get('/teachers/latest', getLatestTeachersHandler)

export {
    router as TeacherRouter
}