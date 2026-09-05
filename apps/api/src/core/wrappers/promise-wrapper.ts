import { ApiError } from "../../shared/contracts/api-error";
import { ErrorMessage } from "../../shared/contracts/error-codes";
import { ApiStatusCode } from "../../shared/contracts/status-codes";
import { Rejector, Resolver } from "../types/promise";

const promiseWrapper = <T>(fn: (resolve: Resolver<T>, reject: Rejector) => Promise<void>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        fn(resolve, reject).catch((error) => {
            const custom_error = new ApiError((error as Error).message, ErrorMessage.INTERNAL_SERVER_ERROR, ApiStatusCode.INTERNAL_SERVER);
            reject(custom_error);
        });
    });
}

export default promiseWrapper;