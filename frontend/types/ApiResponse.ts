import { ErrorCode } from "./ErrorCode";

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

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
