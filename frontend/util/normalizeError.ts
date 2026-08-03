import { ErrorMessages } from "@/constants/ErrorMessages";
import { NormalizedError } from "@/types/NormalizedError";
import { isAxiosError } from "axios";
import { ErrorCodeMapping } from "@/types/ErrorCodeMapping";
import { HttpStatusMapping } from "@/types/HttpStatusMapping";
import { ErrorType } from "@/types/ErrorType";
import { ApiErrorResponse } from "@/types/ApiResponse";

const normalizeError = (error: unknown): NormalizedError => {
    // Axios errors
    if (isAxiosError<ApiErrorResponse>(error)) {
        if (!error.response) {
            return {
                success: false,
                code: 0,
                errorType: ErrorType.NETWORK,
                message: ErrorMessages[ErrorType.NETWORK],
                originalError: error,
            };
        }

        const responseData = error.response.data;
        const status = responseData.code ?? error.response?.status ?? 500;
        const errorCode = responseData.errorCode ?? undefined;
        const errorType =
            (errorCode ? ErrorCodeMapping[errorCode] : undefined) ?? HttpStatusMapping[status] ?? ErrorType.SERVER;
        const errorMessage = ErrorMessages[errorType];

        return {
            success: false,
            code: status,
            errorCode,
            errorType,
            message: errorMessage,
            serverMessage: responseData.message,
            originalError: error,
        };
    }

    // Handle standard JavaScript errors
    if (error instanceof Error) {
        return {
            success: false,
            code: 500,
            errorType: ErrorType.UNKNOWN,
            message: error.message,
            originalError: error,
        };
    }

    // Handle unknown error types
    return {
        success: false,
        code: 500,
        errorType: ErrorType.UNKNOWN,
        message: ErrorMessages[ErrorType.UNKNOWN],
        originalError: error,
    };
};

export default normalizeError;
