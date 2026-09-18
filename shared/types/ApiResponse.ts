import type { ErrorCodeType } from "@toeical/shared";

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
    errorCode?: ErrorCodeType;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
