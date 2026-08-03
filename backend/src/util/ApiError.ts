import type { ErrorCode } from "../types/ErrorCode.ts";

interface ApiErrorOptions extends ErrorOptions {
    errorCode?: ErrorCode;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error
export class ApiError extends Error {
    readonly statusCode: number;
    readonly errorCode?: ErrorCode | undefined;

    constructor(statusCode: number, message: string, options?: ApiErrorOptions) {
        super(message, options);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errorCode = options?.errorCode;
    }
}

export default ApiError;
