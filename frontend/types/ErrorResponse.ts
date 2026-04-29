import { ErrorType } from "./Error";

export interface ErrorResponse {
    // Flag to identify our custom error format
    isCustomError: true;

    success: false;
    code: number;
    errorType: ErrorType;
    message?: string;

    // Keep original error for debugging
    originalError?: unknown;
}
