import { ErrorResponse } from "@/types/ErrorResponse";
import { ZustandResponse } from "@/types/Zustand";
import { ErrorType } from "@/types/Error";

/**
 * Checks if the given error is an ErrorResponse (Handled error)
 */
const isErrorResponse = (e: unknown): e is ErrorResponse => {
    return typeof e === "object" && e !== null && "isCustomError" in e && (e as any).isCustomError === true;
};

/**
 * Main error handler used for stores
 * Logs error and returns normalized ErrorResponse for UI display
 */
const handleError = (error: unknown): ZustandResponse => {
    if (isErrorResponse(error)) {
        const e = error;

        console.log("[Handled Error]", {
            errorType: e.errorType,
            message: e.message,
            originalError: e.originalError,
        });

        return { success: false, errorType: e.errorType };
    }

    console.log("[Unhandled Error]", error);

    return { success: false, errorType: ErrorType.UNKNOWN };
};

export default handleError;
