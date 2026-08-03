import { ErrorCode } from "./ErrorCode";
import { ErrorType } from "./ErrorType";

export interface NormalizedError {
    success: false;
    code: number;
    errorCode?: ErrorCode; // from api response
    errorType: ErrorType; // for ui debugging
    message: string;
    serverMessage?: string;
    originalError: unknown;
}
