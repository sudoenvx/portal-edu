import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { ApiError } from "../../shared/contracts/api-error";
import { ApiStatusCode } from "../../shared/contracts/status-codes";
import { ErrorMessage } from "../../shared/contracts/error-codes";


type AsyncWrapperType = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncWrapper = (fn: AsyncWrapperType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof ApiError) {
                logger.error((error as ApiError).message)
                return next(error);
            }

            const custom_error = new ApiError(
                (error as Error).message,
                ErrorMessage.INTERNAL_SERVER_ERROR, ApiStatusCode.INTERNAL_SERVER)
            return next(custom_error);
        }
    }
}

export default asyncWrapper

