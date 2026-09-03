export const ApiStatusCode = Object.freeze({
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    NOT_CHANGED: 304,
    FORBIDDEN: 403,
    NOT_AUTHORIZED: 401,
    ALREADY_EXISTS: 409,
} as const);
