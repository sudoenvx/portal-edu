import { Request, Response, NextFunction } from "express";
import { AuthError } from "../../shared/contracts/api-error";
import { verifyToken } from "../utils/auth/jwt";

interface BaseAccessTokenPayload {
    id: number
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
    const access_token = req.headers.authorization

    if (!access_token) {
        throw new AuthError('You have to be authenticated.')
    }

    const payload = verifyToken<BaseAccessTokenPayload>(access_token as string)
    if (!payload) {
        throw new AuthError('Invalid or expired access token.')
    }

    req.headers['identifier_id'] = String(payload.id)

    next()
}