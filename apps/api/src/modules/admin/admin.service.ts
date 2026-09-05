import { generateToken } from "../../core/utils/auth/jwt";
import { hashPassword, verifyPassword } from "../../core/utils/auth/password";
import promiseWrapper from "../../core/wrappers/promise-wrapper";
import { AuthError, NotFoundError } from "../../shared/contracts/api-error";
import { AdminLoginPayload, AdminRegisterPayload } from "./admin.dto";
import { AdminRepository } from "./admin.repo";

export class AdminService {
    private readonly adminRepository: AdminRepository

    public constructor(adminRepository: AdminRepository) {
        this.adminRepository = adminRepository
    }

    public login = async ({ email, password }: AdminLoginPayload) => promiseWrapper<{admin: unknown, access_token: string}>(
        async (resolve, reject) => {
            const admin = await this.adminRepository.findByEmail(email)
            if (!admin) {
                const admin_not_found = new NotFoundError('Admin not found')
                return reject(admin_not_found)
            }
            const isValid = await verifyPassword(password, admin.password)

            if (!isValid) {
                const invalid_credentials = new AuthError('Invalid credentials')
                return reject(invalid_credentials)
            }

            const access_token = generateToken({
                id: admin.id,
                email: admin.email
            })

            return resolve({
                admin, access_token
            })

        }
    )

    public register = async ({ name, password, email }: AdminRegisterPayload) => promiseWrapper(
        async (resolve) => {
            const hashedPassword = await hashPassword(password)

            const created_admin = await this.adminRepository.create({
                name, password: hashedPassword, email
            })

            return resolve(created_admin)
        }
    )

    public get = async (id: number) => promiseWrapper(
        async (resolve) => {
            const admin = await this.adminRepository.findOne(id)
            return resolve(admin)
        }
    )
}