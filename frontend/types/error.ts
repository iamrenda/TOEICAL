export enum ErrorType {
    NETWORK = "NETWORK",
    AUTH = "AUTH",
    SERVER = "SERVER",
    VALIDATION = "VALIDATION",
    UNKNOWN = "UNKNOWN",
}

export const ErrorCodeMapping: Record<number, ErrorType> = {
    0: ErrorType.NETWORK,
    400: ErrorType.VALIDATION,
    401: ErrorType.AUTH,
    403: ErrorType.AUTH,
    404: ErrorType.SERVER,
    500: ErrorType.SERVER,
};
