import { ErrorCode } from "./ErrorCode";
import { ErrorType } from "./ErrorType";

export const ErrorCodeMapping: Record<ErrorCode, ErrorType> = {
    [ErrorCode.INVALID_CREDENTIALS]: ErrorType.INVALID_CREDENTIALS,

    [ErrorCode.TOKEN_EXPIRED]: ErrorType.SESSION_EXPIRED,
    [ErrorCode.TOKEN_INVALID]: ErrorType.SESSION_EXPIRED,
    [ErrorCode.FORBIDDEN]: ErrorType.FORBIDDEN,

    [ErrorCode.RESOURCE_NOT_FOUND]: ErrorType.NOT_FOUND,
    [ErrorCode.USER_NOT_FOUND]: ErrorType.NOT_FOUND,

    [ErrorCode.EMAIL_ALREADY_EXISTS]: ErrorType.EMAIL_ALREADY_EXISTS,

    [ErrorCode.USERNAME_ALREADY_EXISTS]: ErrorType.USERNAME_ALREADY_EXISTS,

    [ErrorCode.INVALID_FORMAT]: ErrorType.VALIDATION,
    [ErrorCode.VALIDATION_FAILED]: ErrorType.VALIDATION,

    [ErrorCode.INTERNAL_SERVER_ERROR]: ErrorType.SERVER,
    [ErrorCode.DATABASE_ERROR]: ErrorType.SERVER,
    [ErrorCode.AI_FAILURE]: ErrorType.SERVER,
    [ErrorCode.TOKEN_GENERATION_FAILED]: ErrorType.SERVER,
};
