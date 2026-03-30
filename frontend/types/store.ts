import { ErrorType } from "./error";

export interface ZustandResponse {
    success: boolean;
    errorType?: ErrorType;
}
