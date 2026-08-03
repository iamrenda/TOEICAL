import { ErrorType } from "./ErrorType";

export type StoreSuccessResult<T = null> = {
    success: true;
    data: T;
};

export type StoreErrorResult = {
    success: false;
    errorType: ErrorType;
    errorMessage?: string;
};

export type StoreResult<T = null> = StoreSuccessResult<T> | StoreErrorResult;
