import { ErrorMessages } from "@/constants/ErrorMessages";
import { ErrorCodeMapping, ErrorType } from "@/types/Error";
import { ErrorResponse } from "@/types/ErrorResponse";
import { isAxiosError } from "axios";

/**
 * Normalizes Axios errors into our standard ErrorResponse format
 */
const normalizeError = (error: unknown): ErrorResponse => {
    // Handle Axios errors
    if (isAxiosError(error)) {
        const status = error.response?.status || 500;
        const errorType = ErrorCodeMapping[status] || ErrorType.SERVER;

        return {
            isCustomError: true,
            success: false,
            code: status,
            errorType,
            message: ErrorMessages[errorType],
            originalError: error,
        };
    }

    // Handle standard JavaScript errors
    if (error instanceof Error) {
        return {
            isCustomError: true,
            success: false,
            code: 500,
            errorType: ErrorType.UNKNOWN,
            message: error.message,
            originalError: error,
        };
    }

    // Handle unknown error types
    return {
        isCustomError: true,
        success: false,
        code: 500,
        errorType: ErrorType.UNKNOWN,
        message: ErrorMessages[ErrorType.UNKNOWN],
        originalError: error,
    };
};

export default normalizeError;
