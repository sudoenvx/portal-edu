import { NextFunction } from "express";
import { ApiError } from "./api_error";
import logger from "../core/utils/logger";
import { ErrorCode } from "./error_codes";
import { StatusCode } from "./status_codes";

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
                ErrorCode.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER)
            return next(custom_error);
        }
    }
}

export default asyncWrapper

