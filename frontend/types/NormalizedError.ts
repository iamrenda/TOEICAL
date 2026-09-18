import { ErrorCodeType } from "@toeical/shared";
import { ErrorType } from "./ErrorType";

export interface NormalizedError {
    success: false;
    code: number;
    errorCode?: ErrorCodeType; // from api response
    errorType: ErrorType; // for ui debugging
    message: string;
    serverMessage?: string;
    originalError: unknown;
}
