export enum ErrorType {
    NETWORK = "NETWORK",
    AUTH = "AUTH", // 401
    FORBIDDEN = "FORBIDDEN", // 403
    NOT_FOUND = "NOT_FOUND", // 404
    VALIDATION = "VALIDATION", // 400
    SERVER = "SERVER", // 5xx
    UNKNOWN = "UNKNOWN",
}

export const ErrorCodeMapping: Record<number, ErrorType> = {
    400: ErrorType.VALIDATION,
    401: ErrorType.AUTH,
    403: ErrorType.FORBIDDEN,
    404: ErrorType.NOT_FOUND,
    500: ErrorType.SERVER,
    502: ErrorType.SERVER,
    503: ErrorType.SERVER,
};
