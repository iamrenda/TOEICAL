import { ErrorType } from "./Error";

export interface ZustandResponse {
    success: boolean;
    errorType?: ErrorType;
}
