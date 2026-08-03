import normalizeError from "./normalizeError";
import { StoreErrorResult } from "@/types/StoreResult";

const handleError = (error: unknown): StoreErrorResult => {
    const normalized = normalizeError(error);

    console.error("REQUEST FAILURE:", normalized.originalError);

    return {
        success: false,
        errorType: normalized.errorType,
        errorMessage: normalized.message,
    };
};

export default handleError;
