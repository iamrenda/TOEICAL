import { ErrorType } from "./ErrorType";

export const HttpStatusMapping: Record<number, ErrorType> = {
    400: ErrorType.VALIDATION,
    401: ErrorType.AUTH,
    403: ErrorType.FORBIDDEN,
    404: ErrorType.NOT_FOUND,
    500: ErrorType.SERVER,
    502: ErrorType.SERVER,
    503: ErrorType.SERVER,
};
