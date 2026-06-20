import { ErrorType } from "./Error";

export interface ZustandResponse<T = any> {
    success: boolean;
    errorType?: ErrorType;
}
