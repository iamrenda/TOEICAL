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

export type FastApiResponse<T> = fastApiSuccessResponse<T> | fastApiErrorResponse;
