import { generateToken } from "../../core/utils/auth/jwt";
import { hashPassword, verifyPassword } from "../../core/utils/auth/password";
import promiseWrapper from "../../core/wrappers/promise-wrapper";
import { AuthError, NotFoundError } from "../../shared/contracts/api-error";
import { CreateTeacherPayload, TeacherLoginPayload, UpdateTeacherPayload } from "./teacher.dto";
import { Teacher } from "./teacher.entity";
import { TeacherRepository } from "./teacher.repo";

export class TeacherService {
    private readonly teacherRepository: TeacherRepository

    public constructor(teacherRepository: TeacherRepository) {
        this.teacherRepository = teacherRepository
    }

    public getAll = async () => promiseWrapper<Teacher[]>(
        async (resolve) => {
            const teachers = await this.teacherRepository.findAll()
            return resolve(teachers)
        }
    )

    public getLatest = async () => promiseWrapper<Teacher[]>(
        async (resolve) => {
            const teachers = await this.teacherRepository.findAll({}, 8)
            return resolve(teachers)
        }
    )

    public get = async (id: number) => promiseWrapper<Teacher>(
        async (resolve, reject) => {
            const teacher = await this.teacherRepository.findOne(id)
            if (!teacher) {
                return reject(new NotFoundError('Teacher not found'))
            }
            return resolve(teacher)
        }
    )

    public create = async (data: CreateTeacherPayload) => promiseWrapper(
        async (resolve) => {
            const hashedPassword = await hashPassword(data.password)
            let payload = data
            payload.password = hashedPassword
            const teacher = await this.teacherRepository.create(payload)
            return resolve(teacher)
        }
    )

    public update = async (id: number, data: UpdateTeacherPayload) => promiseWrapper(
        async (resolve) => {
            const teacher = await this.teacherRepository.update(id, data)
            return resolve(teacher)
        }
    )

    public delete = async (id: number) => promiseWrapper(
        async (resolve, reject) => {
            const searchTeacher = await this.teacherRepository.findOne(id)
            if(!searchTeacher) {
                const notFountError = new NotFoundError('no teacher with those credentials')
                return reject(notFountError)
            }

            const teacher = await this.teacherRepository.delete(id)
            return resolve(teacher)
        }
    )

    public login = async ({ email, password }: TeacherLoginPayload) => promiseWrapper(
        async (resolve, reject) => {
            const teacher = await this.teacherRepository.findOneByEmail(email)

            if(!teacher) {
                const notFountError = new NotFoundError('no teacher with those credentials')
                return reject(notFountError)
            }

            const isPasswordVerified = await verifyPassword(password, teacher.password)
            if(!isPasswordVerified) {
                const invalid_credentials = new AuthError('Invalid credentials')
                return reject(invalid_credentials)
            }

            const access_token = generateToken({
                id: teacher.id,
                email: teacher.email
            })
            
            return resolve({
                succes: true,
                data: teacher,
                access_token
            })
        }
    )
}