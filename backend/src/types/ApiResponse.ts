import type { ErrorCode } from "./ErrorCode.ts";

// frontend <-> backend
export type ApiSuccessResponse<T> = {
    status: "success";
    code: number;
    message: string;
    data: T;
};

export type ApiErrorResponse = {
    status: "error";
    code: number;
    message: string;
    errorCode?: ErrorCode;
};

// node <-> fastapi (private)
export type fastApiSuccessResponse<T> = {
    status: "success";
    message: string;
    data: T;
};

export type fastApiErrorResponse = {
    status: "error";
    data: null;
    message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type FastApiResponse<T> = fastApiSuccessResponse<T> | fastApiErrorResponse;
