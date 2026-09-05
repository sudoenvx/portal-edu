import { Router } from 'express'
import { requireAuth } from '../../core/middlewares/require-auth'
import { getCurrentAdminHandler, loginAdminHandler, logoutAdminHandler } from './admin.controller'

const router: Router = Router()

router.get('/auth/admin/me', requireAuth, getCurrentAdminHandler)
router.post('/auth/admin/login', loginAdminHandler)
router.post('/auth/admin/logout', requireAuth, logoutAdminHandler)

export {
    router as AdminRouter
}