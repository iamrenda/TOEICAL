import type { Response } from "express";
import type { ApiSuccessResponse, ApiErrorResponse } from "../types/ApiResponse.ts";
import type { ErrorCode } from "../types/ErrorCode.ts";

const sendSuccess = <T>(
    res: Response<ApiSuccessResponse<T>>,
    code: number,
    message: string,
    data: T,
): Response<ApiSuccessResponse<T>> => {
    return res.status(code).json({
        status: "success",
        code,
        message,
        data,
    });
};

const sendError = (
    res: Response<ApiErrorResponse>,
    code: number,
    message: string,
    errorCode?: ErrorCode,
): Response<ApiErrorResponse> => {
    return res.status(code).json({
        status: "error",
        code,
        message,
        ...(errorCode !== undefined && { errorCode }),
    });
};

export { sendSuccess, sendError };
