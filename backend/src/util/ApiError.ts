import type { ErrorCodeType } from "@toeical/shared";

interface ApiErrorOptions extends ErrorOptions {
    errorCode?: ErrorCodeType;
    zodError?: unknown; // API response type validation error, if any
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
export class ApiError extends Error {
    readonly statusCode: number;
    readonly errorCode?: ErrorCodeType | undefined;
    readonly zodError?: unknown | undefined;

    constructor(statusCode: number, message: string, options?: ApiErrorOptions) {
        super(message, options);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errorCode = options?.errorCode;
        this.zodError = options?.zodError;
    }
}

export default ApiError;
