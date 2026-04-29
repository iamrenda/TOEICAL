import useAuthStore from "@/store/useAuthStore";
import { ErrorType } from "@/types/Error";
import { ErrorResponse } from "@/types/ErrorResponse";
import { router } from "expo-router";

/**
 * Handles specific error types and performs necessary actions
 * (e.g., logout on 401, redirect on 403, etc.)
 */
const handleErrorSideEffects = async (errorResponse: ErrorResponse): Promise<void> => {
    switch (errorResponse.errorType) {
        case ErrorType.AUTH:
            // Clear auth state and redirect to login
            useAuthStore.setState({ accessToken: null, isLoggedIn: false });
            router.replace("/(auth)/login");
            break;

        case ErrorType.FORBIDDEN:
            // Optionally redirect to a "not authorized" page
            // router.replace("/(app)/unauthorized");
            break;

        // Other error types don't require side effects
        default:
            break;
    }
};

export default handleErrorSideEffects;
