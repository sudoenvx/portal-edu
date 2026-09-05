import { ApiResponse } from "../../core/types/api-response";
import { clearAuthTokenCookie, setAuthTokenCookie } from "../../core/utils/auth/cookie";
import asyncWrapper from "../../core/wrappers/async-wrapper";
import { AdminRepository } from "./admin.repo";
import { AdminService } from "./admin.service";


const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)

export const loginAdminHandler = asyncWrapper(
    async (req, res) => {

        const { email, password } = req.body

        const result = await adminService.login({ email, password })
        setAuthTokenCookie(res, result.access_token)
        ApiResponse.success(res, result)
    }
)

export const registerHandler = asyncWrapper(
    async (req, res) => {
        const { name, password, email } = req.body
        const admin = await adminService.register({ name, password, email })
        res.json(admin)
    }
)

export const logoutAdminHandler = asyncWrapper(
    async (req, res) => {

    }
)

export const getCurrentAdminHandler = asyncWrapper(
    async (req, res) => {
        const admin_id = req.headers['identifier_id']
        const admin = adminService.get(+admin_id!)
        clearAuthTokenCookie(res)
        ApiResponse.success(res, admin)
    }
)