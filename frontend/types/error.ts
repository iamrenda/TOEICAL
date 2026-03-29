export enum LoginErrorType {
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS", // Wrong email or password - corresponds to 401
    TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export enum SignUpErrorType {
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export enum ApiErrorType {
    UNKNOWN_ERROR = "UNKNOWN_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVER_ERROR = "SERVER_ERROR",
}

export const loginErrorCodeTypeMapping: Record<number, LoginErrorType> = {
    401: LoginErrorType.INVALID_CREDENTIALS,
    429: LoginErrorType.TOO_MANY_ATTEMPTS,
    500: LoginErrorType.SERVER_ERROR,
};

export const signUpErrorCodeTypeMapping: Record<number, SignUpErrorType> = {
    409: SignUpErrorType.USER_ALREADY_EXISTS,
    500: SignUpErrorType.SERVER_ERROR,
};

export const apiErrorCodeTypeMapping: Record<number, ApiErrorType> = {
    404: ApiErrorType.UNKNOWN_ERROR,
    500: ApiErrorType.SERVER_ERROR,
};
