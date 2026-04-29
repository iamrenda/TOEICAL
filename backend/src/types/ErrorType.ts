export enum ErrorType {
    NETWORK = "NETWORK",
    AUTH = "AUTH", // 401
    FORBIDDEN = "FORBIDDEN", // 403
    NOT_FOUND = "NOT_FOUND", // 404
    VALIDATION = "VALIDATION", // 400
    SERVER = "SERVER", // 5xx
    UNKNOWN = "UNKNOWN",
}
