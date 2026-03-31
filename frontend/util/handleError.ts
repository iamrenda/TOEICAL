import { ErrorCodeMapping, ErrorType } from "@/types/error";
import { ZustandResponse } from "@/types/zustand";
import { isAxiosError } from "axios";

const handleError = (e: unknown): ZustandResponse => {
    if (isAxiosError(e)) {
        const status = e.response?.status;
        const errorType = ErrorCodeMapping[status || 500];

        return { success: false, errorType };
    }

    return { success: false, errorType: ErrorType.NETWORK };
};

export default handleError;
