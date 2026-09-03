import { ErrorMessage } from "./error-codes";
import { ApiStatusCode } from "./status-codes";

type ErrorCodeType = (typeof ErrorMessage)[keyof typeof ErrorMessage];
type StatusCodeType = (typeof ApiStatusCode)[keyof typeof ApiStatusCode];

class ApiError extends Error {
    code: ErrorCodeType
    status: StatusCodeType
    details: Array<string>
    constructor(
        message: string,
        code: ErrorCodeType = ErrorMessage.INTERNAL_SERVER_ERROR,
        status: StatusCodeType = ApiStatusCode.INTERNAL_SERVER,
        details: Array<string> = []
    ) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

class ValidationError extends ApiError {
    constructor(details = []) {
        super("Validation failed", ErrorMessage.VALIDATION_ERROR, ApiStatusCode.BAD_REQUEST, details);
    }
}

class AuthError extends ApiError {
    constructor(message = "Unauthorized") {
        super(message, ErrorMessage.AUTH_ERROR, ApiStatusCode.NOT_AUTHORIZED);
    }
}

class DuplicationError extends ApiError {
    constructor(message = "Data is duplicated") {
        super(message, ErrorMessage.DUPLICATION_ERROR, ApiStatusCode.ALREADY_EXISTS);
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(message, ErrorMessage.BAD_REQUEST, ApiStatusCode.BAD_REQUEST);
    }
}



export {
    AuthError,
    ValidationError,
    DuplicationError,
    ApiError,
    BadRequestError
}
